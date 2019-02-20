
const {Cart, User, Item} = require('../models')
const axios = require('axios')

const jwt = require('jsonwebtoken')
let {secret_key, key} = require('../config/config.json')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class Controller {

    static getCarts (req, res) {
        Cart.findAll()
            .then(carts=> {
                res.json({
                    carts
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static getCartsByUserId (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let UserId = decoded.id
        Cart.findAll({
            include: {
                model: Item,
                include: {
                    model: User
                }
            }
        },{
            where: {
                UserId: {
                    [Op.eq] : UserId
                }
            }
        })
            .then((carts)=> {
                res.json({
                    msg: "Get all carts by user id",
                    carts
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static getOneCart (req, res) {
        let id = req.params.cart_id
        Cart.findOne({
            where : {
                id: {
                    [Op.eq]: id
                }
            }
        })
            .then((cart)=> {
                res.json({
                    msg: 'Get one cart',
                    cart
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static addCart (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let UserId = decoded.id
        console.log(decoded)
        let ItemId = req.params.item_id
        let name = req.body.name
        let createdAt = new Date()
        let updatedAt = new Date()
        Cart.findOrCreate({
            where: {
                UserId: {
                    [Op.eq]: UserId
                },
                ItemId: {
                    [Op.eq]: ItemId
                }
            },
            defaults: {
                UserId,
                ItemId,
                quantity: 1,
                createdAt,
                updatedAt,
                name
            }
        })
            .spread((cart, created) => {
                if (created) {
                    res.json({
                        msg: "Berhasil buat Cart baru"
                    })
                }
                else {
                    console.log(cart)
                    cart.quantity+=1
                    Cart.update({
                        quantity: cart.quantity,
                        name
                    }, {
                        where: {
                            UserId: {
                                [Op.eq]: UserId
                            },
                            ItemId: {
                                [Op.eq]: ItemId
                            }
                        }
                    })
                        .then((newCart)=> {
                            res.json({
                                msg: "Udah ada cart",
                                cart,
                                newCart
                            })
                        })
                        .catch(err=> {
                            console.log(err)
                            res.json({
                                err
                            })
                        })
                }
            })
    }

    static addQuantity (req, res) {
        let UserId = req.body.UserId
        let ItemId = req.body.ItemId
        let updatedAt = new Date()
        Cart.findOne({
            where: {
                UserId: {
                    [Op.eq]: UserId
                },
                ItemId: {
                    [Op.eq]: ItemId
                }
            }
        })
            .then((cart)=> {
                cart.quantity+=1
                Cart.update({
                    quantity: cart.quantity,
                    updatedAt
                },{
                    where: {
                        UserId: {
                            [Op.eq]: UserId
                        },
                        ItemId: {
                            [Op.eq]: ItemId
                        }
                    }
                })
                    .then(()=> {
                        res.json({
                            msg: "Berhasil menambahkan quantity",
                            cart
                        })
                    })
                    .catch(err=> {
                        console.log(err)
                        res.json({
                            err
                        })
                    })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }
    static decQuantity (req, res) {
        let UserId = req.body.UserId
        let ItemId = req.body.ItemId
        let updatedAt = new Date()
        Cart.findOne({
            where: {
                UserId: {
                    [Op.eq]: UserId
                },
                ItemId: {
                    [Op.eq]: ItemId
                }
            }
        })
            .then((cart)=> {
                cart.quantity-=1
                Cart.update({
                    quantity: cart.quantity,
                    updatedAt
                },{
                    where: {
                        UserId: {
                            [Op.eq]: UserId
                        },
                        ItemId: {
                            [Op.eq]: ItemId
                        }
                    }
                })
                    .then(()=> {
                        res.json({
                            msg: "Berhasil mengurangi quantity",
                            cart
                        })
                    })
                    .catch(err=> {
                        console.log(err)
                        res.json({
                            err
                        })
                    })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static deleteCart (req, res) {
        let UserId = req.params.UserId
        let ItemId = req.params.ItemId
        Cart.destroy({
            where: {
                UserId: {
                    [Op.eq]: UserId
                },
                ItemId: {
                    [Op.eq]: ItemId
                }
            }
        })
            .then((deleted)=> {
                res.json({
                    msg: "berhasil menghapus cart!",
                    deleted
                })
            })
            .catch(err=> {
                console.log(err)
                res.json({
                    err
                })
            })
    }

    static goToTrans (req, res) {
        let UserId = req.params.UserId
        let ItemId = req.params.ItemId
        Cart.update({
            status_cart: -1
        }, {
            where: {
                UserId: {
                    [Op.eq]: UserId
                },
                ItemId: {
                    [Op.eq]: ItemId
                }
            }
        })
            .then(()=> {
                res.json({
                    msg: "berhasil menganti status cart"
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static fetchingRajaOngkir (req, res) {
        let destination = req.body.destination
        let weight = req.body.weight*1000
        let courier = req.body.courier
        let origin = 151
        axios.post('https://api.rajaongkir.com/starter/cost',{
            origin,
            destination,
            courier,
            weight
        },{
            headers : {
                key
            }
        })
            .then(({data})=> {
                res.json({
                    msg: 'fetching raja ongkir',
                    data
                })
            })
            .catch(err=> {
                console.log(err)
                res.json({
                    err
                })
            })
    }
}

module.exports = Controller