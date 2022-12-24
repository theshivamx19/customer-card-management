const express = require('express')
const router = express.Router()

const customerController = require('../controllers/customerController')
const cardController = require('../controllers/cardController')

//=======================Customer api===================//
router.post('/createCustomer', customerController.createCustomer)
router.get('/getCustomer', customerController.getCustomer)

//====================Card api=========================//
router.post('/createCard', cardController.createCard)
router.get('/getCards', cardController.getCards)

module.exports = router