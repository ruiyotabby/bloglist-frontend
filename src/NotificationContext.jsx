import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case 'ADD':
      return payload
    case 'CLEAR':
      return { ...state, type: '', message: '' }
    default:
      return console.log('Some error occurred in the reducer');
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, { type: '', message: '' })

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext