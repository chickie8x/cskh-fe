//User config
export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 10
export const DEFAULT_ROLE = null
export const DEFAULT_STATUS = null
export const USER_TABLE_HEADER = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'role',
    label: 'Role',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'createdAt',
    label: 'Created At',
  },
]

//Ticket config
export const DEFAULT_TICKET_STATUS = null
export const DEFAULT_TICKET_PRIORITY = null
export const TICKET_TABLE_HEADER = [
  {
    key: 'carrier',
    label: 'Carrier',
  },
  {
    key: 'category',
    label: 'Category',
  },
  {
    key: 'priority',
    label: 'Priority',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'ticketUser',
    label: 'Customer',
  },
  {
    key: 'description',
    label: 'Description',
  },
  {
    key: 'slaDueAt',
    label: 'SLA Due At',
  },
  {
    key: 'createdAt',
    label: 'Created At',
  },
]

export const TICKET_CATEGORY = [
  {
    key: 'redelivery',
    value: 'REDELIVERY',
  },
  {
    key: 'addressVerify',
    value: 'ADDRESS_VERIFY',
  },
  {
    key: 'claimDmgLost',
    value: 'CLAIM_DMG_LOST',
  },
  {
    key: 'returnToSender',
    value: 'RETURN_TO_SENDER',
  },
  {
    key: 'specialHandling',
    value: 'SPECIAL_HANDLING',
  },
]

export const BADGE_STATUS = [
  {
    value: 'NEW',
    label: 'New',
    style:
      'bg-blue-50 text-blue-500 text-xs font-bold border border-blue-500 flex items-center justify-center w-16 h-6 rounded-full',
  },
  {
    value: 'IN_PROGRESS',
    label: 'Processing',
    style:
      'bg-indigo-50 text-indigo-500 text-xs font-bold border border-indigo-500 flex items-center justify-center w-16 h-6 rounded-full',
  },
  {
    value: 'ASSIGNED',
    label: 'Assigned',
    style:
      'bg-orange-50 text-orange-500 text-xs font-bold border border-orange-500 flex items-center justify-center w-16 h-6 rounded-full',
  },
  {
    value: 'CLOSED',
    label: 'Closed',
    style:
      'bg-green-50 text-green-500 text-xs font-bold border border-green-500 flex items-center justify-center w-16 h-6 rounded-full',
  },
]

export const BADGE_PRIORITY = [
  {
    value: 'LOW',
    label: 'Low',
    style:
      'bg-yellow-50 text-yellow-500 text-xs font-bold border border-yellow-500 flex items-center justify-center w-16 h-6 rounded-full',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    style:
      'bg-orange-50 text-orange-500 text-xs font-bold border border-orange-500 flex items-center justify-center w-16 h-6 rounded-full',
  },
  {
    value: 'HIGH',
    label: 'High',
    style:
      'bg-red-50 text-red-500 text-xs font-bold border border-red-500 flex items-center justify-center w-16 h-6 rounded-full',
  },
]

//SSE config
export const SSE_URL = 'http://14.225.1.34/api/sse/events'

//Order config
export const ORDER_TABLE_HEADER = [
  {
    key: 'waybill',
    label: 'Order Number',
  },
  {
    key: 'moneyTotalFee',
    label: 'Order Total Fee',
  },
  {
    key: 'carrier',
    label: 'Carrier',
  },
  {
    key: 'orderProduct',
    label: 'Order Product',
  },
  {
    key: 'orderStatus',
    label: 'Order Status',
  },
  {
    key: 'lastUpdate',
    label: 'Last Update',
  },
  {
    key: 'moneyCollection',
    label: 'COD',
  },
  {
    key: 'createdAt',
    label: 'Created At',
  },
]

export const CARRIERS = [
  {
    label: 'Viettel Post',
    key: 'viettelPost',
    value: 'VIETTEL_POST',
  },
]
