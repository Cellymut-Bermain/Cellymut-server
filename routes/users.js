const express = require('express');
const router = express.Router();
const Controller = require('../controller/controller-user')
/* GET users listing. */
router.get('/', Controller.getUsers);
router.get('/get-one', Controller.getOneUsers)

router.put('/update/user', Controller.updateUser)
router.put('/update/user/password', Controller.updateUserPassword)
router.put('/update/change-image', Controller.changeImage)

module.exports = router;
