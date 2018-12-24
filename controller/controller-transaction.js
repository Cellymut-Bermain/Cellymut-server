const {Transaction, Item, User, Update} = require('../models')
const {secret_key} = require('../config/config')
const { createRandomId } = require('../crypto')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Controller {

    static getTransactions (req, res) {
        Transaction.findAll({
            include: [
                {
                    model: Item
                },
                {
                    model: User
                }
            ],
        })
            .then((trans)=> {
                res.json({
                    msg: "get all transactions",
                    trans
                })
            })
            .catch(err=> {
                console.log(err)
                res.json({
                    msg: "error getting all transactions",
                    err
                })
            })
    }

    static  getOneTransactions (req, res) {
        const id = req.params.id
        Transaction.findById(id)
            .then(tran=> {
                res.json({
                    msg: 'Get one transaction',
                    tran
                })
            })
            .catch(err=> {
                res.json({
                    msg: "error getting one transcations",
                    err
                })
            })
    }

    static getUserTransactions (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let UserId = decoded.id
        Transaction.findAll({
            include: [
                {
                    model: Item
                },
                {
                    model: User
                }
            ],
            where: {
                UserId: {
                    [Op.eq] : UserId
                }
            }
        })
            .then((trans)=> {
                res.json({
                    msg: "get transaksi berdasarkan user id!",
                    trans
                })
            })
            .catch(err=> {
                res.json({
                    err,
                    msg: "error mendapatkan transaksi berdasarkan user id!"
                })
            })
    }



    static buyTransaction (req, res) {
        // let decoded = jwt.verify(req.headers.token, secret_key)
        let UserId = req.body.UserId
        let ItemId = req.params.item_id
        let id = createRandomId()
        let quantity = Number(req.body.quantity)
        let color = req.body.color
        let price = Number(req.body.price)
        let cost = Number(req.body.cost)
        let cost_courier = cost
        let type_courier = req.body.type_courier
        let total = (price*quantity) + cost
        let alamat_pengiriman = req.body.alamat_pengiriman
        let phone_number = req.body.phone_number
        let createdAt = new Date()
        let updatedAt = new Date()

        Transaction.create({
            id,
            UserId,
            ItemId,
            quantity,
            color,
            total,
            cost_courier,
            type_courier,
            alamat_pengiriman,
            phone_number,
            createdAt,
            updatedAt
        })
            .then(()=> {
                let obj = {
                    id,
                    UserId,
                    ItemId,
                    quantity,
                    color,
                    total,
                    cost_courier,
                    type_courier,
                    createdAt,
                    updatedAt
                }
                Controller.decStock(obj)
                res.json({
                    msg: "berhasil menambahkan transaksi baru!",
                    id
                })
            })
            .catch(err=> {
                res.json({
                    msg: "error menambahkan transaksi",
                    err
                })
            })
    }
    static decStock (obj) {
        Item.findOne({
            where: {
                id: obj.ItemId
            }
        })
            .then((item)=> {
                item.item_stocks -= obj.quantity
                Item.update({
                    item_stocks: item.item_stocks
                },{
                    where: {
                        id: obj.ItemId
                    }
                })
                    .then(()=> {
                        console.log('Berhasil kurangin stocks')
                    })
                    .catch(err=> {
                        console.log(err)
                    })
            })
            .catch(err=> {
                console.log(err)
            })
    }



    static cancelTransaction (req, res) {
        let id = req.params.trans_id
        Transaction.destroy({
            where: {
                id: {
                    [Op.eq] : id
                }
            }
        })
            .then((data)=> {
                if (data) {
                    res.json({
                        data,
                        msg: "berhasil cance transaksi dengan id "+id
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
                    msg: 'gagal menghapus transaksi',
                    err
                })
            })
    }

    static async confirmStatusTransactions (req, res) {
        let id = req.params.trans_id
        try {
            let getTrans = await Transaction.findById(id)
            getTrans.status_transaction+=1
            let updateTrans = await Transaction.update({
              status_transaction: getTrans.status_transaction
            },{
                where: {
                    id: {
                        [Op.eq] : id
                    }
                }
            })
            Controller.updateMessageStatus(id, getTrans)
            res.json({
                getTrans,
                updateTrans
            })

        }
        catch (e) {
            console.log(e)
            res.json({
                e
            })
        }
    }
    static updateMessageStatus (trans_id, getTrans) {

        const updatedAt = new Date()
        const createdAt = new Date()
        Update.create({
            UserId: getTrans.UserId,
            ItemId: getTrans.ItemId,
            type: getTrans.status_transaction,
            updatedAt,
            createdAt,
            message: 'Pesan Sesuatu',
            TransactionId: trans_id
        })
            .then(()=> {
                console.log('Berhasil Update Status Message')
                return 'Berhasil Update Status Message'
            })
            .catch(err=> {
                console.log(err)
                return err
            })
    }

    static async rejectStatusTransactions (req, res) {
        let id = req.params.trans_id
        console.log(id)
        let obj = {
            id: req.body.ItemId ,
            quantity: req.body.quantity
        }
        console.log(obj)
        try {
            let getTrans = await Transaction.findOne({
                where: {
                    id: id
                }
            })
            getTrans.status_transaction = -1
            let updateTrans = await Transaction.update({
                status_transaction: getTrans.status_transaction
            },{
                where: {
                    id: {
                        [Op.eq] : id
                    }
                }
            })
            Controller.restockItem(obj)
            res.json({
                getTrans,
                updateTrans
            })
        }
        catch (e) {
            res.json({
                e
            })
        }
    }
    static restockItem (obj) {
        Item.findOne({
            where: {
                id: obj.id
            }
        })
            .then((item)=> {
                console.log('ini obj',obj)
                item.item_stocks+=obj.quantity
                console.log(item.dataValues)
                Item.update({
                    item_stocks: item.item_stocks
                },{
                    where: {
                        id: obj.id
                    }
                })
                    .then((apaan)=> {
                        console.log('berhasil restock barang', item)
                        console.log(apaan)
                    })
                    .catch(err=> {
                        console.log(err)
                    })
            })
            .catch(err=> {

            })
    }
}

module.exports = Controller