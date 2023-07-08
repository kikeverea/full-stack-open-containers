import apiClient from '../util/apiClient'

export const login = async (username, password) => {
  const response = await apiClient.post('/login', { username, password })
  const user = response.data

  return response.status === 200 ? user : null
}

export const signup = async (username, password) => {
  const response = await apiClient.post('/signup', { username, password })
  const user = response.data

  return response.status === 200 ? user : null
}