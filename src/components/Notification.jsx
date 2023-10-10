import PropType from 'prop-types'

const Notification = ({ notification }) => {
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