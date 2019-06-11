const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { removeSubmissionsByAssignmentId } = require('../models/submission');

const AssignmentSchema = {
  courseId: { required: true },
  title: { required: true },
  points: { required: true },
  due: { required: true },
};
exports.AssignmentSchema = AssignmentSchema;



async function createAssignment(assignment) {
  assignment = extractValidFields(assignment, AssignmentSchema);
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}
exports.createAssignment = createAssignment;



async function getAssignmentById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();

    return results[0];
  }
}
exports.getAssignmentById = getAssignmentById;



async function updateAssignmentById(id, assignment) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const result = await collection.updateOne(
      { _id: new ObjectId(id)},
      { $set: {
        "courseId": assignment.courseId,
        "title": assignment.title,
        "points": assignment.points,
        "due": assignment.due,
        }
      }
    );
    return id;
  }
}
exports.updateAssignmentById = updateAssignmentById;


//Also need to remove all submissions under this assignment
async function removeAssignmentsById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    //Delete submission first
    const db = getDBReference();
    const collection = db.collection('assignments');
    const result = await collection.deleteOne(
      { _id: new ObjectId(id)},
    );
    return id;
  }
}
exports.removeAssignmentsById = removeAssignmentsById;



//Also need to remove all submissions under these assignments
async function removeAssignmentsByCourseId(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    //Delete submission first
    const db = getDBReference();
    const collection = db.collection('assignments');
    const result = await collection.deleteMany(
      { courseId: id },
    );
    console.log("==removeAssignmentsByCourseId: ", result.deletedCount);
    return id;
  }
}
exports.removeAssignmentsByCourseId = removeAssignmentsByCourseId;



function getAssignmentIds(assignments) {
  var assignmentIds = [];
  for(var i = 0; i < assignments.length; i++) {
    assignmentIds.push(assignments[i]._id);
  }
  return assignmentIds;
}


async function getAssignmentsByCourseId(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const results = await collection
      .find({ courseId: id })
      .toArray();

    console.log("==getAssignmentsByCourseId: ", results);
    var assignmentIds = getAssignmentIds(results);
    return assignmentIds;
  }
}
exports.getAssignmentsByCourseId = getAssignmentsByCourseId;
