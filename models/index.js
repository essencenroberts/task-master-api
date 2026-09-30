// index.js to export all models from one place

const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

module.exports = { User, Project, Task }