<script setup lang="ts">
import { sentCopy } from '~/constants/content'
import { pageDescriptions } from '~/constants/seo'

const imageUrl = useWebpBackground('/img/sent.jpg')

usePageSeo({
  title: 'Кляузная | Отправлено',
  description: pageDescriptions.sent,
  path: '/sent',
  noindex: true
})
</script>

<template>
  <div class="msg">
    <div class="msg__text">
      <p v-for="(line, index) in sentCopy.message" :key="index">
        {{ line }}
      </p>
    </div>
    <img :src="imageUrl" alt="Иллюстрация: жалоба отправлена" width="800" height="377">
    <PlaintBtn to="/form">
      {{ sentCopy.link }}
    </PlaintBtn>
  </div>
</template>
