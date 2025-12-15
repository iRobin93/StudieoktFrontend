<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue"
import { getSubjects, addSubject } from "./services/subjectService";

// ---------------- TYPES ----------------
type Subject = {
  id: number
  name: string
  TotalMinutes: number
}

type Session = {
  id: number
  subjectId: number
  minutes: number
  date: string
}

type SubjectInput = {
  inputMinutes: number
  selectedDateTime: string
}

// ---------------- STATE ----------------
const subjects = ref<Subject[]>([])
const newSubjectName = ref("")
const subjectInputs = reactive<{ [key: number]: SubjectInput }>({});





// ---------------- COMPUTED ----------------
const totalMinutesToday = computed(() =>
  subjects.value.reduce((sum, s) => sum + s.TotalMinutes, 0)
)


const fetchSubjects = async () => {
  const data = await getSubjects();
  subjects.value = data;

  subjects.value.forEach(s => {
    if (!subjectInputs[s.id]) {
      subjectInputs[s.id] = {
        inputMinutes: 0,
        selectedDateTime: new Date().toISOString().slice(0, 16)
      };
    }
  });
};


const fetchSessions = async () => {
  subjects.value = await getSubjects();
};

// ---------------- METHODS ----------------
const handleAddSession = (subject: Subject) => {
  if (subjectInputs[subject.id].inputMinutes <= 0) return;

  console.log("Subject:", subject.name);
  console.log("Minutes:", subjectInputs[subject.id].inputMinutes);
  console.log("Date:", subjectInputs[subject.id].selectedDateTime);

  subject.TotalMinutes += subjectInputs[subject.id].inputMinutes;
  subjectInputs[subject.id].inputMinutes = 0;
};


const handleAddSubject = async () => {
  if (!newSubjectName.value.trim()) return;
  await addSubject({ name: newSubjectName.value });
  await fetchSubjects();
  newSubjectName.value = "";
}

const removeSubject = (id: number) => {
  subjects.value = subjects.value.filter(s => s.id !== id)
}

onMounted(() => {
  fetchSubjects();
  fetchSessions();
});

</script>

<template>
  <div class="app">
    <h1>📚 Studie-Økt Tracker</h1>

    <!-- ADD SUBJECT -->
    <div class="add">
      <input v-model="newSubjectName" placeholder="Nytt fag" @keyup.enter="addSubject" />
      <button @click="handleAddSubject">Legg til</button>
    </div>

    <!-- SUBJECT LIST -->
    <ul>
      <li v-for="subject in subjects" :key="subject.id" class="row">
        <div class="info">
          <strong>{{ subject.name }}</strong>
          — {{ subject.TotalMinutes }} minutter
        </div>

        <div class="actions">
          <input type="number" min="1" v-model.number="subjectInputs[subject.id].inputMinutes" placeholder="Min" />

          <input type="datetime-local" v-model="subjectInputs[subject.id].selectedDateTime" />

          <button @click="handleAddSession(subject)">➕</button>
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

li.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.info {
  flex: 1;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

input[type="number"] {
  width: 70px;
}

.inline {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

input[type="number"] {
  width: 70px;
}

input[type="datetime-local"] {
  width: 160px;
}
</style>
