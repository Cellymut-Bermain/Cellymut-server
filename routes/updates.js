var express = require('express');
var router = express.Router();
const Controller = require('../controller/controller-update')

/* GET home page. */
router.get('/',Controller.getUpdates );
router.get('/user/all', Controller.getUpdateByUser)
router.get('/user/all/unread', Controller.getUnread)


router.post('/add/user/:user_id/item/:item_id', Controller.addUpdate)


router.put('/read/:update_id', Controller.readUpdate)

module.exports = router;
