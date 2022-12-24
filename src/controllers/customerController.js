const customerModel = require('../models/customerModel')
const vfy = require('../validator/validation')

const createCustomer = async (req, res) => {
    try {
        const data = req.body
        if (vfy.emptyObject(data)) {
            return res.status(400).send({ status: false, message: 'Data is requied to create customer' })
        }
        const { firstName, lastName, mobileNumber, DOB, emailID, address, customerID, status } = data
        if (!firstName) {
            return res.status(400).send({ status: false, message: 'Please enter first name' })
        }
        if (!vfy.validName(firstName)) {
            return res.status(400).send({ status: false, message: 'Please enter valid first name' })
        }

        if (!lastName) {
            return res.status(400).send({ status: false, message: 'Please enter last name' })
        }
        if (!vfy.validName(lastName)) {
            return res.status(400).send({ status: false, message: 'Please enter valid last name' })
        }
        if (!mobileNumber) {
            return res.status(400).send({ status: false, message: 'Please enter mobile number' })
        }
        if (!vfy.validNumber(mobileNumber)) {
            return res.status(400).send({ status: false, message: 'Please enter valid mobile number' })
        }
        const checkMobile = await customerModel.findOne({ mobileNumber: mobileNumber })
        if (checkMobile) {
            return res.status(404).send({ status: false, message: 'Mobile no. already exists, should be unique' })
        }
        if (!DOB) {
            return res.status(400).send({ status: false, message: 'Please enter Date of Birth' })
        }
        if (!vfy.validDateFormat(DOB)) {
            return res.status(400).send({ status: false, message: 'Please enter valid Date of Birth' })
        }
        if (!emailID) {
            return res.status(400).send({ status: false, message: 'Please enter email id' })
        }
        if (!vfy.validEmail(emailID)) {
            return res.status(400).send({ status: false, message: 'Please enter email id' })
        }
        const checkEmail = await customerModel.findOne({ emailID: emailID })
        if (checkEmail) {
            return res.status(404).send({ status: false, message: 'Email id already exists' })
        }
        if (!address) {
            return res.status(400).send({ status: false, message: 'Please enter address' })
        }
        if (!customerID) {
            return res.status(400).send({ status: false, message: 'Please enter customer id' })
        }
        const checkCustomerId = await customerModel.findOne({ customerID: customerID })
        if (checkCustomerId) {
            return res.status(404).send({ status: false, message: 'Customer id already exists' })
        }
        if (!status) {
            return res.status(400).send({ status: false, message: 'Please enter customer status' })
        }
        if (!['ACTIVE', 'INACTIVE'].includes(status)) {
            return res.status(400).send({ status: false, message: 'Status must be either ACTIVE/INACTIVE' })
        }
        const customer = await customerModel.create(data)
        return res.status(201).send({ status: true, data: customer })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getCustomer = async (req, res) => {
    try {
        const customer = await customerModel.find({ status: "INACTIVE" })
        return res.status(200).send({ status: true, data: customer })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deleteCustomer = async (req, res) => {

}

module.exports = { createCustomer, getCustomer }