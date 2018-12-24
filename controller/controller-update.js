const {Update, User, Item, Transaction} = require('../models')
const {secret_key} = require('../config/config')
const jwt = require('jsonwebtoken')

class Controler {
    static getUpdates (req, res) {
        Update.findAll({
            include: [
                {
                    model: User
                },
                {
                    model: Item
                },
                {
                    model: Transaction
                }
            ]
        })
            .then(updates=> {
                res.json({
                    msg: "get all updates",
                    updates
                })
            }).catch(err=> {
                console.log(err.message)
                res.json({
                    err
                })
        })
    }
    static getUpdateByUser (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        const UserId = decoded.id
        Update.findAll({
            include: [
                {
                    model: User,
                },
                {
                    model: Item
                },

                {
                    model: Transaction
                }
            ],
            where: {
                UserId
            }
        })
            .then((updates)=> {
                res.json({
                    msg: "get updates by user",
                    updates
                })
            })
            .catch(err=> {
                console.log(err)
                res.json({
                    err
                })
            })
    }

    static addUpdate (req, res) {
        const UserId = req.params.user_id
        const ItemId = req.params.item_id
        const type = req.body.type
        const TransactionId = req.body.TransactionId
        const updatedAt = new Date()
        const createdAt = new Date()
        const message = 'Pesanan Anda'

        Update.create({
            UserId,
            ItemId,
            type,
            updatedAt,
            createdAt,
            message,
            TransactionId
        })
            .then(()=> {
                res.json({
                    msg: "berhasil menambahkan pesan baru"
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })

    }
    static getUnread (req, res) {
        // const UserId = req.params.user_id
        let decoded = jwt.verify(req.headers.token, secret_key)
        const UserId = decoded.id
        Update.findAll({
            where: {
                UserId,
                status_read: 0
            }
        })
            .then((unreads)=> {
                res.json({
                    msg: 'get by user unread updates',
                    unreads
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }
    static readUpdate (req, res) {
        const update_id = req.params.update_id
        Update.update({
            status_read: 1
        },{
            where: {
                id: update_id
            }
        })
            .then(()=> {
                res.json({
                    msg: "Berhasil update ke read state",
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }
}

module.exports = Controler