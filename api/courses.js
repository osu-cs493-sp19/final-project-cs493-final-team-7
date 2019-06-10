/*
 * API sub-router for courses collection endpoints.
 */

const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const {
  CourseSchema,
  getCoursesPage,
  insertNewCourse,
  getCourseDetailsById
} = require('../models/course');

/*
 * Route to return a paginated list of courses.
 */
router.get('/', async (req, res) => {
  try {
    const coursePage = await getCoursesPage(parseInt(req.query.page) || 1);
    coursePage.links = {};
    if (coursePage.page < coursePage.totalPages) {
      coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
      coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
    }
    if (coursePage.page > 1) {
      coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
      coursePage.links.firstPage = '/courses?page=1';
    }
    res.status(200).send(coursePage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching courses list.  Please try again later."
    });
  }
});

/*
 * Route to create a new course.
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
 * Route to fetch info about a specific courses.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const course = await getCourseDetailsById(req.params.id);
    if (course) {
      console.log("Results: ", course.students);
      res.status(200).send(course);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch course.  Please try again later."
    });
  }
});


/*
 * Route to modify info about a specific courses.
 */
router.put('/:id', async (req, res, next) => {


});

/*
 * Route to delete info about a specific courses.
 */
router.delete('/:id', async (req, res, next) => {


});


/*
 * Route to get students list of a specific courses.
 */
 router.get('/:id/students', async (req, res, next) => {


 });


/*
 * Route to enroll a course for students.
 */
 router.post('/:id/students', async (req, res, next) => {


 });


 /*
  * Route download students list as csv file of a course.
  */
 router.get('/:id/roster', async (req, res, next) => {


  });

/*
 * Route to get assignments list of a course.
 */
 router.get('/:id/assignments', async (req, res, next) => {


 });


module.exports = router;
