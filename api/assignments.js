/*
 * API sub-router for assignments collection endpoints.
 */

const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');



/*
 * Route to create a new assignment.
 */
router.post('/', async (req, res) => {
  if (validateAgainstSchema(req.body, CourseSchema)) {
    try {
      const id = await insertNewCourse(req.body);
      res.status(201).send({
        id: id,
        links: {
          course: `/courses/${id}`
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting course into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid course object."
    });
  }
});


/*
 * Route to get a specific assignment.
 */
router.get('/{id}', async (req, res) => {

});


/*
 * Route to modify a specific assignment.
 */
router.put('/{id}', async (req, res) => {

});


/*
 * Route to get all submissions of a specific assignment.
 */
router.get('/{id}/submissions', async (req, res) => {

});


/*
 * Route to create all submissions of a specific assignment.
 */
router.post('/{id}/submissions', async (req, res) => {

});

module.exports = router;
