import apiClient from '../util/apiClient'

// const loginUrl = '/api/login'

const login = async (username, password) => {
  const response = await apiClient.post('/login', { username, password })
  const user = response.data

  return response.status === 200 ? user : null
}

export default { login }