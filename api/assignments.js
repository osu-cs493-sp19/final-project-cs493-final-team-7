/*
 * API sub-router for assignments collection endpoints.
 */
const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const { getUserById } = require('../models/user');
const { getCourseById } = require('../models/course');
const {
  SubmissionSchema,
  createSubmission,
  getSubmissionsByAssignmentId,
  removeSubmissionsByAssignmentId
} = require('../models/submission');
const {
  AssignmentSchema,
  createAssignment,
  getAssignmentById,
  updateAssignmentById,
  removeAssignmentsById,
  getAssignmentsByCourseId
} = require('../models/assignment');

const fileTypes = {
  'file/jpeg': 'pdf'
};

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      const basename = crypto.pseudoRandomBytes(16).toString('hex');
      const extension = path.extname(file.originalname);
      callback(null, `${basename}.${extension}`);
    }
  })
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
    if(currentUser.role == 0 || currentUser._id == course.instructorId){
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
  console.log(req.params.id);
  const id = req.params.id;
  try {
    const assignment = await getAssignmentById(id);
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
    if(currentUser.role == "0" || currentUser._id == course.instructorId){
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
  const id = req.params.id;
  const assignment = await getAssignmentById(id);
  const currentUser = await getUserById(req.user);
  if(assignment) {
    const course = await getCourseById(assignment.courseId);
    if(currentUser.role == "0" || currentUser._id == course.instructorId){
      try {
        const deleteSuccessful = await removeAssignmentsById(req.params.id);
        if (deleteSuccessful) {
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
router.get('/:id/submissions', async (req, res, next) => {

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
  if (validateAgainstSchema(req.body, SubmissionSchema) && req.file) {
    if( course.studentsId.includes(currentUser._id)){
      try {
        const file = {
          path: req.file.path,
          filename: req.file.filename,
          contentType: req.file.mimetype,
          assignmentId: req.params.id,
          studentId: currentUser._id,
          timeStamp: req.body.timeStamp
        };
        const id = await createSubmission(file);

        res.status(201).send({
          links: {
            submission: `/assignments/${id}/submissions`
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
