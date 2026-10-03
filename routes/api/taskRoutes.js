const express = require("express");
const router = express.Router();
const { Task } = require('../../models'); // Task model import
const { authMiddleware, userOwnedProject } = require('../../utils/authentication');
// CRUD
  // POST /api/projects/:projectsId/tasks -- create new task
  router.post('/', async(requestAnimationFrame, res) => {
    try {
      // check user owns project
      const project = await userOwnedProject(req.params.projectId, res);
      if(!project) return;

      // create task and link to project
      const { title, description, status } = req.body || {};
      const task = await Task.create({
        title,
        description,
        status,
        project: project._id,
      });

      res.status(201).json(task);
    } catch (err) {

     //ValidationError  
     const status = err.name === 'ValidationError' ? 400 : 500;
     res.status(status).json({
      message: err.message
     });
    }
  });

  // GET /api/projects/:projectId/tasks -- get all tasks for a specific project
  router.get('/projects/:projectId/tasks', authMiddleware, async (req, res) => {
    try {
      // check parent project ownership
      const project = await userOwnedProject(req.params.projectId, req, res)

      if (!project) returns;

      // get only task that belong to this project
      const tasks = await Task.find({
        project: project._id
      });
      res.json(tasks)

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


  // PUT /api/tasks/:taskId -- update asingle task 
router.put('/tasks/:taskId', authMiddleware, async (req, res) => {
  try {
    // find task
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }
    // find task parent project and if user is the owner

    const project = await userOwnedProject(task.project, req, res);
    if(!project) return;

    // update 
    const { title, description, status } = req.body || {};
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status  = status;

    // validation
    await task.save();
    res.json(task)
  } catch (err) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.messagen});
  }
});

  // DELETE /api/tasks/:taskId -- delate a single task 
  router.delete('/tasks/:taskId', authMiddleware, async (req, res) => {
    try {
      // find the task
      const task = await Task.findById(req.params.taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      // check the user owns the task's parent project
      const project = await userOwnedProject(task.project, req, res);
      if (!project) return;

      // delete task

      await task.deleteOne();
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
    
  });

  module.exports = router;