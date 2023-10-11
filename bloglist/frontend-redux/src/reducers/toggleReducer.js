import { createSlice } from '@reduxjs/toolkit'

const toggleSlice = createSlice({
  name: 'toggle',
  initialState: false,
  reducers: {
    toggle(state, action) {
      return action.payload
    },
  },
})

export const setToggle = (visibility) => {
  return async (dispatch) => {
    dispatch(toggle(visibility))
  }
}

export const { toggle } = toggleSlice.actions
export default toggleSlice.reducer
