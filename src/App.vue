<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"

// ---------------- TYPES ----------------
type Subject = {
  id: number
  name: string
  minutes: number
  inputMinutes: number
}

// ---------------- STATE ----------------
const subjects = ref<Subject[]>([])
const newSubjectName = ref("")

// ---------------- COMPUTED ----------------
const totalMinutesToday = computed(() =>
  subjects.value.reduce((sum, s) => sum + s.minutes, 0)
)

// ---------------- METHODS ----------------
const addMinutes = (subject: Subject) => {
  if (subject.inputMinutes <= 0) return

  subject.minutes += subject.inputMinutes
  subject.inputMinutes = 0
}

const addSubject = () => {
  if (!newSubjectName.value.trim()) return

  subjects.value.push({
    id: Date.now(),
    name: newSubjectName.value,
    minutes: 0,
    inputMinutes: 0,
  })

  newSubjectName.value = ""
}

const removeSubject = (id: number) => {
  subjects.value = subjects.value.filter(s => s.id !== id)
}

// ---------------- LOCAL STORAGE ----------------
const STORAGE_KEY = "study-tracker"

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    subjects.value = JSON.parse(saved)
  } else {
    subjects.value = [
      { id: 1, name: "Matte", minutes: 0, inputMinutes: 0 },
      { id: 2, name: "Programmering", minutes: 0, inputMinutes: 0 },
    ]
  }
})

watch(subjects, () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects.value))
}, { deep: true })
</script>

<template>
  <div class="app">
    <h1>📚 Studie-Økt Tracker</h1>

    <!-- ADD SUBJECT -->
    <div class="add">
      <input
        v-model="newSubjectName"
        placeholder="Nytt fag"
        @keyup.enter="addSubject"
      />
      <button @click="addSubject">Legg til</button>
    </div>

    <!-- SUBJECT LIST -->
    <ul>
      <li v-for="subject in subjects" :key="subject.id">
        <strong>{{ subject.name }}</strong>
        — {{ subject.minutes }} min

        <div class="inline">
          <input
            type="number"
            min="1"
            v-model.number="subject.inputMinutes"
            placeholder="Min"
          />
          <button @click="addMinutes(subject)">➕</button>
          <button @click="removeSubject(subject.id)">❌</button>
        </div>
      </li>
    </ul>

    <!-- TOTAL -->
    <h3>📊 Total i dag: {{ totalMinutesToday }} min</h3>
  </div>
</template>

<style scoped>
.app {
  max-width: 500px;
  margin: 2rem auto;
  font-family: system-ui, sans-serif;
}

.add {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

ul {
  padding: 0;
}

li {
  list-style: none;
  margin-bottom: 1rem;
}

.inline {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

input[type="number"] {
  width: 70px;
}
</style>
