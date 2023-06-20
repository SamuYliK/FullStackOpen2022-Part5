import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const inputTitle = container.querySelector('#title-input')
  const inputAuthor = container.querySelector('#author-input')
  const inputUrl = container.querySelector('#url-input')

  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'Test Title')
  await user.type(inputAuthor, 'Test Author')
  await user.type(inputUrl, 'Test Url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('Test Url')
})