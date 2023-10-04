const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://samuylikuivila:${password}@cluster0.xenfxwd.mongodb.net/testBlogApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Paras blogi foreva',
  author: 'Sana hallussa',
  url: 'www.bloggaavasanasepposivutoiminenkoodintuottaja.fi',
  likes: 3,
})

blog.save().then( () => {
  console.log('Eka blogi tallessa')
  mongoose.connection.close()
})

const blogTwo = new Blog({
  title: 'Vlogit > blogit',
  author: 'Tylsaa ilman videoo',
  url: 'www.kuvaavaanvideoniinparanee.fi',
  likes: 0,
})

blogTwo.save().then( () => {
  console.log('Vloggaajan sana tallessa')
  mongoose.connection.close()
})