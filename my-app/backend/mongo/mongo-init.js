db.createUser({
  user: 'dev',
  pwd: 'pass',
  roles: [
    {
      role: 'dbOwner',
      db: 'dev_database',
    },
  ],
});

db.createCollection('blogs');
db.createCollection('users');
db.createCollection('comments');


