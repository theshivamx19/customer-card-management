const cardModel = require('../models/cardModel')
const customerModel = require('../models/customerModel')
const vfy = require('../validator/validation')
const bcrypt = require('bcrypt')

//===========================Create customer===========================//

const createCustomer = async (req, res) => {
    try {
        const data = req.body
        if (vfy.emptyObject(data)) {
            return res.status(400).send({ status: false, message: 'Data is requied to create customer' })
        }
        const { firstName, lastName, mobileNumber, DOB, emailID, address, customerID, status, password, cardHolder } = data
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
            return res.status(400).send({ status: false, message: 'Please enter valid Date of Birth MM/DD/YYYY' })
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
        if (!password) {
            return res.status(400).send({ status: false, message: 'Please create a password' })
        }
        if (!vfy.validPassword(password)) {
            return res.status(400).send({ status: false, message: 'Password must contain atleast one uppercase, lowercase, number & special character, length b/w 8-15' })
        }
        let salt = await bcrypt.genSalt(10)
        let encryptedPassword = await bcrypt.hash(password, salt)
        data.password = encryptedPassword
        if (!address) {
            return res.status(400).send({ status: false, message: 'Please enter address' })
        }
        if (!customerID) {
            return res.status(400).send({ status: false, message: 'Please enter customer id' })
        }
        if (!vfy.validCustomerId(customerID)) {
            return res.status(400).send({ status: false, message: 'Please enter 8 digit valid customer id' })
        }
        const checkCustomerId = await customerModel.findOne({ customerID: customerID })
        if (checkCustomerId) {
            return res.status(404).send({ status: false, message: 'Customer id already exists' })
        }
        if (cardHolder) {
            return res.status(400).send({ status: false, message: 'At the time of registration you do not hold any card, please remove this field' })
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

//===========================Customer Login==============================//

const customerLogin = async function (req, res) {
    try {
        let customerID = req.body.customerID;
        let password = req.body.password;

        if (!customerID) {
            return res.status(400).send({ status: false, message: 'Please enter customer id' })
        }
        if (!vfy.validCustomerId(customerID)) {
            return res.status(400).send({ status: false, message: 'Please enter 8 digit valid customer id' })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: 'Please create a password' })
        }
        if (!vfy.validPassword(password)) {
            return res.status(400).send({ status: false, message: 'Password must contain atleast one uppercase, lowercase, number & special character, length b/w 8-15' })
        }
        let customer = await customerModel.findOne({customerID, password});
        if (!customer){
            return res.status(400).send({ status: false, msg: "CustomerId or Password is incorrect" });
        }
        let token = jwt.sign(
            {
                customerID: customer.customerID,
                
            },
            "myProject"
        );
        res.setHeader('x-api-key', token)
        res.status(200).send({ status: true, message : "Logged in successful", data: token });
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
};


//===========================Get all customers====================//

const getCustomer = async (req, res) => {
    try {
        const customer = await customerModel.find({ status: "ACTIVE" })
        if (customer.length == 0) {
            return res.status(404).send({ status: false, message: "No customer found" })
        }
        return res.status(200).send({ status: true, data: customer })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//======================Get customers by query=========================//

const getCustomerByQuery = async (req, res) => {
    try {
        const data = req.query
        if (vfy.emptyObject(data)) {
            return res.status(400).send({ status: false, message: 'Enter query to find data' })
        }
        const { firstName, mobileNumber, customerID } = data
        if (firstName) {
            if (!vfy.validName(firstName)) {
                return res.status(400).send({ status: false, message: 'Please enter valid first name' })
            }
            const checkName = await customerModel.findOne({ firstName, status: 'ACTIVE' })
            if (!checkName) {
                return res.status(404).send({ status: false, message: 'No customer exists with this name' })
            }
        }
        if (mobileNumber) {
            if (!vfy.validNumber(mobileNumber)) {
                return res.status(400).send({ status: false, message: 'Please enter valid mobile number' })
            }
            const checkMobile = await customerModel.findOne({ mobileNumber: mobileNumber, status: 'ACTIVE' })
            if (!checkMobile) {
                return res.status(404).send({ status: false, message: 'No customer exists with this mobile no.' })
            }
        }
        if (customerID) {
            if (!vfy.validCustomerId(customerID)) {
                return res.status(400).send({ status: false, message: 'Please enter 8 digit valid customer id' })
            }
            const checkCustomerId = await customerModel.findOne({ customerID: customerID, status: 'ACTIVE' })
            if (!checkCustomerId) {
                return res.status(404).send({ status: false, message: 'No customer exists with this customer id' })
            }
        }
        const customer = await customerModel.find({ ...data, status: "ACTIVE" })
        return res.status(200).send({ status: true, totalCustomer: customer.length, data: customer })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

//===============================Delete customer by customer id=======================//

const deleteCustomer = async (req, res) => {
    try {
        const customerID = req.params.customerID
        if (customerID.length == 0) {
            return res.status(400).send({ status: false, message: "Customer unique id is requied" })
        }
        if (!vfy.validCustomerId(customerID)) {
            return res.status(400).send({ status: false, message: "Enter valid 8 digit customer id" })
        }
        const checkCustomerId = await customerModel.findOne({ customerID, status: "ACTIVE" })
        if (!checkCustomerId) {
            return res.status(404).send({ status: false, message: "Customer does not exists with this id" })
        }
        const customer = await customerModel.findOneAndUpdate({ customerID, status: 'ACTIVE' },
            {
                $set: {
                    status: "INACTIVE"
                }
            })
        if (!customer) {
            return res.status(404).send({ status: false, message: "Customer not found" })
        }
        await cardModel.findOneAndUpdate({ customerID },
            {
                $set: {
                    status: "INACTIVE"
                }
            })
        return res.status(200).send({ status: true, message: "Customer deleted successfully" })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//======================Update customer by customer id==========================//

const updateCustomer = async (req, res) => {
    try {
        const customerID = req.params.customerID
        const data = req.body
        if (customerID.length == 0) {
            return res.status(400).send({ status: false, message: "Customer unique id is requied" })
        }
        if (!vfy.validCustomerId(customerID)) {
            return res.status(400).send({ status: false, message: "Enter valid 8 digit customer id" })
        }
        const checkCustomerId = await customerModel.findOne({ customerID, status: "ACTIVE" })
        if (!checkCustomerId) {
            return res.status(404).send({ status: false, message: "Customer does not exists with this id" })
        }
        const { mobileNumber, DOB, emailID, password } = data
        if (mobileNumber) {
            if (!vfy.validNumber(mobileNumber)) {
                return res.status(400).send({ status: false, message: "Enter valid 8 digit customer id" })
            }
            const checkMobile = await customerModel.findOne({ mobileNumber: mobileNumber })
            if (checkMobile) {
                return res.status(404).send({ status: false, message: 'Mobile no. already exists, should be unique' })
            }
        }
        if (DOB) {
            if (!vfy.validDateFormat()) {
                return res.status(400).send({ status: false, message: "Please enter valid Date of Birth MM/DD/YYYY" })
            }
        }
        if (emailID) {
            if (!vfy.validEmail(emailID)) {
                return res.status(400).send({ status: false, message: "Enter valid email id" })
            }
            const checkEmail = await customerModel.findOne({ mobileNumber: mobileNumber })
            if (checkEmail) {
                return res.status(404).send({ status: false, message: 'Email id already exists, should be unique' })
            }
        }
        if (password) {
            if (!vfy.validPassword(password)) {
                return res.status(400).send({ status: false, message: "Password must contain atleast one uppercase, lowercase, number & special character, length b/w 8-15" })
            }
            let comparedPassword = await bcrypt.compare(password, checkCustomerId.password)
            console.log(comparedPassword)
            if (comparedPassword) {
                return res.status(400).send({ status: false, message: "You cannot update with previous password" })
            }
            let salt = await bcrypt.genSalt(10)
            let encryptedPassword = await bcrypt.hash(password, salt)
            password = encryptedPassword
        }

        const customer = await customerModel.findOneAndUpdate({ customerID, status: 'ACTIVE' },
            {
                $set: {
                    data
                }
            }, { new: true })
        if (!customer) {
            return res.status(404).send({ status: false, message: "Customer not found" })
        }
        return res.status(200).send({ status: true, data: customer })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createCustomer, getCustomer, deleteCustomer, getCustomerByQuery, updateCustomer, customerLogin }


// mobileNumber,
//                     DOB,
//                     emailID,
//                     password,
//                     cardHolder