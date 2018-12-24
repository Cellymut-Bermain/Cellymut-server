const jwt = require('jsonwebtoken')
const {secret_key} = require('../config/config.json')

class Middleware {
    static checkToken (req, res, next) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        console.log(decoded)
        if (decoded.role_admin) {
            next()
        }
        else {
            res.json({
                message: 'Sorry you have to add access token as header'
            })
        }
    }
}

module.exports = Middleware