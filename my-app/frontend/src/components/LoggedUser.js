const LoggedUser = ({ user, logout }) => {
  const container = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }

  return (
    <div style={ container }>
      <h2>{ user.username }</h2>
      <button onClick={ logout }>Logout</button>
    </div>
  )
}

export default LoggedUser