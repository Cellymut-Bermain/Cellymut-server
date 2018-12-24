const jwt = require('jsonwebtoken')
const {secret_key} = require('../config/config.json')
const {User} = require('../models')
const { createPassword} = require('../crypto')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
class Controller {
    static getUsers (req, res) {
        User.findAll({order: [['id', 'ASC']]})
            .then((users)=> {
                res.json({
                    users,
                    message: "Get All Users"
                })
            })
            .catch(err=> {
                res.json({
                    message: "Error Get All Users",
                    err
                })
            })
    }
    static getOneUsers (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let id = decoded.id
        console.log(id,'id')
        User.findById(id)
            .then((user)=> {
                res.json({
                    message: "Get One User",
                    user
                })
            })
            .catch(err=> {
                res.json({
                    message: "Error Get One User",
                    err
                })
            })
    }
    static changeImage (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let id = decoded.id
        User.update({
            image_profile: req.body.image_profile
        }, {
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        })
            .then(()=> {
                res.json({
                    msg: "berhasil change image"
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static updateUser (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let id = decoded.id
        let email = req.body.email
        let phone_number = req.body.phone_number
        let address = req.body.address
        let type_home = req.body.type_home
        let country = req.body.country
        let city = req.body.city
        let provinsi = req.body.provinsi
        let postal_code = req.body.postal_code
        let updated_at = new Date()
        User.update({
            email,
            phone_number,
            address,
            type_home,
            country,
            city,
            provinsi,
            postal_code,
            updatedAt: updated_at
        }, {
            where : {
                id: {
                    [Op.eq]: id
                }
            }
        })
            .then(()=> {
                res.json({
                    msg: 'Berhasil update profile',
                })
            })
            .catch(err=> {
                console.log(err)
                res.json({
                    err
                })
            })
    }

    static updateUserPassword (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let id = decoded.id
        let password = req.body.password
        let newPass = req.body.newPass
        let updated_at = new Date()
            User.findOne({
                where: {
                    id: {
                        [Op.eq]: id
                    }
                }
            })
                .then((user)=> {
                    let decipherHash = user.password.split('.')
                    let salt = decipherHash[1]
                    let isPassword = createPassword(password, salt)
                    let passUser = user.password
                    if (isPassword===passUser)  {
                        let newPassword = createPassword(newPass, salt)
                        User.update({
                            password: newPassword,
                            updatedAt: updated_at
                        }, {
                            where: {
                                id: {
                                    [Op.eq] : id,
                                }
                            }
                        })
                            .then(()=> {
                                res.json({
                                    msg: "Berhasil Update Ganti Password",
                                    status: 1
                                })
                            })
                            .catch(err=> {
                                res.json({
                                    msg: "Gagal Update Password",
                                    err
                                })
                            })

                    }
                    else {
                        res.json({
                            msg: "Password salah",
                            status: 0
                        })
                    }
                })
    }
}

module.exports = Controller