import { useState } from 'react'

const ValueToggleButton = ({ labels, handleClick }) => {

  const [ value, setValue ] = useState(labels[0])

  const toggle = () => {
    setValue(value === labels[0] ? labels[1] : labels[0])
    handleClick()
  }

  return (
    <button className='toggle-button' onClick={ toggle }>{ value }</button>
  )
}

export default ValueToggleButton