const User = require('../models/user')

const initialUsers = [
  {
    name: 'user1',
    username: 'username1',
    passwordHash: 'sekret1'
  },
  {
    name: 'user2',
    username: 'username2',
    passwordHash: 'sekret2'
  },
]

const usersInDb = async () => {
  const users = await User.find({}).populate('blogs')
  return users.map(user => user.toJSON())
}

const randomUser = () => {
  const randomInd = Math.floor(Math.random(initialUsers.length - 1))
  return initialUsers[randomInd]
}

module.exports = {
  users: initialUsers,
  initialUsers,
  usersInDb,
  randomUser
}