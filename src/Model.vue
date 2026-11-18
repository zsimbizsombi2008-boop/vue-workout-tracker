<script setup>
const model = defineModel()
const prop = defineProps({
maxLength:Number
})
</script>

<template>
  <div class="notes-input">
    <label for="workout-notes">Edzésjegyzet</label>
    <textarea id="workout-notes" v-model="model" :maxlength="maxLength" placeholder="Mi a következő célod?" aria-describedby="notes-count"></textarea>
    <p id="notes-count" :class="{ Full: model.length >= 300 }">{{ model.length }} / {{ maxLength }} karakter</p>
  </div>
</template>

<style scoped>
.notes-input { display: grid; gap: 7px; }
.notes-input label { color: var(--muted); font-size: .8rem; }
.notes-input p { text-align: right; color: var(--muted); font-size: .75rem; }
.notes-input .Full { color: #a12630; text-decoration: underline; }
</style>
