const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const dotenv = require('dotenv').config()
const connectDb = require("./config/dbConnection")
const cors = require('cors');

const app = express()
app.use(cors());

connectDb();
const port = process.env.PORT || 5000

app.use(express.json()) 
app.use('/api/contacts', require('./routes/contactRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use(errorHandler)



app.listen(port, () => {
})