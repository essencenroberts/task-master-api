// index.js to export all models from one place

const User = require('./userSchema');
const Project = require('./projectSchema');
const Task = require('./taskSchema');

module.exports = { User, Project, Task };