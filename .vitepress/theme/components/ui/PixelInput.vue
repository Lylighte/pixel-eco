<script lang="ts" setup>
const model = defineModel<string>({
  default: '',
})
</script>

<template>
  <input v-model="model" class="pixel-input" type="text" />
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
}

.pixel-input:disabled {
  color: var(--pixel-input-disabled-text);
  background-color: var(--pixel-input-disabled-bg);
}
</style>
