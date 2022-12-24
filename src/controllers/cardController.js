const mongoose = require('mongoose')
const cardModel = require('../models/cardModel')
const customerModel = require('../models/customerModel')
const vfy = require('../validator/validation')

const createCard = async (req, res) => {
    try {
        const data = req.body
        if (vfy.emptyObject(data)) {
            return res.status(400).send({ status: false, message: 'Data is required to create card' })
        }
        let { cardNumber, cardType, customerName, status, vision, customerID } = data
        if (!cardNumber) {
            return res.status(400).send({ status: false, message: 'Please provide card number' })
        }
        const checkCardNumber = await cardModel.findOne({ cardNumber })
        if (checkCardNumber) {
            return res.status(404).send({ status: false, message: 'Card no. already exists' })
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
        const checkCustomerId = await customerModel.findOne({ customerID })
        if (!checkCustomerId) {
            return res.status(400).send({ status: false, message: 'Given customer id does not exists with any customer' })
        }
        // if (!customerName) {
        //     return res.status(400).send({ status: false, message: 'Please enter customer name' })
        // }
        // if (!vfy.validName(customerName)) {
        //     return res.status(400).send({ status: false, message: 'Enter valid customer name' })
        // }
        customerName = checkCustomerId.firstName +" "+ checkCustomerId.lastName
        // if(!status){
        //     return res.status(400).send({ status: false, message: 'Please enter card status' })
        // }
        if (status) {
            if (!['ACTIVE', 'INACTIVE'].includes(status)) {
                return res.status(400).send({ status: false, message: 'Status must be either ACTIVE/INACTIVE' })
            }
        }
        if (!vision) {
            return res.status(400).send({ status: false, message: 'Please provide vision' })
        }
        // const finalData = {...data, customerName}
        const card = await cardModel.create({...data, customerName})
        return res.status(201).send({ status: true, data: card })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createCard }