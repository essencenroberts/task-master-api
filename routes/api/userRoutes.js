// imports express, router, User model
const express = require('express')
const router = express.Router();
const User = require('../../models/userSchema');
const signToken = require('../../utils/authentication');
const jwt = require('jsonwebtoken');

// function to handle errors

// REGISTRATION 
  //POST create new user /api/users/register
router.post('/api/users/register', async (req, res) => {
  try {
   
    const { username, email, password } = req.body || {};

   // to create new user
    const newUser = await User.create({ username, email, password });

    const token = signToken(user);

    res.status(201).json({
      token,
      newUser: { _id: User._id, username: User.username, email: User.email },
    });
  } catch (err) {
    // email is already taken 
    if (err.code == 11000) {
    return res.status(400).json({ message: "Registration failed!" });
    }
    // validtion error 
    if (err.name === 'ValidationError') {
     return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//LOGIN
  //POST find user by email /api/users/login

router.post('/login', async (req, res) => {
  try {
    // req.body
    const { email, password } = req.body || {};

    // find user by email 
    const user = await User.findOne({ email })

    // check password
    if (!user || !(await user.isCorrectPassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // if correct
    const token = signToken(user);

    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
});

module.exports = router;