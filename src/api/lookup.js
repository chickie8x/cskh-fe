import api from './axios'

//get all provinces
export const getProvinces = async () => {
  try {
    const response = await api.get('/connector/viettelpost/provinces')
    return response.data.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//get all district by province id
export const getDistricts = async (provinceId) => {
  try {
    const response = await api.get('/connector/viettelpost/districts', {
      params: {
        provinceId: provinceId,
      },
    })
    return response.data.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//get all wards by district id
export const getWards = async (districtId) => {
  try {
    const response = await api.get('/connector/viettelpost/wards', {
      params: {
        districtId: districtId,
      },
    })
    return response.data.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//get wards new by province id
export const getWardsNew = async (provinceId) => {
  try {
    const response = await api.get('/connector/viettelpost/wards-new', {
      params: {
        provinceId: provinceId,
      },
    })
    return response.data.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//verify address
export const verifyAddress = async (address) => {
  try {
    const response = await api.post('/connector/viettelpost/checking-address', {
      address: address,
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

// export const getProvincesAfterMerge = async () => {
//   try {
//     const response = await api.get(
//       'https://api.viettelpost.vn/api/setting/listAllProvinceAfterMerge',
//     )
//     console.log(response)
//     return response.data
//   } catch (error) {
//     console.error(error)
//     throw error
//   }
// }

// //get all wards after merge
// export const getWardsAfterMerge = async () => {
//   try {
//     const response = await api.get('https://api.viettelpost.vn/api/setting/listAllWardAfterMerge')
//     console.log(response)
//     return response.data
//   } catch (error) {
//     console.error(error)
//     throw error
//   }
// }
