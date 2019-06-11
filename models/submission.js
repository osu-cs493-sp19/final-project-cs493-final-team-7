const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getStudentsByCourseId } = require('./user');

const SubmissionSchema = {
  timeStamp: { required: true }
};
exports.SubmissionSchema = SubmissionSchema;




async function createSubmission(file) {
  const db = getDBReference();
  const collection = db.collection('files');
  const result = await collection.insertOne(file);
  return result.insertedId;
}
exports.createSubmission = createSubmission;




async function getSubmissionsByAssignmentId(id) {

}
exports.getSubmissionsByAssignmentId = getSubmissionsByAssignmentId;



async function removeSubmissionsByAssignmentId(id) {
  // assignment = extractValidFields(assignment, AssignmentSchema);
  // const db = getDBReference();
  // const collection = db.collection('assignments');
  // const result = await collection.insertOne(assignment);
  // return result.insertedId;
}
exports.removeSubmissionsByAssignmentId = removeSubmissionsByAssignmentId;
