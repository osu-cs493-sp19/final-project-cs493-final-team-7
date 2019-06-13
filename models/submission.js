const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { getStudentsByCourseId } = require('./user');

const SubmissionSchema = {
  timeStamp: { required: false }
};
exports.SubmissionSchema = SubmissionSchema;




exports.createSubmission = function (file, mdata) {
  return new Promise((resolve, reject) => {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'submission' });
  file._id = new ObjectId().toString();
  console.log("== file._id: " + file._id);
  console.log("== assignmentId: " + mdata.assignmentId);
  console.log("== studentId: " + mdata.studentId);
  console.log("== timestamp: " + mdata.timestamp);
  const uploadStream = bucket.openUploadStreamWithId(
    file._id,
    file.filename,
    { metadata: mdata }
  );

  fs.createReadStream(file.path)
    .pipe(uploadStream)
    .on('error', (err) => {
      reject(err);
    })
    .on('finish', (result) => {
      resolve();
    });

  });
};


async function getSubmissionsByAssignmentId(id, page) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'submission' });
  const bucket2 = new GridFSBucket(db, { bucketName: 'submission.chunks' });
  var count = await bucket.find({ "metadata.assignmentId": id }).toArray();
  count = count.length;
  //const data = await bucket2.find({files_id: "5d022f00d639720011b919c9"},{data:true, _id: false}).toArray()

  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const pageSize = 5;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  var results = await bucket.find({ "metadata.assignmentId": id}, {"metadata.assignmentId":true,"metadata.studentId": true, "metadata.timestamp": true })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    submissions: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getSubmissionsByAssignmentId = getSubmissionsByAssignmentId;


async function removeSubmissionsByAssignmentId(id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'submission' });
  const id = await bucket.find({"metadata.assignmentId": id});
  console.log("== id: " + id);
  const result = await bucket.delete(id);
  return id;

}
exports.removeSubmissionsByAssignmentId = removeSubmissionsByAssignmentId;

exports.getDownloadStreamByFilename = function (filename) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'submission' });
  return bucket.openDownloadStreamByName(filename);
};
