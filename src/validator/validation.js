const moment = require('moment/moment')
const mongoose = require('mongoose')

const emptyObject = function(objectId){
    return Object.keys(objectId).length == 0
}

const validName = function(name){
    return /^[a-zA-Z ]+$/.test(name)
}

const validNumber = function(number){
    return /^[7,8,9]{1}[0-9]{9}$/.test(number)
    
}
const validDateFormat = function(DOB){
    // return moment(DOB).format('MM/DD/YYYY')
    return moment(DOB, 'MM/DD/YYYY', true).isValid()
}


const validEmail = function(email){
    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailReg.test(email)
}

const validCustomerId = function(customerId){
    return /^\d{8}$/.test(customerId)
}

const validPassword = function(password){
    // return /^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)
    return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(password)
}

module.exports = {emptyObject, validName, validNumber, validDateFormat, validEmail, validCustomerId, validPassword}