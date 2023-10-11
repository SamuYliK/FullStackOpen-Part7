import { useNavigate, useMatch  } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { List, ListItem, Button, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import { update, remove, createComment } from '../services/blogs'
import { useNotificationDispatch } from '../contexts/NotificationContext'
import { useCurrentUserValue } from '../contexts/CurrentUserContext'

const Blog = ({ blogs }) => {
  if (!blogs) {
    return <div>loading blog...</div>
  }
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()
  const user = useCurrentUserValue()

  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  const likeBlogMutation = useMutation(update, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const commentBlogMutation = useMutation(createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const removeBlogMutation = useMutation(remove, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

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
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      likeBlogMutation.mutate(updatedBlog)
    } catch (exception) {
      dispatchNotification({
        type: 'NOTIFY',
        payload: [
          'error',
          `Blog '${blog.title}' was already removed from server`,
        ],
      })
      setTimeout(() => {
        dispatchNotification({ type: 'RESET' })
      })
    }
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {      
      try {
        removeBlogMutation.mutate({ id: blog.id, removeToken: user.token })
      } catch (exception) {
        dispatchNotification({ type: 'ERROR', payload: [type: 'NOTIFY', 'Blog was already removed from server']})
        setTimeout(() => {
          dispatchNotification({ type: 'RESET' })
        }, 3000)
      }
      navigate('/')
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    const comment = event.target[0].value
    event.target[0].value = ''
    const comments = blog.comments.concat(comment)
    const commentedBlog = {
      ...blog,
      comments: comments,
    }
    commentBlogMutation.mutate(commentedBlog)
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
          onClick={removeBlog}
        >
          delete blog
        </Button>
      </div>
    </div>
  )
}

export default Blog
