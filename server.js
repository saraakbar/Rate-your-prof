require('dotenv').config()

const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()

const swaggerJSdoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Rate My Professor API",
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
  apis: ["./routes/*.js"], // Make sure this points to your API definition files.
};


const swaggerSpec = swaggerJSdoc(options)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

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