require('dotenv').config()

const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const cors = require('cors');

const swaggerJSdoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Rate Your Professor API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  apis: ["./routes/*.js"], 
};


const swaggerSpec = swaggerJSdoc(options)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors());
app.use(express.json())

const userRoute = require('./routes/userRoute');
const teacherRoute = require('./routes/teacherRoute');
const reviewRoute = require('./routes/reviewRoute');
const adminRoute = require('./routes/adminRoute');

app.get('/welcome', (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use(userRoute);
app.use(teacherRoute);
app.use(reviewRoute);
app.use(adminRoute);

app.listen(8000, () => console.log('Server Started'))