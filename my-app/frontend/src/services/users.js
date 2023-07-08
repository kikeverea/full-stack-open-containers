const LOCAL_STORAGE_USER_KEY = 'loggedInUser'

const getUserFromLocal = () => {
  const json = window.localStorage.getItem(LOCAL_STORAGE_USER_KEY)
  return json ? JSON.parse(json) : null
}

const saveUserInLocal = (user) =>
  window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user))

const removeUserFromLocal = () =>
  window.localStorage.removeItem(LOCAL_STORAGE_USER_KEY)

export default { getUserFromLocal, saveUserInLocal, removeUserFromLocal }