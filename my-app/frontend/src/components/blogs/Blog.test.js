import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'


describe('Blog test', () => {
  const dummyBlog = {
    title: 'blog',
    author: 'me',
    url: 'www.me.com',
    likes: 0
  }
  let container
  const onUpdateRequest = jest.fn()
  const onDeleteRequest = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        blog={ dummyBlog }
        onUpdateRequest={ onUpdateRequest }
        onDeleteRequest={ onDeleteRequest }/>)
      .container
  })

  test('show simple content by default', () => {
    assertSimpleContentOnDisplay()
  })

  test('show full content when view button is clicked', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('view')

    await user.click(showButton)

    const title = container.querySelector('#title')
    const url = container.querySelector('#url')
    const likeButton = screen.getByText('like')
    const likes = container.querySelector('#likes')
    const author = container.querySelector('#author')
    const hideButton = screen.getByText('hide')

    expect(title).toBeDefined()
    expect(url).toBeDefined()
    expect(likeButton).toBeDefined()
    expect(likes).toBeDefined()
    expect(likes.innerHTML).toBe('' + dummyBlog.likes)
    expect(author).toBeDefined()
    expect(hideButton).toBeDefined()
  })

  test('show simple content when hide button is clicked', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('view')

    await user.click(showButton)
    await user.click(showButton)

    assertSimpleContentOnDisplay()
  })

  test('like button clicked twice calls likes handler twice', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('view')

    await user.click(showButton)

    const likeButton = screen.getByText('like')
    const likes = container.querySelector('#likes')
    const likesBeforeClicking = dummyBlog.likes

    await user.click(likeButton)
    await user.click(likeButton)

    const likesAfterClicking = likesBeforeClicking + 2

    expect(dummyBlog.likes).toBe(likesAfterClicking)
    expect(likes.innerHTML).toBe('' + likesAfterClicking)
    expect(onUpdateRequest.mock.calls).toHaveLength(2)
  })

  const assertSimpleContentOnDisplay = () => {
    const title = container.querySelector('#title')
    const url = container.querySelector('#url')
    const likes = container.querySelector('#likes')
    const author = container.querySelector('#author')
    const showButton = screen.getByText('view')

    expect(title).toBeDefined()
    expect(url).toBe(null)
    expect(likes).toBe(null)
    expect(author).toBe(null)
    expect(showButton).toBeDefined()
  }
})
