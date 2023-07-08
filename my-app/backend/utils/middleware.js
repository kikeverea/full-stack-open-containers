const logger = require('./logger')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  const errorMessage = response.error

  if (errorMessage) {
    logger.error(error.response.error)
  }

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer '))
    request.token = authorization.substring(7)

  next()
}

const userExtractor = (request, response, next) => {
  const token = request.token

  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.username) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  request.user = {
    id: decodedToken.id,
    username: decodedToken.username,
    name: decodedToken.name
  }

  next()
}

const commentsExtractor = (request, response, next) => {
  const { comments } = request.body

  request.comments =
    comments
      ? comments.map(comment => typeof comment === 'string' ? comment : comment.id)
      : []

  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
  commentsExtractor
}