const jwt = require('jsonwebtoken')

//========================================
// Verify token
//========================================
let verifyToken = ( req, res, next ) => {
    let token = req.get('Authorization')

    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'You\'re not authorized'
                }
            })
        }

        req.user = decoded.user
        next()
    })
}

//========================================
// Verify role
//========================================
let verifyRole = ( req, res, next ) => {
    let user = req.user

    if (user.role === 'ADMIN_ROLE'){
        next()
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'You\'re not authorized to do this action'
            }
        })
    }
}

module.exports = {
    verifyRole,
    verifyToken
}