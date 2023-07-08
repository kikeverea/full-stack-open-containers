import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Toggable = forwardRef((props, ref) => {

  const [active, setActive] = useState(false)

  const showWhenActive = {
    display: active ? '' : 'none'
  }

  const hideWhenActive = {
    display: active ? 'none' : ''
  }

  const toggle = () =>
    setActive(!active)

  useImperativeHandle(ref, () => {
    return {
      toggle
    }
  })

  return (
    <div id = { props.id } className='toggable' style={{ padding: '20px 0 20px 0' }}>
      <div className='toggler-element' style={ hideWhenActive }>
        <button className='toggle-button' onClick={ toggle }>{ props.label }</button>
      </div>
      <div className='toggable-children' style={ showWhenActive }>
        { props.children }
      </div>
    </div>
  )
})

Toggable.displayName = 'Toggable'

Toggable.propTypes = {
  label: PropTypes.string.isRequired
}


export default Toggable