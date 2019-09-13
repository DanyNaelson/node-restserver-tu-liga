const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { verifyRole, verifyToken } = require('../middlewares/authentication');
const app = express();

app.get('/users', [verifyToken], function (req, res) {
    let limit = Number(req.query.limit) || 10
    let page = ((req.query.page - 1) * limit) || 0

    User.find({})
        .skip(page)
        .limit(limit)
        .exec((err, users) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    count
                })
            })

            
        })

})

app.post('/user', [verifyToken, verifyRole], function (req, res) {
    let body = req.body
    let birthday = body.birthday.split('/', )
    let newUser = new User({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        nickname: body.nickname,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role,
        birthday: new Date(birthday[0], birthday[1], birthday[2], 0, 0, 0, 0),
        telephone: body.telephone,
        sex: body.sex,
        documentID: body.documentID
    })

    newUser.save((err, userDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
})

app.put('/user/:id', [verifyToken, verifyRole], function (req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['firstName', 'lastName', 'email', 'nickname', 
    'role', 'birthday', 'telephone', 'sex', 'documentID'])

    User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, userDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!userDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            })
        }
        
        res.json({
            user: userDB
        })
    })

    
})

app.delete('/user/:id', [verifyToken, verifyRole], function (req, res) {
    let id = req.params.id

    /**
     * TO DO: Change status instead of remove user
     */
    User.findByIdAndRemove(id, (err, userDeleted) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!userDeleted){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            })
        }

        res.json({
            ok: true,
            user: userDeleted
        })
    })
})

module.exports = app;