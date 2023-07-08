const initHelper = require('./init_helper')
const usersHelper = require('./users_helper')
const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
  await initHelper.initUsers()
})

test('login with correct credentials returns token', async () => {
  const users = usersHelper.initialUsers
  const randomInd = Math.floor(Math.random(users.length - 1))
  const user = users[randomInd]

  const credentials = {
    username: user.username,
    password: user.passwordHash
  }

  const response = await api
    .post('/api/login')
    .send(credentials)
    .expect(200)

  const token = response.body

  expect(token.token).toBeDefined()
  expect(token.id).toBeDefined()
  expect(token.name).toBe(user.name)
  expect(token.username).toBe(user.username)
})

test('login with incorrect credentials fails with status 401', async () => {
  const credentials = {
    username: 'does_not_exist',
    password: 'wrong_password'
  }

  const response = await api
    .post('/api/login')
    .send(credentials)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const error = response.body

  expect(error.error).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})