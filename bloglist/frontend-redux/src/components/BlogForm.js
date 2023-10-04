import { createBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { TextField, Button } from '@mui/material'

const BlogForm = () => {
  const dispatch = useDispatch()

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
      dispatch(createBlog(blogObject))
      dispatch(
        setNotification(
          `A new blog ${blogObject.title} by ${blogObject.author} added successfully`,
          5,
          'success',
        ),
      )
    } catch (exception) {
      dispatch(
        setNotification(
          'Something went wrong, blog could not be added :(',
          5,
          'error',
        ),
      )
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
