<script setup lang="ts">
import { pageDescriptions } from '~/constants/seo'

const errorMessage = ref('')
const plaintFormRef = ref<{ confirmSubmit: () => void, abortSubmit: () => void } | null>(null)

function fetchErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined
  }

  const record = error as Record<string, unknown>
  if (typeof record.statusMessage === 'string' && record.statusMessage) {
    return record.statusMessage
  }

  const data = record.data
  if (data && typeof data === 'object' && 'statusMessage' in data) {
    const statusMessage = (data as { statusMessage?: unknown }).statusMessage
    if (typeof statusMessage === 'string' && statusMessage) {
      return statusMessage
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return undefined
}

usePageSeo({
  title: 'Кляузная | Жалоба',
  description: pageDescriptions.form,
  path: '/form'
})

async function onSubmit(payload: { body: string, name: string | null }) {
  errorMessage.value = ''

  try {
    await $fetch('/api/complaints', {
      method: 'POST',
      body: payload
    })
    plaintFormRef.value?.confirmSubmit()
    setTimeout(() => {
      navigateTo('/sent')
    }, 5000)
  }
  catch (error: unknown) {
    plaintFormRef.value?.abortSubmit()
    errorMessage.value = fetchErrorMessage(error) ?? 'Не удалось отправить жалобу'
  }
}
</script>

<template>
  <div>
    <PlaintForm ref="plaintFormRef" @submit="onSubmit" />
    <p v-if="errorMessage" class="plaint-error">
      {{ errorMessage }}
    </p>
  </div>
</template>