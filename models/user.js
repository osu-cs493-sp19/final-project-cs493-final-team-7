const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const { extractValidFields } = require('../lib/validation');
const { getDBReference } = require('../lib/mongo');

/*
 * Schema for a User.
 */
const UserSchema = {
  name: { required: true },
  password: { required: true },
  role: {required: true}
};
exports.UserSchema = UserSchema;


/*
 * Insert a new User into the DB.
 */
async function insertNewUser(user) {
  const userToInsert = extractValidFields(user, UserSchema);
  const db = getDBReference();
  const collection = db.collection('users');

  const passwordHash = await bcrypt.hash(userToInsert.password, 8);
  userToInsert.password = passwordHash;

  const result = await collection.insertOne(userToInsert);
  return result.insertedId;
};
exports.insertNewUser = insertNewUser;


/*
 * Fetch a user from the DB based on user ID.
 */
async function getUserById(id, includePassword) {
  const db = getDBReference();
  const collection = db.collection('users');
  console.log("id length: ", id.length);
  if(id.length < 3 ) {
    console.log("==default users");
    const projection = includePassword ? {} : { password: 0 };
    const results = await collection
      .find({ _id: id })
      .project(projection)
      .toArray();
    return results[0];
  } else if (!ObjectId.isValid(id)) {
    console.log("INVALID ID: ", id);
    return null;
  } else {
    console.log("VALID ID: ", id);
    const projection = includePassword ? {} : { password: 0 };
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .project(projection)
      .toArray();
    return results[0];
  }
};
exports.getUserById = getUserById;

exports.validateUser = async function (id, password) {
  const user = await getUserById(id, true);

  const authenticated = user && await bcrypt.compare(password, user.password);
  if(authenticated)
    console.log("Authenticated!!");
  else {
    console.log("INPUT: " + password);
    console.log("DB PASSWORD" + user.password);
  }
  return authenticated;
};

async function getStudentsByCourseId(id) {
  console.log("==IN getStudentsByCourseId ID: ", id);
  const db = getDBReference();
  const collection = db.collection('users');
  if(id.length < 3 ) {
    const results = await collection
      .find({ courseid: id })
      .toArray();
    return results;
  } else if (!ObjectId.isValid(id)) {
    return [];
  } else {
    const results = await collection
      .find({ courseid: new ObjectId(id) })
      .toArray();
    return results;
  }
}
exports.getStudentsByCourseId = getStudentsByCourseId;
