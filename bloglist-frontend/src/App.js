import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotification'
import SuccessNotification from './components/SuccessNotification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [length, setLength] = useState(0)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
      setLength(blogs.length)
    })
  }, [length])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
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

  const blogFormRef = useRef()

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try{
      blogService
        .create(blogObject)
        .then(returnedBlog => {
          setSuccessMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added successfully`)
          setLength(length + 1)
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

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setSuccessMessage(`${user.name} was successfully logged out`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
  }

  const updateLikesOf = id => {
    const blog = blogs.find(n => n.id === id)
    const updatedBlog = { ...blog, likes: blog.likes+1 }
    
    try{
    blogService
      .update(id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
    setLength(length + 1)
    } catch(exception) {
        setErrorMessage(
          `Blog '${blog.title}' was already removed from server`
        )
        setTimeout(() => {
        setErrorMessage(null)
        }, 3000)
        setBlogs(blogs.filter(n => n.id !== id))
      }
  }

  const removeBlogID = ( id, title, author ) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      try{
      blogService
        .remove(id, user.token)
      } catch(exception){
          setErrorMessage(
            `Blog was already removed from server`
          )
          setTimeout(() => {
          setErrorMessage(null)
          }, 3000)
        }
      setBlogs(blogs.filter(n => n.id !== id))
    }
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
      <div>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      </div>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog 
        key={blog.id} 
        blog={blog} 
        updateLikes={() => updateLikesOf(blog.id)}
        usersName={user.username}
        removeBlog={() => removeBlogID( blog.id, blog.title, blog.author )}
        />
      )}
    </div>
  )
}

export default App