import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNotification } from '../reducers/notificationReducer';
import Togglable from './Togglable';
import { createBlog } from '../reducers/blogReducer';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const handleCreation = async (event) => {
    try {
      event.preventDefault()
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog({ title, author, url }))
      dispatch(createNotification({type: 'success', message: `a new blog '${title}' by '${author}' added`}))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Togglable buttonLabel='Create new blog' ref={blogFormRef} >
      <form onSubmit={handleCreation}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name='title'
            id='title'
            required
            onChange={({target}) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name='author'
            id='author'
            required
            onChange={({target}) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url}
            name='url'
            id='url'
            required
            onChange={({target}) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </Togglable>
  )
}

export default BlogForm;