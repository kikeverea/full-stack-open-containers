const blogsHelper = require('./blogs_helper')
const usersHelper = require('./users_helper')
const initHelper = require('./init_helper')
const { default: mongoose } = require('mongoose')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const baseUri = '/api/blogs'
let token
let user
let authorizationHeader

beforeAll(async () => {
  await initHelper.initUsers()
  const response = await loginRandomUser()
  token = response.body.token
  user = {
    id: response.body.id,
    name: response.body.name,
    username: response.body.username
  }
  authorizationHeader = `bearer ${ token }`
})

beforeEach(async () => {
  await initHelper.initBlogs()
},
20000)

const loginRandomUser = async () => {
  const user = usersHelper.randomUser()
  const credentials = {
    username: user.username,
    password: user.passwordHash
  }

  return await api
    .post('/api/login')
    .send(credentials)
    .expect(200)
}

describe('when there are blogs already saved', () => {
  test('returns the correct amount of blogs', async () => {
    const blogsInDb = await blogsHelper.blogsInDb()
    const response = await api.get(baseUri).expect(200)
    const blogs = response.body
    const blog = blogs[Math.floor(Math.random() * blogs.length)]

    expect(response.body).toHaveLength(blogsInDb.length)
    expect(blog.id).toBeDefined()
    expect(blog.user).toBeDefined()
    expect(blog.comments).toBeDefined()
  })
})

/************* POST *****************/

describe('addition of new blogs', () => {
  test('returns added blog with status 201 if blog is valid', async () => {
    const newBlog = blogsHelper.dummyBlog()
    const response = await postBlog(newBlog)

    const savedBlog = response.body
    expect(blogsHelper.areEqual(savedBlog, newBlog)).toBe(true)
  })

  test('added blog can be found in blogs collection', async () => {
    const blogsAtStart = await blogsHelper.blogsInDb()
    const newBlog = blogsHelper.dummyBlog()

    await postBlog(newBlog)

    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, newBlog)

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    expect(inCollection).toBeDefined()
  })

  test('if likes property is missing, add blog with zero likes', async () => {
    const blogNoLikes = blogsHelper.dummyBlog({ ignore: ['likes'] })

    const response = await postBlog(blogNoLikes)
    const savedBlog = response.body

    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, savedBlog)

    expect(savedBlog.likes).toEqual(0)
    expect(inCollection.likes).toEqual(0)
  })

  test('if comments property is missing, add blog with empty comments array', async () => {
    const blogNoComments = blogsHelper.dummyBlog({ ignore: ['comments'] })

    const response = await postBlog(blogNoComments)
    const savedBlog = response.body

    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, savedBlog)

    expect(savedBlog.comments).toEqual([])
    expect(inCollection.comments).toEqual([])
  })

  test('adding with title and url missing, fails with status 400', async () => {
    const blogsAtStart = await blogsHelper.blogsInDb()
    const blog = blogsHelper.dummyBlog({ ignore: ['title', 'url'] })

    const response = await postBlog(blog, { expectedStatus: 400 })

    await assertCreationFailed(response, blog, blogsAtStart)
  })

  test('adding without providing a token, fails with status 401', async () => {
    const blogsAtStart = await blogsHelper.blogsInDb()
    const blog = blogsHelper.dummyBlog()

    const response = await postBlog(blog, { expectedStatus: 401, authorization: '' })

    await assertCreationFailed(response, blog, blogsAtStart)
  })

  describe('addition of blogs comments', () => {
    test('adding new comment returns comment with 201 and defined id', async () => {
      const comment = 'new comment'
      const blog = await blogsHelper.randomBlogFromUser(user)

      const response = await postComment(blog.id, comment)

      assertCommentCreated(response, comment)
    })

    test('added comment can be found in blogs collection', async () => {
      const comment = 'new comment'
      const blog = await blogsHelper.randomBlogFromUser(user)

      const response = await postComment(blog.id, comment)
      const createdComment = response.body

      const blogsAtEnd = await blogsHelper.blogsInDb()
      const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, blog, { ignore: ['comments'] })

      const inCollectionComment =
        inCollection.comments.find(collectionComment => collectionComment.id === createdComment.id)

      expect(inCollectionComment).toBeDefined()
    })

    test('adding new comment without authorization succeeds', async () => {
      const comment = 'new comment'
      const blog = await blogsHelper.randomBlogFromUser(user)

      const response = await postComment(blog.id, comment, { authorization: '' })

      assertCommentCreated(response, comment)
    })

    const assertCommentCreated = (response, comment) => {
      const createdComment = response.body
      expect(createdComment.id).toBeDefined()
      expect(createdComment.comment).toBe(comment)
    }

    const postComment = async (blogId, comment, { authorization = authorizationHeader } = {}) =>
      await api
        .post(`${ baseUri }/${ blogId }/comments`)
        .set('Authorization', authorization)
        .send({ comment })
        .expect(201)
        .expect('Content-Type', /application\/json/)
  })

  const assertCreationFailed = async (response, newBlog, blogsAtStart) => {
    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, newBlog)

    expect(response.body.error).toBeDefined()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(inCollection).toBeUndefined()
  }

  const postBlog = async (blog, { expectedStatus = 201 , authorization = authorizationHeader } = {}) =>
    await api
      .post(baseUri)
      .set('Authorization', authorization)
      .send(blog)
      .expect(expectedStatus)
      .expect('Content-Type', /application\/json/)
})

