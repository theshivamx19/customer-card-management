const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route')

const app = express()
app.use(express.json())

mongoose.connect('mongodb+srv://Admin:Admin123@cluster0.ngpjs.mongodb.net/customerCard-DB',

    { useNewUrlParser: true })
    .then(() => console.log('MongoDB is connnected'))
    .catch((err) => console.log(err))

app.use('/', route)

app.listen((3000), () => console.log('Listening to port 3000'))

