const Flex = ({ id, direction, customStyle, className, children }) => {
  let style = {
    display: 'flex',
    flexDirection: direction,
  }

  if (customStyle) {
    style = {
      ...style,
      ...customStyle
    }
  }

  return (
    <div id={id ? id : ''} style={ style } className={ className ? className : '' }>
      { children }
    </div>
  )
}

export default Flex