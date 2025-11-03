import api from './axios'

export const getNotifications = async () => {
  try {
    const res = await api.get('/notification/get')
    if (res.data.success) {
      return res.data
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}
