import { List, ListItem } from '@mui/material'

const User = ({ user }) => {
  if (!user) {
    return null
  }

  if (user.blogs.length === 0) {
    return (
      <div>
        <h2>{user.username}</h2>
        <h3>Added blogs</h3>
        <p>User has not added any blogs</p>
      </div>
    )
  }

  return (
    <div>
      <h2>{user.username}</h2>
      <h3>Added blogs</h3>
      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} sx={{ display: 'list-item' }}>
            {blog.title}
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default User
