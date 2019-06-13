db.users.insertMany([
  {
    "_id": "0",
    "name": "Admin",
    "password": "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    "email": "chiens@oregonstate.edu",
    "role": "admin"
  },
  {
    "_id": "1",
    "name": "Instructor RH",
    "password": "$2a$08$FBStm3plzBCnh/MPIUsJ0.f7kJkp6aH47haXHb3HY.Gfygan7e8He",
    "email": "fred@fredmeyer.com",
    "role": "instructor"
  },
  {
    "_id": "2",
    "name": "Instructor JF",
    "password": "$2a$08$Y2IHnr/PU9tzG5HKrHGJH.zH3HAvlR5i5puD5GZ1sHA/mVrHKci72",
    "email": "allan@allanscoffee.com",
    "role": "instructor"
  },
  {
    "_id": "3",
    "name": "Student 1",
    "password": "$2a$08$bAKRXPs6fUPhqjZy55TIeO1e.aXud4LD81awrYncaCKJoMsg/s0c.",
    "email": "paul@darksidecinema.com",
    "role": "student"
  },
  {
    "_id": "4",
    "name": "Student 2",
    "password": "$2a$08$U7IXbbolDIk0SRlmH/dnT.FBCvf.EMvorShGlM65XeQFr./P0rhqe",
    "email": "william@interzoneorganic1",
    "role": "student"
  },
  {
    "_id": "5",
    "name": "Student 3",
    "password": "$2a$08$q8njvTTel9JDR.BQbb1cD.XL73CR.QCOXLnofdpd9orbv0dzWGir.",
    "email": "kim@localboyzhawaiiancafe.com",
    "role": "student"
  }
]);

db.courses.insertMany([
{
    "_id": "5d01de295eec7adabe43630d",
    "subject": "CS",
    "number": "290",
    "title": "Web Development",
    "term": "sp19",
    "instructorId": "1",
    "studentsId": [
        "3",
        "4",
        "5"
    ]
},
{
    "_id": "5d01de295eec7adabe43630e",
    "subject": "MUS",
    "number": "103",
    "title": "Intron to Flute",
    "term": "sp19",
    "instructorId": "2",
    "studentsId": [
        "3",
        "4",
        "5"
    ]
},
{
    "_id": "5d01de295eec7adabe43630f",
    "subject": "MUS",
    "number": "303",
    "title": "Advanced Piano",
    "term": "sp19",
    "instructorId": "2",
    "studentsId": [
        "3"
    ]
},
{
    "_id": "5d01de295eec7adabe436310",
    "subject": "MUS",
    "number": "403",
    "title": "Advanced Piano II",
    "term": "sp19",
    "instructorId": "2",
    "studentsId": [
        "3",
        "5"
    ]
}
]);

db.assignments.insertMany([
{
    "_id": "5d01de295eec7adabe436312",
    "courseId": "5d01de295eec7adabe43630d",
    "title": "assignment2",
    "points": "100",
    "due": "2019-06-30T17:00:00-07:00"
},
{
    "_id": "5d01de295eec7adabe436313",
    "courseId": "5d01de295eec7adabe43630d",
    "title": "assignment1",
    "points": "100",
    "due": "2019-06-19T17:00:00-07:00"
},
{
    "_id": "5d01de295eec7adabe436314",
    "courseId": "5d01de295eec7adabe43630e",
    "title": "assignment1",
    "points": "100",
    "due": "2019-06-19T17:00:00-07:00"
},
{
    "_id": "5d01de295eec7adabe436315",
    "courseId": "5d01de295eec7adabe43630f",
    "title": "assignment1",
    "points": "80",
    "due": "2019-06-14T17:00:00-07:00"
},
{
    "_id": "5d01de295eec7adabe436316",
    "courseId": "5d01de295eec7adabe43630f",
    "title": "assignment2",
    "points": "50",
    "due": "2019-07-14T17:00:00-07:00"
}
]);
