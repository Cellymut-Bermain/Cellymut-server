const jwt = require('jsonwebtoken')
const {secret_key} = require('../config/config.json')

class Middleware {
    static checkTokenAdd (req, res, next) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        console.log(decoded)
        if (decoded.role_admin=='admin' || decoded.role_admin=='super_admin' ) {
            next()
        }
        else {
            res.json({
                message: 'Sorry you have to add right access token as header'
            })
        }
    }
    static checkTokenEdit (req, res, next) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        if (decoded.role_admin=='super_admin' ) {
            next()
        }
        else {
            res.json({
                message: 'Sorry you have to add right access token as header'
            })
        }
    }
    static checkTokenDelete (req, res, next) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        if (decoded.role_admin=='super_admin' ) {
            next()
        }
        else {
            res.json({
                message: 'Sorry you have to add right access token as header'
            })
        }
    }
}

module.exports = Middleware