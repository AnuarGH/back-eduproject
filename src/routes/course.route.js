const {ADMIN} = require('../utils/passport');

module.exports = (router) => {
  const courses = require('../controllers/course.controller.js');

  // Create a new Course
  router.post('/courses', ADMIN, courses.create);

  // Update a Course with CourseId
  router.put('/courses/:courseId', ADMIN, courses.update);

  // Delete a Course with CourseId
  router.delete('/courses/:courseId', ADMIN, courses.delete);

  // User with administrative privileges can retrieve any course
  router.get('/courses/all', ADMIN, courses.findAllAdmin);

  // User with no administrative privileges cannot see hidden courses
  router.get('/courses', courses.findAll);

  // Retrieve a single Course with CourseId
  router.get('/courses/:courseId', courses.findOne);

};