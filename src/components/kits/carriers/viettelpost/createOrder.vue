<template>
  <div class="flex flex-col gap-4 w-full h-full relative">
    <div class="flex justify-end items-center">
      <span class="text-red-500 text-sm">{{ t('requiredFields') }}</span>
    </div>
    <div class="flex gap-4">
      <div class="w-full flex flex-col gap-4">
        <!-- sender -->
        <div
          class="bg-white dark:bg-card shadow-sm rounded-md overflow-hidden flex flex-col space-y-2 p-4"
        >
          <div class="flex items-center gap-2">
            <User class="w-5 h-5 text-indigo-500" />
            <span class="font-medium">{{ t('senderTitle') }}</span>
          </div>
          <div class="mt-4">
            <span class="text-sm font-semibold">{{ t('sender') }}</span>
            <Select v-model="selectedSenderAddress" :disabled="!senderAddresses.length">
              <SelectTrigger>
                <SelectValue placeholder="Chọn địa chỉ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="address in senderAddresses"
                  :key="address.id"
                  :value="address.address"
                >
                  {{ `${senderName} - ${senderPhone} - ${address?.address}` }}
                </SelectItem>
              </SelectContent>
            </Select>
            <div
              v-if="!senderAddresses.length"
              class="flex items-center gap-1 text-red-500 text-sm py-2"
            >
              <TriangleAlert class="size-4" /> {{ t('emptySenderAddress') }}
            </div>
          </div>
        </div>

        <!-- receiver -->
        <div
          class="bg-white dark:bg-card shadow-sm rounded-md overflow-hidden flex flex-col space-y-2 p-4"
        >
          <div class="flex items-center gap-2">
            <User class="w-5 h-5 text-indigo-500" />
            <span class="font-medium">{{ t('receiverTitle') }}</span>
          </div>
          <div class="grid grid-cols-2 gap-6 mt-4">
            <div class="flex flex-col gap-1">
              <Label for="name">{{ t('receiverName') }} <span class="text-red-500">*</span></Label>
              <Input
                v-model="orderObject.RECEIVER_FULLNAME"
                type="text"
                class="border-transparent bg-muted"
                :class="{ 'border-red-500': receiverNameFlag }"
                @input="receiverNameFlag = false"
              />
            </div>
            <div class="flex flex-col gap-1">
              <Label for="phone">{{ t('receiverPhone') }}</Label>
              <Input
                v-model="orderObject.RECEIVER_PHONE"
                type="text"
                class="border-transparent bg-muted"
                :class="{ 'border-red-500': receiverPhoneFlag }"
                @input="receiverPhoneFlag = false"
              />
            </div>
            <div>
              <Label for="province"
                >{{ t('selectProvincePlaceHolder') }} <span class="text-red-500">*</span></Label
              >

              <Select v-model="receiverProvince">
                <SelectTrigger
                  class="border-transparent w-full bg-muted"
                  :class="{ 'border-red-500': receiverProvinceFlag }"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="border-transparent">
                  <SelectItem
                    v-for="province in provinces"
                    :key="province.PROVINCE_ID"
                    :value="province.PROVINCE_NAME"
                    >{{ province.PROVINCE_NAME }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="district"
                >{{ t('selectDistrictPlaceHolder') }} <span class="text-red-500">*</span></Label
              >
              <Select v-model="receiverDistrict">
                <SelectTrigger
                  class="border-transparent w-full bg-muted"
                  :class="{ 'border-red-500': receiverDistrictFlag }"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="border-transparent">
                  <SelectItem
                    v-for="district in receiverDistricts"
                    :key="district.DISTRICT_ID"
                    :value="district.DISTRICT_NAME"
                    >{{ district.DISTRICT_NAME }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="ward"
                >{{ t('selectWardPlaceHolder') }} <span class="text-red-500">*</span></Label
              >
              <Select v-model="receiverWard">
                <SelectTrigger
                  class="border-transparent w-full bg-muted"
                  :class="{ 'border border-red-500': receiverWardFlag }"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="border-transparent">
                  <SelectItem
                    v-for="ward in receiverWards"
                    :key="ward.WARDS_ID"
                    :value="ward.WARDS_NAME"
                    >{{ ward.WARDS_NAME }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="street"
                >{{ t('selectStreetOrSubWard') }} <span class="text-red-500">*</span></Label
              >
              <Input
                v-model="receiverStreet"
                class="w-full border-transparent bg-muted"
                type="text"
                :class="{ 'border-red-500': receiverAddressFlag }"
                @input="receiverAddressFlag = false"
              />
            </div>
          </div>
        </div>

        <!-- choose service -->
        <div
          class="bg-white dark:bg-card shadow-sm rounded-md overflow-hidden flex flex-col space-y-2 p-4"
        >
          <div class="flex items-center gap-2">
            <Truck class="w-5 h-5 text-indigo-500" />
            <span class="font-medium">{{ t('chooseService') }}</span>
          </div>
          <div>
            <span>{{ t('mainServices') }}</span>
            <div class="grid grid-cols-3 gap-2 text-sm w-full mt-1">
              <div
                v-for="service in orderServices"
                :key="service.MA_DV_CHINH"
                class="flex items-center gap-1"
              >
                <input
                  v-model="orderService"
                  :value="service"
                  type="radio"
                  name="orderServices"
                  :id="service.MA_DV_CHINH"
                />
                <label :for="service.MA_DV_CHINH">{{ service.TEN_DICHVU }}</label>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col gap-2 text-sm mt-4 border-t pt-2 border-border"
            v-if="orderService"
          >
            <div class="flex items-center">
              <Clock class="w-4 h-4 text-indigo-500 mr-1" />
              <span>{{ t('expectTimeDelivery') }}:</span>
              <span class="font-bold block ml-2">{{ orderService?.THOI_GIAN }}</span>
            </div>
            <div class="flex items-center">
              <DollarSign class="w-4 h-4 text-indigo-500 mr-1" />
              <span>{{ t('totalOrderFee') }}:</span>
              <span class="font-bold block ml-2">{{ formatCurrency(orderService?.GIA_CUOC) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- column 2 -->
      <div class="w-full max-w-lg">
        <!-- product detail -->
        <div class="flex flex-col gap-4 w-full p-4 bg-white dark:bg-card shadow-sm rounded-md">
          <div class="flex items-center gap-2">
            <Package class="w-5 h-5 text-indigo-500" />
            <h2 class="font-medium">{{ t('productDetail') }}</h2>
          </div>
          <div class="flex flex-col gap-2 border-b border-border py-4">
            <span class="font-medium">{{ t('goodType') }}</span>
            <div class="flex gap-8 text-sm">
              <div class="flex items-center gap-2" v-for="item in productTypes" :key="item.id">
                <label :for="item.value">{{ item.name }}</label>
                <input
                  v-model="productType"
                  :value="item.value"
                  class="scale-110"
                  type="radio"
                  name="goodType"
                  :id="item.value"
                  :checked="item.checked"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 text-sm py-4">
            <div
              v-for="(product, index) in productList"
              :key="index"
              class="py-6 border-b border-border"
            >
              <div>
                <label for="productName"
                  >{{ t('productName') }} <span class="text-red-500">*</span></label
                >
                <Input
                  v-model="product.productName"
                  type="text"
                  class="border-transparent bg-muted shadow-sm"
                />
              </div>
              <div class="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <label for="quantity"
                    >{{ t('productQuantity') }} <span class="text-red-500">*</span></label
                  >
                  <div class="flex items-center gap-2 relative">
                    <SquareSigma class="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2" />
                    <Input
                      v-model="product.productQuantity"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      class="border-transparent bg-muted pl-8 shadow-sm"
                      @input="onlyNumbers"
                    />
                  </div>
                </div>
                <div>
                  <label for="length"
                    >{{ t('productWeight') }} <span class="text-red-500">*</span></label
                  >
                  <div class="flex items-center gap-2 relative">
                    <Weight class="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2" />
                    <Input
                      v-model="product.productWeight"
                      type="text"
                      inputmode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      class="border-transparent bg-muted pl-8 shadow-sm"
                      @input="onlyNumbers"
                    />
                  </div>
                </div>
                <div>
                  <label for="width">{{ t('productCost') }}</label>
                  <div class="flex items-center gap-2 relative">
                    <Banknote class="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2" />
                    <Input
                      v-model="product.productPrice"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      class="border-transparent bg-muted pl-8 shadow-sm"
                      @input="onlyNumbers"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <Button @click="addProduct" variant="default"> <Plus /> {{ t('addProduct') }}</Button>
          </div>
          <div class="mt-4 flex flex-col gap-2 border-y border-border py-4">
            <div class="flex justify-between">
              <span class="text-sm">{{ t('totalWeight') }}g</span>
              <span class="font-bold text-red-500"
                >{{
                  productInfo.totalProductWeight ? formatNumber(productInfo.totalProductWeight) : 0
                }}g</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-sm">{{ t('totalCost') }}</span>
              <span class="font-bold text-red-500">{{
                productInfo.totalProductPrice ? formatCurrency(productInfo.totalProductPrice) : 0
              }}</span>
            </div>
          </div>
          <div class="text-sm">
            <div class="flex items-center gap-2">
              <DiamondPercent class="w-5 h-5 text-indigo-500" />
              <span class="font-medium">{{ t('specialSpecs') }}</span>
            </div>
            <div class="grid grid-cols-3 gap-4 mt-2">
              <div
                class="flex items-center gap-2"
                v-for="specialSpec in specialSpecs"
                :key="specialSpec.id"
              >
                <Input
                  v-model="specialSpec.value"
                  class="w-4 h-4"
                  type="checkbox"
                  :id="specialSpec.name"
                />
                <Label class="hover:text-indigo-500" :for="specialSpec.name">{{
                  t(specialSpec.name)
                }}</Label>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 border-t border-border py-4 text-sm">
            <div class="flex items-center gap-2">
              <RulerDimensionLine class="w-5 h-5 text-indigo-500" />
              <span>{{ t('productSize') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Input
                v-model="productLength"
                type="text"
                pattern="[0-9]*"
                :placeholder="t('productLengthPlaceholder')"
                class="border-transparent bg-muted"
                @input="onlyNumbers"
              />
              <Input
                v-model="productWidth"
                type="text"
                pattern="[0-9]*"
                :placeholder="t('productWidthPlaceholder')"
                class="border-transparent bg-muted"
                @input="onlyNumbers"
              />
              <Input
                v-model="productHeight"
                type="text"
                pattern="[0-9]*"
                :placeholder="t('productHeightPlaceholder')"
                class="border-transparent bg-muted"
                @input="onlyNumbers"
              />
            </div>
          </div>
        </div>

        <!-- COD -->
        <div class="p-4 bg-white flex flex-col gap- dark:bg-card shadow-sm rounded-md mt-4">
          <div class="flex flex-col gap-6">
            <div>
              <span class="font-medium">{{ t('cod') }}</span>
              <div class="flex items-center gap-1 text-xs text-indigo-500">
                <Info class="w-3 h-3" />
                <span>{{ t('codDescription') }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model="isCod"
                type="checkbox"
                class="border-transparent bg-muted w-4 h-4"
                id="cod"
              />
              <Label for="cod">{{ t('codByProductCost') }}</Label>
            </div>
            <div class="text-sm">
              <span class="font-medium">{{ t('payCostPerson') }}</span>
              <div class="flex items-center gap-6 mt-2">
                <div
                  v-for="paymentPerson in orderPaymentPeople"
                  :key="paymentPerson.id"
                  class="flex items-center gap-2"
                >
                  <input
                    type="radio"
                    v-model="orderPaymentPerson"
                    :value="paymentPerson.value"
                    class="w-4 h-4 cursor-pointer"
                    :id="paymentPerson.name"
                    name="codPaymentPerson"
                  />
                  <Label class="cursor-pointer" :for="paymentPerson.name">{{
                    t(paymentPerson.label)
                  }}</Label>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2 mt-4">
              <Label class="text-muted-foreground" for="note">{{ t('note') }}</Label>
              <textarea
                v-model="oderNote"
                type="text"
                class="p-4 border border-border rounded-md"
                id="note"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- sidebar bottom -->
    <div
      class="w-full h-24 grid grid-cols-6 divide-x divide-border bg-indigo-50 dark:bg-card sticky bottom-0 z-50 border border-border rounded-md"
    >
      <div class="flex flex-col px-4 justify-center gap-2">
        <span class="text-sm font-medium">
          {{ t('totalOrderFee') }}
        </span>
        <span class="font-bold text-red-500">
          {{ formatCurrency(orderService?.GIA_CUOC || 0) }}
        </span>
      </div>
      <div class="flex flex-col px-4 justify-center gap-2">
        <span class="text-sm font-medium">
          {{ t('totalCodFee') }}
        </span>
        <span class="font-bold text-red-500">
          {{ isCod ? formatCurrency(moneyCollection) : 0 }}
        </span>
      </div>
      <div class="flex flex-col px-4 justify-center gap-2">
        <span class="text-sm font-medium">
          {{ t('expectDeliverTime') }}
        </span>
        <span class="font-bold text-red-500"> {{ orderService?.THOI_GIAN || 0 }} </span>
      </div>
      <div class="col-span-3 flex items-center justify-center gap-4 px-4">
        <Button @click="createOrder" variant="default"><Send /> {{ t('createOrderNow') }}</Button>
        <Button variant="outline" disabled><SquarePen /> {{ t('saveDraftOrder') }}</Button>
        <Button variant="outline" disabled><RefreshCw /> {{ t('refreshOrderForm') }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Package,
  SquareSigma,
  Truck,
  User,
  Weight,
  Plus,
  Banknote,
  DiamondPercent,
  RulerDimensionLine,
  Info,
  Send,
  SquarePen,
  RefreshCw,
  TriangleAlert,
  Clock,
  DollarSign,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'
import { onMounted, ref, watch, computed } from 'vue'
import api from '@/api/axios'
import { formatCurrency, formatNumber } from '@/utils/format'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { watchDebounced } from '@vueuse/core'

const authStore = useAuthStore()
const { t } = useI18n()
const senderAddresses = ref(authStore.userAddress || [])
const selectedSenderAddress = ref(senderAddresses.value[0]?.address || '')
const senderName = ref(authStore.user?.name || '')
const senderPhone = ref(authStore.user?.phone || '')

const onlyNumbers = (event) => {
  const input = event.target
  input.value = input.value.replace(/[^0-9.]/g, '')
}

const specialSpecs = ref([
  {
    id: 1,
    name: 'highValueProduct',
    value: 'highValueProduct',
    checked: false,
  },
  {
    id: 2,
    name: 'overSizeProduct',
    value: 'overSizeProduct',
    checked: false,
  },
  {
    id: 3,
    name: 'fragileRiskProduct',
    value: 'fragileRiskProduct',
    checked: false,
  },
  {
    id: 4,
    name: 'liquidProduct',
    value: 'liquidProduct',
    checked: false,
  },
  {
    id: 5,
    name: 'magBatteryProduct',
    value: 'magBatteryProduct',
    checked: false,
  },
  {
    id: 6,
    name: 'oneBlockProduct',
    value: 'oneBlockProduct',
    checked: false,
  },
])

const productTypes = [
  {
    id: 1,
    name: 'Bưu phẩm',
    value: 'HH',
    checked: true,
  },
  {
    id: 2,
    name: 'Tài liệu',
    value: 'TH',
    checked: false,
  },
]

const orderPaymentPeople = [
  {
    id: 1,
    name: 'senderPay',
    label: 'senderPay',
    value: 'sender',
  },
  {
    id: 2,
    name: 'receiverPay',
    label: 'receiverPay',
    value: 'receiver',
  },
]

//fields required flags
const receiverNameFlag = ref(false)
const receiverPhoneFlag = ref(false)
const receiverAddressFlag = ref(false)
const receiverDistrictFlag = ref(false)
const receiverWardFlag = ref(false)
const receiverProvinceFlag = ref(false)

//check fields required
const checkRequiredFields = () => {
  if (!selectedSenderAddress.value) {
    toast.error(t('requiredFieldsMissing'))
    return false
  }

  if (orderObject.value.RECEIVER_FULLNAME === '') {
    receiverNameFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.RECEIVER_PHONE === '') {
    receiverPhoneFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.RECEIVER_ADDRESS === '') {
    receiverAddressFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.RECEIVER_DISTRICT === '') {
    receiverDistrictFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.RECEIVER_WARD === '') {
    receiverWardFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.RECEIVER_PROVINCE === '') {
    receiverProvinceFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  return true
}

const orderServices = ref([])
const orderService = ref(null)
const provinces = ref([])
const receiverProvince = ref(null)
const receiverDistricts = ref([])
const receiverDistrict = ref(null)
const receiverWards = ref([])
const receiverWard = ref(null)
const receiverStreet = ref('')
const receiverAddress = ref('')
const oderNote = ref('')
const productType = ref(productTypes[0].value)
const productWidth = ref(0)
const productHeight = ref(0)
const productLength = ref(0)
const productList = ref([
  {
    productName: '',
    productQuantity: 1,
    productPrice: 0,
    productWeight: 0,
  },
])
const addProduct = () => {
  productList.value.push({
    productName: '',
    productQuantity: 1,
    productPrice: 0,
    productWeight: 0,
  })
}
const orderPaymentPerson = ref(orderPaymentPeople[0].value)
const productPrice = ref(0)
const isCod = ref(false)
const orderPaymentCode = computed(() => {
  if (isCod.value) {
    return orderPaymentPerson.value === 'sender' ? 3 : 2
  } else {
    return orderPaymentPerson.value === 'sender' ? 1 : 4
  }
})

const moneyCollection = computed(() => {
  if (isCod.value) {
    return productInfo.value.totalProductPrice
  } else {
    return 0
  }
})

const productInfo = computed(() => {
  const result = {
    totalProducts: '',
    totalProductPrice: 0,
    totalProductWeight: 0,
  }
  productList.value.forEach((product) => {
    result.totalProducts += product.productName + ', '
    result.totalProductPrice += parseInt(
      parseInt(product.productPrice) * parseInt(product.productQuantity),
    )
    result.totalProductWeight += parseInt(
      parseInt(product.productWeight) * parseInt(product.productQuantity),
    )
  })
  return result
})

const orderObject = ref({
  ORDER_NUMBER: '',
  SENDER_FULLNAME: senderName.value,
  SENDER_ADDRESS: selectedSenderAddress.value,
  SENDER_PHONE: senderPhone.value,
  RECEIVER_FULLNAME: '',
  RECEIVER_ADDRESS: '',
  RECEIVER_PHONE: '',
  PRODUCT_NAME: '',
  PRODUCT_QUANTITY: 1,
  PRODUCT_PRICE: 0,
  PRODUCT_WEIGHT: 0,
  PRODUCT_LENGTH: 0,
  PRODUCT_WIDTH: 0,
  PRODUCT_HEIGHT: 0,
  PRODUCT_TYPE: productType.value,
  ORDER_PAYMENT: orderPaymentCode.value,
  ORDER_SERVICE: orderService.value,
  ORDER_SERVICE_ADD: null,
  ORDER_NOTE: '',
  MONEY_COLLECTION: moneyCollection.value,
  MONEY_FEEINSURRANCE: 0,
  MONEY_TOTAL: 0,
  PRODUCT_DETAIL: productList.value,
})

const getServiceObject = ref({
  SENDER_ADDRESS: selectedSenderAddress.value,
  RECEIVER_ADDRESS: receiverAddress.value,
  PRODUCT_TYPE: orderObject.value.PRODUCT_TYPE,
  PRODUCT_WEIGHT: orderObject.value.PRODUCT_WEIGHT,
  PRODUCT_PRICE: orderObject.value.PRODUCT_PRICE,
  MONEY_COLLECTION: orderObject.value.MONEY_COLLECTION,
  PRODUCT_HEIGHT: orderObject.value.PRODUCT_HEIGHT,
  PRODUCT_WIDTH: orderObject.value.PRODUCT_WIDTH,
  PRODUCT_LENGTH: orderObject.value.PRODUCT_LENGTH,
  TYPE: orderObject.value.TYPE || 1,
})

let attemptProvinces = 0
const getProvinces = async () => {
  const maxTry = 5
  const delay = 1000
  try {
    const res = await api.get('/connector/viettelpost/provinces')
    provinces.value = res.data.data.data
    attemptProvinces = 0
  } catch (error) {
    console.log(error)
    if (attemptProvinces < maxTry) {
      attemptProvinces++
      setTimeout(() => getProvinces(), delay)
    } else {
      toast.error('Failed to fetch provinces')
      attemptProvinces = 0
    }
  }
}

let attemptDistricts = 0
const getDistricts = async (provinceId) => {
  const maxTry = 5
  const delay = 1000
  try {
    const res = await api.get('/connector/viettelpost/districts', { params: { provinceId } })
    receiverDistricts.value = res.data.data.data
  } catch (error) {
    console.log(error)
    if (attemptDistricts < maxTry) {
      attemptDistricts++
      setTimeout(() => getDistricts(provinceId), delay)
    } else {
      toast.error('Failed to fetch districts')
      attemptDistricts = 0
    }
  }
}

let attemptWards = 0
const getWards = async (districtId) => {
  const maxTry = 5
  const delay = 1000
  try {
    const res = await api.get('/connector/viettelpost/wards', { params: { districtId } })
    receiverWards.value = res.data.data.data
  } catch (error) {
    console.log(error)
    if (attemptWards < maxTry) {
      attemptWards++
      setTimeout(() => getWards(districtId), delay)
    } else {
      toast.error('Failed to fetch wards')
      attemptWards = 0
    }
  }
}

let attemptServices = 0
const getServices = async () => {
  const maxTry = 5
  const delay = 1000
  try {
    const res = await api.post('/connector/viettelpost/price-all-nlp', {
      data: getServiceObject.value,
    })
    if (!res.data.data.error) {
      orderServices.value = res.data.data.RESULT
    }
    console.log(orderServices.value)
  } catch (error) {
    console.log(error)
    if (attemptServices < maxTry - 1) {
      setTimeout(() => getServices(attemptServices + 1), delay)
    } else {
      toast.error('Failed to fetch services')
      attemptServices = 0
    }
  }
}

let attemptCreateOrder = 0
const createOrder = async () => {
  if (!checkRequiredFields()) return
  const maxTry = 5
  const delay = 1000
  try {
    const res = await api.post('/connector/viettelpost/order/create', { data: orderObject.value })
    console.log(res.data)
    toast.success(t('createOrderSuccessMessage'))
  } catch (error) {
    console.log(error)
    if (attemptCreateOrder < maxTry) {
      attemptCreateOrder++
      setTimeout(() => createOrder(), delay)
    } else {
      toast.error(t('createOrderFailedMessage'))
      attemptCreateOrder = 0
    }
  }
}

const checkgetServices = () => {
  if (
    !receiverProvince.value ||
    !receiverDistrict.value ||
    !receiverWard.value ||
    !receiverStreet.value
  )
    return
  receiverAddress.value = `${receiverStreet.value}, ${receiverWard.value}, ${receiverDistrict.value}, ${receiverProvince.value}`
  orderObject.value.RECEIVER_ADDRESS = receiverAddress.value
  getServiceObject.value.RECEIVER_ADDRESS = receiverAddress.value
  getServiceObject.value.PRODUCT_TYPE = productType.value
  getServiceObject.value.PRODUCT_WEIGHT = productInfo.value.totalProductWeight
  getServiceObject.value.PRODUCT_PRICE = productInfo.value.totalProductPrice
  const fields = ['SENDER_ADDRESS', 'RECEIVER_ADDRESS', 'PRODUCT_TYPE', 'PRODUCT_WEIGHT']
  const isAllFilled = fields.every((field) => getServiceObject.value[field])
  if (isAllFilled) {
    getServices()
  } else {
    console.log('not all filled')
    return
  }
}

watch(isCod, () => {
  orderPaymentPerson.value = 'sender'
})

watch(oderNote, () => {
  orderObject.value.ORDER_NOTE = oderNote.value
})

watchDebounced(
  productInfo,
  () => {
    orderObject.value.PRODUCT_PRICE = productInfo.value.totalProductPrice
    orderObject.value.PRODUCT_WEIGHT = productInfo.value.totalProductWeight
    orderObject.value.PRODUCT_NAME = productInfo.value.totalProducts
    checkgetServices()
  },
  { debounce: 500, maxWait: 1000 },
)

watch(moneyCollection, () => {
  orderObject.value.MONEY_COLLECTION = moneyCollection.value
})

watch(productPrice, () => {
  orderObject.value.PRODUCT_PRICE = productPrice.value
})

watch(productWidth, () => {
  orderObject.value.PRODUCT_WIDTH = productWidth.value
})

watch(productHeight, () => {
  orderObject.value.PRODUCT_HEIGHT = productHeight.value
})

watch(productLength, () => {
  orderObject.value.PRODUCT_LENGTH = productLength.value
})

watch(orderServices, () => {
  orderService.value = orderServices.value[0] || ''
})

watch(orderService, () => {
  orderObject.value.ORDER_SERVICE = orderService.value.MA_DV_CHINH || ''
})

watch(
  () => receiverProvince.value,
  (newVal, oldVal) => {
    const provinceId = provinces.value.find((item) => item.PROVINCE_NAME === newVal)?.PROVINCE_ID
    getDistricts(provinceId)
    checkgetServices()
  },
)

watch(
  () => receiverDistrict.value,
  (newVal, oldVal) => {
    const districtId = receiverDistricts.value.find(
      (item) => item.DISTRICT_NAME === newVal,
    )?.DISTRICT_ID
    getWards(districtId)
    checkgetServices()
  },
)

watch(receiverWard, () => {
  checkgetServices()
})

watch(receiverStreet, () => {
  checkgetServices()
})

watch(productType, () => {
  orderObject.value.PRODUCT_TYPE = productType.value
  checkgetServices()
})

watch(orderPaymentCode, () => {
  orderObject.value.ORDER_PAYMENT = orderPaymentCode.value
})

watch(
  orderObject.value,
  () => {
    // console.log(orderObject.value)
  },
  { deep: true },
)

onMounted(async () => {
  getProvinces()
})
</script>
