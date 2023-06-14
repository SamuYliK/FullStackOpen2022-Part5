import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotification'
import SuccessNotification from './components/SuccessNotification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  },[])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage(`${user.name} was successfully logged in`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }

  }

  const addBlog = (event) => {
    event.preventDefault()

    try{
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      }

      blogService
        .create(blogObject)
          .then(returnedBlog => {
            setBlogs(blogs.concat(returnedBlog))
            setSuccessMessage(`A new blog ${newTitle} by ${newAuthor} added successfully`)
            setNewTitle('')
            setNewAuthor('')
            setNewUrl('')
          })
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('Something went wrong, blog could not be added :(')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input 
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type='text'
          value={newTitle}
          name='Title'
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author:
          <input 
            type='text'
            value={newAuthor}
            name='Author'
            onChange={({ target }) => setNewAuthor(target.value)}
          />
      </div>
      <div>
        url:
          <input 
            type='text'
            value={newUrl}
            name='Url'
            onChange={({ target }) => setNewUrl(target.value)}
          />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setSuccessMessage(`${user.name} was successfully logged out`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    }

  if (user === null){
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorNotification message={errorMessage} />
        <SuccessNotification message={successMessage} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      <p>
        {user.name} logged in 
        <button onClick={() => logOut()}>logout</button>
      </p>
      <h2>Create a new blog</h2>
      {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
    </div>
  )
}

export default App