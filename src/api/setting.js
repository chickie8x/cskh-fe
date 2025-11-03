import api from './axios'
export const getCarriers = async (carrier) => {
  try {
    const response = await api.get('connector/viettelpost/general-info', {
      params: {
        carrier,
      },
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const connectCarrier = async (data) => {
  try {
    const response = await api.post('connector/viettelpost/customer-token/create', data)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
