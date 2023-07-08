const router = require('express').Router()
const User = require('../mongo/models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const wrongPassword = user === null || !user
    ? true
    : !await bcrypt.compare(password, user.passwordHash)

  if (wrongPassword) {
    return response
      .status(401)
      .json({ error: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({
      token,
      id: user._id.toString(),
      username: user.username,
      name: user.name
    })

})

module.exports = router