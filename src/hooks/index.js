import { useContext } from "react"
import NotificationContext from "../NotificationContext"

export const useNotification = (type) => {
  const [notification, dispatch] = useContext(NotificationContext)

  const show = (message) => {
    dispatch({ type: 'ADD', payload: { type: type, message: message } })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
  }

  return { show }
}