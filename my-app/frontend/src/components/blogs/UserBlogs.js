import { useRef, useState } from 'react'

import Flex from '../Flex'
import Blog from './Blog'
import Toggable from '../Toggable'
import NewBlogForm from './NewBlogForm'

import blogsService from '../../services/blogs'

const UserBlogs = ({ user, onBlogsChange }) => {

  const [blogs, setBlogs] = useState(user.blogs)

  const newBlogForm = useRef()

  const addNewBlog = async (blog) => {
    newBlogForm.current.toggle()

    const addedBlog = await blogsService.addBlog(blog, user)

    if(addedBlog && Object.keys(addedBlog)) {
      refreshBlogs(blogs ? blogs.concat(addedBlog) : [addedBlog],{
        action: 'add',
        blog: addedBlog
      })
    }
  }

  const cancelNewBlog = () => {
    newBlogForm.current.toggle()
  }

  const updateBlog = async (blog) => {
    const isUpdated = await blogsService.updateBlog(blog, user)

    if (isUpdated) {
      const updatedList = replaceBlogInBlogs(blog)
      refreshBlogs(updatedList, {
        action: 'update',
        blog: blog
      })
    }
  }

  const replaceBlogInBlogs = (blog) => {
    const blogIndex = blogs.findIndex(x => x.id === blog.id)
    blogs[blogIndex] = blog
    return [...blogs]
  }

  const tryDelete = async (blog) => {
    const deleteConfirmed = window.confirm(`Remove blog '${ blog.title }'?`)

    if (deleteConfirmed)
      await deleteBlog(blog)
  }

  const deleteBlog = async (blog) => {
    const isDeleted = await blogsService.deleteBlog(blog, user)

    if (isDeleted) {
      const updatedList = removeBlogFromBlogs(blog)
      refreshBlogs(updatedList, {
        action: 'delete',
        blog: blog
      })
    }
  }

  const removeBlogFromBlogs = (toDelete) =>
    blogs.filter(blog => blog.id !== toDelete.id)

  const refreshBlogs = (updatedBlogs, change) => {
    user.blogs = updatedBlogs
    setBlogs(updatedBlogs)
    onBlogsChange(change)
  }

  const sortByLikes = (blogs) =>
    blogs.sort((blog1, blog2) => blog2.likes - blog1.likes)

  return (
    <Flex customStyle={{ flexDirection: 'column', gap: 5, maxWidth: 480 }}>
      <Toggable id='new-blog-form' label={ 'new blog' } ref={ newBlogForm }>
        <NewBlogForm onFormSubmit={ addNewBlog } onCancel={ cancelNewBlog } />
      </Toggable>
      { blogs ?
        <>
          {
            sortByLikes(blogs).map(blog =>
              <Blog key={ blog.id }
                blog={ blog }
                onUpdateRequest={ updateBlog }
                onDeleteRequest={ tryDelete }/>
            )}
        </>
        : 'No blogs listed' }
    </Flex>
  )
}

export default UserBlogs