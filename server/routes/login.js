const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body

    User.findOne({ email: body.email }, (err, userDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!userDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "invalid_credentials"
                }
            })
        }

        const { _id, photo, role, url } = userDB;
        const user = {
            _id,
            photo,
            role,
            url
        }

        if(!bcrypt.compareSync( body.password, userDB.password )){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "invalid_credentials"
                }
            }) 
        }

        let token = jwt.sign({
            user
        }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN })

        res.json({
            ok: true,
            user,
            token
        })
    })
})

app.post('/sign-up', (req, res) => {
    let body = req.body;
    const emailRegexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const passRegexp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    if(!emailRegexp.test(body.email)){
        return res.status(400).json({
            ok: false,
            err: {
                message: "invalid_email",
                field: 'email'
            }
        })
    }

    if(!passRegexp.test(body.password)){
        return res.status(400).json({
            ok: false,
            err: {
                message: "invalid_password",
                field: 'password'
            }
        })
    }

    User.findOne({ email: body.email }, (err, userDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(userDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "registered_user",
                    registered_by: 'email',
                    field: 'email'
                }
            })
        }

        const date = new Date();
        let birthday = new Date(date.setFullYear(date.getFullYear() - 19));
        let nickname = body.email.replace(/[^\w\s]/gi, '-').toLowerCase();
        let url = nickname
        let newUser = new User({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            role: 'PLAYER_ROLE',
            nickname,
            password: bcrypt.hashSync( body.password, 10 ),
            birthday,
            url,
            accountStatus: true,
            withEmail: true
        })

        newUser.save((err, userDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
    
            const { _id, photo, role, url } = userDB;
            const user = {
                _id,
                photo,
                role,
                url
            }
            let token = jwt.sign({
                user
            }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN })
    
            res.json({
                ok: true,
                user,
                token
            })
        })
    })
})

module.exports = app;