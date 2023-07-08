const FormButtons = ({ children }) => {

  const style = {
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  }

  return (
    <div style={ style }>
      { children }
    </div>
  )
}

export default FormButtons