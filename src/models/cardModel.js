const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const cardSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
        unique: true
    },
    cardType: {
        type: String,
        enum : ['REGULAR', 'SPECIAL'],
        required : true
    },
    customerName: {
        type: String,
        requied: true
    },
    status: {
        type: String,
        // enum : ['ACTIVE', 'INACTIVE'],
        default : 'ACTIVE'
    },
    vision: {
        type: String,
    },
    customerId: {
        type: ObjectId,
        ref: 'Customer'
    }
}, { timestamps: true })

module.exports = mongoose.model('Card', cardSchema)