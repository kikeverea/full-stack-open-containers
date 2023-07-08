import { useState } from 'react'
import FormField from './FormField'
import Flex from './Flex'
import PropTypes from 'prop-types'

const LoginForm = ({ loginService, userLoggedIn }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(username, password)
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
    <form onSubmit={ handleLogin }>
      <Flex customStyle={{
        flexDirection: 'column',
        gap: 10,
        maxWidth: 260,
        alignContent: 'flex-start'
      }}>
        <FormField name='User' value={ username } inputChange={ setUsername } />
        <FormField name='Password' value={ password } inputChange={ setPassword } />
        <input id='submitButton' type='submit' value='login'/>
      </Flex>
    </form>
  )
}

LoginForm.propTypes = {
  loginService: PropTypes.object.isRequired,
  userLoggedIn: PropTypes.func.isRequired
}

export default LoginForm