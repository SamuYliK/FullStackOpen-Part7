import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    makeNotification(state, action) {
      return action.payload
    },
    resetNotification() {
      return null
    },
  },
})

export const setNotification = (notification, time, notType) => {
  return async (dispatch) => {
    dispatch(makeNotification([notification, notType]))
    setTimeout(() => {
      dispatch(resetNotification())
    }, time * 1000)
  }
}

export const { makeNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer
