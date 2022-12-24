const express = require('express')
const router = express.Router()

const customerController = require('../controllers/customerController')
const cardController = require('../controllers/cardController')

router.post('/createCustomer', customerController.createCustomer)
router.post('/createCard', cardController.createCard)

module.exports = router