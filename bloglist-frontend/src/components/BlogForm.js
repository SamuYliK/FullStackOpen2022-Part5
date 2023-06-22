import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ( { createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }

  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  return(
    <div className='formDiv'>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type='text'
            value={newTitle}
            name='Title'
            onChange={event => setNewTitle(event.target.value)}
            id='title-input'
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={newAuthor}
            name='Author'
            onChange={event => setNewAuthor(event.target.value)}
            id='author-input'
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={newUrl}
            name='Url'
            onChange={event => setNewUrl(event.target.value)}
            id='url-input'
          />
        </div>
        <button id='submit-blog-button' type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm