import { createContext, useReducer } from "react";

const userReducer = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case 'SAVE':
      return payload
    case 'CLEAR':
      return null
    default:
      return console.log('Some error occurred in the reducer');
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext