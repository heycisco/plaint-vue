<script setup lang="ts">
const bgUrl = useWebpBackground('/img/bg.jpg')
</script>

<template>
  <div
    class="background"
    :style="{ backgroundImage: `url(${bgUrl})` }"
  />
  <div class="wrapper">
    <LogoMain />
    <div class="main-content">
      <div class="wrapper">
        <slot />
      </div>
    </div>
  </div>
  <FooterMain />
</template>