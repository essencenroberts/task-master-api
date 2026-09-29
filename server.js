require("dotenv").config 

//dependecies
const express = require('express');
const app = express();
const mongoose = require('mongoose')

const PORT = process.env.PORT

//database
mongoose.connect(process.env.MONGO_URI)
  // create an instance of an express application

//middleware
app.use(express.json());


// routes

// port
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`)
});