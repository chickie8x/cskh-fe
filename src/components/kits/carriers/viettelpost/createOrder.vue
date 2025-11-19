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
          <div class="grid grid-cols-2 gap-6 mt-4">
            <div class="flex flex-col gap-1">
              <Label for="name">{{ t('senderName') }} <span class="text-red-500">*</span></Label>
              <Input
                v-model="orderObject.SENDER_FULLNAME"
                type="text"
                class="border-transparent bg-muted"
                :class="{ 'border-red-500': senderNameFlag }"
                @input="senderNameFlag = false"
              />
            </div>
            <div class="flex flex-col gap-1">
              <Label for="phone">{{ t('senderPhone') }} <span class="text-red-500">*</span></Label>
              <Input
                v-model="orderObject.SENDER_PHONE"
                type="text"
                class="border-transparent bg-muted"
                :class="{ 'border-red-500': senderPhoneFlag }"
                @input="senderPhoneFlag = false"
              />
            </div>
            <div>
              <Label for="province"
                >{{ t('selectProvincePlaceHolder') }} <span class="text-red-500">*</span></Label
              >

              <Select v-model="orderObject.SENDER_PROVINCE">
                <SelectTrigger
                  class="border-transparent w-full bg-muted"
                  :class="{ 'border-red-500': senderProvinceFlag }"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="border-transparent">
                  <SelectItem
                    v-for="province in provinces"
                    :key="province.PROVINCE_ID"
                    :value="province.PROVINCE_ID"
                    >{{ province.PROVINCE_NAME }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="district"
                >{{ t('selectDistrictPlaceHolder') }} <span class="text-red-500">*</span></Label
              >
              <Select v-model="orderObject.SENDER_DISTRICT">
                <SelectTrigger
                  class="border-transparent w-full bg-muted"
                  :class="{ 'border-red-500': senderDistrictFlag }"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="border-transparent">
                  <SelectItem
                    v-for="district in senderDistricts"
                    :key="district.DISTRICT_ID"
                    :value="district.DISTRICT_ID"
                    >{{ district.DISTRICT_NAME }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="ward"
                >{{ t('selectWardPlaceHolder') }} <span class="text-red-500">*</span></Label
              >
              <Select v-model="orderObject.SENDER_WARD">
                <SelectTrigger
                  class="border-transparent w-full bg-muted"
                  :class="{ 'border-red-500': senderWardFlag }"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent class="border-transparent">
                  <SelectItem
                    v-for="ward in senderWards"
                    :key="ward.WARDS_ID"
                    :value="ward.WARDS_ID"
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
                v-model="orderObject.SENDER_ADDRESS"
                class="w-full border-transparent bg-muted"
                :class="{ 'border-red-500': senderAddressFlag }"
                type="text"
                @input="senderAddressFlag = false"
              />
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

              <Select v-model="orderObject.RECEIVER_PROVINCE">
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
                    :value="province.PROVINCE_ID"
                    >{{ province.PROVINCE_NAME }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="district"
                >{{ t('selectDistrictPlaceHolder') }} <span class="text-red-500">*</span></Label
              >
              <Select v-model="orderObject.RECEIVER_DISTRICT">
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
                    :value="district.DISTRICT_ID"
                    >{{ district.DISTRICT_NAME }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="ward"
                >{{ t('selectWardPlaceHolder') }} <span class="text-red-500">*</span></Label
              >
              <Select v-model="orderObject.RECEIVER_WARD">
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
                    :value="ward.WARDS_ID"
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
                v-model="orderObject.RECEIVER_ADDRESS"
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
            <div class="flex justify-between gap-2 text-sm w-full mt-1">
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
          <div class="flex items-center gap-2 text-sm">
            <span class="font-medium">{{ t('expectTimeDelivery') }}</span>
            <span class="font-bold">{{ orderService?.THOI_GIAN }}</span>
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
                    :disabled="!isCod"
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

const { t } = useI18n()

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
const senderNameFlag = ref(false)
const senderPhoneFlag = ref(false)
const senderAddressFlag = ref(false)
const senderDistrictFlag = ref(false)
const senderWardFlag = ref(false)
const senderProvinceFlag = ref(false)
const receiverNameFlag = ref(false)
const receiverPhoneFlag = ref(false)
const receiverAddressFlag = ref(false)
const receiverDistrictFlag = ref(false)
const receiverWardFlag = ref(false)
const receiverProvinceFlag = ref(false)

//check fields required
const checkRequiredFields = () => {
  if (orderObject.value.SENDER_FULLNAME === '') {
    senderNameFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.SENDER_PHONE === '') {
    senderPhoneFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.SENDER_ADDRESS === '') {
    senderAddressFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.SENDER_DISTRICT === '') {
    senderDistrictFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.SENDER_WARD === '') {
    senderWardFlag.value = true
    toast.error(t('requiredFieldsMissing'))
    return false
  }
  if (orderObject.value.SENDER_PROVINCE === '') {
    senderProvinceFlag.value = true
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
const senderDistricts = ref([])
const receiverDistricts = ref([])
const senderWards = ref([])
const receiverWards = ref([])
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
    return orderPaymentPerson.value === 'sender' ? 1 : 1
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
  GROUPADDRESS_ID: 0,
  CUS_ID: 0,
  DELIVERY_DATE: '',
  SENDER_FULLNAME: '',
  SENDER_ADDRESS: '',
  SENDER_PHONE: '',
  SENDER_EMAIL: '',
  SENDER_WARD: 0,
  SENDER_DISTRICT: 0,
  SENDER_PROVINCE: 0,
  SENDER_LATITUDE: 0,
  SENDER_LONGITUDE: 0,
  RECEIVER_FULLNAME: '',
  RECEIVER_ADDRESS: '',
  RECEIVER_PHONE: '',
  RECEIVER_EMAIL: '',
  RECEIVER_WARD: 0,
  RECEIVER_DISTRICT: 0,
  RECEIVER_PROVINCE: 0,
  RECEIVER_LATITUDE: 0,
  RECEIVER_LONGITUDE: 0,
  PRODUCT_NAME: '',
  PRODUCT_DESCRIPTION: '',
  PRODUCT_QUANTITY: 1,
  PRODUCT_PRICE: 0,
  PRODUCT_WEIGHT: 0,
  PRODUCT_LENGTH: 0,
  PRODUCT_WIDTH: 0,
  PRODUCT_HEIGHT: 0,
  PRODUCT_TYPE: productType.value,
  ORDER_PAYMENT: orderPaymentCode.value,
  ORDER_SERVICE: orderService.value,
  ORDER_SERVICE_ADD: '',
  ORDER_VOUCHER: '',
  ORDER_NOTE: '',
  MONEY_COLLECTION: moneyCollection.value,
  MONEY_TOTALFEE: 0,
  MONEY_FEECOD: 0,
  MONEY_FEEVAS: 0,
  MONEY_FEEINSURRANCE: 0,
  MONEY_FEE: 0,
  MONEY_FEEOTHER: 0,
  MONEY_TOTALVAT: 0,
  MONEY_TOTAL: 0,
  LIST_ITEM: productList.value,
})

const getServiceObject = ref({
  SENDER_PROVINCE: orderObject.value.SENDER_PROVINCE,
  SENDER_DISTRICT: orderObject.value.SENDER_DISTRICT,
  RECEIVER_PROVINCE: orderObject.value.RECEIVER_PROVINCE,
  RECEIVER_DISTRICT: orderObject.value.RECEIVER_DISTRICT,
  PRODUCT_TYPE: orderObject.value.PRODUCT_TYPE,
  PRODUCT_WEIGHT: orderObject.value.PRODUCT_WEIGHT,
  PRODUCT_PRICE: orderObject.value.PRODUCT_PRICE,
  MONEY_COLLECTION: orderObject.value.MONEY_COLLECTION,
  TYPE: orderObject.value.TYPE,
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
const getDistricts = async (provinceId, target) => {
  const maxTry = 5
  const delay = 1000
  try {
    const res = await api.get('/connector/viettelpost/districts', { params: { provinceId } })
    if (target === 'sender') {
      senderDistricts.value = res.data.data.data
    } else {
      receiverDistricts.value = res.data.data.data
    }
  } catch (error) {
    console.log(error)
    if (attemptDistricts < maxTry) {
      attemptDistricts++
      setTimeout(() => getDistricts(provinceId, target), delay)
    } else {
      toast.error('Failed to fetch districts')
      attemptDistricts = 0
    }
  }
}

let attemptWards = 0
const getWards = async (districtId, target) => {
  const maxTry = 5
  const delay = 1000
  try {
    const res = await api.get('/connector/viettelpost/wards', { params: { districtId } })
    if (target === 'sender') {
      senderWards.value = res.data.data.data
    } else {
      receiverWards.value = res.data.data.data
    }
  } catch (error) {
    console.log(error)
    if (attemptWards < maxTry) {
      attemptWards++
      setTimeout(() => getWards(districtId, target), delay)
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
    const res = await api.post('/connector/viettelpost/prices-all', {
      data: getServiceObject.value,
    })
    orderServices.value = res.data.data.filter(
      (service) =>
        service.MA_DV_CHINH === 'STK' ||
        service.MA_DV_CHINH === 'SHT' ||
        service.MA_DV_CHINH === 'SCN',
    )
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

watch(isCod, () => {
  orderPaymentPerson.value = 'sender'
})

watch(oderNote, () => {
  orderObject.value.ORDER_NOTE = oderNote.value
})

watch(productInfo, () => {
  orderObject.value.PRODUCT_PRICE = productInfo.value.totalProductPrice
  orderObject.value.PRODUCT_WEIGHT = productInfo.value.totalProductWeight
  orderObject.value.PRODUCT_NAME = productInfo.value.totalProducts
})

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
  orderObject.value.ORDER_SERVICE = orderService.value.MA_DV_CHINH
})

watch(
  () => orderObject.value.SENDER_PROVINCE,
  (newVal, oldVal) => {
    getDistricts(newVal, 'sender')
  },
)

watch(
  () => orderObject.value.SENDER_DISTRICT,
  (newVal, oldVal) => {
    getWards(newVal, 'sender')
  },
)

watch(
  () => orderObject.value.RECEIVER_PROVINCE,
  (newVal, oldVal) => {
    getDistricts(newVal, 'receiver')
  },
)

watch(
  () => orderObject.value.RECEIVER_DISTRICT,
  (newVal, oldVal) => {
    getWards(newVal, 'receiver')
  },
)

watch(productType, () => {
  orderObject.value.PRODUCT_TYPE = productType.value
})

watch(orderPaymentCode, () => {
  orderObject.value.ORDER_PAYMENT = orderPaymentCode.value
})

watch(
  () => [
    orderObject.value.SENDER_PROVINCE,
    orderObject.value.SENDER_DISTRICT,
    orderObject.value.RECEIVER_PROVINCE,
    orderObject.value.RECEIVER_DISTRICT,
    orderObject.value.PRODUCT_TYPE,
    orderObject.value.PRODUCT_WEIGHT,
    orderObject.value.PRODUCT_PRICE,
  ],
  async () => {
    if (
      orderObject.value.SENDER_PROVINCE &&
      orderObject.value.SENDER_DISTRICT &&
      orderObject.value.RECEIVER_PROVINCE &&
      orderObject.value.RECEIVER_DISTRICT &&
      orderObject.value.PRODUCT_TYPE &&
      orderObject.value.PRODUCT_WEIGHT
    ) {
      getServiceObject.value = {
        SENDER_PROVINCE: orderObject.value.SENDER_PROVINCE,
        SENDER_DISTRICT: orderObject.value.SENDER_DISTRICT,
        RECEIVER_PROVINCE: orderObject.value.RECEIVER_PROVINCE,
        RECEIVER_DISTRICT: orderObject.value.RECEIVER_DISTRICT,
        PRODUCT_TYPE: orderObject.value.PRODUCT_TYPE,
        PRODUCT_WEIGHT: orderObject.value.PRODUCT_WEIGHT,
      }
      console.log(getServiceObject.value)
      try {
        await getServices()
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message||'Lỗi khi load dịch vụ')
      }
    }
  },
)

onMounted(async () => {
  getProvinces()
})
</script>