/************* DELETE *****************/

describe('deletion of blogs', () => {
  test('deleting with valid id, succeeds with 204', async () => {
    const blog = await blogsHelper.randomBlogFromUser(user)
    await deleteBlog(blog)
  })

  test('deleted blog cannot be found in blogs collection', async () => {
    const blogsAtStart = await blogsHelper.blogsInDb()
    const toDelete = await blogsHelper.randomBlogFromUser(user, blogsAtStart)

    await deleteBlog(toDelete)

    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, toDelete)

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    expect(inCollection).toBeUndefined()
  })

  test('deleting without providing a token, fails with 401', async () => {
    const blogsAtStart = await blogsHelper.blogsInDb()
    const toDelete = blogsAtStart[0]

    const response = await deleteBlog(toDelete, { expectedStatus: 401, authorization: '' })

    await assertDeletionFailed(toDelete, response, blogsAtStart)
  })

  test('user deleting a blog that did not create, fails with 401', async () => {
    const blogsAtStart = await blogsHelper.blogsInDb()
    const blog = await blogsHelper.randomBlogFromUserDifferentThan(user, blogsAtStart)

    const response = await deleteBlog(blog, { expectedStatus: 401 })

    await assertDeletionFailed(blog, response, blogsAtStart)
  })

  describe('deleting comments', () => {
    test('deleting comment succeeds with 204', async () => {
      const blog = await blogsHelper.randomBlogFromUser(user)
      const comment = randomComment(blog)

      await deleteComment(blog.id, comment)
    })

    test('deleting comment cannot be found in blogs collection', async () => {
      const blog = await blogsHelper.randomBlogFromUser(user)
      const comment = randomComment(blog)

      await deleteComment(blog.id, comment)

      const blogsAtEnd = await blogsHelper.blogsInDb()
      const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, blog, { ignore: ['comments'] })
      const inCollectionComment =
        inCollection.comments.find(collectionComment => collectionComment.id === comment.id)

      expect(inCollectionComment).toBeUndefined()

    })

    test('deleting comment without a token fails with 401', async () => {
      const blog = await blogsHelper.randomBlogFromUser(user)
      const comment = randomComment(blog)

      await deleteComment(blog.id, comment, { expectedStatus: 401, authorization: '' })
    })

    test('user deleting a comment that did not create fails with 401', async () => {
      const blog = await blogsHelper.randomBlogFromUserDifferentThan(user)
      const comment = randomComment(blog)

      await deleteComment(blog.id, comment, { expectedStatus: 401 })
    })

    const randomComment = blog => {
      const comments = blog.comments
      return comments[Math.floor(Math.random() * comments.length)]
    }

    const deleteComment = async (blogId, comment, { expectedStatus = 204, authorization = authorizationHeader } = {}) => {
      await api
        .delete(`${ baseUri }/${ blogId }/comments/${ comment.id.toString() }`)
        .set('Authorization', authorization)
        .send({ comment })
        .expect(expectedStatus)
    }
  })

  const deleteBlog = async (blog, { expectedStatus = 204, authorization = authorizationHeader } = {}) => {
    return await api
      .delete(`${ baseUri }/${ blog.id }`)
      .set('Authorization', authorization)
      .expect(expectedStatus)
  }

  const assertDeletionFailed = async (toDelete, response, blogsAtStart) => {
    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, toDelete)

    expect(response.body.error).toBeDefined()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(inCollection).toBeDefined()
  }
})

