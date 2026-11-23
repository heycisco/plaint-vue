<script setup lang="ts">
import { startCopy } from '~/constants/content'
import { pageDescriptions } from '~/constants/seo'

usePageSeo({
  title: 'Кляузная | Анонимные жалобы',
  description: pageDescriptions.home,
  path: '/',
  jsonLdWebSite: true
})
</script>

<template>
  <div class="start-page">
    <h1>{{ startCopy.title }}</h1>
    <div class="main-description">
      <p v-for="(paragraph, index) in startCopy.mainDescription" :key="index">
        {{ paragraph }}
      </p>
    </div>
    <PlaintBtn to="/form">
      {{ startCopy.startLink }}
    </PlaintBtn>
  </div>
</template>

<style scoped>
.start-page h1 {
  font-size: clamp(2.25rem, 14vw, 3em);
  line-height: 1.1;
  text-align: center;
}

.main-description {
  display: flex;
  flex-direction: column;
  gap: 1em;
  text-align: center;
}

</style>