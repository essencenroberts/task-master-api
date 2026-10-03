const express = require("express");
const router = express.Router();
const { Project, Task } = require('../../models');
const { authMiddleware, userOwnedProject } = require('../../utils/authentication')


// middleware
router.use(authMiddleware);

// routes
// CRUD
  // POST /api/projects -- create a new project
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body || {};

    const project = await Project.create({
      name,
      description,
      user: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

  // GET /api/projects: -- get all projects
  router.get('/', async (req, res) => {
    try {
      
      const projects = await Project.find({ user: req.user._id });
      res.json(projects);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
    
  });

  // GET /api/projects/:id -- get a single prodject by its ID

router.get('/:id', async (req, res) => {
  try {
    const project = await userOwnedProject(req.params.id, req, res);

    if (!project) return;

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

  // PUT /api/projects/:id -- update a project
  router.put('/:id', async (req, res) => {
    try {
      const project = await userOwnedProject(req.params.id, req, res);
      if (!project) return;

    // update fields sent 
      const { name, description } = req.body || {};

      if (name !== undefined) project.name = name;
      if (description !== undefined) project.description = description;

      await project.save();
      res.json(project);
    } catch (error) {
      const status = err.name === 'ValidationError' ? 400 : 500;
      res.status(status).json({ message: err.message });
    }

  });


  // DELETE /api/projects/:id -- delete a project 

  router.delete('/:id', async(req, res) => {

    try {
      const project = await userOwnedProject(req.params.id, req, res);
      if (!project) return;

      await Task.deleteAll({ project: project._id });

      await project.deleteOne();

      res.json({ message: 'Project and its tasks were deleted' });

    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
