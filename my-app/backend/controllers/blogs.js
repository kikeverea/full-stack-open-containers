const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { id: 1, name: 1, username: 1 })
    .populate('comments')

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes = 0, comments = [] } = request.body

  if (!title && !url) {
    return response.status(400).json({
      error: 'Title or url must be provided'
    })
  }

  const requestUser = request.user

  const user = await User.findOne({ username: requestUser.username })

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    comments: comments,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', middleware.userExtractor, middleware.commentsExtractor, async (request, response) => {
  const { title, author, url, likes = 0, user = request.user.id } = request.body

  const id = request.params.id
  const comments = request.comments
  const blog = await Blog.findById(id)

  if (userIsNotCreatorOfBlog(user, blog))
    return unauthorizedUserResponse(response)

  const updated = await updateBlog(request.params.id, { title, author, url, likes, comments, user })
  response.status(204).json(updated)
})

blogsRouter.put('/:id/likes', async (request, response) => {
  const { likes } = request.body

  const updated = await updateBlog(request.params.id, { likes })
  response.status(204).json(updated)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body

  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  const toSave = new Comment({
    comment,
    blog: blog._id
  })

  const savedComment = await toSave.save()

  await updateBlog(request.params.id, { comments: [...blog.comments, savedComment._id] })
  response.status(201).json(savedComment)
})

const updateBlog = async (blogId, updateFields) =>
  await Blog.findByIdAndUpdate(
    blogId,
    updateFields,
    {new: true, runValidators: true, context: 'query'})

blogsRouter.delete('/:blogId/comments/:commentId', middleware.userExtractor, async (request, response) => {
  const commentId = request.params.commentId
  const blogId = request.params.blogId

  const comment = await Comment.findById(commentId)
  const blog = await Blog.findById(blogId)
  const user = request.user

  if (userIsNotCreatorOfBlog(user.id, blog))
    return unauthorizedUserResponse(response)

  await comment.remove()
  await updateBlog(blogId, { comments: blog.comments.filter(comment => comment.id !== commentId) })

  response.status(204).end()
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const id = request.params.id

  const blog = await Blog.findById(id)
  const user = request.user

  if (userIsNotCreatorOfBlog(user.id, blog))
    return unauthorizedUserResponse(response)

  await blog.remove()

  response.status(204).end()
})

const userIsNotCreatorOfBlog = (userId, blog) =>
  blog.user.toString() !== userId

const unauthorizedUserResponse = (response) => {
  response
    .status(401)
    .json({ error: 'user not authorized to do this operation' })
}

module.exports = blogsRouter

