import { format } from 'date-fns'

export const formatDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy')
}

export const formatDateRange = (dates) => {
  if (!dates || dates.length !== 2) {
    return
  }
  const [startDate, endDate] = dates
  return format(startDate, 'dd-MM-yyyy') + ' - ' + format(endDate, 'dd-MM-yyyy')
}

export const formatTime = (date) => {
  return format(new Date(date), 'HH:mm:ss')
}

export const formatDateTime = (date) => {
  return format(new Date(date), 'dd-MM-yyyy HH:mm:ss')
}

export const formatNumber = (number) => {
  return parseInt(number).toLocaleString('vi-VN') || number
}

export const formatCurrency = (number) => {
  return parseInt(number).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || number
}
