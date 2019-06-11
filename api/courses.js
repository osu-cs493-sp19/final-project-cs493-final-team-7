/*
 * API sub-router for courses collection endpoints.
 */

const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const { getUserById } = require('../models/user');
const { getAssignmentsByCourseId } = require('../models/assignment');
const {
  CourseSchema,
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  updateEnrollmentByCourseId,
  removeCourseById
} = require('../models/course');

/*
 * Route to return a paginated list of courses.
 */
router.get('/', async (req, res) => {
  try {
    const coursePage = await getAllCourses(parseInt(req.query.page) || 1);
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
router.post('/', requireAuthentication, async (req, res) => {
  const currentUser = await getUserById(req.user);
  if(currentUser.role == "0"){
    if (validateAgainstSchema(req.body, CourseSchema)) {
      try {
        const id = await createCourse(req.body);
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
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

/*
 * Route to fetch info about a specific courses.
 Returns summary data about the Course, excluding the list of students enrolled in the course
 and the list of Assignments for the course.

 */
router.get('/:id', async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id);
    if (course) {
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
router.put('/:id', requireAuthentication, async (req, res, next) => {
  const currentUser = await getUserById(req.user);
  const id = req.params.id;
  const existingCourse = await getCourseById(id);
  if(existingCourse) {
    if(currentUser.role == "0" || currentUser._id == existingCourse.instructorId){
      if (validateAgainstSchema(req.body, CourseSchema)) {
        try {
          const updatedId = await updateCourseById(id, req.body);
          res.status(201).send({
            id: updatedId,
            links: {
              course: `/courses/${updatedId}`
            }
          });
        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Error updating course into DB.  Please try again later."
          });
        }
      } else {
        res.status(400).send({
          error: "Request body is not a valid course object."
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
 * Route to delete info about a specific courses.
 */
router.delete('/:id', requireAuthentication, async (req, res, next) => {
  const id = req.params.id;
  const existingCourse = await getCourseById(id);
  const currentUser = await getUserById(req.user);
  if(existingCourse) {
    if(currentUser.role == "0") {
      try {
        const deleteSuccessful = await removeCourseById(req.params.id);
        if (deleteSuccessful) {
          res.status(204).end();
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to delete course.  Please try again later."
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
 * Route to get students list of a specific courses.

  Returns a list containing the User IDs of all students currently enrolled in the Course.
  Only an authenticated User with 'admin' role or
  an authenticated 'instructor' User whose ID matches the `instructorId` of the Course
  can fetch the list of enrolled students.
 */
 router.get('/:id/students', requireAuthentication, async (req, res, next) => {
   const id = req.params.id;
   const currentUser = await getUserById(req.user);
   const course = await getCourseById(id);
   if(course) {
     if(currentUser.role == "0" || currentUser._id == course.instructorId){
        res.status(200).send(
          {"enrolled students ID": course.studentsId}
        );
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
 * Route to enroll a course for students.
 Body:
 Arrays of User IDs for students to be enrolled/unenrolled in the Course.
 Exact type/format of IDs will depend on your implementation but
 each will likely be either an integer or a string.
 */
 router.post('/:id/students', requireAuthentication, async (req, res, next) => {
   const id = req.params.id;
   const currentUser = await getUserById(req.user);
   const course = await getCourseById(id);
   if(course) {
     if(currentUser.role == "0" || currentUser._id == course.instructorId){
       if(req.body.add || req.body.remove){
         const enrollIds = req.body.add;
         const unenrollIds = req.body.remove;
         const results = await updateEnrollmentByCourseId(id, enrollIds, unenrollIds);
         res.status(200).send(
           {"Course Enrollments": results}
         );
       } else {
         res.status(400).send({
           error: "Request body is not a valid course object."
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
  * Route download students list as csv file of a course.
    Returns a CSV file containing information about all of the students
    currently enrolled in the Course, including names, IDs, and email addresses.
    Only an authenticated User with 'admin' role or an authenticated
    'instructor' User whose ID matches the `instructorId` of the Course
    can fetch the course roster.
  */
router.get('/:id/roster', requireAuthentication, async (req, res, next) => {
  const id = req.params.id;
  const currentUser = await getUserById(req.user);
  const course = await getCourseById(id);
  if(course) {
    //Create getRosterByCourseId function to get student list in csv file in model
   if(currentUser.role == "0" || currentUser._id == course.instructorId){
      res.status(200).send(
        {"students list": "students list csv file can be downloaded"}
      );
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
 * Route to get assignments list of a course.
 */
 router.get('/:id/assignments', async (req, res, next) => {
   const id = req.params.id;
   const course = await getCourseById(id);
   if(course) {
     const assignments = await getAssignmentsByCourseId(id);
      res.status(200).send(
        {
          courseId: course._id,
          subject: course.subject,
          number: course.number,
          title: course.title,
          assignments: assignments
        }
      );
   } else {
     next();
   }
 });


module.exports = router;
