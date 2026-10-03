//import/connect mongoose
const mongoose = require('mongoose');


// define Scheme for project model
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 
    'Project name is required'],
    trim: true,
  },

  description: {
    type: String,
     trim: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
},
  { timestamps: true }
);

// export model 
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
