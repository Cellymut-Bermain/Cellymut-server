const cron = require('node-cron')
let {Item, Transaction, Update} = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
cron.schedule("0 0 0 * * *", function () {
    function findMonopolly () {
        Item.findAll({
            where: {
                item_name: 'Monopolly Cellymut',
                parent_id: {
                    [Op.ne]: -1,
                }
            }
        })
            .then((items)=> {
                let stocks = 0
                for(var i=0;i<items.length;i++) {
                    // console.log(items[i].dataValues)
                    stocks+=items[i].item_stocks
                }
                Item.update({
                    item_stocks: stocks
                }, {
                    where : {
                        item_name: 'Monopolly Cellymut',
                        parent_id: {
                            [Op.eq]: -1,
                        }
                    }
                })
                    .then(()=> {
                    })
                    .catch(err=> {
                        console.log(err)
                    })

            })
            .catch(err=> {
                console.log(err)
            })
    }
    findMonopolly()

    function findUlarTangg () {
        Item.findAll({
            where: {
                item_name: 'Ular Tangga Cellymut',
                parent_id: {
                    [Op.ne]: -1,
                }
            }
        })
            .then((items)=> {
                let stocks = 0
                for(var i=0;i<items.length;i++) {
                    // console.log(items[i].dataValues)
                    stocks+=items[i].item_stocks
                }
                Item.update({
                    item_stocks: stocks
                }, {
                    where : {
                        item_name: 'Ular Tangga Cellymut',
                        parent_id: {
                            [Op.eq]: -1,
                        }
                    }
                })
                    .then(()=> {
                    })
                    .catch(err=> {
                        console.log(err)
                    })

            })
            .catch(err=> {
                console.log(err)
            })
    }
    findUlarTangg()
    function msgUpadate () {
        let temp = []
        Transaction.findAll()
            .then((trans)=> {
                for (var i=0;i<trans.length;i++) {
                    temp.push(trans[i].dataValues)
                    created6Months(trans[i].dataValues.createdAt, trans[i].dataValues)
                }
                // console.log(temp)
            })
            .catch(err=> {
                console.log(err)
            })
    }
    function created6Months (date, trans) {
        var d = new Date(date);
        d.setMonth(d.getMonth() + 6);
        var todayDate = new Date()
        if (d.toLocaleDateString() === todayDate.toLocaleDateString()) {
            createMessage(trans)
        }
    }
    function createMessage (trans) {
        const UserId = trans.UserId
        const ItemId = trans.ItemId
        const type = 4
        const TransactionId = trans.id
        const updatedAt = new Date()
        const createdAt = new Date()
        const message = 'Update Sekarang'
        console.log('ini trans', trans)
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

                console.log('ini')
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }
    msgUpadate()
    console.log('Ini berapa hari kan updatenya')
})

module.exports = cron