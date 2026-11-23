<script setup lang="ts">
const currentYear = new Date().getFullYear()

const viewport = ref({ width: 0, height: 0 })

function updateViewport() {
  if (import.meta.client) {
    viewport.value = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  }
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport)
})
</script>

<template>
  <footer class="main-footer">
    <div class="content">
      <p>
        Издательство «<a href="https://starchenkov.pro/" target="_blank" rel="noopener noreferrer">Старченков тунеядец</a>»
      </p>
      <p>Подписано в печать 2019 г.</p>
      <p>Носитель {{ viewport.width }}x{{ viewport.height }} уч. л. = 1,25 усл.</p>
      <p>Отпечатано {{ currentYear }} г.</p>
      <p>
        Типография «NGINX»
      </p>
    </div>
  </footer>
</template>