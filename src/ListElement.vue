<script setup>
defineProps({
workout: {
type:Object,
 required: true
}
})
const emit = defineEmits([
"deleteFunction",
"CompleteFunction",
"editFunction",
"ReSetFunction"
])



</script>

<template>
  <li class="workout-item">
    <div class="workout-summary">
      <div class="workout-details">
        <h3>{{ workout.name }}</h3>
        <p>{{ workout.duration }} perc</p>
      </div>
      <span class="workout-status" :class="{ 'is-completed': workout.completed }">
        <span aria-hidden="true">{{ workout.completed ? '✓' : '○' }}</span>
        {{ workout.completed ? 'Elvégezve' : 'Hátralévő' }}
      </span>
    </div>
    <div class="workout-actions">
      <button v-if="workout.completed === false" type="button" class="CompleteButton" @click="emit('CompleteFunction', workout.completed, workout.id)">Kész</button>
      <button v-else="workout.completed === true" type="button" class="CompleteButton" @click="emit('ReSetFunction', workout.completed, workout.id)">Visszavonás</button>
      <div class="secondary-actions">
        <button type="button" class="EditButton" @click="emit('editFunction', workout.id)">Szerkesztés</button>
        <button type="button" class="deleteButton" @click="emit('deleteFunction', workout.id)">Törlés</button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.workout-item { padding: 18px; border: 1px solid var(--border); border-radius: 12px; background: #fff; min-width: 0; }
.workout-summary { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.workout-details { flex: 1; min-width: 100px; }
.workout-details h3 { font-size: 1rem; font-weight: 600; }
.workout-details p { color: var(--muted); font-size: .8rem; margin-top: 4px; }
.workout-status { display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; border-radius: 20px; background: #f0f2ee; color: #58624d; font-size: .7rem; font-weight: 600; white-space: nowrap; }
.workout-status.is-completed { color: #24553f; background: #e4f0e7; }
.Completed { background: #fbfdfb; }
.workout-actions { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.workout-actions button { font-size: .8rem; padding: 9px 12px; }
.CompleteButton { color: var(--accent); background: #eff5f0; border-color: #d2e1d5; }
.secondary-actions { display: flex; gap: 4px; flex-wrap: wrap; }
.EditButton, .deleteButton { background: transparent; border-color: transparent; }
.EditButton:hover { background: #eff3ef; }
.deleteButton { color: #9e343b; }
.deleteButton:hover { background: #fff0f0; }
@media (max-width: 360px) {
  .workout-item { padding: 14px; }
  .workout-actions button { padding-inline: 9px; }
}
</style>