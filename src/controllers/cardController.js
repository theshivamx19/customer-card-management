const mongoose = require('mongoose')
const cardModel = require('../models/cardModel')
const customerModel = require('../models/customerModel')
const vfy = require('../validator/validation')

const createCard = async (req, res) => {
    try {
        const data = req.body
        let totalDocs = await cardModel.find().countDocuments()
        totalDocs++
        console.log(totalDocs)
        if (vfy.emptyObject(data)) {
            return res.status(400).send({ status: false, message: 'Data is required to create card' })
        }
        let { cardNumber, cardType, customerName, status, vision, customerID } = data
        if (cardNumber) {
            return res.status(400).send({ status: false, message: "You cannot enter Card Number mannually, please remove this field" })
        }
        if (customerName) {
            return res.status(400).send({ status: false, message: 'You do not need to enter this field, please remove' })
        }
        if (!cardType) {
            return res.status(400).send({ status: false, message: 'Please provide card type' })
        }
        if (!['REGULAR', 'SPECIAL'].includes(cardType)) {
            return res.status(400).send({ status: false, message: 'Card type must be either REGULAR/SPECIAL' })
        }
        if (!customerID) {
            return res.status(400).send({ status: false, message: 'Please enter customer id' })
        }
        if (!vfy.validCustomerId(customerID)) {
            return res.status(400).send({ status: false, message: 'Please enter 8 digit valid customer id' })
        }
        const checkCustomerId = await customerModel.findOne({ customerID })
        if (!checkCustomerId) {
            return res.status(400).send({ status: false, message: 'Given customer id does not exists with any customer' })
        }

        if (status) {
            if (!['ACTIVE', 'INACTIVE'].includes(status)) {
                return res.status(400).send({ status: false, message: 'Status must be either ACTIVE/INACTIVE' })
            }
        }
        if (!vision) {
            return res.status(400).send({ status: false, message: 'Please provide vision' })
        }
        cardNumber = "SBI" + 0 + 0 + totalDocs++
        customerName = checkCustomerId.firstName + " " + checkCustomerId.lastName
        const card = await cardModel.create({ ...data, customerName, cardNumber })
        return res.status(201).send({ status: true, data: card })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const getCards = async (req, res) => {
    try {
        const cards = await cardModel.find()
        if(cards.length==0){
            return res.status(404).send({status : false, message : 'No card found'})
        }
        return res.status(200).send({ status: true, "total cards" : cards.length, data: cards })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { createCard, getCards }

