<script setup>
import { ref, computed, watch, onMounted, reactive, nextTick, onUnmounted} from 'vue'
import WorkoutItem from "./ListElement.vue"
import BaseModal from "./BaseModal.vue"
import NotesInput from "./Model.vue"
import { useLocalStorage } from '../composables/useLocalstorage.js';

const workoutName = ref("");
const errMsg = ref("");
const duration = ref(0);
const workouts = useLocalStorage("Workouts",[])
const workoutsNotes = useLocalStorage("WorkoutsNote","")
const workoutSearch = ref("")
const Completed = ref(false)
const Condition = ref("")
const Helper = ref(false)
const editnameInput = ref(null)
const workoutExamples = ref([])
const FetchProblemText = ref("")
const isLoading = ref(false)




const DeleteModal = reactive({
DeleteAllapot : 'closed',
workoutId : null
})









const selectedEditObj = reactive({
selectedForEdit : null,
EditPressedStatus : 'closed'
})

const totalDuration = computed(()=>{
let totalDuration = 0;
for (const durat of workouts.value) {
  totalDuration += durat.duration
}
return totalDuration
})


async function SelectEdit(id) {
  const Editedworkout = workouts.value.find((workout)=>{
   return workout.id === id
  })
selectedEditObj.selectedForEdit = {...Editedworkout}
selectedEditObj.EditPressedStatus = 'open'

await nextTick()
editnameInput.value?.focus()
}






function  addWorkout() {
  errMsg.value = ""
  console.log("name",workoutName.value)
  console.log("duration",duration.value)

if(workoutName.value.trim() === "" || typeof duration.value !== "number" || duration.value === 0){
errMsg.value = "Töltsd ki a mezőket!"
return
}

const workout = {
id: crypto.randomUUID(),
name: workoutName.value,
duration: duration.value,
completed: Completed.value
}

workouts.value.push(workout)
workoutName.value = "";
duration.value = 0
console.log("Edzések:",workouts.value)
}

function deleteWorkout(id) {
const TheWorkout = workouts.value.findIndex((workout)=>{
return workout.id === id
})

if(TheWorkout === -1) {
  return
}
workouts.value.splice(TheWorkout,1);
DeleteModal.DeleteAllapot = 'closed'
 
}



function CompleteWorkout(completed, id){
const TheWorkout = workouts.value.find((workout)=>{
return workout.id === id
})
if(!TheWorkout) {
  return
}
if(completed === false){ 
TheWorkout.completed = true
}else{
TheWorkout.completed = false
}
}

function ResetWorkout(completed, id){
const TheWorkout = workouts.value.find((workout)=>{
return workout.id === id
})
if(!TheWorkout) {
  return
}
if(completed === true){ 
TheWorkout.completed = false
}else{
TheWorkout.completed = false
}
}


function SwapWorkoutByEdit(id,newName,newDuration){
const SwapWorkout = workouts.value.find((workout)=>{
return workout.id === id
})
if(!SwapWorkout){
return
}

if(newName.trim() !== "" && newDuration > 0 && typeof newDuration === "number"){
SwapWorkout.name = newName;
SwapWorkout.duration = newDuration
}
}

function GivingObject(object) {

  
  const newObject = {
    id: crypto.randomUUID(),
    name: object.name,
    duration: object.duration,
    completed: false
  }

  workouts.value.push(newObject)



}


async function getJSONdata() {
  isLoading.value = true
  FetchProblemText.value = ''
  try{
  const response = await fetch('/workoutExamples.json')
    if(!response.ok){
    FetchProblemText.value = 'Hibás kérés.'
  isLoading.value = false

 return
  }
  const data = await response.json()


  workoutExamples.value = data
  

  }catch{
   FetchProblemText.value = 'Hálozati hiba.'
  isLoading.value = false

    return
  }finally{
 isLoading.value = false
  }
}