/************* PUT *****************/

describe('updating existing blogs', () => {
  test('returns status 204 if blog is valid', async () => {
    const blog = await updatedDummy()
    await updateBlog(blog)
  })

  test('updated blog can be found in blogs collection', async () => {
    const toUpdate = await updatedDummy()

    await updateBlog(toUpdate)

    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, toUpdate)

    expect(inCollection).toBeDefined()
  })

  test('updating a blog does not modify blogs collection', async () => {
    const blogsAtStart = await blogsHelper.blogsInDb()
    const blog = await updatedDummy(blogsAtStart)

    await updateBlog(blog)

    const blogsAtEnd = await blogsHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('sending an update without likes, updates likes to zero', async () => {
    const toUpdate = await updatedDummy({ likes: undefined })

    await updateBlog(toUpdate)

    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, toUpdate,
      { ignore: ['likes'] })

    expect(inCollection.likes).toBe(0)
  })

  test('sending an update without comments, updates comments to empty array', async () => {
    const toUpdate = await updatedDummy({ comments: undefined })

    await updateBlog(toUpdate)

    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, toUpdate, { ignore: ['comments'] })

    expect(inCollection.comments).toBeDefined()
    expect(inCollection.comments.length).toBe(0)
  })

  test('updating without providing a token, fails with 401', async () => {
    const toUpdate = await updatedDummy()

    await updateBlog(toUpdate, { expectedStatus: 401, authorization: '' })
    await assertUpdateFailed(toUpdate)
  })

  test('user updating a blog that did not create, fails with 401', async () => {
    const blogFromOtherUser = await blogsHelper.randomBlogFromUserDifferentThan(token)

    const toUpdate = {
      ...blogFromOtherUser,
      title: 'Other title'
    }

    await updateBlog(toUpdate, { expectedStatus: 401 })
    await assertUpdateFailed(toUpdate)
  })

  describe('updating likes', () => {
    test('returns 204 and updates likes if update is valid', async () => {
      const blog = await blogsHelper.randomBlogFromUser(user)

      const likes = { likes: blog.likes + Math.floor(Math.random() * 5) }

      await updateLikes(blog.id, likes)

      const blogsAtEnd = await blogsHelper.blogsInDb()
      const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, blog, { ignore: ['likes'] })

      expect(inCollection.likes).toBe(likes.likes)
    })

    test('updating likes does not alter the rest of the blog', async () => {
      const blog = await blogsHelper.randomBlogFromUser(user)
      const toUpdate = {
        ...blog,
        title: 'wrong title',
        author: 'another',
        likes: 1234
      }

      await updateLikes(toUpdate.id, toUpdate)

      const blogsAtEnd = await blogsHelper.blogsInDb()
      const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, blog, { ignore: ['likes'] })

      expect(blogsHelper.areEqual(blog, inCollection, ['likes'])).toBe(true)
      expect(inCollection.likes).toBe(toUpdate.likes)
    })

    const updateLikes = async (blogId, likes) => {
      return await api
        .put(`${ baseUri }/${ blogId }/likes`)
        .set('Authorization', authorizationHeader)
        .send(likes)
        .expect(204)
    }
  })

  const updatedDummy = async (update) => {
    const blog = await blogsHelper.randomBlogFromUser(user)

    if (!update) {
      update = {
        title: 'Other title',
        author: 'Another author',
      }
    }

    const { id, title, author, url, likes, comments } = blog

    return { id, title, author, url, likes, comments, ...update }
  }

  const updateBlog = async (blog, { expectedStatus = 204, authorization = authorizationHeader } = {}) => {
    return await api
      .put(`${ baseUri }/${ blog.id }`)
      .set('Authorization', authorization)
      .send(blog)
      .expect(expectedStatus)
  }

  const assertUpdateFailed = async (toUpdate) => {
    const blogsAtEnd = await blogsHelper.blogsInDb()
    const inCollection = blogsHelper.findBlogEqualTo(blogsAtEnd, toUpdate)

    expect(inCollection).toBeUndefined()
  }
})

afterAll(() => {
  mongoose.connection.close().then(() => {
    console.log('Connection closed')
  })
})