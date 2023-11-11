import { useQuery } from '@tanstack/react-query';
import userService from '../services/user';
import { Link, useParams } from 'react-router-dom';

const Users = () => {
	const { error, isLoading, data } = useQuery({
		queryKey: ['users'],
		queryFn: userService.getAll,
	});
	if (isLoading) return <p>Please wait...</p>;
	if (error) return <p>{error.message}</p>;
	const users = data;

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
					{users.map((user) => (
						<tr key={user.id}>
							<td>
								<Link to={`/users/${user.id}`}>{user.name}</Link>
							</td>
							<td>{user.blogs.length}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};

export const User = () => {
	const { id } = useParams();
	const { isLoading, data } = useQuery({
		queryKey: ['users'],
		queryFn: userService.getAll,
	});

	if (isLoading) return <p>Please wait...</p>;

	const users = data;
	const user = users.find((user) => user.id === id);

	if (!user) return <p>User not found</p>;

	return (
		<>
			<h3>{user.name}</h3>
			<h5>added blogs</h5>
			{user.blogs.map((blog) => (
				<Link key={blog.id} className="blog" to={`/blogs/${blog.id}`}>
					{blog.title}{' '}
				</Link>
			))}
		</>
	);
};

export default Users;
