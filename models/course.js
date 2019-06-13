/*
 * Course schema and data accessor methods;
 */

const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { removeAssignmentsByCourseId } = require('../models/assignment');
const { getUserById } = require('./user');
const ObjectID = require('mongodb').ObjectID;
/*
 * Schema describing required/optional fields of a course object.
 */
const CourseSchema = {
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: true }
};
exports.CourseSchema = CourseSchema;

async function getAllCourses(page) {
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
exports.getAllCourses = getAllCourses;


async function createCourse(course) {
  course = extractValidFields(course, CourseSchema);
  const db = getDBReference();
  const collection = db.collection('courses');
  const result = await collection.insertOne(course);
  return result.insertedId;
}
exports.createCourse = createCourse;


async function getCourseById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('courses');
    const results = await collection
      .find({ _id: id })
      .toArray();
      return results[0];
  }
}
exports.getCourseById = getCourseById;


async function updateCourseById(id, course) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('courses');
    const result = await collection.updateOne(
      { _id: new ObjectId(id)},
      { $set: {
        "subject": course.subject,
        "number": course.number,
        "title": course.title,
        "term": course.term,
        "instructorId": course.instructorId
        }
      }
    );
    return id;
  }
}
exports.updateCourseById = updateCourseById;


async function updateEnrollmentByCourseId(courseId, addIds, removeIds) {
  console.log("==updateEnrollmentByCourseId:");
  console.log("add: ", addIds);
  console.log("remove: ", removeIds);

  if (!ObjectId.isValid(courseId)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('courses');
    var result = await collection.updateOne(
      { _id: new ObjectId(courseId)},
      { $pull: { studentsId: { $in: removeIds } }},
    );

    result = await collection.updateOne(
      { _id: new ObjectId(courseId)},
      { $push: { studentsId: { $each: addIds } }}
    );

    return courseId;
  }
}
exports.updateEnrollmentByCourseId = updateEnrollmentByCourseId;


//Also need to remove all assignments, enrolled students(auto), submissions
async function removeCourseById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    //delete assignments first
    const remove = await removeAssignmentsByCourseId(id);
    const db = getDBReference();
    const collection = db.collection('courses');
    const result = await collection.deleteOne(
      { _id: new ObjectId(id)},
    );
    return id;
  }
}
exports.removeCourseById = removeCourseById;



function getCourseIdByResults(results) {
  var ids = [];
  for(var i = 0; i < results.length; i++) {
      ids.push(results[i]._id);
  }
  return ids;
}



async function getCourseIdByUserId(role, userid) {
  if (!ObjectId.isValid(userid) && userid.length != 1) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('courses');

    if(role == "instructor") {
      const results = await collection
        .find(
          { "instructorId": userid },
          { _id: 1}
        )
        .toArray();
        const courseIds = getCourseIdByResults(results);
        return courseIds;
    } else {
      const results = await collection
        .find(
          { "studentsId": userid },
          { _id: 1}
        )
        .toArray();
        const courseIds = getCourseIdByResults(results);
        return courseIds;
    }
  }
}
exports.getCourseIdByUserId = getCourseIdByUserId;

async function generateCSV(id) {
  const db = getDBReference();
  const collection = db.collection("courses");

  const course = await collection
    .find({
      _id: id
    })
    .toArray();

    const students = course[0].studentsId;
    const studentsLen = students.length;
    var csv = "";
    for (var i = 0; i < studentsLen; i++) {
      const user = await getUserById(students[i]);
      csv += students[i].toString() + ", " + user.name.toString() + ", " + user.email.toString() + "\n";
    }

     return csv;
}
exports.generateCSV = generateCSV;
