export const ORDER_STATUS_DETAIL = {
  'Chưa duyệt': {
    codes: ['-100'],
    color:
      'bg-gray-500/10 text-gray-700 border-gray-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Đã duyệt': {
    codes: ['100', '102', '103', '104', '-108'],
    color:
      'bg-blue-500/10 text-blue-600 border-blue-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Đã gửi tại cửa hàng tiện lợi': {
    codes: ['-109', '-110'],
    color:
      'bg-purple-500/10 text-purple-600 border-purple-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Đã hủy': {
    codes: ['107', '201'],
    color: 'bg-red-500/10 text-red-600 border-red-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Đã lấy hàng': {
    codes: ['105'],
    color:
      'bg-cyan-500/10 text-cyan-600 border-cyan-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Đang vận chuyển': {
    codes: ['200', '202', '300', '320', '400'],
    color:
      'bg-yellow-500/10 text-yellow-600 border-yellow-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Đang giao hàng': {
    codes: ['500', '506', '570', '508', '509', '550'],
    color:
      'bg-orange-500/10 text-orange-600 border-orange-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Giao hàng thất bại': {
    codes: ['507'],
    color:
      'bg-rose-500/10 text-rose-600 border-rose-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Duyệt hoàn': {
    codes: ['505', '502', '515'],
    color:
      'bg-indigo-500/10 text-indigo-600 border-indigo-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Phát thành công tiêu hủy': {
    codes: ['503'],
    color:
      'bg-pink-500/10 text-pink-600 border-pink-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Hoàn thành công': {
    codes: ['504'],
    color:
      'bg-green-500/10 text-green-600 border-green-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Chờ duyệt hoàn': {
    codes: ['505'],
    color: 'bg-sky-500/10 text-sky-600 border-sky-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
  'Giao hàng thành công': {
    codes: ['501'],
    color:
      'bg-emerald-500/10 text-emerald-600 border-emerald-400/20 px-2 py-1 text-xs font-semibold rounded',
  },
}

export function orderStatusMap(code) {
  const entry = Object.entries(ORDER_STATUS_DETAIL).find(([, v]) => v.codes.includes(String(code)))
  return entry || ['Không xác định', { color: 'bg-gray-500/10 text-gray-600 border-gray-400/20' }]
}

const LABEL_TO_CODES_MAP = {}
Object.entries(ORDER_STATUS_DETAIL).forEach(([label, { codes }]) => {
  LABEL_TO_CODES_MAP[label] = new Set(codes.map(String)) // dùng String để đồng nhất
})

/**
 * Filter danh sách vận đơn theo một hoặc nhiều nhãn
 * @param {Array} orders - danh sách vận đơn, mỗi đơn có thuộc tính `statusCode` (hoặc tên field bạn dùng)
 * @param {string|string[]} labels - nhãn muốn filter (có thể là 1 hoặc mảng)
 * @param {string} codeField - tên field chứa mã trạng thái (mặc định: 'statusCode')
 * @returns {Array} danh sách vận đơn đã filter
 */
export function filterOrdersByLabels(orders, labels, codeField = 'statusCode') {
  if (!labels || labels.length === 0) return orders

  const labelArray = Array.isArray(labels) ? labels : [labels]
  const allowedCodeSets = labelArray.map((label) => LABEL_TO_CODES_MAP[label]).filter(Boolean)

  if (allowedCodeSets.length === 0) return []

  return orders.filter((order) => {
    const code = String(order[codeField])
    return allowedCodeSets.some((codeSet) => codeSet.has(code))
  })
}

export const ticketPropMap = (arr) => {
  let ret = []
  arr.map((item) => {
    ret.push({
      value: item,
      label: item,
    })
  })
  return ret
}
