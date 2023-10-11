import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { List, ListItem, Button, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import { likeBlog, removeBlog, commentBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.currentUser)

  if (!user) {
    return null
  }
  if (!blog) {
    return null
  }

  const correctPerson = blog.user.username === user.username

  const removeStyle = {
    display: correctPerson ? '' : 'none',
  }

  const updateLikes = () => {
    dispatch(likeBlog(blog))
  }

  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        dispatch(removeBlog(blog.id, user.token))
        dispatch(
          setNotification(
            `Blog '${blog.title} by '${blog.author} removed'`,
            5,
            'success',
          ),
        )
        navigate('/')
      } catch (exception) {
        dispatch(
          setNotification('Blog was already removed from server', 5, 'error'),
        )
      }
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    const comment = event.target[0].value
    event.target[0].value = ''
    dispatch(commentBlog(blog, comment))
  }

  return (
    <div className="blog">
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>Url: {blog.url}</div>
      <div className="likes">
        {blog.likes} likes
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={updateLikes}
        >
          like
        </Button>
      </div>
      <div>Added by user: {blog.user.username}</div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <div>
          <TextField
            label="comment"
            variant="filled"
            size="small"
            hiddenLabel
            color="success"
            focused
          />
          <Button variant="outlined" color="primary" size="small" type="submit">
            add comment
          </Button>
        </div>
      </form>

      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        {blog.comments.map((comment) => (
          <ListItem key={comment} sx={{ display: 'list-item' }}>
            {comment}
          </ListItem>
        ))}
      </List>

      <div style={removeStyle}>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={remove}
        >
          delete blog
        </Button>
      </div>
    </div>
  )
}

export default Blog
