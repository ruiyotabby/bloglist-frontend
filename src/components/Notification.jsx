import PropType from 'prop-types'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const Notification = () => {
  const [notification, dispatch] = useContext(NotificationContext)
  const { message, type } = notification

  if (!message) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  notification : PropType.object
}

export default Notification