/*
 * API sub-router for assignments collection endpoints.
 */

const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const { getUserById } = require('../models/user');
const { getCourseById } = require('../models/course');
const {
  AssignmentSchema,
  createAssignment,
  getAssignmentById,
  updateAssignmentById,
  removeAssignmentsById,
  getAssignmentsByCourseId
} = require('../models/assignment');


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
router.get('/:id', async (req, res) => {
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
router.put('/:id', requireAuthentication, async (req, res) => {
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
 */
router.get('/:id/submissions', async (req, res) => {

});


/*
 * Route to create all submissions of a specific assignment.
 */
router.post('/:id/submissions', async (req, res) => {

});

module.exports = router;
