import Flex from './Flex'

const FormField = ({ name, value, inputChange }) => {

  return (
    <Flex direction={ 'row' } customStyle={{ gap: 20, justifyContent: 'space-between' }}>
      <label htmlFor={ name }>{ name }</label>
      <input
        id={ name }
        type="text"
        value={ value }
        onChange={({ target }) => inputChange(target.value)}
      />
    </Flex>
  )
}

export default FormField