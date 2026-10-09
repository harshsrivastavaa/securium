const express = require('express');
const {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse
} = require('../controllers/courseController');

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
