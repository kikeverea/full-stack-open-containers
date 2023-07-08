const supertest = require('supertest')
const app = require('../app')
const helper = require('./users_helper')
const initHelper = require('./init_helper')
const { default: mongoose } = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
  await initHelper.initUsers()
},
20000)

describe('query users', () => {
  test('query all users', async () => {
    const dbUsers = await helper.usersInDb()

    const response = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const allUsers = response.body

    expect(allUsers).toHaveLength(dbUsers.length)
    expect(allUsers).toEqual(expect.arrayContaining(dbUsers))
  })
})

describe('create new users', () => {
  test('posting valid user, adds new user', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'newuser',
      name: 'user',
      password: 'sekret'
    }

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const filtered = usersAtEnd.filter(user =>
      user.name === response.body.name &&
      user.username === response.body.username)
    expect(filtered).toHaveLength(1)

    const user = filtered[0]
    expect(user).toBeDefined()
    expect(user.blogs).toBeDefined()
    expect(user.blogs).toHaveLength(0)
  })

  test('creating a user with an existing username, fails with status 400', async () => {
    const usersAtStart = await helper.usersInDb()
    const randomInd = Math.floor(Math.random() * usersAtStart.length)
    const userInDb = usersAtStart[randomInd]

    const newUser = {
      username: userInDb.username,
      name: 'random',
      password: 'rand'
    }

    await assertBadRequest(usersAtStart, newUser)
  })

  test('posting user without username, fails with status 400', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'user',
      password: 'sekret'
    }

    await assertBadRequest(usersAtStart, newUser)
  })

  test('posting user without password, fails with status 400', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'user',
      username: 'username',
    }

    await assertBadRequest(usersAtStart, newUser)
  })

  const assertBadRequest = async (usersAtStart, newUser) => {
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const error = response.body
    expect(error.error).toBeDefined()

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  }

  describe('update existing users', () => {
    test('updates user name without modifying other properties', async () => {
      const user = helper.randomUser()
      const token = await loginUser(user)
      const toUpdate = { ...user, name: 'New name', username: 'user' }

      await updateUser(toUpdate, { token })

      const usersAfter = await helper.usersInDb()
      const updatedUser = usersAfter.find(after => after.id === user.id)

      expect(updatedUser.name).toBe('New name')
      expect(updatedUser.username).toBe(user.username)
      expect(updatedUser.name === user.name).toBe(false)
    })

    test('Updating without token fails with 401', async () => {
      const user = helper.randomUser()
      const toUpdate = { ...user, name: 'New name', username: 'user' }

      await updateUser(toUpdate, { expectedStatus: 401 })
    })

    test('Updating different user fails with 401', async () => {
      const users = helper.initialUsers
      const user1 = users[1]
      const user2 = users[2]

      const token = await loginUser(user1)
      const toUpdate = { ...user2, name: 'New name', username: 'user' }

      await updateUser(toUpdate, { expectedStatus: 401, token })
    })

    const loginUser = async user => {
      const credentials = {
        username: user.username,
        password: user.passwordHash
      }

      const response = await api
        .post('/api/login')
        .send(credentials)
        .expect(200)

      user.id = response.body.id

      return response.body.token
    }

    const updateUser = async (user, { expectedStatus = 204, token = '' } = {}) => {
      await api
        .put(`/api/users/${ user.id }`)
        .set('Authorization', `bearer ${ token }`)
        .send(user)
        .expect(expectedStatus)
    }
  })
})

afterAll(() => {
  mongoose.connection.close()
})
