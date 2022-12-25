const express = require('express')
const router = express.Router()

const customerController = require('../controllers/customerController')
const cardController = require('../controllers/cardController')
const auth = require('../middlewares/auth')

//=======================Customer api===================//
router.post('/createCustomer', customerController.createCustomer)
router.post('/customerLogin', customerController.customerLogin)
router.get('/getCustomer', customerController.getCustomer)
router.get('/getCustomerByQuery', customerController.getCustomerByQuery)
router.delete('/deleteCustomer/:customerID', customerController.deleteCustomer)
router.put('/updateCustomer/:customerID', customerController.updateCustomer)

//====================Card api=========================//
router.post('/createCard', cardController.createCard)
router.get('/getCards', cardController.getCards)
router.get('/getCardByCustomerId/:customerID', cardController.getCardByCustomerId)



router.all("/*", function (req, res) {
    res.status(404).send({ status: false, msg: "Make sure your url/endpoint is correct" })
})

module.exports = router