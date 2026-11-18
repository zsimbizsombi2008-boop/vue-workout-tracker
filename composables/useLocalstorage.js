import {ref, watch, onMounted} from 'vue'


export function useLocalStorage(key,initialValue){
const data = ref(initialValue)


onMounted(()=>{
const DataInvatition = localStorage.getItem(key);

if(DataInvatition === null){
return
}
try{
data.value = JSON.parse(DataInvatition)
}catch{
warn("Hibás JSON formátum!")
}
})

watch(data,(newWorkouts)=>{
localStorage.setItem(key,JSON.stringify(newWorkouts))
},{deep:true})

return data
}