const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const { UserSchema, insertNewUser, getUserById, validateUser } = require('../models/user');




router.post('/', requireAuthentication, async (req, res) => {
  if (validateAgainstSchema(req.body, UserSchema)) {
    const currentUser = await getUserById(req.user);
    if (currentUser.role == "0" || req.body.role ==  "2" ) {
      try {
        const id = await insertNewUser(req.body);
        res.status(201).send({
          id: id
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting user into DB.  Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid user object."
    });
  }
});

router.post('/login', async (req, res) => {
  if (req.body && req.body.password) {
    try {
      const authenticated = await validateUser(req.body.id, req.body.password);
      if (authenticated) {
        const token = generateAuthToken(req.body.id);
        console.log("success to login!");
        res.status(200).send({
          token: token
        });
      } else {
        res.status(401).send({
          error: "Invalid credentials"
        });
      }
    } catch (err) {
      console.log("ERROR:" , err);
      res.status(500).send({
        error: "Error validating user.  Try again later."
      });
    }
  } else {
    console.log("==REQ BODY: " + req.body + " REQ.BODY.ID: " + req.body.id);
    res.status(400).send({
      error: "Request body was invalid"
    });
  }
});


/*
 * Route to list all of a user's user data.
 */
router.get('/:id/', requireAuthentication, async (req, res, next) => {
  const currentUser = await getUserById(req.user);
  if (req.params.id == req.user || currentUser.role == 0) {
    try {
      console.log("==GET users/", req.params.id);
      const user = await getUserById(req.params.id);
      if (user) {
        res.status(200).send({ user: user });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch users.  Please try again later."
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});


module.exports = router;
