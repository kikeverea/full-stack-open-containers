import Flex from '../Flex'
import { useState } from 'react'
import ValueToggleButton from '../ValueToggleButton'
import HoverButton from '../HoverButton'

const Blog = ({ blog, onUpdateRequest, onDeleteRequest }) => {

  const [ likes, setLikes ] = useState(blog.likes ? blog.likes : 0)
  const [ showFullContent, setShowFullContent ] = useState(false)

  const simpleContent = () =>
    <div id='title'>{ blog.title }</div>

  const fullContent = () =>
    <Flex id='blog-full' direction={ 'column' } customStyle={{ gap: 10 }}>
      <div id='title'>{ blog.title }</div>
      <div id='url'>{ blog.url }</div>
      <Flex direction={ 'row' } customStyle={{ gap: 10 }}>
        <div id='likes'>{ likes }</div>
        <button onClick={ () => likeBlog(blog) }>like</button>
      </Flex>
      <div id='author'>{ blog.author }</div>
      <HoverButton label={ 'remove' } color={ '#de1212' } handleOnClick={ () => onDeleteRequest(blog) }/>
    </Flex>

  const likeBlog = (blog) => {
    const newLikes = likes + 1
    setLikes(newLikes)
    blog.likes = newLikes
    onUpdateRequest(blog)
  }

  const toggleContent = () =>
    setShowFullContent(!showFullContent)

  return (
    <Flex direction={ 'row' } className='blog' customStyle={{
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid black',
      padding: '10px 16px 10px 16px'
    }}
    >
      { showFullContent ? fullContent() : simpleContent() }
      <ValueToggleButton labels={[ 'view', 'hide' ]} handleClick={ toggleContent }/>
    </Flex>
  )
}

export default Blog