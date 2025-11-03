import api from './axios'

export const getUsers = async (query) => {
  try {
    const res = await api.get('/admin/get-users', { params: query })
    if (res.data.success) {
      return res.data
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/admin/delete-user`, { data: { userId: id } })
    if (res.data.success) {
      return res.data
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

export const editUser = async (data) => {
  try {
    const res = await api.put(`/admin/set-user`, data)
    if (res.data.success) {
      return res.data
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}
