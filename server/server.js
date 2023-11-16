require('dotenv').config()

const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const cors = require('cors');
const path = require('path'); 
const {auth} = require('./middleware/auth');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors());
app.use(express.json())

app.use("/uploads",auth)
app.use("/uploads",express.static(path.join(__dirname, 'uploads')));

const userRoute = require('./routes/userRoute');
const teacherRoute = require('./routes/teacherRoute');
const reviewRoute = require('./routes/reviewRoute');
const adminRoute = require('./routes/adminRoute');

app.get("/", (req, res) => {
  const response = "Welcome to Rate Your Professor";
    res.status(200).json({ message: response });
  });

app.use(userRoute);
app.use(teacherRoute);
app.use(reviewRoute);
app.use(adminRoute);

app.listen(8000, () => console.log('Server Started'))