import { createSlice } from "@reduxjs/toolkit";
import { array } from "prop-types";
import { useDispatch } from "react-redux";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: '',
    type: ''
  },
  reducers: {
    addNotification(state,  action ) {
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

export const { addNotification, clearNotification } = notificationSlice.actions

export const createNotification = ({type, message}) => {
  return (dispatch) => {
    dispatch(addNotification({ type, message }))
    setTimeout(() => dispatch(clearNotification()), 3000)
  }
}

export default notificationSlice.reducer