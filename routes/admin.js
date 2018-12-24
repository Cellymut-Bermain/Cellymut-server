var express = require('express');
var router = express.Router();
const Controller = require('../controller/controller-admin')
const Middleware = require('../middleware/middleware-admin')
/* GET users listing. */
router.get('/', Controller.getAdmins);
router.get('/:id', Controller.getOneAdmin)

router.post('/add', Middleware.checkTokenAdd, Controller.addAdmin)
router.post('/login', Controller.login)

router.put('/update/:id', Middleware.checkTokenEdit, Controller.updateAdmin)

router.delete('/delete/:id', Middleware.checkTokenDelete, Controller.deleteAdmin)

module.exports = router;
