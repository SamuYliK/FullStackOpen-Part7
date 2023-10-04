import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      const blogs = action.payload.sort((a, b) => b.likes - a.likes)
      return blogs
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateLikes(state, action) {
      const id = action.payload
      const blogToLike = state.find((n) => n.id === id)
      const likes = blogToLike.likes + 1
      const likedBlog = {
        ...blogToLike,
        likes: likes,
      }
      return state
        .map((blog) => (blog.id !== id ? blog : likedBlog))
        .sort((a, b) => b.likes - a.likes)
    },
    updateAfterRemoval(state, action) {
      const id = action.payload
      return state.filter((n) => n.id !== id)
    },
    updateComments(state, action) {
      const id = action.payload.id
      const blogToComment = state.find((n) => n.id === id)
      const comments = action.payload.comments
      const commentedBlog = {
        ...blogToComment,
        comments: comments,
      }
      return state
        .map((blog) => (blog.id !== id ? blog : commentedBlog))
        .sort((a, b) => b.likes - a.likes)
    },
  },
})

export const {
  setBlogs,
  appendBlog,
  updateLikes,
  updateAfterRemoval,
  updateComments,
} = blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    await blogService.create(content)
    const allBlogs = await blogService.getAll()
    dispatch(setBlogs(allBlogs))
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const likedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })
    dispatch(updateLikes(likedBlog.id))
  }
}

export const removeBlog = (id, token) => {
  return async (dispatch) => {
    await blogService.remove(id, token)
    dispatch(updateAfterRemoval(id))
  }
}

export const commentBlog = (blog, comment) => {
  return async (dispatch) => {
    const comments = blog.comments.concat(comment)
    const commentedBlog = await blogService.createComment(blog.id, {
      ...blog,
      comments: comments,
    })
    dispatch(updateComments(commentedBlog))
  }
}

export default blogsSlice.reducer
