const router = require('express').Router()
const User = require('../mongo/models/user')
const Blog = require('../mongo/models/blog')

router.post('/reset', async (req, res) => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  res.status(204).end()
})

module.exports = router
