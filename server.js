require('dotenv').config()

const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const userRoute = require('./routes/userRoute');
const teacherRoute = require('./routes/teacherRoute');
const reviewRoute = require('./routes/reviewRoute');

app.use(userRoute);
app.use(teacherRoute);
app.use(reviewRoute);

app.listen(3000, () => console.log('Server Started'))