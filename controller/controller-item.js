const {Item} = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Controller {
    static getItems (req, res) {
        Item.findAll()
            .then((items)=> {
                res.json({
                    message: 'Get All Items',
                    items
                })
            })
    }
    static getOneItem (req, res) {
        let id = req.params.id
        Item.findById(id)
            .then((item)=> {
                res.json({
                    message: "get one item",
                    item
                })
            })
            .catch(err=> {
                res.json({
                    message: "error get one item",
                    err
                })
            })
    }
    static getParents (req, res) {
        Item.findAll({
            where: {
                parent_id : {
                    [Op.eq] : -1
                }
            }
        })
            .then((parents)=> {
                res.json({
                    msg: "get all parents",
                    parents
                })
            })
    }
    static getBySize (req, res) {
        let size = req.headers.size
        let item_name = req.headers.item_name
        console.log(req.headers)
        Item.findAll({
            where: {
                size: size,
                item_name,
                item_stocks: {
                    [Op.ne]: 0
                }
            }
        })
            .then(items=> {
                console.log(items)
                res.json({
                    msg: "getting items by size" ,
                    items
                })
            })
            .catch(err=> {
                console.log(err)
                res.json({
                    err
                })
            })
    }
    static getBySizeAndColor (req, res) {
        let size = req.headers.size
        let color = req.headers.color
        console.log('dont even masuk sini')
        Item.findOne({
            where: {
                size,
                color
            }
        })
            .then(item=> {
                console.log(item,'>>>>>>')
                res.json({
                    msg: "get item  by color and size",
                    item
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static addItem (req, res) {
        let item_name = ''
        let item_price = req.body.item_price
        let item_stocks = req.body.item_stocks
        let item_image = req.body.item_image
        let image_name = req.body.image_name
        let size = req.body.size
        let color = req.body.color
        let parent_id = req.body.parent_id
        let createdAt = new Date()
        let updatedAt = new Date()
        if (parent_id===1) {
            item_name = 'Monopolly Cellymut'
        }
        else {
            item_name = 'Ular Tangga Cellymut'
        }
        Item.findOrCreate({
            where: {
                size,
                color,
                item_name
            },
            defaults: {
                item_name,
                item_price,
                item_stocks,
                image_name,
                item_image,
                size,
                color,
                parent_id,
                createdAt: updatedAt,
                updatedAt
            }
        })
            .spread((item, created)=> {
                if (created) {
                    let obj = {
                        item_name,
                        item_price,
                        item_stocks,
                        image_name,
                        item_image,
                        size,
                        color,
                        parent_id,
                        createdAt,
                        updatedAt
                    }
                    Controller.addStock(obj)
                    res.json({
                        msg: "Berhasil menambahkan item baru",
                        status: 1
                    })
                }
                else {
                    res.json({
                        msg: "Ukuran dan Warna telah ada!",
                        status: 0
                    })
                }
            })
    }

    static addStock(obj) {
        Item.findOne({
            where: {
                item_name: obj.item_name,
                parent_id: -1
            }
        })
            .then(item=> {
                item.item_stocks+=obj.item_stocks
                Item.update({
                    item_stocks: item.item_stocks
                }, {
                    where: {
                        item_name: obj.item_name,
                        parent_id: -1
                    }
                })
            })
            .catch(err=> {
                console.log(err)
            })
    }


    static updateItem (req, res) {
        let id = req.params.id
        let item_name = req.body.item_name
        let item_price = req.body.item_price
        let item_stocks = req.body.item_stocks
        let item_image = req.body.item_image
        let color = req.body.color
        let size = req.body.size
        let updated_at = new Date()
        console.log(req.body)
        Item.update({
            item_name,
            item_price,
            item_stocks,
            item_image,
            updated_at,
            color,
            size
        }, {
            where: {
                id: {
                    [Op.eq] : id
                }
            }
        })
            .then(()=> {
                res.json({
                    msg: "Berhasil update item "
                })
            })
            .catch((err)=> {
                res.json({
                    msg: "Gagal update item",
                    err
                })
            })
    }

    static changeStatusItem(req, res) {
        let id = req.params.id
        let status = req.body.status
        Item.update({
            status
        },{
            where: {
                id: {
                    [Op.eq] : id
                }
            }
        })
            .then(()=> {
                res.json({
                    msg: "Berhasil merubah status menjadi " + status
                })
            })
            .catch((err)=> {
                res.json({
                    msg: "gagal merubah status",
                    err
                })
            })
    }
}

module.exports = Controller