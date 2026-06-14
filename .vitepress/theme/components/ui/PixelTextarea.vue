<script lang="ts" setup>
const model = defineModel<string>({
  default: '',
})
</script>

<template>
  <textarea
    class="pixel-input"
    v-model="model"
    @input="($event.target as HTMLTextAreaElement).style.height = ''; ($event.target as HTMLTextAreaElement).style.height = `calc(0.2rem + ${($event.target as HTMLTextAreaElement).scrollHeight}px)`"
  ></textarea>
</template>

<style lang="css" scoped>
.pixel-input {
  font-family: var(--pixel-font-body);
  font-size: 1rem;
  letter-spacing: 1px;
  padding: 2px;
  border: 2px solid transparent;
  border-top: 2px solid var(--pixel-input-shadow-dark);
  border-bottom: 2px solid var(--pixel-input-shadow-light);
  background-color: var(--pixel-input-bg);
  color: var(--pixel-input-text);
  outline: var(--pixel-input-border);
  overflow-y: hidden;
  resize: vertical;
}
</style>
