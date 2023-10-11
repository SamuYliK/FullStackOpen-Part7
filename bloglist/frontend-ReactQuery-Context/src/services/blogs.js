import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

export const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

export const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export const update = async (updatedObject) => {
  const response = await axios.put(
    `${baseUrl}/${updatedObject.id}`,
    updatedObject,
  )
  return response.data
}

export const remove = (removalParameter) => {
  const poistuvaToken = `Bearer ${removalParameter.removeToken}`
  const config = {
    headers: { Authorization: poistuvaToken },
  }
  axios.delete(`${baseUrl}/${removalParameter.id}`, config)
}

export const createComment = async (updatedObject) => {
  const response = await axios.put(
    `${baseUrl}/${updatedObject.id}/comments`,
    updatedObject,
  )
  return response.data
}

export default { getAll, create, update, remove, setToken, createComment }
