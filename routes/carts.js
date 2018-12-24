const express = require('express');
const router = express.Router();
const Controller = require('../controller/controller-cart')
/* GET home page. */
router.get('/get/all', Controller.getCarts)
router.get('/', Controller.getCartsByUserId);
router.get('/:cart_id', Controller.getOneCart)

router.post('/get/ongkir', Controller.fetchingRajaOngkir)
router.post('/add/:item_id', Controller.addCart)

router.put('/inc-quantity', Controller.addQuantity)
router.put('/dec-quantity', Controller.decQuantity)

router.delete('/delete/cart/:ItemId/:UserId', Controller.deleteCart)
router.delete('/delete.cart/status/:ItemId/:UserId', Controller.goToTrans)

module.exports = router;
