var express = require('express');
var router = express.Router();
const Controller = require('../controller/controller-auth')

/* GET users listing. */
router.post('/login', Controller.login );
router.post('/register', Controller.register);

module.exports = router;
