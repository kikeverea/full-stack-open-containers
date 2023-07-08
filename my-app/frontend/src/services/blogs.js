import apiClient from '../util/apiClient'

const fetchUserBlogs = async (id) => {
  const response = await apiClient.get('/users')
  const users = response.data
  const loggedInUser = users.filter(user => user.id === id)[0]

  return loggedInUser.blogs
}

const addBlog = async (blog, user) => {
  const config = {
    headers: { Authorization: `bearer ${ user.token }` },
  }

  const response = await apiClient.post('/blogs', blog, config)
  return response.data
}

const updateBlog = async (blog, user) => {
  blog = {
    ...blog,
    user: user.id
  }

  const response = await apiClient.put(`/blogs/${ blog.id }`, blog, config(user))

  return response.status === 200
}

const deleteBlog = async (blog, user) => {
  const response = await apiClient.delete(`/blogs/${ blog.id }`, config(user))
  return response.status === 204
}

const config = (user) => {
  return (
    {
      headers: { Authorization: `bearer ${ user.token }` },
    }
  )
}


export default { fetchUserBlogs, addBlog, updateBlog, deleteBlog }