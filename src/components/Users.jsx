import { useQuery, useQueryClient } from "@tanstack/react-query"
import userService from "../services/user"
import { Link, useParams } from "react-router-dom"

const Users = () => {
  const { error, isLoading, data } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })
  if (isLoading) return <p>Please wait...</p>
  if (error) return <p>{error.message}</p>
  const users = data

  return (
    <>
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
          <tr key={user.id}>
            <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
            <td>{user.blogs.length}</td>
          </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export const User = () => {
  const queryClient = useQueryClient()
  const users = queryClient.getQueryData(['users'])

  if (!users) return <p>Nothing to see here</p>

  const user = users.find(user => user.id === useParams().id)

  if (!user) return <p>User not found</p>

  return (
    <>
      <h3>{user.name}</h3>
      <h5>added blogs</h5>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </>
  )
}

export default Users