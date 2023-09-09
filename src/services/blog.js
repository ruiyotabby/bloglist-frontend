import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl).catch(error => console.log(error))
  return response.data
}

export default { getAll }