<template>
  <div class="p-4 flex flex-col space-y-4">
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

        <Select v-if="selectedMethod === 'old-to-new'" v-model="districtId" :disabled="!provinceId">
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
        {{ resultAddress?.reference?.formattedAddress }}
        <Copy class="w-4 h-4 opacity-50 hover:opacity-100 transition cursor-pointer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Copy, LocateFixed, RefreshCcw, SearchCheck, AlertCircle, Loader2 } from 'lucide-vue-next'
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

const errMessage = ref('loadingAddressFailed')
const errShow = ref(false)
const targetFn = ref('')
const loading = ref(false)
const verifyLoading = ref(false)
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

onMounted(() => {
  fetchProvinces()
})
</script>
