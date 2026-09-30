const mongoose = require('mongoose');


// define schema for task include title, description, status, and ref to "Project' import 'Project'

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
  },

  description: {
    type: String,
  },

  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To-Do',
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  }

},
  { timestamps: true }
)


// export model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;