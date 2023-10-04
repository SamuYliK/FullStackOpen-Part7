const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const createInitialBlogs = async () => {
  let passwordHash = await bcrypt.hash('salainen', 10)
  const user = new User({ username: 'alku', passwordHash })
  await user.save()

  passwordHash = await bcrypt.hash('salainen', 10)
  const tokaUser = new User({ username: 'toka', passwordHash })
  await tokaUser.save()

  let blog = new Blog({
    title: 'Paras blogi foreva',
    author: 'Sana hallussa',
    url: 'www.bloggaavasanasepposivutoiminenkoodintuottaja.fi',
    likes: 3,
    user: user._id,
  })
  await blog.save()
  blog = new Blog({
    title: '--',
    author: '-',
    url: '...',
    likes: 5,
    user: user._id
  })
  await blog.save()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Not real', url: '...', })
  await blog.save()
  await Blog.findByIdAndRemove(blog.id)

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  createInitialBlogs, blogsInDb, nonExistingId, usersInDb
}