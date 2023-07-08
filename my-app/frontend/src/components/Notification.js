const Notification = ({ notification }) => {

  if (notification === null) {
    return <div id='notification'></div>
  }

  const typeColor = notification.type === 'success' ? 'green' : 'red'

  const notificationStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderWidth: 3,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    color: typeColor,
    borderColor: typeColor
  }

  return (
    <div id='notification' style={ notificationStyle }>
      { notification.message }
    </div>
  )
}

export default Notification