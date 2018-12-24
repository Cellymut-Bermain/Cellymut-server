const jwt = require('jsonwebtoken')
const {User} = require('../models')
const { createRandomSalt, createPassword} = require('../crypto')
let {secret_key} = require('../config/config.json')
class Controller {
    static register (req, res) {
        let email = req.body.email
        let first_name = req.body.first_name
        let last_name = req.body.last_name
        let phone_number = req.body.phone_number

        let salt = createRandomSalt()
        let password = createPassword(req.body.password,salt)
        let createdAt = new Date()
        let updatedAt = new Date()
        User.findOrCreate({
            where : {
                email: email
            },
            defaults: {
                first_name,
                last_name,
                password,
                createdAt,
                updatedAt,
                phone_number
            }
        })
            .spread((user , created) => {
                console.log(created)
                if (created) {
                    const token = jwt.sign({
                        id: user.id,
                        email: user.email,
                    }, secret_key)
                    res.json({
                        msg: "Login Berhasil!!",
                        token,
                        user,
                        status: 1
                    })
                }
                else {
                    res.json({
                        message: "Email telah digunakan",
                        status: 0
                    })
                }
            })

    }

    static fbSignIn (req, res) {
        let first_name = req.body.first_name
        let last_name = req.body.last_name
        let email = req.body.email
        let password = req.body.password
        let created_at = new Date()
        let updated_at = new Date()
        User.findOne({
            where: {
                email
            }
        })
            .then(user=> {
                if (user) {
                    const token = jwt.sign({
                        id: user.id,
                        email
                    }, secret_key)
                    res.json({
                        token,
                        msg: 'Login facebook berhasil!',
                        user
                    })
                }
                else {
                    User.create({
                        first_name,
                        last_name,
                        email,
                        password,
                        created_at,
                        updated_at,
                    })
                        .then(()=> {
                            const token = jwt.sign({
                                id: user.id,
                                email
                            }, secret_key)
                            res.json({
                                msg: "Berhasil membuat user baru baru dengan data facebook!",
                                token,
                                user
                            })
                        })
                        .catch(err=> {
                            console.log(err)
                            res.json({
                                msg: "gagal menambahkan user baru dengan data facebook",
                                err
                            })
                        })
                }
            })
            .catch(err=> {
                res.json({
                    msg: 'Login facebook gagal!',
                    err
                })
            })
    }
    static login (req, res) {
        let email = req.body.email
        let password = req.body.password
        User.findOne({
            where : {
                email
            }
        })
            .then((user)=> {
                if (user) {
                    let decipherHash = user.password.split('.')
                    let salt = decipherHash[1]
                    let isPassword = createPassword(password, salt)
                    let passUser = user.password
                    if (isPassword===passUser )  {
                        const token = jwt.sign({
                            id: user.id,
                            email: user.email,
                        }, secret_key)
                        res.json({
                            msg: "Login Berhasil!!",
                            token,
                            user,
                            status: 1
                        })
                    }
                    else {
                        res.json({
                            msg: "Username/Password salah",
                            status: 0
                        })
                    }
                }
                else {
                    res.json({
                        msg: "Username/Password salah",
                        status: 0
                    })
                }
            })
            .catch(err=> {
                res.json({
                    message: "Error Login",
                    err
                })
            })
    }
}

module.exports = Controller