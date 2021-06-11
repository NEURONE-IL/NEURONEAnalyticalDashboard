/*
@fvillarrealcespedes:
NEURONE-AD Database.
*/ 
let db1 = db.getSiblingDB('neurone-ad');
db1.createUser(
  {
    user: 'admin',
    pwd: 'admin',
    roles: [{ role: 'readWrite', db: 'neurone-ad' }],
  },
);

/*
@fvillarrealcespedes:
NEURONE-AD Test Database.
*/ 
let db2 = db.getSiblingDB('neurone-ad-test');
db2.createUser(
  {
    user: 'admin',
    pwd: 'admin',
    roles: [{ role: 'readWrite', db: 'neurone-ad-test' }],
  },
);

/*
@fvillarrealcespedes:
NEURONE-Auth Database.
*/ 
let db3 = db.getSiblingDB('neurone-auth');
db3.createUser(
  {
    user: 'admin',
    pwd: 'admin',
    roles: [{ role: 'readWrite', db: 'neurone-auth' }],
  },
);

/*
@fvillarrealcespedes:
NEURONE-AM-Simulator Database.
*/ 
let db4 = db.getSiblingDB('test');
db4.createUser(
  {
    user: 'test',
    pwd: 'test',
    roles: [{ role: 'readWrite', db: 'test' }],
  },
);