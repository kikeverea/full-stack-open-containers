const listHelper = require('../utils/list_helper')
const helper = require('./blogs_helper')

describe('total likes', () => {
  test('when list is empty, equals 0', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [helper.blogs[0]]
    const loneBlogLikes = listWithOneBlog[0].likes
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(loneBlogLikes)
  })

  test('when list has many blogs, equals the likes of all blogs', () => {
    expect(listHelper.totalLikes(helper.blogs)).toBe(36)
  })
})

describe('favorite blog', () => {
  test('when list is empty, blog is undefined', () => {
    expect(listHelper.favoriteBlog([])).toBe(undefined)
  })

  test('when list has one blog, favorite is that blog', () => {
    const listWithOneBlog = [helper.blogs[0]]
    const loneBlog = listWithOneBlog[0]
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual({
      title: loneBlog.title,
      author: loneBlog.author,
      likes: loneBlog.likes
    })
  })

  test('when list has many blogs, determine favorite blog by likes', () => {
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }
    expect(listHelper.favoriteBlog(helper.blogs)).toEqual(expected)
  })
})

describe('most blogs', () => {
  test('when list is empty, author is undefined', () => {
    expect(listHelper.mostBlogs([])).toBe(undefined)
  })

  test('when list has one blog, author is author of that blog', () => {
    const listWithOneBlog = [helper.blogs[0]]
    const loneBlog = listWithOneBlog[0]
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
      author: loneBlog.author,
      blogs: 1
    })
  })

  test('when list has many blogs, determine most blogs by author entries', () => {
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    expect(listHelper.mostBlogs(helper.blogs)).toEqual(expected)
  })
})

describe('most likes', () => {
  test('when list is empty, author is undefined', () => {
    expect(listHelper.mostLikes([])).toBe(undefined)
  })

  test('when list has one blog, author is author of that blog', () => {
    const listWithOneBlog = [helper.blogs[0]]
    const loneBlog = listWithOneBlog[0]
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
      author: loneBlog.author,
      likes: loneBlog.likes
    })
  })

  test('when list has many blogs, determine most likes by author', () => {
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    expect(listHelper.mostLikes(helper.blogs)).toEqual(expected)
  })
})