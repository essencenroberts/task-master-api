//import
const mongoose = require('mongoose');

// connect to mongodb
async function connectDB() {
  try {
    const uri = process.env.MONGO_URI

    await mongoose.connect(uri)

    console.log('Successsfully conneced to MongoDB');
    
  } catch (error) {
    console.error('Database connection error', error);
    process.exit(1);
    
  }
}

module.exports = connectDB