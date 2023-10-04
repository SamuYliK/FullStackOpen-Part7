const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('when there is initially an user at data base', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    let passwordHash = await bcrypt.hash('salainen', 10)
    let user = new User({ username: 'alku', passwordHash })
    await user.save()

    passwordHash = await bcrypt.hash('tosisalainen', 10)
    user = new User({ username: 'alku kaks', passwordHash })
    await user.save()
  })

  describe('users are returned correctly', () => {
    test('users are returned as json', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all users are returned', async () => {
      const response = await helper.usersInDb()

      expect(response).toHaveLength(2)
    })

    test('users are identified with id, not _id', async () => {
      const response = await helper.usersInDb()
      response.forEach(element => {
        expect(element.id).toBeDefined()
      })
    })
  })

  describe('addition of a new user', () => {

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'Puuhamies Pate',
        name: 'Pate',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper status code if username is taken', async () => {
      const usersAtStart = await helper.usersInDb()
      if (usersAtStart.length === 0){
        expect(usersAtStart.length).toBe(2)
      }
      const newUser = {
        username: usersAtStart[0].username,
        name: 'Pate',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper status code if username or password is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const noUserName = { name: 'Pate', password: 'salainen',
      }

      const shortUserName = { username: 'As', name: 'Pate', password: 'salainen' }

      const noPassword = { username: 'Asiakas', name: 'Pate' }

      const shortPassword = { username: 'Asiaskas', name: 'Pate', password: 'sa' }

      await api
        .post('/api/users')
        .send(noUserName)
        .expect(400)

      await api
        .post('/api/users')
        .send(shortUserName)
        .expect(400)

      await api
        .post('/api/users')
        .send(noPassword)
        .expect(400)

      await api
        .post('/api/users')
        .send(shortPassword)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

  })
})

afterAll(async () => {
  await mongoose.connection.close()
})