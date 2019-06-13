/*
 * API sub-router for assignments collection endpoints.
 */
const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const { getUserById } = require('../models/user');
const { getCourseById } = require('../models/course');
const {
  SubmissionSchema,
  createSubmission,
  getSubmissionsByAssignmentId,
  removeSubmissionsByAssignmentId,
  getDownloadStreamByFilename
} = require('../models/submission');
const {
  AssignmentSchema,
  createAssignment,
  getAssignmentById,
  updateAssignmentById,
  removeAssignmentsById,
  getAssignmentsByCourseId,
  getAllAssignment
} = require('../models/assignment');

const fileTypes = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'text/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
};

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      const basename = crypto.pseudoRandomBytes(16).toString('hex');
      const extension = fileTypes[file.mimetype];
      console.log("== extension: " + extension);
      callback(null, `${basename}.${extension}`);
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!fileTypes[file.mimetype])
  }
});


/*
 * Route to create a new assignment.
 Create and store a new Assignment with specified data and adds it to the
 application's database.  Only an authenticated User with 'admin' role or an
 authenticated 'instructor' User whose ID matches the `instructorId` of the
 Course corresponding to the Assignment's `courseId` can create an Assignment.
 */
router.post('/', requireAuthentication, async (req, res) => {
  const currentUser = await getUserById(req.user);
  const course = await getCourseById(req.body.courseId);
  if (validateAgainstSchema(req.body, AssignmentSchema)) {
    if(currentUser.role == "admin" || currentUser._id == course.instructorId){
      try {
        const id = await createAssignment(req.body);
        res.status(201).send({
          id: id,
          links: {
            assignment: `/assignments/${id}`
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting assignment into DB.  Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid assignment object or courseId not exists."
    });
  }
});


/*
 * Route to get a specific assignment.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const assignment = await getAssignmentById(req.params.id);
    if (assignment) {
      res.status(200).send(assignment);
    } else {
      console.log("== assignment id -> next");
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch assignment DB.  Please try again later."
    });
  }
});

//XXX: for testing
/*
 * Route to get a specific assignment.
 */
router.get('/', async (req, res, next) => {
  try {
    const assignment = await getAllAssignment();
    if (assignment) {
      res.status(200).send(assignment);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch assignment DB.  Please try again later."
    });
  }
});


/*
 * Route to modify a specific assignment.
 */
router.put('/:id', requireAuthentication, async (req, res, next) => {
  const id = req.params.id;
  const currentUser = await getUserById(req.user);
  const assignment = await getAssignmentById(id);
  if(assignment) {
    const course = await getCourseById(assignment.courseId);
    if(currentUser.role == "admin" || currentUser._id == course.instructorId){
      if (validateAgainstSchema(req.body, AssignmentSchema)) {
        try {
          const updatedId = await updateAssignmentById(id, req.body);
          res.status(201).send({
            id: updatedId,
            links: {
              assignment: `/assignments/${updatedId}`
            }
          });
        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Error updating assignment into DB.  Please try again later."
          });
        }
      } else {
        res.status(400).send({
          error: "Request body is not a valid assignment object."
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
  } else {
    next();
  }
});


/*
 * Route to delete info about a specific assignment.
 */
router.delete('/:id', requireAuthentication, async (req, res, next) => {
  const assignment = await getAssignmentById(req.params.id);
  const currentUser = await getUserById(req.user);
  if(assignment) {
    const course = await getCourseById(assignment.courseId);
    if(currentUser.role == "admin" || currentUser._id == course.instructorId){
      try {
        const deleteSuccessful = await removeAssignmentsById(req.params.id);
        const sub_deleted = await removeSubmissionsByAssignmentId(req.params.id);
        if (deleteSuccessful && sub_deleted) {
          res.status(204).end();
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to delete assignment by DB.  Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
  } else {
    next();
  }
});


/*
 * Route to get all submissions of a specific assignment.
 Returns the list of all Submissions for an Assignment.  This list should be
 paginated.  Only an authenticated User with 'admin' role or an authenticated
 'instructor' User whose ID matches the `instructorId` of the Course
 corresponding to the Assignment's `courseId` can fetch the Submissions for
 an Assignment.
 */
router.get('/:id/submissions',requireAuthentication, async (req, res, next) => {
  const assignment = await getAssignmentById(req.params.id);
  const currentUser = await getUserById(req.user);
  if(assignment) {
    const course = await getCourseById(assignment.courseId);
    if(currentUser.role == "admin" || currentUser._id == course.instructorId){
      try {
        const file = await getSubmissionsByAssignmentId(req.params.id, parseInt(req.query.page) || 1);
        if (file) {
          file.links = {};
          if (file.page < file.totalPages) {
            file.links.nextPage = `/assignments/${req.params.id}/submissions?page=${file.page + 1}`;
            file.links.lastPage = `/assignments/${req.params.id}/submissions?page=${file.totalPages}`;
          }
          if (file.page > 1) {
            file.links.prevPage = `/assignments/${req.params.id}/submissions?page=${file.page - 1}`;
            file.links.firstPage = `/assignments/${req.params.id}/submissions?page=1`;
          }
          res.status(200).send(file);
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to fetch submissions by DB.  Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
  } else {
    next();
  }
});


function removeUploadedFile(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

router.get('/download/:filename', async (req, res, next) => {
  getDownloadStreamByFilename(req.params.filename)
    .on('error', (err) => {
      if (err.code === 'ENOENT') {
        next();
      } else {
        next(err);
      }
    })
    .on('file', (file) => {
      res.status(200);
    })
    .pipe(res);
});

/*
 * Route to create all submissions of a specific assignment.
 Create and store a new Assignment with specified data and adds it to the
 application's database.  Only an authenticated User with 'student' role who
 is enrolled in the Course corresponding to the Assignment's `courseId` can
 create a Submission.
 */
router.post('/:id/submissions',
upload.single('file'), requireAuthentication, async (req, res, next) => {
  const currentUser = await getUserById(req.user);
  const assignment = await getAssignmentById(req.params.id);
  const course = await getCourseById(assignment.courseId);
  if (req.file) {
    if( course.studentsId.includes(currentUser._id) && currentUser.role == "student"){
      try {
        const file = {
          path: req.file.path,
          filename: req.file.filename,
          contentType: req.file.mimetype,
          assignmentId: req.params.id,
          studentId: currentUser._id,
          timeStamp: req.body.timeStamp
        };

        var date = new Date();
        date = date.toISOString();

        const metadata = {
            assignmentId: req.params.id,
            studentId: currentUser._id,
            timestamp: date
        };

        await createSubmission(file, metadata);
        await removeUploadedFile(req.file);

        res.status(201).send({
          links: {
            submission: `/assignments/${req.params.id}/submissions`
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting assignment into DB.  Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid submission object."
    });
  }
});

module.exports = router;