const SearchElements = computed(()=> {
 
   let workoutselect = workouts.value

  workoutselect = workoutselect.filter((workout)=>{
  return workout.name.includes(workoutSearch.value)
  })


  
  switch (Condition.value) {
    case "Pending":
      const PendingWorkouts = workoutselect.filter((workout)=>{
      return workout.completed === false
      })
      workoutselect = PendingWorkouts
      console.log("pending")
      break;
    case "Completed":
      
      const CompletedWorkouts = workoutselect.filter((workout)=>{
      return workout.completed === true
      })
      workoutselect = CompletedWorkouts
      console.log("completed")

    break;

    case "All":
console.log("all")
    break;
  
    default:
      console.log("default")
      break;
  }



  return workoutselect
})


function EscapeLeave(event) {
  if(event.key === "Escape" && selectedEditObj.EditPressedStatus === "open"){
  selectedEditObj.EditPressedStatus = "closed"
  }
}

onMounted(()=>{
window.addEventListener("keydown",EscapeLeave)
})
onUnmounted(()=>{
window.removeEventListener("keydown",EscapeLeave)
})


watch( ()=> selectedEditObj.EditPressedStatus,(newValue,oldValue)=>{
if(oldValue === "open" && newValue === "closed"){
Helper.value = false
}
})


</script>

