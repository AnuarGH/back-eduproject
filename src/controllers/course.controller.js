const Course = require('../models/course.model.js');

// Create and Save a new Course
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    return res.status(400).send({
      message: "Course title can not be empty"
    });
  }

  // Create a Course
  const course = new Course({
    title: req.body.title
  });

  // Save Course in the database
  course.save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Course."
      });
    });
};

// Retrieve and return all courses from the database.
exports.findAllAdmin = (req, res) => {
  Course.find({}, "-lessons")
    .then(courses => {
      res.send(courses);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving courses."
      });
    });
};

// Retrieve and return all courses from the database.
exports.findAll = (req, res) => {
  Course.find({hidden: false}, "-lessons")
    .then(courses => {
      res.send(courses);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving courses."
      });
    });
};
// Find a single course with a courseId
exports.findOne = (req, res) => {
  Course.findById(req.params.courseId)
    .then(course => {
      if (!course) {
        return res.status(404).send({
          message: "Course not found with id " + req.params.courseId
        });
      }
      res.send(course);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Course not found with id " + req.params.courseId
        });
      }
      return res.status(500).send({
        message: "Error retrieving course with id " + req.params.courseId
      });
    });

};

// Update a course identified by the courseId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.course) {
    return res.status(400).send({
      message: "No update were sent"
    });
  }

  // Find course and update it with the request body
  Course.findByIdAndUpdate(req.params.courseId, req.body.course, {new: true})
    .then(course => {
      if (!course) {
        return res.status(404).send({
          message: "Course not found with id " + req.params.courseId
        });
      }
      res.send(course);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Course not found with id " + req.params.courseId
        });
      }
      return res.status(500).send({
        message: "Error updating course with id " + req.params.courseId
      });
    });
};

// Delete a course with the specified courseId in the request
exports.delete = (req, res) => {
  Course.findByIdAndRemove(req.params.courseId)
    .then(course => {
      if(!course) {
        return res.status(404).send({
          message: "Course not found with id " + req.params.courseId
        });
      }
      res.send({message: "Course deleted successfully!"});
    })
    .catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "Course not found with id " + req.params.courseId
        });
      }
      return res.status(500).send({
        message: "Could not delete course with id " + req.params.courseId
      });
    });

};