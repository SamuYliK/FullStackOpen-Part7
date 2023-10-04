const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

describe('when there is initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    await helper.createInitialBlogs()
  })

  describe('blogs are returned correctly', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await helper.blogsInDb()
      expect(response).toHaveLength(2)
    })

    test('blogs are identified with id, not _id', async () => {
      const response = await helper.blogsInDb()
      response.forEach(element => {
        expect(element.id).toBeDefined()
      })
    })
  })

  describe('addition of a new blog', () => {
    test('valid blogs can be added', async () => {
      const users = await helper.usersInDb()
      const user = users[0]

      const userForToken = {
        username: user.username,
        id: user.id
      }

      const token = jwt.sign(userForToken, process.env.SECRET)

      const blogToAdd = {
        title: 'Meneeko perille',
        author: 'Testi Testaaja',
        url: 'www.testingtestingjasamasuomeks.fi',
        likes: 5,
        user: user.id,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogToAdd)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await helper.blogsInDb()
      expect(response).toHaveLength(2 + 1)
      const titles = response.map(r => r.title)
      expect(titles).toContain('Meneeko perille')
    })

    test('likes are zero unless otherwise specified', async () => {
      const users = await helper.usersInDb()
      const user = users[0]

      const userForToken = {
        username: user.username,
        id: user.id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)
      const blogNoLikes = {
        title: 'Ei tykatty',
        author: 'Jaska Jokunen',
        url: 'www.bloggaavavloggaajavaivloggaavabloggaaja.fi',
        user: user.id,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogNoLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await helper.blogsInDb()
      const noLikes = response.reduce( (amLikes, blog) => {
        if (blog.title === 'Ei tykatty'){
          return { likes: blog.likes }
        } else {
          return amLikes
        }
      }, {})
      expect(response).toHaveLength(2 + 1)
      expect(noLikes.likes).toBe(0)
    })

    test('blog without title or url is not added', async () => {
      const users = await helper.usersInDb()
      const user = users[0]

      const userForToken = {
        username: user.username,
        id: user.id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const notGoodBlog = { author: 'Not good', likes: 10, user: user.id }

      const noTitle = { author: 'No title',
        url: 'www.tatasivuaeitietaakseniloydyinterwebsista.fi',
        likes: 10, user: user.id }

      const noUrl = { title: 'No url', author: 'Joku Jaskanen',
        likes: 10, user: user.id }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(notGoodBlog)
        .expect(400)

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(noTitle)
        .expect(400)

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(noUrl)
        .expect(400)

      const response = await helper.blogsInDb()
      expect(response).toHaveLength(2)
    })

    test('blog cannot be added without proper token', async () => {
      const users = await helper.usersInDb()
      const user = users[0]

      const blogToAdd = {
        title: 'Meneeko perille',
        author: 'Testi Testaaja',
        url: 'http//...',
        likes: 5,
        user: user.id,
      }

      await api
        .post('/api/blogs')
        .send(blogToAdd)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const response = await helper.blogsInDb()
      expect(response).toHaveLength(2)
      const titles = response.map(r => r.title)
      expect(titles).not.toContain('Meneeko perille')
    })
  })

  describe('deletion of a blog', () => {
    test('blog deletion succeeds with status code 204 if id is valid', async () => {
      const users = await helper.usersInDb()
      const user = users[0]

      const userForToken = {
        username: user.username,
        id: user.id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(2 - 1)
      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).not.toContain(blogToDelete.title)
    })

    test('user not associated with blog cannot delete it', async () => {
      const users = await helper.usersInDb()

      const userForToken = {
        username: users[1].username,
        id: users[1].id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(2)
      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).toContain(blogToDelete.title)
    })

    test('blog cannot be deleted without proper token', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(2)
      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).toContain(blogToDelete.title)
    })
  })

  describe('modification of a blog', () => {
    test('existing blog can be modified', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const updatedBlog = {
        title: 'Paivitetty',
        author: blogsAtStart[0].author,
        url: blogsAtStart[0].url,
        likes: 100,
      }

      await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(2)
      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).toContain(updatedBlog.title)
      const titlesStart = blogsAtStart.map(r => r.title)
      expect(titlesStart).not.toContain(updatedBlog.title)

      const updatedLikes = blogsAtEnd.reduce( (newLikes, blog) => {
        if (blog.title === 'Paivitetty'){
          return { likes: blog.likes }
        } else {
          return newLikes
        }
      }, {})
      expect(updatedLikes.likes).toBe(updatedBlog.likes)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})