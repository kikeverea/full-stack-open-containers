const router = require('express').Router()
const User = require('../mongo/models/user')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const exists = await User.findOne({ username })

  if (exists)
    return response
      .status(400)
      .json({ error: `user ${ exists } already exist`})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name: username,
    passwordHash
  })

  await user.save()

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