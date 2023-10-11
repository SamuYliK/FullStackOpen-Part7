import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Container } from '@mui/material'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Blog from './components/Blog'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import User from './components/User'
import NavigationMenu from './components/NavigationMenu'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import { getAll } from './services/blogs'
import { getAllUsers } from './services/users'

import { useNotificationDispatch } from './contexts/NotificationContext'
import {
  useCurrentUserValue,
  useCurrentUserDispatch,
} from './contexts/CurrentUserContext'

const App = () => {
  const dispatchNotification = useNotificationDispatch()
  const dispatchCurrentUser = useCurrentUserDispatch()
  const user = useCurrentUserValue()
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatchCurrentUser({ type: 'USER', payload: loggedUser })
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const blogResult = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    refetchOnWindowFocus: false,
  })

  const blogs = blogResult.data

  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    refetchOnWindowFocus: false,
  })

  const users = usersResult.data

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatchNotification({
      type: 'NOTIFY',
      payload: ['success', `${user.username} was successfully logged out`],
    })
    dispatchCurrentUser({ type: 'LOGOUT' })
    setTimeout(() => {
      dispatchNotification({ type: 'RESET' })
    })
    navigate('/')
  }

  if (blogResult.isLoading || usersResult.isLoading) {
    return <div>loading data......</div>
  }

  if (user === null) {
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
        <Route path="/users/:id" element={<User users={users} />} />
        <Route
          path="/"
          element={
            <div>
              <Togglable buttonLabel="create new blog">
                <BlogForm />
              </Togglable>
              <Blogs blogs={blogs} />
            </div>
          }
        />
        <Route path="/blogs/:id" element={<Blog blogs={blogs} />} />
      </Routes>
    </Container>
  )
}

export default App
