const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getStudentsByCourseId } = require('./user');

const AssignmentSchema = {
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: false }
};
exports.CourseSchema = AssignmentSchema;
