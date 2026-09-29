//import/connect mongoose
const mongoose = require('mongoose');


// define Scheme for project model
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  description: {
    type: String,
  },

  user: {
    type: SchemaType.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

// export model 
const Project = mongoose.model('Project', projectSchema);
module.exports = Project
