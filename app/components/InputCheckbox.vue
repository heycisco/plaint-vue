<script setup lang="ts">
defineProps<{
  identifier: string
  criticismAccept: string
}>()

const checked = defineModel<boolean>('checked', { default: false })

watch(checked, (value) => {
  if (!import.meta.client) {
    return
  }

  if (value) {
    document.documentElement.classList.add('plaint-sign-anim')
  }
  else {
    document.documentElement.classList.remove('plaint-sign-anim')
  }
})

function onSignAnimationEnd() {
  if (!import.meta.client) {
    return
  }
  document.documentElement.classList.remove('plaint-sign-anim')
}

onUnmounted(() => {
  if (!import.meta.client) {
    return
  }
  document.documentElement.classList.remove('plaint-sign-anim')
})
</script>

<template>
  <div class="group checkbox-group">
    <label :for="identifier">
      <slot />
      <input
        :id="identifier"
        v-model="checked"
        type="checkbox"
      >
      <span class="new-checkbox">
        <span
          v-if="checked"
          class="new-checkbox__sign"
          @animationend="onSignAnimationEnd"
        >{{ criticismAccept }}</span>
      </span>
    </label>
  </div>
</template>

<style>
html.plaint-sign-anim .app {
  overflow: hidden;
}
</style>

<style scoped>
.checkbox-group {
  pointer-events: none;
}

input[type='checkbox'] {
  display: none;
}

label {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 0.15em 0.35em;
}

.new-checkbox {
  font-size: var(--font-size);
  display: inline-block;
  height: 1.275em;
  width: 8em;
  text-shadow: none;
  margin-left: 0.35em;
  position: relative;
  overflow: visible;
}

.new-checkbox::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: all;
  cursor: pointer;
  content: '';
  background: var(--border-obj) 0 1.127em;
  background-size: auto var(--field-rule-height);
  background-repeat: repeat-x;
}

.new-checkbox__sign {
  position: absolute;
  height: 150%;
  width: 110%;
  color: var(--c-main-2);
  text-align: center;
  font-size: 150%;
  bottom: 10%;
  left: -8%;
  z-index: 10;
  transform-origin: 50% 85%;
  animation: checkbox-zoom 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes checkbox-zoom {
  0% {
    opacity: 0.45;
    transform: scale3d(16, 16, 16) rotate(36deg);
    filter: blur(7px);
  }

  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1) rotate(-4deg);
    filter: blur(0);
  }
}
</style>