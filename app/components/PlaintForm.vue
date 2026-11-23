<script setup lang="ts">
import { dialogVariants, formLabels } from '~/constants/content'
import { COMPLAINT_BODY_MAX, COMPLAINT_NAME_MAX } from '#shared/complaintLimits'

const emit = defineEmits<{
  submit: [payload: { body: string, name: string | null }]
}>()

const message = ref('')
const name = ref('')
const checked = ref(false)
const skippedName = ref(false)

const alertMessage = ref('')
const alertStyle = ref('')
const answersContent = ref<{ ignore: string, takeNote: string } | null>(null)
const goNext = ref(true)
const showAnswers = ref(false)
const successfully = ref(false)

const dialogTimers = new Set<ReturnType<typeof setTimeout>>()

function scheduleDialogResume(delay: number) {
  const id = setTimeout(() => {
    dialogTimers.delete(id)
    goNext.value = true
  }, delay)
  dialogTimers.add(id)
}

function checkInputLoop(msgLen: number, nameLen: number) {
  if (msgLen < 1 && nameLen < 1) {
    return 1
  }
  if (msgLen < 6) {
    return 2
  }
  if (msgLen > COMPLAINT_BODY_MAX) {
    return 5
  }
  if (msgLen > 5 && nameLen > COMPLAINT_NAME_MAX) {
    return 4
  }
  if (msgLen > 5 && nameLen < 1 && !skippedName.value) {
    return 3
  }
  if (!checked.value) {
    return 6
  }
  const trimmedName = name.value.trim()
  emit('submit', { body: message.value.trim(), name: trimmedName || null })
  return 7
}

function confirmSubmit() {
  successfully.value = true
}

function abortSubmit() {
  successfully.value = false
  goNext.value = true
  alertMessage.value = ''
  showAnswers.value = false
}

defineExpose({ confirmSubmit, abortSubmit })

function applyDialog(index: number) {
  const current = dialogVariants[index - 1]
  if (!current) {
    return
  }

  alertMessage.value = current.title
  alertStyle.value = current.style
  answersContent.value = 'answers' in current ? { ...current.answers } : null
  showAnswers.value = false
  goNext.value = false

  if ('finish' in current && current.finish) {
    scheduleDialogResume(5000)
    return
  }

  if (answersContent.value) {
    showAnswers.value = true
    return
  }

  scheduleDialogResume(3000)
}

function validate(skipName = false) {
  if (skipName) {
    skippedName.value = true
  }

  const index = skipName
    ? checkInputLoop(message.value.length, 2)
    : checkInputLoop(message.value.length, name.value.length)

  applyDialog(index)
}

function resetForm() {
  message.value = ''
  name.value = ''
  checked.value = false
  skippedName.value = false
  alertMessage.value = ''
  goNext.value = true
  showAnswers.value = false
  successfully.value = false
}

onUnmounted(() => {
  for (const id of dialogTimers) {
    clearTimeout(id)
  }
  dialogTimers.clear()
})
</script>

<template>
  <form class="plaint-form" @submit.prevent>
    <div
      v-if="!successfully"
      class="plaint-form__wrapper"
      :class="{ blocked: !goNext }"
    >
      <div class="plaint-field">
        <label for="message">{{ formLabels.message }}</label>
        <textarea
          id="message"
          v-model="message"
          rows="5"
          :maxlength="COMPLAINT_BODY_MAX"
        />
      </div>

      <div class="plaint-field">
        <label for="name">{{ formLabels.name }}</label>
        <input
          id="name"
          v-model="name"
          type="text"
          :maxlength="COMPLAINT_NAME_MAX"
          @keydown.enter.prevent
        >
      </div>

      <InputCheckbox
        v-model:checked="checked"
        identifier="criticism"
        :criticism-accept="formLabels.criticismAccept"
      >
        {{ formLabels.criticism }}
      </InputCheckbox>

      <div class="main-btn main-btn--split">
        <PlaintBtn
          type="submit"
          class="main-btn__submit"
          @click="validate()"
        >
          {{ formLabels.sent }}
        </PlaintBtn>
        <PlaintBtn
          type="button"
          reset
          @click="resetForm"
        >
          {{ formLabels.reset }}
        </PlaintBtn>
      </div>
    </div>

    <div class="tooltips">
      <Transition name="fade">
        <div
          v-if="alertMessage && !goNext"
          class="tooltips__item"
          :class="alertStyle"
        >
          <p>{{ alertMessage }}</p>
          <div v-if="showAnswers && answersContent" class="tooltips__adv">
            <button
              type="button"
              class="tooltips__adv-ignore"
              @click="validate(true)"
            >
              {{ answersContent.ignore }}
            </button>
            <button
              type="button"
              class="tooltips__adv-go"
              @click="goNext = true"
            >
              {{ answersContent.takeNote }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </form>
</template>