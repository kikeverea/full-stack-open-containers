import { useState } from 'react'
import FormField from './FormField'
import Flex from './Flex'
import PropTypes from 'prop-types'


const LoginForm = ({ login, signup, userLoggedIn }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [action, setAction] = useState('')

  const setLogin = () =>
    setAction('login')

  const setSignUp = () =>
    setAction('signup')

  const handleFormSubmit = async event => {
    event.preventDefault()
    try {
      const user = action === 'login'
        ? await login(username, password)
        : await signup(username, password)

      await userLoggedIn(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.log(exception)
      await userLoggedIn(null)
    }
  }

  return (
    <form onSubmit={ handleFormSubmit }>
      <Flex customStyle={{
        flexDirection: 'column',
        gap: 10,
        maxWidth: 260,
        alignContent: 'flex-start'
      }}>
        <FormField name='User' value={ username } inputChange={ setUsername } />
        <FormField name='Password' value={ password } inputChange={ setPassword } />
        <input id="loginButton" type='submit' value='login' onClick={ ()=> setLogin() }/>
        <input id='signupButton' type='submit' value='sign up' onClick={ ()=> setSignUp() }/>
      </Flex>
    </form>
  )
}

export default LoginForm