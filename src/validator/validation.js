const moment = require('moment/moment')
const mongoose = require('mongoose')

const emptyObject = function(objectId){
    return Object.keys(objectId).length == 0
}

const validName = function(name){
    return /^[a-zA-Z ]+$/.test(name)
}

const validNumber = function(number){
    return /^[1-9]{1}[0-9]{9}$/.test(number)
}
const validDateFormat = function(date){
    return moment(date, 'DD/MM/YYYY', true).isValid()
}


const validEmail = function(email){
    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailReg.test(email)
}

const validCustomerId = function(customerId){
    return /^\d{8}$/.test(customerId)
}

module.exports = {emptyObject, validName, validNumber, validDateFormat, validEmail, validCustomerId}