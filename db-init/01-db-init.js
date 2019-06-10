db.users.insertMany([
  {
    "_id": "0",
    "name": "Admin",
    "password": "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    "role": "0"
  },
  {
    "_id": "1",
    "name": "Instructor RH",
    "password": "$2a$08$FBStm3plzBCnh/MPIUsJ0.f7kJkp6aH47haXHb3HY.Gfygan7e8He",
    "courseid": ["0", "1", "2"],
    "role": "1"
  },
  {
    "_id": "2",
    "name": "Instructor JF",
    "password": "$2a$08$Y2IHnr/PU9tzG5HKrHGJH.zH3HAvlR5i5puD5GZ1sHA/mVrHKci72",
    "courseid": ["3", "4", "5"],
    "role": "1"
  },
  {
    "_id": "3",
    "name": "Student 1",
    "password": "$2a$08$bAKRXPs6fUPhqjZy55TIeO1e.aXud4LD81awrYncaCKJoMsg/s0c.",
    "courseid": ["0", "1"],
    "role": "2"
  },
  {
    "_id": "4",
    "name": "Student 2",
    "password": "$2a$08$U7IXbbolDIk0SRlmH/dnT.FBCvf.EMvorShGlM65XeQFr./P0rhqe",
    "courseid": ["5"],
    "role": "2"
  },
  {
    "_id": "5",
    "name": "Student 3",
    "password": "$2a$08$q8njvTTel9JDR.BQbb1cD.XL73CR.QCOXLnofdpd9orbv0dzWGir.",
    "courseid": ["1", "2", "3", "4", "5"],
    "role": "2"
  }
])

db.courses.insertMany([
  {
    "_id": "0",
    "subject": "CS",
    "number": "493",
    "title": "Cloud Application Development",
    "term": "sp19",
    "instructorId": "1"
  },
  {
    "_id": "1",
    "subject": "CS",
    "number": "480",
    "title": "Translators",
    "term": "sp19",
    "instructorId": "1"
  },
  {
    "_id": "2",
    "subject": "CS",
    "number": "290",
    "title": "Web Development",
    "term": "sp19",
    "instructorId": "1"
  },
  {
    "_id": "3",
    "subject": "MUS",
    "number": "103",
    "title": "Intron to Flute",
    "term": "sp19",
    "instructorId": "2"
  },
  {
    "_id": "4",
    "subject": "MUS",
    "number": "303",
    "title": "Advanced Piano",
    "term": "sp19",
    "instructorId": "2"
  },
  {
    "_id": "5",
    "subject": "MUS",
    "number": "403",
    "title": "Advanced Piano II",
    "term": "sp19",
    "instructorId": "2"
  }
]);

db.businesses.insertMany([
  {
    "name": "Block 15",
    "address": {
      "street": "300 SW Jefferson Ave.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-758-2077",
    "category": "Restaurant",
    "subcategory": "Brewpub",
    "website": "http://block15.com"
  },
  {
    "name": "Robnett's Hardware",
    "address": {
      "street": "400 SW 2nd St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-753-5531",
    "category": "Shopping",
    "subcategory": "Hardware"
  },
  {
    "name": "Corvallis Brewing Supply",
    "address": {
      "street": "119 SW 4th St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-758-1674",
    "category": "Shopping",
    "subcategory": "Brewing Supply",
    "website": "http://www.lickspigot.com"
  },
  {
    "name": "First Alternative Co-op North Store",
    "address": {
      "street": "2855 NW Grant Ave.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97330"
    },
    "phone": "541-452-3115",
    "category": "Shopping",
    "subcategory": "Groceries"
  },
  {
    "name": "Local Boyz",
    "address": {
      "street": "1425 NW Monroe Ave.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97330"
    },
    "phone": "541-754-5338",
    "category": "Restaurant",
    "subcategory": "Hawaiian"
  },
  {
    "name": "Interzone",
    "address": {
      "street": "1563 NW Monroe Ave.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97330"
    },
    "phone": "541-754-5965",
    "category": "Restaurant",
    "subcategory": "Coffee Shop"
  },
  {
    "name": "Darkside Cinema",
    "address": {
      "street": "215 SW 4th St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-752-4161",
    "category": "Entertainment",
    "subcategory": "Movie Theater",
    "website": "http://darksidecinema.com"
  },
  {
    "name": "The Beanery Downtown",
    "address": {
      "street": "500 SW 2nd St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-753-7442",
    "category": "Restaurant",
    "subcategory": "Coffee Shop"
  },
  {
    "name": "WinCo Foods",
    "address": {
      "street": "2335 NW Kings Blvd.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97330"
    },
    "phone": "541-753-7002",
    "category": "Shopping",
    "subcategory": "Groceries"
  },
  {
    "name": "The Book Bin",
    "address": {
      "street": "215 SW 4th St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-752-0040",
    "category": "Shopping",
    "subcategory": "Book Store"
  },
  {
    "name": "Fred Meyer",
    "address": {
      "street": "777 NW Kings Blvd.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97330"
    },
    "phone": "541-753-9116",
    "category": "Shopping",
    "subcategory": "Groceries"
  },
  {
    "name": "Cyclotopia",
    "address": {
      "street": "435 SW 2nd St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-757-9694",
    "category": "Shopping",
    "subcategory": "Bicycle Shop"
  },
  {
    "name": "Oregon Coffee & Tea",
    "address": {
      "street": "215 NW Monroe Ave.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-752-2421",
    "category": "Shopping",
    "subcategory": "Tea House",
    "website": "http://www.oregoncoffeeandtea.com"
  },
  {
    "name": "Corvallis Cyclery",
    "address": {
      "street": "344 SW 2nd St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-752-5952",
    "category": "Shopping",
    "subcategory": "Bicycle Shop"
  },
  {
    "name": "Spaeth Lumber",
    "address": {
      "street": "1585 NW 9th St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97330"
    },
    "phone": "541-752-1930",
    "category": "Shopping",
    "subcategory": "Hardware"
  },
  {
    "name": "New Morning Bakery",
    "address": {
      "street": "219 SW 2nd St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-754-0181",
    "category": "Restaurant",
    "subcategory": "Bakery"
  },
  {
    "name": "First Alternative Co-op South Store",
    "address": {
      "street": "1007 SE 3rd St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-753-3115",
    "category": "Shopping",
    "subcategory": "Groceries"
  },
  {
    "name": "Block 15 Brewery & Tap Room",
    "address": {
      "street": "3415 SW Deschutes St.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97333"
    },
    "phone": "541-752-2337",
    "category": "Restaurant",
    "subcategory": "Brewpub",
    "website": "http://block15.com"
  },
  {
    "name": "The Beanery Monroe",
    "address": {
      "street": "2541 NW Monroe Ave.",
      "city": "Corvallis",
      "state": "OR",
      "zip": "97330"
    },
    "phone": "541-757-0828",
    "category": "Restaurant",
    "subcategory": "Coffee Shop"
  }
])
