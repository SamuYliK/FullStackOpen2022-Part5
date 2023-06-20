import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Testien Testaaja',
    url: 'notrealaddress.com',
    likes: '0',
    user: {
      name: 'Nimi Testaaja',
      username: 'Testaaja'
    }
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blogNotVisible')
  expect(div).toHaveTextContent('Component testing is done with react-testing-library')
  expect(div).toHaveTextContent('Testien Testaaja')
  expect(div).not.toHaveTextContent('notrealaddress.com')
  expect(div).not.toHaveTextContent('likes')
})

test('renders also url, likes and user if view button is clicked', async() => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Testien Testaaja',
    url: 'notrealaddress.com',
    likes: '0',
    user: {
      name: 'Nimi Testaaja',
      username: 'Testaaja'
    }
  }
  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const divSimple = container.querySelector('.blogNotVisible')
  expect(divSimple).toHaveStyle('display: none')
  const divAll = container.querySelector('.blogVisible')
  expect(divAll).not.toHaveStyle('display: none')
  expect(divAll).toHaveTextContent('notrealaddress.com')
  expect(divAll).toHaveTextContent('likes 0')
  expect(divAll).toHaveTextContent('Nimi Testaaja')
})

test('pressing like button calls eventhandler function correct amount of times', async() => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Testien Testaaja',
    url: 'notrealaddress.com',
    likes: '0',
    user: {
      name: 'Nimi Testaaja',
      username: 'Testaaja'
    }
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} updateLikes={ mockHandler } />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})