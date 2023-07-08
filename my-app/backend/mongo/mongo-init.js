print('Start #################################################################');

db = db.getSiblingDB('prod_db');
db.createUser(
  {
    user: 'admin',
    pwd: 'pass',
    roles: [
      {
        role: 'dbOwner',
        db: 'prod_db'
      }
    ],
  },
);
db.createCollection('blogs');
db.createCollection('users');
db.createCollection('comments');

db = db.getSiblingDB('dev_db');
db.createUser(
  {
    user: 'dev',
    pwd: 'pass',
    roles: [
      {
        role: 'dbOwner',
        db: 'dev_db'
      }
    ],
  },
);
db.createCollection('blogs');
db.createCollection('users');
db.createCollection('comments');

print('END #################################################################')