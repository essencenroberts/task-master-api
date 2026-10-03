const router = require('express').Router();


//routes
  // /api/users
router.use('/users', require('./userRoutes'));

// /taskRoutes
router.use('/', require('./taskRoutes'));

// /projectRoutes
router.use('/projects', require('./projectRoutes'));

module.exports = router;