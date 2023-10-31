import { useQuery } from "@tanstack/react-query"
import userService from "../services/user"

const Users = () => {
  const { error, isLoading, data } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })
  if (isLoading) return <div>Please wait...</div>
  if (error) return <div>{error}</div>
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
            <td>{user.name}</td>
            <td>{user.blogs.length}</td>
          </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export default Users