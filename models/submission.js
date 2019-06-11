const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getStudentsByCourseId } = require('./user');

const SubmissionSchema = {
  assignmentId: { required: true },
  studentId: { required: true },
  timeStamp: { required: true },
  file: { required: true },
};
exports.SubmissionSchema = SubmissionSchema;

//getSubmissionsByAssignmentId

//createSubmission

async function removeSubmissionsByAssignmentId(id) {
  // assignment = extractValidFields(assignment, AssignmentSchema);
  // const db = getDBReference();
  // const collection = db.collection('assignments');
  // const result = await collection.insertOne(assignment);
  // return result.insertedId;
}
exports.removeSubmissionsByAssignmentId = removeSubmissionsByAssignmentId;
