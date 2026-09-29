//import/connect mongoose and bcrypt
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// define scheme for use with fields username, email (unique), and password include pre-save hook to has the password
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type:  String,
    required: true,
  },
})

//pre-save hook to hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash
  (this.password, 10);

});
// password checker
userSchema.methods.isCorrectPassword = 
async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User