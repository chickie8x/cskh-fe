import api from './axios'

export const getTickets = async (query) => {
  try {
    const res = await api.get('/ticket/get', { params: query })
    console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    return null
  }
}
