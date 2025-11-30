<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import { Input } from '../ui/input';

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  modelValue: '',
  placeholder: 'Enter your phone number'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'phone-valid', value: string): void
}>()

const touched = ref(false)

// Simplified validation: enforce prefix 63 or 09 and total length 11 digits (2 prefix + 9 digits)
function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  const cleaned = phone.replace(/\D/g, '')
  if (!cleaned) return { isValid: false, error: 'Phone number is required' }
  if (!/^(63|09)\d{9}$/.test(cleaned)) {
    return { isValid: false, error: 'Must start with 63 or 09 and be 11 digits total' }
  }
  return { isValid: true }
}

// Track previous valid value to prevent typing invalid prefixes
const previousValue = ref('')

function sanitizeDigits(input: string) {
  let v = input.replace(/\D/g, '')
  // Restrict prefix
  if (v.length >= 2 && !(v.startsWith('63') || v.startsWith('09'))) {
    return previousValue.value // reject invalid prefix
  }
  return v.slice(0, 11) // limit to 11 digits total
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const sanitized = sanitizeDigits(target.value)
  if (sanitized !== target.value) {
    target.value = sanitized
  }
  previousValue.value = sanitized
  emit('update:modelValue', sanitized)
}

function handleBlur() {
  touched.value = true
}

function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  const raw = (e.clipboardData?.getData('text') || '')
  const sanitized = sanitizeDigits(raw)
  const target = e.target as HTMLInputElement
  target.value = sanitized
  previousValue.value = sanitized
  emit('update:modelValue', sanitized)
}

const baseClasses = 'w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-mono text-sm focus:outline-none placeholder-muted-foreground'
const validClasses = 'border-green-500 bg-green-50/30 dark:bg-green-950/20 focus:ring-2 focus:ring-green-500/20'
const invalidClasses = 'border-red-500 bg-red-50/30 dark:bg-red-950/20 focus:ring-2 focus:ring-red-500/20'
const neutralClasses = 'border-border bg-background focus:border-primary focus:ring-2 focus:ring-ring/50'

const inputClasses = computed(() => {
  if (touched.value && props.modelValue) {
    return `${baseClasses} ${isValid.value ? validClasses : invalidClasses}`
  }
  return `${baseClasses} ${neutralClasses}`
})

const validation = computed(() => validatePhoneNumber(props.modelValue))
const isValid = computed(() => validation.value.isValid)

const normalizedPhone = computed(() => props.modelValue) // no normalization needed now
const phoneHelper = computed(() => {
  if (!props.modelValue) return 'Enter number starting with 09XXXXXXXXX or 63XXXXXXXXX (11 digits)'
  if (isValid.value) return 'Valid: ' + props.modelValue
  return 'Invalid: Must start with 63 or 09 and be 11 digits total'
})

watch(isValid, (v) => {
  if (v) emit('phone-valid', props.modelValue)
})
</script>

<template>
  <div class="grid grid-cols-1  space-y-2 text-left">
    <label for="phone" class="text-sm font-medium text-foreground">
      Phone Number
    </label>

    <!-- Phone Input Field -->
    <div class="relative">
      <input
        id="phone"
        type="tel"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @paste="handlePaste"
        :placeholder="placeholder"
        :class="inputClasses"
        class="w-full"
        inputmode="numeric"
        pattern="(63|09)[0-9]{9}"
        autocomplete="tel"
      />

      <!-- Validation Icon -->
      <div v-if="touched && modelValue" class="absolute right-3 top-1/2 -translate-y-1/2">
        <CheckCircle2 v-if="isValid" class="w-5 h-5 text-green-600" />
        <AlertCircle v-else class="w-5 h-5 text-red-600" />
      </div>
    </div>

    <!-- Helper Text -->
    <!-- <div class="text-xs text-muted-foreground">{{ phoneHelper }}</div> -->

    <!-- Error Message -->
    <div v-if="touched && !isValid && modelValue" class="flex items-center gap-2 text-xs text-red-600 animate-in fade-in">
      <AlertCircle class="w-4 h-4 flex-shrink-0" />
      <span>{{ validation.error }}</span>
    </div>

    <!-- Success Message -->
    <div v-if="touched && isValid" class="flex items-center gap-2 text-xs text-green-600 animate-in fade-in">
      <CheckCircle2 class="w-4 h-4 flex-shrink-0" />
      <span>Valid Philippine phone number</span>
    </div>
  </div>
</template>
