import { useState } from 'react'

const BlogForm = ( {createBlog }) => {
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

    return(
    <div>
      <h2>Create a new blog</h2>
        
        <form onSubmit={addBlog}>
          <div>
            title:
            <input
              type='text'
              value={newTitle}
              name='Title'
              onChange={event => setNewTitle(event.target.value)}
            />
          </div>
          <div>
            author:
              <input 
                type='text'
                value={newAuthor}
                name='Author'
                onChange={event => setNewAuthor(event.target.value)}
              />
          </div>
          <div>
            url:
              <input 
                type='text'
                value={newUrl}
                name='Url'
                onChange={event => setNewUrl(event.target.value)}
              />
          </div>
          <button type='submit'>create</button>
        </form>
    </div>
    )
}

export default BlogForm