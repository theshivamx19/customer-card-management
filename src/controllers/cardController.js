const mongoose = require('mongoose')
const cardModel = require('../models/cardModel')
const customerModel = require('../models/customerModel')
const vfy = require('../validator/validation')

//=================================Create cards================================//

const createCard = async (req, res) => {
    try {
        const data = req.body
        let totalDocs = await cardModel.find().countDocuments()
        totalDocs++
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
        if (checkCustomerId.status == "INACTIVE") {
            return res.status(400).send({ status: false, message: 'You cannot generate card of deleted customer' })
        }
        const checkCustomerInCard = await cardModel.findOne({ customerID })
        if (checkCustomerInCard) {
            return res.status(400).send({ status: false, message: `Card already generated for the customer id ${customerID}` })
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
        await customerModel.findOneAndUpdate({ customerID }, { $set: { cardHolder: "YES" } })
        return res.status(201).send({ status: true, data: card })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//==============================Get all cards==============================//

const getCards = async (req, res) => {
    try {
        const cards = await cardModel.find()
        if (cards.length == 0) {
            return res.status(404).send({ status: false, message: 'No card found' })
        }
        return res.status(200).send({ status: true, "total cards": cards.length, data: cards })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//============================Get card by customer id==================================//

const getCardByCustomerId = async (req, res) => {
    try {
        const customerID = req.params.customerID
        if (customerID.length == 0) {
            return res.status(400).send({ status: false, message: 'Customer id is required' })
        }
        if (!vfy.validCustomerId(customerID)) {
            return res.status(400).send({ status: false, message: 'Please enter 8 digit valid customer id' })
        }
        const checkCustomerId = await customerModel.findOne({ customerID, status: "ACTIVE" })
        if (!checkCustomerId) {
            return res.status(400).send({ status: false, message: 'Given customer id does not exists with any customer' })
        }
        const cards = await cardModel.findOne({ customerID, status: 'ACTIVE' })
        if (!cards) {
            return res.status(404).send({ status: false, message: `Card not exists for the given customer id ${customerID}` })
        }
        return res.status(200).send({ status: true, data: cards })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createCard, getCards, getCardByCustomerId }

