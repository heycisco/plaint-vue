<script setup lang="ts">
const props = defineProps<{
  identifier: string
  criticismAccept: string
}>()

const checked = defineModel<boolean>('checked', { default: false })
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
      <span class="new-checkbox" :class="{ active: checked }">
        <span>{{ criticismAccept }}</span>
      </span>
    </label>
  </div>
</template>

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
}

.new-checkbox::before {
  position: absolute;
  inset: 0;
  pointer-events: all;
  cursor: pointer;
  content: '';
  background: var(--border-obj) 0 1.127em;
  background-size: auto 0.086em;
  background-repeat: repeat-x;
}

.new-checkbox span {
  position: absolute;
  height: 150%;
  width: 110%;
  color: var(--c-main-2);
  text-align: center;
  visibility: hidden;
  font-size: 150%;
  bottom: 10%;
  left: -8%;
  z-index: 10;
}

.new-checkbox.active span {
  animation: checkbox-zoom 0.3s ease-out forwards;
  transform: scale3d(12, 12, 12) rotate(40deg);
}

@keyframes checkbox-zoom {
  from {
    opacity: 0;
    transform: scale3d(12, 12, 12) rotate(40deg);
    filter: blur(5px);
    overflow: hidden;
  }

  to {
    transform: scale3d(1, 1, 1) rotate(-4deg);
    filter: blur(0);
    visibility: visible;
    overflow: visible;
  }
}
</style>