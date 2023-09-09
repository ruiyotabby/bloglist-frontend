import PropType from 'prop-types'

const Notification = ({message, className}) => {
  if (!message) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message : PropType.string,
  className: PropType.string
}

export default Notification