<template>
  <div class="app-shell">
    <header class="page-header">
      <div>
        <p class="eyebrow">WORKOUTS / EDZÉSNAPLÓ</p>
        <h1>Minden edzés számít.</h1>
        <p class="intro">Tervezd meg, végezd el, kövesd a fejlődésed.</p>
      </div>
      <div class="total-card">
        <span class="total-label">Összes edzésidő</span>
        <p><strong>{{ totalDuration }}</strong> <span>perc</span></p>
        <span class="total-caption">A naplóban szereplő összes edzés</span>
      </div>
    </header>

    <main class="dashboard">
      <aside class="sidebar" aria-label="Edzés hozzáadása és jegyzetek">
        <section class="panel" aria-labelledby="add-heading">
          <p class="eyebrow">EGY LÉPÉSSEL KÖZELEBB</p>
          <h2 id="add-heading">Rögzíts egy edzést</h2>
          <p class="section-description">Adj nevet az edzésnek és add meg az időtartamát.</p>
          <form class="add-form" @submit.prevent="addWorkout()">
            <div class="field name-div">
              <label for="name">Edzés neve</label>
              <input id="name" class="name-input" type="text" v-model="workoutName" placeholder="Pl. Reggeli futás">
            </div>
            <div class="field duration-div">
              <label for="duration">Időtartam <span class="label-hint">(perc)</span></label>
              <input id="duration" class="duration-input" type="number" v-model.number="duration">
            </div>
            <p v-if="errMsg" class="error-message" role="alert">{{ errMsg }}</p>
            <button class="primary-button add-button" type="submit"><span aria-hidden="true">＋</span> Új edzés</button>
          </form>
        </section>

        <section class="panel notes-panel" aria-labelledby="notes-heading">
          <h2 id="notes-heading">Saját jegyzetek</h2>
          <p class="section-description">Célok, gondolatok, egy kis motiváció.</p>
          <NotesInput v-model="workoutsNotes" :maxLength="300" />
          <p v-if="workoutsNotes" class="notes-preview">{{ workoutsNotes }}</p>
        </section>
      </aside>

      <div class="content-column">
        <section class="panel workouts-panel" aria-labelledby="workouts-heading">
          <div class="section-heading">
            <div>
              <p class="eyebrow">A TE TEMPÓDBAN</p>
              <h2 id="workouts-heading">Edzéseid</h2>
            </div>
            <span class="count-badge">{{ workouts.length }} edzés</span>
          </div>
          <div class="list-filters">
            <div class="field">
              <label for="workout-search">Keresés</label>
              <input id="workout-search" class="searchInput" type="text" v-model="workoutSearch" placeholder="Keress az edzés nevére…">
            </div>
            <div class="field Select-Condition">
              <label for="condition">Állapot</label>
              <select id="condition" class="Condition" v-model="Condition">
                <option value="">Minden állapot</option>
                <option value="Pending">Hátralévő</option>
                <option value="Completed">Elvégezve</option>
                <option value="All">Összes</option>
              </select>
            </div>
          </div>
          <ul v-if="SearchElements.length" class="workout-list" aria-label="Edzéslista">
            <WorkoutItem
              v-for="workout in SearchElements"
              :key="workout.id"
              :workout="workout"
              :class="{ Completed: workout.completed }"
              @deleteFunction="DeleteModal.DeleteAllapot = 'open'; DeleteModal.workoutId = workout.id"
              @completeFunction="CompleteWorkout"
              @editFunction="SelectEdit(workout.id)"
              @ReSetFunction="ResetWorkout"
            />
          </ul>
          <div v-else-if="workouts.length === 0" class="empty-state">
            <span class="empty-icon" aria-hidden="true">＋</span>
            <h3>Itt kezdődik a következő edzésed</h3>
            <p>Add meg az edzés nevét és időtartamát, majd kattints az <strong>Új edzés</strong> gombra.</p>
          </div>
          <div v-else class="empty-state">
            <span class="empty-icon" aria-hidden="true">⌕</span>
            <h3>Nincs megfelelő edzés</h3>
            <p>Próbálj másik nevet, vagy módosítsd az állapotszűrőt.</p>
          </div>
        </section>

        <section class="panel FetchApparance" aria-labelledby="examples-heading">
          <div class="section-heading examples-heading">
            <div>
              <h2 id="examples-heading">Kell egy kis inspiráció?</h2>
              <p class="section-description">Válassz a mintaedzések közül, és add a naplódhoz.</p>
            </div>
            <button :disabled="isLoading" @click="getJSONdata" class="GetDataButton" type="button">Mintaedzések betöltése</button>
          </div>
          <p v-if="isLoading" class="status-message" role="status">Betöltés…</p>
          <p v-if="workoutExamples.length === 0 && FetchProblemText" class="error-message" role="alert">{{ FetchProblemText }}</p>
          <ul v-if="workoutExamples.length" class="example-list">
            <li v-for="examples in workoutExamples" :key="examples.id">
              <div><strong>{{ examples.name }}</strong><span>{{ examples.duration }} perc</span></div>
              <button @click="GivingObject(examples)" class="GivingButton" type="button">Naplóhoz adás</button>
            </li>
          </ul>
        </section>
      </div>
    </main>
    <footer class="page-footer">A kis lépésekből lesz a fejlődés.</footer>
  </div>

  <BaseModal :open="selectedEditObj.EditPressedStatus === 'open'" class="EditModal" @close="selectedEditObj.EditPressedStatus = 'closed'">
    <template #header>
      <p class="eyebrow">EDZÉSNAPLÓ</p>
      <h2>Edzés szerkesztése</h2>
    </template>
    <div class="edit-fields">
      <div class="field">
        <label for="edit-name">Edzés neve</label>
        <input id="edit-name" type="text" class="NameEdit" v-model="selectedEditObj.selectedForEdit.name" ref="editnameInput">
      </div>
      <div class="field">
        <label for="edit-duration">Időtartam <span class="label-hint">(perc)</span></label>
        <input id="edit-duration" type="text" class="DurationEdit" v-model.number="selectedEditObj.selectedForEdit.duration">
      </div>
      <div class="modal-actions">
        <button @click="SwapWorkoutByEdit(selectedEditObj.selectedForEdit.id,selectedEditObj.selectedForEdit.name,selectedEditObj.selectedForEdit.duration)" type="button" class="SaveButton primary-button">Mentés</button>
        <button v-if="Helper === false" @click="Helper = true">Súgó</button>
        <button v-else-if="Helper === true" @click="Helper = false">Súgó bezárása</button>
      </div>
    </div>
    <template #footer><p>A módosítások rögzítéséhez nyomd meg a Mentés gombot, majd zárd be az ablakot.</p></template>
  </BaseModal>

  <BaseModal @close="Helper = false" :open="Helper">
    <template #header><p class="eyebrow">GYORS SEGÍTSÉG</p><h2>Hogyan használd?</h2></template>
    <ol class="help-list">
      <li><strong>Rögzíts egy edzést.</strong> Töltsd ki a nevet és az időtartamot, majd nyomd meg az Új edzés gombot.</li>
      <li><strong>Kövesd az állapotát.</strong> A Kész gombbal jelölheted elvégzettnek, a Visszavonás gombbal újra hátralévőnek.</li>
      <li><strong>Módosíts, ha szükséges.</strong> A Szerkesztés ablakban add meg az új adatokat, nyomd meg a Mentés gombot, majd zárd be az ablakot. A Törlés gombbal eltávolíthatod az edzést.</li>
    </ol>
    <template #footer><p>A keresővel és az állapotszűrővel könnyen megtalálod az edzéseidet.</p></template>
  </BaseModal>

  <BaseModal :open="DeleteModal.DeleteAllapot === 'open'" @close="DeleteModal.DeleteAllapot = 'closed'">
    <template #header><p class="eyebrow">EDZÉS TÖRLÉSE</p><h2>Biztosan törlöd?</h2></template>
    <p>Az edzés végleg kikerül a naplódból. Ez a művelet nem vonható vissza.</p>
    <div class="modal-actions">
      <button @click="DeleteModal.DeleteAllapot = 'closed'" class="Close" type="button">Mégse</button>
      <button @click="deleteWorkout(DeleteModal.workoutId)" type="button" class="DeleteButton danger-button">Törlés</button>
    </div>
  </BaseModal>
