import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blog";
import { createNotification } from "./notificationReducer";

const loginSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    saveUser(state, action) {
      return action.payload
    }
  }
})

export const { saveUser } = loginSlice.actions
export default loginSlice.reducer

export const login = (credentials) => {
  return async (dispatch) => {
    try {
      const loggedUser = await loginService.login(credentials)
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      dispatch(saveUserDetails(loggedUser))
      dispatch(createNotification({type: 'success', message: `${loggedUser.name} signed in successfully`}))
    } catch ({ response }){
      console.log(response.data.error);
      dispatch(createNotification({type: 'error', message: response.data.error}))
    }
  }
}

export const saveUserDetails = (loggedUser) => {
  return (dispatch) => {
    console.log(loggedUser);
    blogService.setToken(loggedUser.token)
    dispatch(saveUser(loggedUser))
  }
}
