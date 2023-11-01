import { useContext, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../hooks';
import blogService from '../services/blog';
import Togglable from './Togglable';
import UserContext from '../UserContext';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const successNotification = useNotification('success')
  const errorNotification = useNotification('error')
  const blogFormRef = useRef()
  const queryClient = useQueryClient()
  const [user, userDispatch] = useContext(UserContext)


  const { data } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blogs = data

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      successNotification.show(`a new blog '${newBlog.title}' by '${newBlog.author}' added`)
      queryClient.setQueryData(['blogs'], blogs.concat({...newBlog, user: user}))
    },
    onError: (error) => errorNotification.show(error.response.data.error)
  })

  const handleCreation = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>Create new</h2>
      <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
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
    </>
  )
}

export default BlogForm;