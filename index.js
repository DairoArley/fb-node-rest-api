const express = require('express')
const app = express()

const dotenv = require('dotenv')
const mongoose = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require("./routes/users")
const authRoute = require('./routes/auth')

dotenv.config()

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.info('conectado a Mongo mejorado')
  }
)

// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(8800, () => console.info('backend server is running'))
