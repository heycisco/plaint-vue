<script setup lang="ts">
import type { NuxtError } from '#app'
import { notFoundCopy } from '~/constants/content'
import { pageDescriptions } from '~/constants/seo'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error.statusCode === 404)
const imageUrl = useWebpBackground('/img/404.png')

usePageSeo({
  title: is404.value ? 'Кляузная | 404' : 'Кляузная | Ошибка',
  description: is404.value ? pageDescriptions.notFound : pageDescriptions.error,
  noindex: true
})
</script>

<template>
  <AppShell>
    <div v-if="is404" class="msg msg--not-found">
      <img :src="imageUrl" alt="Страница не найдена" width="696" height="527">
      <PlaintBtn to="/">
        {{ notFoundCopy.link }}
      </PlaintBtn>
    </div>
    <div v-else class="msg">
      <p class="msg__text">
        {{ error.statusMessage || 'Упс, чето пошло не так!' }}
      </p>
      <PlaintBtn to="/">
        {{ notFoundCopy.link }}
      </PlaintBtn>
    </div>
  </AppShell>
</template>
