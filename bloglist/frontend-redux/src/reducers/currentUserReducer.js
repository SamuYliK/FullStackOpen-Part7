import { createSlice } from '@reduxjs/toolkit'

import { setNotification } from './notificationReducer'
import loginService from '../services/login'
import blogService from '../services/blogs'

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: [],
  reducers: {
    currentUser(state, action) {
      return action.payload
    },
    userLoginFailed(state, action) {
      return action.payload
    },
  },
})

export const { currentUser, userLoginFailed } = currentUserSlice.actions

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      dispatch(currentUser(user))
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatch(setNotification(`Welcome to blog app ${username}`, 5, 'success'))
    } catch (exception) {
      dispatch(userLoginFailed({ error: 'Not correct person' }))
      dispatch(setNotification('wrong username or password', 5, 'error'))
    }
  }
}

export const userIsLoggedIn = (user) => {
  return async (dispatch) => {
    dispatch(currentUser(user))
    blogService.setToken(user.token)
  }
}

export default currentUserSlice.reducer
