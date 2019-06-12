const router = require('express').Router();

//router.use('/businesses', require('./businesses'));
//router.use('/photos', require('./photos'));
router.use('/users', require('./users'));
router.use('/courses', require('./courses'));
router.use('/assignments', require('./assignments'));

module.exports = router;
