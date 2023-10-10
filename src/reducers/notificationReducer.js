import { createSlice } from "@reduxjs/toolkit";
import { array } from "prop-types";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: '',
    type: ''
  },
  reducers: {
    createNotification(state,  action ) {
      const { message, type } = action.payload
      state.message = message
      state.type = type
      return state
    },
    clearNotification(state, action) {
      state = { message: '', type: '' }
      return state
    },
  }
})

export const { createNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer