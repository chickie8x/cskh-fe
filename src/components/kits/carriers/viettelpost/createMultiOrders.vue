<template>
  <div class="h-full w-full">
    <div class="flex items-center gap-3">
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx, .xls, .csv"
        class="hidden"
        @change="onFileChange"
      />
      <span v-if="fileName" class="text-gray-700 text-sm">{{ fileName }}</span>
      <Button variant="outline" @click="loadFile"><Plus /> {{ t('uploadExcel') }}</Button>
      <Button v-if="orderData.length" @click="verifyOrders" variant="outline"><ListChecks/> </Button>
      <Button v-if="isVerify" @click="createOrders"><FilePlus /> {{ t('createOrders') }}</Button>
      <Button @click="downloadTemplate" variant="outline" class="ml-auto"
        ><Download /> {{ t('downloadExcel') }}</Button
      >
    </div>
    <div v-if="excelData.length" class="mt-4">
      <div v-if="haveErrorOrders" class="flex items-center gap-2 text-orange-500 py-2 text-sm">
        <ShieldAlert />
        <span>{{ t('orderVerifyWarning') }}</span>
      </div>
      <div class="overflow-x-auto">
        <ExcelTable :tbHeaders="tbHeaders" :data="excelData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import ExcelTable from '@/components/kits/excel-table/index.vue'
import { Button } from '@/components/ui/button'
import { Plus, Download, ShieldAlert, ListChecks, FilePlus } from 'lucide-vue-next'
import api from '@/api/axios.js'
import { useAuthStore } from '@/stores/auth'
import { v4 as uuidv4 } from 'uuid'

const { t } = useI18n()
const authStore = useAuthStore()
const fileInput = ref(null)
const fileName = ref('')
const excelData = ref([])
const orderData = ref([])
const tbHeaders = ref([])
const isVerify = ref(false)
const haveErrorOrders = computed(() => {
  return excelData.value.some((order) => order['VERIFY_STATE'] === 'FAILED')
})

function loadFile() {
  fileInput.value.value = ''
  fileInput.value.click()
}

function downloadTemplate() {
  const link = document.createElement('a')
  link.href = '/excel/VTP_mau_excel_don_hang_o.xlsx'
  link.download = 'viettelpost.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    // Đọc sheet sang JSON
    let rows = XLSX.utils.sheet_to_json(sheet, {
      defval: '', // Giữ các ô trống là ''
    })

    // Loại bỏ cột STT, MA DON HANG
    rows = rows.map((row) => {
      const newRow = { ...row }
      delete newRow.STT
      delete newRow['Mã đơn hàng ']
      return newRow
    })

    // Loại bỏ các cột có tên chứa 'EMPTY'
    rows = rows.map((row) => {
      const cleanRow = {}
      for (const [key, value] of Object.entries(row)) {
        if (!key.includes('EMPTY')) {
          cleanRow[key.trim()] = value
        }
      }
      return cleanRow
    })

    // Lọc bỏ row trống (chỉ toàn giá trị rỗng sau khi bỏ STT)
    rows = rows.filter((row) =>
      Object.values(row).some((v) => v !== '' && v !== null && v !== undefined),
    )

    //add verify id
    rows = rows.map((row) => {
      const newRow = { ...row }
      newRow.VERIFY_ID = uuidv4()
      return newRow
    })

    //table headers
    if (rows.length) {
      Object.keys(rows[0]).map((item) => {
        if (item !== 'VERIFY_ID') {
          tbHeaders.value.push({ key: item.trim(), label: item.trim() })
        }
      })
    }
    excelData.value = rows
  }

  reader.readAsArrayBuffer(file)
}

const mapObjectKey = {
  'Tên người nhận (*)': 'RECEIVER_FULLNAME',
  'Số ĐT người nhận (*)': 'RECEIVER_PHONE',
  'Địa chỉ nhận (*)': 'RECEIVER_ADDRESS',
  'Tên hàng hóa (*)': 'PRODUCT_NAME',
  'Số lượng': 'PRODUCT_QUANTITY',
  'Trọng lượng (gram)  (*)': 'PRODUCT_WEIGHT',
  'Giá trị hàng (VND) (*)': 'PRODUCT_PRICE',
  'Tiền thu hộ COD (VND)': 'MONEY_COLLECTION',
  'Loại hàng hóa (*)': 'PRODUCT_TYPE',
  'Tính chất hàng hóa đặc biệt': 'PRODUCT_DESCRIPTION',
  'Dịch vụ  (*)': 'ORDER_SERVICE',
  'Dịch vụ cộng thêm': 'ORDER_SERVICE_ADD',
  'Thu tiền xem hàng': 'ORDER_VOUCHER',
  'Dài (cm)': 'PRODUCT_LENGTH',
  'Rộng (cm)': 'PRODUCT_WIDTH',
  'Cao (cm)': 'PRODUCT_HEIGHT',
  'Người trả cước': 'ORDER_PAYMENT',
  'Yêu cầu khác': 'ORDER_NOTE',
}

const orderObject = () => {
  return {
    ORDER_NUMBER: '',
    SENDER_FULLNAME: authStore.user?.name,
    SENDER_ADDRESS: authStore.userAddress[0].address,
    SENDER_PHONE: '',
    RECEIVER_FULLNAME: '',
    RECEIVER_ADDRESS: '',
    RECEIVER_PHONE: '',
    PRODUCT_NAME: '',
    PRODUCT_DESCRIPTION: '',
    PRODUCT_QUANTITY: 1,
    PRODUCT_PRICE: 0,
    PRODUCT_WEIGHT: 0,
    PRODUCT_LENGTH: 0,
    PRODUCT_WIDTH: 0,
    PRODUCT_HEIGHT: 0,
    PRODUCT_TYPE: '',
    ORDER_PAYMENT: '',
    ORDER_SERVICE: '',
    ORDER_SERVICE_ADD: '',
    ORDER_VOUCHER: '',
    ORDER_NOTE: '',
    MONEY_COLLECTION: '',
    MONEY_TOTALFEE: 0,
    MONEY_FEECOD: 0,
    MONEY_FEEVAS: 0,
    MONEY_FEEINSURRANCE: 0,
    MONEY_FEE: 0,
    MONEY_FEEOTHER: 0,
    MONEY_TOTALVAT: 0,
    MONEY_TOTAL: 0,
    LIST_ITEM: [],
  }
}

const orderObjectMapper = (row) => {
  const ret = orderObject()
  Object.keys(mapObjectKey).forEach((key) => {
    ret[mapObjectKey[key]] = row[key]
    ret['VERIFY_ID'] = row['VERIFY_ID']
    ret['VERIFY_STATE'] = 'PENDING'
  })

  Object.keys(ret).forEach((key) => {
    //determine order payment
    if (
      key === 'ORDER_PAYMENT' &&
      ret.MONEY_COLLECTION &&
      ret['ORDER_PAYMENT'] === 'Người nhận trả'
    ) {
      ret['ORDER_PAYMENT'] = 2
    } else if (
      key === 'ORDER_PAYMENT' &&
      ret.MONEY_COLLECTION &&
      ret['ORDER_PAYMENT'] === 'Người gửi trả'
    ) {
      ret['ORDER_PAYMENT'] = 3
    } else if (
      key === 'ORDER_PAYMENT' &&
      !ret.MONEY_COLLECTION &&
      ret['ORDER_PAYMENT'] === 'Người gửi trả'
    ) {
      ret['ORDER_PAYMENT'] = 1
    } else if (
      key === 'ORDER_PAYMENT' &&
      !ret.MONEY_COLLECTION &&
      ret['ORDER_PAYMENT'] === 'Người nhận trả'
    ) {
      ret['ORDER_PAYMENT'] = 4
    }

    //determine order service
    if (key === 'ORDER_SERVICE') {
      ret['ORDER_SERVICE'] = ret['ORDER_SERVICE'].split(' ')[0] || 'VCN'
    }

    //determine product type
    if (key === 'PRODUCT_TYPE') {
      ret['PRODUCT_TYPE'] = ret['PRODUCT_TYPE'] === 'Tài liệu' ? 'TL' : 'HH'
    }

    //determine type
    if (!ret['TYPE']) {
      ret['TYPE'] = 1
    }
  })
  return ret
}

const orderDataBuild = () => {
  const orders = excelData.value.map((row) => {
    if (row['Loại hàng hóa (*)'] === '') {
      row['Loại hàng hóa (*)'] = 'Bưu kiện'
    }
    return orderObjectMapper(row)
  })
  orderData.value = orders
}

const verifyOrders = async () => {
  const tasks = orderData.value.map((order, index) => {
    return api
      .post('/connector/viettelpost/price-nlp', { data: order })
      .then((res) => ({ res, index }))
      .catch((err) => ({ err, index }))
  })

  const results = await Promise.allSettled(tasks)

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { res, index } = result.value

      if (!res.data.data.error) {
        excelData.value[index]['VERIFY_STATE'] = 'SUCCESS'
        excelData.value[index]['TOTAL_MONEY'] = res.data.data.data.MONEY_TOTAL
        orderData.value[index] = { ...orderData.value[index], ...res.data.data.data }
        orderData.value[index]['VERIFY_STATE'] = 'SUCCESS'
      } else {
        excelData.value[index]['VERIFY_STATE'] = 'FAILED'
      }
    } else {
      // rejected → error
      const { err, index } = result.reason
      excelData.value[index]['VERIFY_STATE'] = 'FAILED'
    }
  })
  isVerify.value = true
}

const createOrders = async () => {
  const orders = orderData.value.filter((order) => {
    if(order.VERIFY_STATE === 'SUCCESS'){
      return order
    }
  })
  const tasks = orders.map((order, index) => {
    console.log(order)
    return api
      .post('/connector/viettelpost/order/create-nlp', { data: order })
      .then((res) => ({ res, index }))
      .catch((err) => ({ err, index }))
  })

  const results = await Promise.allSettled(tasks)

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { res, index } = result.value
      if(res.data.success){
        excelData.value[index]['VERIFY_STATE'] = 'CREATED'
      }
    } else {
      console.log(result.reason)
    }
  })
}

watch(excelData, () => {
  if (excelData.value.length) {
    orderDataBuild()
  }
})
</script>
