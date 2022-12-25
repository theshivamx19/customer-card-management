const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    DOB: {
        type: Date,
        required: true,
    },
    emailID: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type : String,
        required : true,
        min : 8,
        max : 15
    },
    address: {
        type: String,
        required: true,
    },
    customerID: {
        type: String,
        required: true,
        unique: true
    },
    cardHolder : {
        type : String,
        enum : ['YES', 'NO'],
        default : 'NO'
    },
    status: {
        type: String,
        enum : ['ACTIVE', 'INACTIVE'],
        required :true
    }
}, { timestamps: true })

module.exports = mongoose.model('Customer', customerSchema)