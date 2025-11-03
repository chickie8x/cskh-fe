<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-white p-6"
  >
    <Card class="w-full max-w-md shadow-lg">
      <CardHeader>
        <h2 class="text-2xl font-semibold">Welcome back</h2>
        <p class="text-sm text-slate-500 mt-1">Sign in to your account</p>
      </CardHeader>
      <CardContent v-if="alert">
        <Alert variant="destructive" class="relative">
          <X
            @click="alert = false"
            class="!w-6 !h-6 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full p-1 absolute top-2 right-2"
          />
          <CircleAlert class="h-6 w-6" />
          <AlertTitle>{{ alertMessage.title }}</AlertTitle>
          <AlertDescription>
            {{ alertMessage.description }}
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardContent>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <Label for="email" class="mb-1">Email</Label>
            <div>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="you@company.com"
                autocomplete="email"
              />
            </div>
            <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <Label for="password" class="mb-1">Password</Label>
            <div class="relative flex items-center">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button type="button" class="absolute right-2" @click="toggleShowPassword">
                <Eye v-if="showPassword" class="text-gray-400" />
                <EyeClosed v-else class="text-gray-400" />
              </button>
            </div>
            <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Checkbox v-model="form.remember" id="remember" />
              <Label for="remember" class="!mb-0">Remember me</Label>
            </div>
            <a class="text-sm hover:underline" href="#">Forgot password?</a>
          </div>

          <div>
            <Button type="submit" class="w-full" :disabled="submitting">
              <span v-if="!submitting">Sign in</span>
              <span v-else>Signing in...</span>
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter class="text-center text-sm text-slate-500">
        Don’t have an account?
        <a href="#" class="text-sky-600 hover:underline ml-1">Sign up</a>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { CircleAlert, Eye, EyeClosed, X } from 'lucide-vue-next'
import validator from 'validator'
import { login } from '@/api/auth.js'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const alert = ref(false)
const alertMessage = ref({
  title: 'Error!',
  description: '',
})

const errors = reactive({ email: '', password: '' })
const submitting = ref(false)
const showPassword = ref(false)

function validate() {
  errors.email = ''
  errors.password = ''

  if (!form.email) errors.email = 'Email is required.'
  else if (!validator.isEmail(form.email)) errors.email = 'Invalid email.'

  if (!form.password) errors.password = 'Password is required.'
  else if (!validator.isStrongPassword(form.password))
    errors.password =
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'

  return !errors.email && !errors.password
}

function toggleShowPassword() {
  showPassword.value = !showPassword.value
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  const authStore = useAuthStore()
  try {
    const res = await login(form.email, form.password)
    if (res.success) {
      authStore.setAccessToken(res.token)
      router.push('/')
    }
  } catch (error) {
    console.error(error)
    alert.value = true
    alertMessage.value.description = error.response.data.message
    setTimeout(() => {
      alert.value = false
    }, 5000)
  } finally {
    submitting.value = false
  }
}
</script>
