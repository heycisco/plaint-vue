<script setup lang="ts">
withDefaults(defineProps<{
  to?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  reset?: boolean
}>(), {
  type: 'button',
  disabled: false,
  reset: false
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="plaint-btn"
    :class="{ 'plaint-btn--reset': reset }"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    class="plaint-btn"
    :class="{ 'plaint-btn--reset': reset }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.plaint-btn {
  font-size: calc(var(--font-size) * 1.4);
  position: relative;
  color: #f7fbfa;
  line-height: 1;
  padding: 0.2em 0.5em;
  font-weight: 600;
  text-shadow: 0 0 1px #0000009e;
  transition: box-shadow var(--transition-out);
  border: 0;
  background: transparent;
  border-radius: 2px;
}

.plaint-btn:hover:not(:disabled) {
  transition: box-shadow var(--transition-in);
  box-shadow: 0 1px 4px #00000085;
}

.plaint-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--c-brand);
  border-radius: 2px;
}

.plaint-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.plaint-btn--reset {
  font-size: var(--font-size);
  color: #404040;
  top: 0.1em;
}

.plaint-btn--reset::before {
  background: #fff;
}

@media (max-width: 519px) {
  .plaint-btn:not(.plaint-btn--reset) {
    min-height: 2.5em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