</template>

<style>
:root {
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  color: #233632;
  background: #f4f6f4;
  font-synthesis: none;
  line-height: 1.5;
  --accent: #23634f;
  --muted: #5e7069;
  --border: #d7e0da;
}
* { box-sizing: border-box; }
body { margin: 0; min-width: 0; }
button, input, select, textarea { font: inherit; }
button, input, select, textarea { border: 1px solid var(--border); border-radius: 10px; }
button {
  min-height: 44px;
  padding: 10px 16px;
  background: #fff;
  color: #344e43;
  font-weight: 600;
  cursor: pointer;
  transition: background-color .15s, border-color .15s;
}
button:hover { background: #eef3ef; border-color: #8b9f94; }
button:disabled { opacity: .65; cursor: wait; }
input, select, textarea { width: 100%; min-width: 0; background: #fff; color: #233632; padding: 11px 12px; min-height: 46px; }
input::placeholder, textarea::placeholder { color: #708077; opacity: 1; }
textarea { resize: vertical; min-height: 120px; }
:focus-visible { outline: 3px solid #256bba; outline-offset: 3px; }
h1, h2, h3, p { margin: 0; }
h1 { font-size: clamp(1.9rem, 4vw, 2.75rem); line-height: 1.15; letter-spacing: -.045em; font-weight: 700; }
h2 { font-size: 1.2rem; line-height: 1.3; letter-spacing: -.025em; }
h3 { font-size: 1.05rem; }
label { font-size: .875rem; font-weight: 600; }
p, h1, h2, h3, strong { overflow-wrap: anywhere; }
.primary-button { background: var(--accent); border-color: var(--accent); color: #fff; }
.primary-button:hover { background: #184b3b; border-color: #184b3b; }
.danger-button { background: #a52e36; color: #fff; border-color: #a52e36; }
.danger-button:hover { background: #85232a; border-color: #85232a; }
.eyebrow { color: var(--accent); font-size: .7rem; font-weight: 700; letter-spacing: .13em; margin-bottom: 10px; }
.field { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
.label-hint { font-weight: 400; color: var(--muted); }
.section-description { color: var(--muted); font-size: .875rem; margin-top: 8px; }
.error-message { color: #a12630; background: #fff0f0; border-radius: 8px; padding: 10px 12px; font-size: .875rem; }
.modal-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.edit-fields { display: grid; gap: 20px; }
.help-list { margin: 0; padding-left: 24px; display: grid; gap: 18px; }
.help-list li { padding-left: 5px; }
.help-list li::marker { color: var(--accent); font-weight: 700; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; } }
</style>

<style scoped>
.app-shell { max-width: 1200px; margin: 0 auto; padding: 48px 32px 24px; }
.page-header { display: flex; justify-content: space-between; align-items: center; gap: 28px; margin-bottom: 36px; }
.intro { margin-top: 14px; color: var(--muted); }
.total-card { flex-shrink: 0; padding: 20px 24px; background: #e8efe9; border: 1px solid #d3dfd5; border-radius: 16px; }
.total-label { font-size: .8rem; font-weight: 600; color: #415b4d; }
.total-card p { color: var(--accent); }
.total-card strong { font-size: 2.25rem; letter-spacing: -.04em; font-weight: 700; }
.total-card p span { font-size: .875rem; }
.total-caption { display: block; font-size: .7rem; color: #53695c; }
.dashboard { display: grid; grid-template-columns: 320px minmax(0, 1fr); align-items: start; gap: 24px; }
.sidebar, .content-column { display: grid; gap: 24px; min-width: 0; }
.panel { background: #fff; border: 1px solid var(--border); border-radius: 18px; padding: 24px; box-shadow: 0 3px 12px #23363203; min-width: 0; }
.add-form { display: grid; gap: 18px; margin-top: 24px; }
.add-button { width: 100%; }
.add-button span { margin-right: 4px; }
.notes-panel :deep(.notes-input) { margin-top: 18px; }
.notes-preview { border-top: 1px solid var(--border); padding-top: 12px; margin-top: 12px; white-space: pre-wrap; color: var(--muted); font-size: .875rem; }
.section-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.count-badge { background: #f0f4f1; border-radius: 20px; padding: 5px 10px; white-space: nowrap; font-size: .75rem; color: #52665a; }
.list-filters { display: grid; grid-template-columns: minmax(0, 1fr) 160px; gap: 12px; margin-top: 24px; padding-bottom: 24px; }
.workout-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.empty-state { text-align: center; padding: 36px 16px; border: 1px dashed #cbd8cf; border-radius: 12px; background: #fafcf9; }
.empty-state p { color: var(--muted); font-size: .875rem; margin: 10px auto 0; max-width: 340px; }
.empty-icon { display: grid; place-items: center; width: 48px; height: 48px; margin: 0 auto 16px; border-radius: 50%; background: #e9f0ea; color: var(--accent); font-size: 1.6rem; }
.examples-heading { align-items: flex-start; flex-wrap: wrap; }
.examples-heading h2 { font-size: 1rem; }
.GetDataButton { font-size: .8rem; }
.example-list { list-style: none; margin: 20px 0 0; padding: 0; display: grid; gap: 12px; }
.example-list li { display: flex; justify-content: space-between; align-items: center; gap: 12px; border-top: 1px solid var(--border); padding-top: 16px; }
.example-list li div { min-width: 0; }
.example-list span { display: block; color: var(--muted); font-size: .8rem; margin-top: 2px; }
.GivingButton { flex-shrink: 0; font-size: .8rem; }
.status-message, .FetchApparance .error-message { margin-top: 16px; }
.page-footer { text-align: center; font-size: .75rem; color: var(--muted); padding-top: 32px; }
@media (max-width: 900px) {
  .dashboard { grid-template-columns: 280px minmax(0, 1fr); gap: 16px; }
  .panel { padding: 20px; }
  .list-filters { grid-template-columns: 1fr; }
}
@media (max-width: 700px) {
  .app-shell { padding: 28px 16px 24px; }
  .page-header { flex-direction: column; align-items: stretch; gap: 24px; margin-bottom: 24px; }
  .total-card { padding: 16px 20px; }
  .dashboard { display: flex; flex-direction: column; gap: 20px; }
  .sidebar { display: contents; }
  .sidebar > .panel:first-child { order: 0; width: 100%; }
  .content-column { order: 1; width: 100%; gap: 20px; }
  .notes-panel { order: 2; width: 100%; }
  .empty-state { padding: 28px 12px; }
}
@media (max-width: 360px) {
  .app-shell { padding-inline: 12px; }
  .panel { padding: 16px; }
  .example-list li { flex-wrap: wrap; }
}
</style>