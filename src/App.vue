<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue"
import { getSubjects, addSubject } from "./services/subjectService";
import { getSessions, createSession } from "./services/sessionService";
import SessionsModal from "./components/SessionsModal.vue";
// ---------------- TYPES ----------------
type Subject = {
  id: number
  name: string
  totalMinutes: number
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
const selectedDate = ref(new Date().toISOString().slice(0, 10));

// Modal
const showSessionsModal = ref(false);
const sessions = ref([]);


// ---------------- COMPUTED ----------------
const totalMinutesToday = computed(() =>
  subjects.value.reduce((sum, s) => sum + s.totalMinutes, 0)
)




// ---------------- METHODS ----------------


const fetchSubjects = async () => {
  const data = await getSubjects(selectedDate);
  subjects.value = data;

  subjects.value.forEach(s => {
    if (!subjectInputs[s.id]) {
      subjectInputs[s.id] = {
        inputMinutes: 0,
        selectedDateTime: getLocalDateTime()
      };
    }
  });
};

function getLocalDateTime() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);
}

const handleAddSession = async (subject: Subject) => {
  const input = subjectInputs[subject.id];
  if (!input || input.inputMinutes <= 0) return;

  const dto = {
    subjectId: subject.id,
    minutes: input.inputMinutes,
    startedAt: input.selectedDateTime
  };

  await createSession(dto);

  subject.totalMinutes += input.inputMinutes;
  input.inputMinutes = 0;
};



const handleAddSubject = async () => {
  if (!newSubjectName.value.trim()) return;
  await addSubject({ name: newSubjectName.value });
  await fetchSubjects();
  newSubjectName.value = "";
}


const openSessionsModal = async () => {
  sessions.value = await getSessions(selectedDate.value); // store the fetched sessions
  showSessionsModal.value = true;
};


const closeSessionsModal = () => {
  showSessionsModal.value = false;
};

const removeSubject = (id: number) => {
  subjects.value = subjects.value.filter(s => s.id !== id)
}

onMounted(() => {
  fetchSubjects();
});

</script>

<template>
  <div class="app">

    <div class="date-picker">
      <label for="date">Velg dato:</label>
      <input type="date" id="date" v-model="selectedDate" @change="fetchSubjects" />
    </div>

    <h1>📚 Studie-Økt Tracker</h1>

    <!-- ADD SUBJECT -->
    <div class="add">
      <input v-model="newSubjectName" placeholder="Nytt fag" @keyup.enter="handleAddSubject" />
      <button @click="handleAddSubject">Legg til</button>
    </div>

    <!-- SUBJECT LIST -->
    <ul>
      <li v-for="subject in subjects" :key="subject.id" class="row">
        <div class="info">
          <strong>{{ subject.name }}</strong>
          — {{ subject.totalMinutes }} minutter
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
    <button @click="openSessionsModal">Se økter</button>
    <SessionsModal :visible="showSessionsModal" :sessions="sessions" :date="selectedDate" @close="closeSessionsModal" />


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

/* Overlay covers entire screen */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* semi-transparent background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  /* ensures modal is on top of everything */
}

/* Modal box styling */
.modal {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  /* ensures modal content is above overlay */
}

/* Optional: style close button */
.modal button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
