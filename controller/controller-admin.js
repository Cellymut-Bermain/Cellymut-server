const {Admin}  = require('../models')
const {secret_key} = require('../config/config')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { createRandomSalt, createPassword} = require('../crypto')

class Controller {
    static getAdmins (req, res) {
        Admin.findAll()
            .then((admins)=> {
                res.json({
                    msg : "get all admins",
                    admins
                })
            })
            .catch(err=> {
                res.json({
                    msg : "error get add admins",
                    err
                })
            })
    }
    static getOneAdmin (req, res) {
        let id = req.params.id
        Admin.findById(id)
            .then((admin)=> {
                res.json({
                    msg: "get one admin",
                    admin
                })
            })
            .catch(err=> {
                res.json({
                    msg: "error get one admin",
                    admin
                })
            })
    }
    static addAdmin (req, res) {
        let username = req.body.username
        let salt = createRandomSalt()
        let password = createPassword(req.body.password,salt)
        let created_at = new Date()
        let updated_at = new Date()
        Admin.findOrCreate({
            where : {
                username: username
            },
            defaults: {
                password,
                created_at,
                updated_at,
            }
        })
            .spread((admin , created) => {
                console.log(created)
                if (created) {
                    res.json({
                        message: "Berhasil register user baru",
                        admin
                    })
                }
                else {
                    res.json({
                        message: "Username telah digunakan",
                    })
                }
            })
    }
    static updateAdmin (req, res) {
        let id = req.params.id
        let username = req.body.username
        let salt = createRandomSalt()
        let password = createPassword(req.body.password, salt)
        let updated_at = new Date()

        Admin.update({
            username,
            password,
            updated_at
        }, {
            where: {
                id: {
                    [Op.eq] : id
                }
            }
        })
            .then(()=> {
                res.json({
                    msg: "berhasil update admin!",
                })
            })
            .catch(err=> {
                res.json({
                    msg: "Gagal Update admin!",
                    err
                })
            })
    }

    static deleteAdmin (req, res) {
        let id = req.params.id
        Admin.destroy({
            where : {
                id: {
                    [Op.eq] : id
                }
            }
        })
            .then((data)=> {
                if (data) {
                    res.json({
                        data,
                        msg: "berhasil menghapus admin dengan id "+id
                    })
                }
                else {
                    res.json({
                        msg: "Tidak ada data yang terhapus"
                    })
                }
            })
            .catch((err)=> {
                res.json({
                    msg: 'gagal menghapus admin',
                    err
                })
            })
    }

    static login (req, res) {
        let username = req.body.username
        let password = req.body.password
        Admin.findOne({
            where : {
                username
            }
        })
            .then((admin)=> {
                if (admin) {
                    let decipherHash = admin.password.split('.')
                    let salt = decipherHash[1]
                    let isPassword = createPassword(password, salt)
                    let passUser = admin.password
                    if (isPassword===passUser )  {
                        const token = jwt.sign({
                            id: admin.id,
                            username: admin.username,
                            role_admin: admin.role_admin
                        }, secret_key)
                        res.json({
                            message: "Login Berhasil!!",
                            token,
                            admin
                        })
                    }
                    else {
                        res.json({
                            message: "Username/Password salah"
                        })
                    }
                }
                else {
                    res.json({
                        message: "Username/Password salah"
                    })
                }
            })
            .catch(err=> {
                console.log(err)
                res.json({
                    message: "Error Login",
                    err
                })
            })
    }
}

module.exports = Controller