/*
 * Course schema and data accessor methods;
 */

const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getStudentsByCourseId } = require('./user');

/*
 * Schema describing required/optional fields of a course object.
 */
const CourseSchema = {
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: false }
};
exports.CourseSchema = CourseSchema;

async function getCoursesPage(page) {
  const db = getDBReference();
  const collection = db.collection('courses');
  const count = await collection.countDocuments();

  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const pageSize = 5;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    courses: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getCoursesPage = getCoursesPage;


async function insertNewCourse(course) {
  course = extractValidFields(course, CourseSchema);
  const db = getDBReference();
  const collection = db.collection('courses');
  const result = await collection.insertOne(course);
  return result.insertedId;
}
exports.insertNewCourse = insertNewCourse;


async function getCourseById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');

  if(id.length < 3 ) {
    const results = await collection
      .find({ _id: id })
      .toArray();
    return results;
  } else if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}


async function getCourseDetailsById(id) {

  const course = await getCourseById(id);
  if(course) {
    course.students = await getStudentsByCourseId(id);
  }

  return course;
}
exports.getCourseDetailsById = getCourseDetailsById;
