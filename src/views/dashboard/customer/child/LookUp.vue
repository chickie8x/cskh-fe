<template>
  <div class="h-full bg-gray-100 dark:bg-background p-4 overflow-y-auto">
    <div class="flex items-center mt-4">
      <button
        class="rounded-t-lg opacity-50 hover:opacity-100 transition"
        :class="
          currTab === 'lookup'
            ? 'bg-white dark:bg-card px-4 py-2 opacity-100'
            : 'bg-gray-100 dark:bg-card px-4 py-2'
        "
        @click="currTab = 'lookup'"
      >
        {{ t('lookUpAddress') }}
      </button>
      <button
        class="rounded-t-lg opacity-50 hover:opacity-100 transition"
        :class="
          currTab === 'verify'
            ? 'bg-white dark:bg-card px-4 py-2 opacity-100'
            : 'bg-gray-100 dark:bg-card px-4 py-2'
        "
        @click="currTab = 'verify'"
      >
        {{ t('verifyAddress') }}
      </button>
    </div>
    <div
      v-if="currTab === 'lookup'"
      class="flex flex-col space-y-4 bg-white dark:bg-card p-4 shadow-lg"
    >
      <h1 class="font-bold text-2xl">{{ t('lookUpAddress') }}</h1>
      <div class="flex items-center gap-4">
        <h2 class="font-bold">{{ t('method') }}</h2>
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-1">
            <input
              v-model="selectedMethod"
              class="scale-110"
              type="radio"
              id="method1"
              value="old-to-new"
              name="method"
              checked
            />
            <label for="method1">{{ t('oldToNew') }}</label>
          </div>
          <div class="flex items-center gap-1">
            <input
              v-model="selectedMethod"
              class="scale-110"
              type="radio"
              id="method2"
              value="new-to-old"
              name="method"
            />
            <label for="method2">{{ t('newToOld') }}</label>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <LocateFixed />
          <span>{{ t('address') }}</span>
        </div>

        <div v-if="errShow" class="w-fit">
          <Alert variant="destructive">
            <AlertCircle class="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription class="flex items-center gap-4">
              {{ t(errMessage) }}
              <Button variant="destructive" @click="retryFetch"
                ><Loader2 v-if="loading" class="w-4 h-4 animate-spin" />{{ t('tryAgain') }}</Button
              >
            </AlertDescription>
          </Alert>
        </div>

        <div class="grid grid-cols-2 gap-2 w-full max-w-[1024px]">
          <Select v-model="provinceId">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="t('selectProvincePlaceHolder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="item in provinces"
                  :key="item.PROVINCE_ID"
                  :value="item.PROVINCE_ID"
                  >{{ item.PROVINCE_NAME.toUpperCase() }}</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            v-if="selectedMethod === 'old-to-new'"
            v-model="districtId"
            :disabled="!provinceId"
          >
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="t('selectDistrictPlaceHolder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="item in districts"
                  :key="item.DISTRICT_ID"
                  :value="item.DISTRICT_ID"
                  >{{ item.DISTRICT_NAME.toUpperCase() }}</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            v-model="wardId"
            :disabled="
              (selectedMethod === 'old-to-new' && !districtId) ||
              (selectedMethod === 'new-to-old' && !provinceId)
            "
          >
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="t('selectWardPlaceHolder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in wards" :key="item.WARDS_ID" :value="item.WARDS_ID">{{
                  item.WARDS_NAME.toUpperCase()
                }}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input v-model="street" type="text" :placeholder="t('selectStreetOrSubWard')" />
        </div>
      </div>
      <Button variant="default" class="w-fit" @click="doVerify(address)"
        ><Loader2 v-if="verifyLoading" class="size-4 animate-spin" /><SearchCheck v-else />
        {{ t('convert') }}</Button
      >
      <div v-if="resultAddress">
        <h2 class="font-bold text-xl">{{ t('resultLookUp') }}:</h2>
        <div class="flex items-center gap-4 px-4 py-1 w-fit border border-border rounded">
          {{ resultAddress?.reference?.formattedAddress || 'Không xác minh được' }}
          <Copy class="w-4 h-4 opacity-50 hover:opacity-100 transition cursor-pointer" />
        </div>
      </div>
    </div>
    <div
      v-if="currTab === 'verify'"
      class="w-full flex flex-col space-y-4 bg-white dark:bg-card p-4 shadow-lg"
    >
      <div>
        <h1 class="font-bold text-2xl">{{ t('verifyAddress') }}</h1>
        <div class="flex items-center gap-8 mt-2">
          <div class="flex items-center gap-1">
            <input
              type="radio"
              v-model="addressMode"
              value="single"
              id="single"
              class="scale-110"
            />
            <label for="single">{{ t('singleAddress') }}</label>
          </div>
          <div class="flex items-center gap-1">
            <input
              type="radio"
              v-model="addressMode"
              value="multiple"
              id="multiple"
              class="scale-110"
            />
            <label for="multiple">{{ t('multipleAddress') }}</label>
          </div>
        </div>
      </div>
      <div v-if="addressMode === 'single'">
        <div class="flex items-center gap-2">
          <input
            class="h-9 px-2 border border-border rounded-md w-full max-w-[1024px] text-sm"
            type="text"
            :placeholder="t('enterAddress')"
            v-model="textAddress"
          />
          <Button variant="default" class="w-fit" @click="doVerifyNew"><SearchCheck /></Button>
        </div>
        <div v-if="resultTextAddress" class="mt-4">
          <h2 class="font-bold text-xl">{{ t('resultLookUp') }}:</h2>
          <div class="flex items-center gap-4 px-4 py-1 w-fit border border-border rounded">
            {{ resultTextAddress?.reference?.formattedAddress || 'Không xác minh được' }}
            <Copy class="w-4 h-4 opacity-50 hover:opacity-100 transition cursor-pointer" />
          </div>
        </div>
      </div>
      <div v-if="addressMode === 'multiple'">
        <div class="flex items-center gap-2">
          <input
            ref="fileInput"
            class="hidden"
            type="file"
            accept=".xlsx, .xls, .csv"
            @change="onFileChange"
          />
          <span v-if="fileName" class="text-gray-700 text-sm">{{ fileName }}</span>
          <Button variant="outline" class="w-fit ml-2" @click="loadFile"
            ><Plus /> {{ t('uploadExcel') }}</Button
          >
          <Button
            v-if="excelData.length && !isVerified"
            variant="default"
            class="w-fit ml-2"
            :disabled="verifyLoadingMulti"
            @click="doMultiVerify"
            ><ListCheck v-if="!verifyLoadingMulti" /> <Loader2 v-else class="animate-spin"
          /></Button>
          <Button variant="outline" class="w-fit ml-auto" @click="downloadTemplate"
            ><Download /> {{ t('downloadExcel') }}</Button
          >
        </div>
        <div v-if="excelData.length" class="mt-4">
          <Table :data="excelData" :tbHeader="tbHeaders" :action-col="false" :styling="styling" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Copy,
  LocateFixed,
  SearchCheck,
  AlertCircle,
  Loader2,
  Plus,
  ListCheck,
  Download,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getProvinces, getDistricts, getWards, verifyAddress, getWardsNew } from '@/api/lookup'
