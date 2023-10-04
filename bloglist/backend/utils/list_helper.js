let _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce( (sum, blog) => sum + blog.likes, 0 )
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0){
    return {}
  } else {
    const result = blogs.reduce( (favorite, blog) => {
      if (favorite.likes <= blog.likes){
        const currentFavorite = {
          title: blog.title,
          author: blog.author,
          likes: blog.likes
        }
        return currentFavorite
      } else {
        return favorite
      }
    }, { likes: 0 })
    return result
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0){
    return {}
  } else {
    const authorList = blogs.reduce( (authors, blog) => {
      authors[blog.author] = authors[blog.author] || 0
      authors[blog.author] += 1
      return authors
    }, {})
    const maxKey = _.maxBy(_.keys(authorList), o => authorList[o])
    const result = {
      author: maxKey,
      blogs: authorList[maxKey]
    }
    return result
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0){
    return {}
  } else {
    const authorLikes = blogs.reduce( (authors, blog) => {
      authors[blog.author] = authors[blog.author] || 0
      authors[blog.author] += blog.likes
      return authors
    }, {})
    const maxKey = _.maxBy(_.keys(authorLikes), o => authorLikes[o])
    const result = {
      author: maxKey,
      likes: authorLikes[maxKey]
    }
    return result
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}