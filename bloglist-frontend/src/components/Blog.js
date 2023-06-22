import { useState } from 'react'

const Blog = ({ blog, updateLikes, usersName, removeBlog }) => {
  const [visible, setVisible] = useState(false)
  const correctPerson = blog.user.username === usersName

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: visible ? 'none' : ''
  }

  const blogStyleTwo = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: visible ? '' : 'none'
  }

  const removeStyle = {
    display: correctPerson ? '' : 'none'
  }

  const makeVisible = () => setVisible(!visible)

  const makeNotVisible = () => setVisible(!visible)

  return (
    <div className='blog'>
      <div id='blog-not-visible' style={blogStyle} className='blogNotVisible'>
        {blog.title} {blog.author}
        <button id='view-button' onClick={makeVisible}>view</button>
      </div>
      <div id='blog-visible' style={blogStyleTwo} className='blogVisible'>
        <div>
          {blog.title} {blog.author}
          <button id='hide-button' onClick={makeNotVisible}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div className='likes'>
          likes {blog.likes}
          <button id='like-button' onClick={updateLikes}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <div style={removeStyle}>
          <button id='remove-button' onClick={removeBlog}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