import { ref, watch, computed } from 'vue'
import { onMounted } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import * as XLSX from 'xlsx'
import Table from '@/components/kits/table/index.vue'
import { v4 as uuidv4 } from 'uuid'
import api from '@/api/axios.js'
import { toast } from 'vue-sonner'
import { chunkArray } from '@/utils/helper'

const errMessage = ref('loadingAddressFailed')
const errShow = ref(false)
const targetFn = ref('')
const loading = ref(false)
const verifyLoading = ref(false)
const currTab = ref('lookup')
const retryFetch = async () => {
  try {
    loading.value = true
    if (targetFn.value === 'province') {
      await fetchProvinces()
    } else if (targetFn.value === 'district') {
      await fetchDistrictsById(provinceId.value)
    } else if (targetFn.value === 'ward') {
      await fetchWardsByDistrictId(districtId.value)
    } else if (targetFn.value === 'wardNew') {
      await fetchWardsNewByProvinceId(provinceId.value)
    } else if (targetFn.value === 'verify') {
      await doVerify(address.value)
    }
    loading.value = false
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
const selectedMethod = ref('old-to-new')
const provinces = ref([])
const provinceId = ref('')
const provinceName = computed(() => {
  if (!provinces.value.length || !provinceId.value) return ''
  return (
    provinces.value?.find((province) => province.PROVINCE_ID === provinceId.value).PROVINCE_NAME ||
    ''
  )
})
const districts = ref([])
const districtId = ref('')
const districtName = computed(() => {
  if (!districts.value.length || !districtId.value) return ''
  return (
    districts.value?.find((district) => district.DISTRICT_ID === districtId.value).DISTRICT_NAME ||
    ''
  )
})
const wards = ref([])
const wardId = ref('')
const wardName = computed(() => {
  if (!wards.value.length || !wardId.value) return ''
  return wards.value?.find((ward) => ward.WARDS_ID === wardId.value).WARDS_NAME || ''
})
const address = computed(() => {
  return selectedMethod.value === 'old-to-new'
    ? `${street.value}, ${wardName.value}, ${districtName.value}, ${provinceName.value}`
    : `${street.value}, ${wardName.value}, ${provinceName.value}`
})
const resultAddress = ref('')
const street = ref('')
const { t } = useI18n()

const fetchProvinces = async () => {
  try {
    const response = await getProvinces()
    provinces.value = response.data
    errShow.value = false
  } catch (error) {
    console.error(error)
    errMessage.value = 'loadingAddressFailed'
    errShow.value = true
    targetFn.value = 'province'
  }
}
const fetchDistrictsById = async (provinceId) => {
  try {
    const response = await getDistricts(provinceId)
    districts.value = response.data
    errShow.value = false
  } catch (error) {
    console.error(error)
    errMessage.value = 'loadingAddressFailed'
    errShow.value = true
    targetFn.value = 'district'
  }
}

const fetchWardsByDistrictId = async (districtId) => {
  try {
    const response = await getWards(districtId)
    wards.value = response.data
    errShow.value = false
  } catch (error) {
    console.error(error)
    errMessage.value = 'loadingAddressFailed'
    errShow.value = true
    targetFn.value = 'ward'
  }
}

const fetchWardsNewByProvinceId = async (provinceId) => {
  try {
    const response = await getWardsNew(provinceId)
    wards.value = response.data
    errShow.value = false
  } catch (error) {
    console.error(error)
    errMessage.value = 'loadingAddressFailed'
    errShow.value = true
    targetFn.value = 'wardNew'
  }
}

const doVerify = async (address) => {
  try {
    verifyLoading.value = true
    const response = await verifyAddress(address)
    resultAddress.value = response.data
    errShow.value = false
    verifyLoading.value = false
  } catch (error) {
    console.error(error)
    errMessage.value = 'verifyAddressFailedMes'
    errShow.value = true
    targetFn.value = 'verify'
    verifyLoading.value = false
  }
}

const resetAddress = () => {
  const tmp = [...provinces.value]
  provinces.value = null
  provinces.value = tmp
  provinceId.value = ''
  districtId.value = ''
  wardId.value = ''
  street.value = ''
}

watch(selectedMethod, () => {
  resetAddress()
})

watch(provinceId, () => {
  if (provinceId.value) {
    if (selectedMethod.value === 'old-to-new') {
      fetchDistrictsById(provinceId.value)
    } else {
      fetchWardsNewByProvinceId(provinceId.value)
    }
  } else {
    resetAddress()
  }
})

watch(districtId, () => {
  if (selectedMethod.value === 'old-to-new' && districtId.value) {
    fetchWardsByDistrictId(districtId.value)
  }
})

//new verify address
const textAddress = ref('')
const resultTextAddress = ref('')
const verifyLoadingMulti = ref(false)
const isVerified = ref(false)
const addressMode = ref('single')
const fileInput = ref(null)
const fileName = ref('')
const excelData = ref([])
const tbHeaders = ref([
  {
    key: 'STT',
    label: t('STT'),
  },
  {
    key: 'address',
    label: t('originalAddress'),
  },
  {
    key: 'addressVerify',
    label: t('verifiedAddress'),
  },
])

const styling = {
  address: {
    colName: 'address',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return col.address
    },
  },
  addressVerify: {
    colName: 'addressVerify',
    classFn: (col) => {
      return col.addressVerify !== 'Không xác minh được' ? 'text-green-700' : 'text-red-500'
    },
    valueFn: (col) => {
      return col.addressVerify || ''
    },
  },
}

const doVerifyNew = async () => {
  if (!textAddress.value) {
    toast.error('Vui lòng nhập địa chỉ')
    return
  }
  try {
    verifyLoadingMulti.value = true
    const response = await verifyAddress(textAddress.value)
    resultTextAddress.value = response.data
    verifyLoadingMulti.value = false
  } catch (error) {
    console.error(error)
    verifyLoadingMulti.value = false
  }
}

const doMultiVerify = async () => {
  verifyLoadingMulti.value = true
  const chunkSize = 10
  const chunks = chunkArray(excelData.value, chunkSize)

  for (let batchIndex = 0; batchIndex < chunks.length; batchIndex++) {
    const batch = chunks[batchIndex]
    const promises = batch.map((item, idxInBatch) => {
      const idx = batchIndex * chunkSize + idxInBatch
      return api
        .post('connector/viettelpost/checking-address', { address: item.address })
        .then((res) => ({ res, idx }))
        .catch((err) => ({ err, idx }))
    })

    const batchResults = await Promise.allSettled(promises)

    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { res, idx } = result.value
        if (res.data.success) {
          excelData.value[idx]['addressVerify'] =
            res.data.data?.reference?.formattedAddress || 'Không xác minh được'
        }
      }
    })
  }
  verifyLoadingMulti.value = false
  isVerified.value = true
}

const loadFile = () => {
  fileInput.value.value = ''
  isVerified.value = false
  fileInput.value.click()
}

const onFileChange = (e) => {
  excelData.value = []
  const file = e.target.files[0]
  if (!file) return
  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
    rows.map((row, index) => {
      excelData.value.push({
        STT: index + 1,
        address: row.address,
        addressVerify: '',
        id: uuidv4(),
      })
    })
  }
  console.log(excelData.value)
  reader.readAsArrayBuffer(file)
}

function downloadTemplate() {
  const link = document.createElement('a')
  link.href = '/excel/addresses.xlsx'
  link.download = 'addresses.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  fetchProvinces()
})
</script>
