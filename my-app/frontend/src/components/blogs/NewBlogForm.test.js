import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

describe('<NewBlogForm />', () => {

  let user
  let container
  const onFormSubmit = jest.fn()
  const onCancel = jest.fn()

  beforeEach(() => {
    user = userEvent.setup()
    container = render(<NewBlogForm onFormSubmit={ onFormSubmit } onCancel = { onCancel }/>).container
  })

  test('onFormSubmit prop called with correct details', async () => {
    const title = container.querySelector('#Title')
    const author = container.querySelector('#Author')
    const url = container.querySelector('#Url')
    const submitButton = container.querySelector('input[type="submit"]')

    await user.type(title, 'Blog Title')
    await user.type(author, 'By me')
    await user.type(url, 'www.me.com')
    await user.click(submitButton)

    const expected = {
      title: 'Blog Title',
      author: 'By me',
      url: 'www.me.com'
    }

    expect(onFormSubmit.mock.calls).toHaveLength(1)
    expect(onFormSubmit.mock.calls[0][0]).toStrictEqual(expected)
  })

  test('cancel button calls "onCancel" prop', async () => {
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(onCancel.mock.calls).toHaveLength(1)
  })
})

