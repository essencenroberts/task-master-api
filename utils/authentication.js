// import jsonwebtoken JWT library

const jwt = require('jsonwebtoken'); // import JWT library
const Project = require('../models'); // to look up Projects

const expiration = '2h';

// make a token (both rehister and login need a token)
function signToken(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiration });

}

// middleware
function authMiddleware(req, res, next) {
  // look for header
  const authHeader = req.headers.authorization;

  // if no header /token reject 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'You must be logged in to do that'
    });
  }

  // split Bearer the token out
  const token = authHeader.split(' ')[1];
  // check signature and expiration
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // attach users info to request
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

}

// check if the user owns the project
async function userOwnedProject(projectId, req, res) {
  const project = await Project.findById(projectId);

  // if user doesn't own return null and send error response
  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return null;
  }
  // if user owns it return project
  if (project.user.toString() !== req.user._id) {
    res.status(403).json({ message: 'You are not allowed to access this project.' })
  }

  return project;
}

module.exports = { signToken, authMiddleware,  userOwnedProject };