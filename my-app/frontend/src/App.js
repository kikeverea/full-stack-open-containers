import { useEffect, useState } from 'react'
import UserBlogs from './components/blogs/UserBlogs'
import LoggedUser from './components/LoggedUser'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import loginService from './services/login'
import usersService from './services/users'
import blogsService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const user = usersService.getUserFromLocal()
    if (user) {
      setUser(user)
    }
  }, [])

  const loggedIn = async (user) => {
    console.log('Called')
    if (user) {
      user.blogs = await blogsService.fetchUserBlogs(user.id)
      saveUserInLocal(user)
      showNotification('Logged in', 'success')
    }
    else {
      showNotification('Login failed. Wrong credentials', 'fail')
    }
  }

  const logout = () => {
    usersService.removeUserFromLocal()
    setUser(null)
  }

  const saveUserInLocal = (user) => {
    usersService.saveUserInLocal(user)
    setUser({ ...user })
  }

  const showNotification = (message, type) => {
    setNotification({
      message: message,
      type: type
    })

    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleBlogsListChange = (change) => {
    if (change.action === 'add')
      showNotification(`A new blog: '${ change.blog.title }', was added`, 'success')

    usersService.saveUserInLocal(user)
  }

  return (
    <div style={{ padding: 10 }}>
      <h1>{ user !== null ? 'Blogs' : 'Log in'}</h1>
      <Notification notification={ notification }/>
      { user !== null
        ?
        <>
          <LoggedUser user={ user } logout={ logout } />
          <UserBlogs user={ user } onBlogsChange={ handleBlogsListChange }/>
        </>
        :
        <LoginForm loginService={ loginService } userLoggedIn={ loggedIn }/>
      }
    </div>
  )
}

export default App
