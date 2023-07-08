const _ = require('lodash')

const totalLikes = (blogs) => {
  return _.reduce(blogs, (total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0)
    return undefined

  const favorite = _(blogs)
    .orderBy('likes', 'desc')
    .head()

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0)
    return undefined

  return _(blogs)
    .countBy('author')
    .transform((mostBlogs, blogs, author) => {
      if (blogs > mostBlogs.blogs) {
        mostBlogs.author = author
        mostBlogs.blogs = blogs
      }
    }, { author: '', blogs: 0 })
    .value()
}

const mostLikes = (blogs) => {
  if (blogs.length === 0)
    return undefined

  return _(blogs)
    .groupBy('author')
    .transform((mostLikes, blogs, author) => {
      const likes = _.reduce(blogs, (likes, blog) => likes + blog.likes, 0)
      if (likes > mostLikes.likes) {
        mostLikes.author = author
        mostLikes.likes = likes
      }
    }, { author: '', likes: 0 })
    .value()
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}