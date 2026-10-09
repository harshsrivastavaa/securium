const { Course } = require('../models');
const {
  courseCreateSchema,
  courseUpdateSchema,
  parseCourseId
} = require('../validators/courseValidator');

const sendValidationError = (res, error) => {
  const errors = error.errors.map((item) => ({
    field: item.path.join('.'),
    message: item.message
  }));

  return res.status(400).json({
    message: 'Validation failed',
    errors
  });
};

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ data: courses });
  } catch (err) {
    next(err);
  }
};

const getCourse = async (req, res, next) => {
  const idResult = parseCourseId.safeParse(req.params.id);

  if (!idResult.success) {
    return sendValidationError(res, idResult.error);
  }

  try {
    const course = await Course.findByPk(idResult.data);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ data: course });
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  const result = courseCreateSchema.safeParse(req.body);

  if (!result.success) {
    return sendValidationError(res, result.error);
  }

  try {
    const course = await Course.create(result.data);

    res.status(201).json({
      message: 'Course created successfully',
      data: course
    });
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  const idResult = parseCourseId.safeParse(req.params.id);

  if (!idResult.success) {
    return sendValidationError(res, idResult.error);
  }

  const bodyResult = courseUpdateSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return sendValidationError(res, bodyResult.error);
  }

  try {
    const course = await Course.findByPk(idResult.data);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.update(bodyResult.data);

    res.status(200).json({
      message: 'Course updated successfully',
      data: course
    });
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  const idResult = parseCourseId.safeParse(req.params.id);

  if (!idResult.success) {
    return sendValidationError(res, idResult.error);
  }

  try {
    const deletedCount = await Course.destroy({
      where: { id: idResult.data }
    });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse
};
