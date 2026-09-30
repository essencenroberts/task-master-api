require('dotenv').config(); 

//dependecies
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const connectDB = require('./config/connection.js');
const PORT = process.env.PORT || 3009;

// connect to MongoDB
connectDB();

//database
mongoose.connect(process.env.MONGO_URI)
  // create an instance of an express application

//middleware
app.use(express.json());


// routes
  // test route to see if server is alive
  app.get('/', (req, res) => {
    res.send('TaskMaster API is running!');
  });

// port
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`)
});