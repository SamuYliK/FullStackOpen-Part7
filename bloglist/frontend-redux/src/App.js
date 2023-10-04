import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useMatch, useNavigate } from 'react-router-dom'
import { Container } from '@mui/material'

import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import User from './components/User'
import NavigationMenu from './components/NavigationMenu'
import LoginForm from './components/LoginForm'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogsReducer'
import { userIsLoggedIn } from './reducers/currentUserReducer'
import { initializeUsers } from './reducers/usersReducer'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.currentUser)
  const users = useSelector((state) => state.users)

  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  const userMatch = useMatch('/users/:id')
  const matchedUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatch(userIsLoggedIn(loggedUser))
    }
  }, [])

  const blogFormRef = useRef()

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(
      setNotification(`${user.name} was successfully logged out`, 5, 'success'),
    )
    navigate('/')
  }

  if (user.name === undefined) {
    return (
      <div>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <Container>
      <NavigationMenu username={user.username} logOut={logOut} />
      <div>
        <h2>Blog app</h2>
        <Notification />
      </div>
      <Routes>
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<User user={matchedUser} />} />
        <Route
          path="/"
          element={
            <div>
              <div>
                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                  <BlogForm />
                </Togglable>
              </div>
              <Blogs blogs={blogs} />
            </div>
          }
        />
        <Route path="/blogs/:id" element={<Blog blog={matchedBlog} />} />
      </Routes>
    </Container>
  )
}

export default App
