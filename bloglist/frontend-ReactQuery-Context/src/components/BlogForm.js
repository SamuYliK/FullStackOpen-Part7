import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TextField, Button } from '@mui/material'

import { create } from '../services/blogs'
import { useNotificationDispatch } from '../contexts/NotificationContext'

const BlogForm = () => {
  const dispatchNotification = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation(create, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const addBlog = (event) => {
    event.preventDefault()
    const title = event.target[0].value
    const author = event.target[1].value
    const url = event.target[2].value
    const blogObject = {
      title,
      author,
      url,
    }
    event.target[0].value = ''
    event.target[1].value = ''
    event.target[2].value = ''

    try {
      newBlogMutation.mutate(blogObject)
      dispatchNotification({
        type: 'NOTIFY',
        payload: [
          'success',
          `A new blog ${blogObject.title} by ${blogObject.author} added successfully`,
        ],
      })
      setTimeout(() => {
        dispatchNotification({ type: 'RESET' })
      }, 3000)
    } catch (exception) {
      dispatchNotification({
        type: 'NOTIFY',
        payload: ['error', 'Something went wrong, blog could not be added'],
      })
      dispatchNotification({ type: 'RESET' })
    }
  }

  return (
    <div className="formDiv">
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          <TextField
            type="text"
            label="title"
            variant="filled"
            size="small"
            focused
          />
        </div>
        <div>
          <TextField
            type="text"
            label="author"
            variant="filled"
            size="small"
            focused
          />
        </div>
        <div>
          <TextField
            type="text"
            label="url"
            variant="filled"
            size="small"
            focused
          />
        </div>
        <Button
          variant="contained"
          color="success"
          size="small"
          id="submit-blog-button"
          type="submit"
        >
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
