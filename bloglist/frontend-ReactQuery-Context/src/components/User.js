import { List, ListItem } from '@mui/material'
import { useMatch } from 'react-router-dom'

const User = ({ users }) => {
  if (!users) {
    return <div>loading user...</div>
  }

  const userMatch = useMatch('/users/:id')
  const matchedUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

  if (matchedUser.blogs.length === 0) {
    return (
      <div>
        <h2>{matchedUser.username}</h2>
        <h3>Added blogs</h3>
        <p>User has not added any blogs</p>
      </div>
    )
  }

  return (
    <div>
      <h2>{matchedUser.username}</h2>
      <h3>Added blogs</h3>
      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        {matchedUser.blogs.map((blog) => (
          <ListItem key={blog.id} sx={{ display: 'list-item' }}>
            {blog.title}
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default User
