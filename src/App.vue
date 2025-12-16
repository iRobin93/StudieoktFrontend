<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue"
import { getSubjects, addSubject, deleteSubject } from "./services/subjectService";
import { getSessions, createSession } from "./services/sessionService";
import SessionsModal from "./components/SessionsModal.vue";
import "./app.css";
// ---------------- TYPES ----------------
type Subject = {
  id: number
  name: string
  totalMinutes: number
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


const handleRemoveSubject = async (id: number) => {
  const confirmed = window.confirm("Er du sikker på at du vil slette dette faget?");
  if (!confirmed) return;

  try {
    await deleteSubject(id);
    await fetchSubjects();
  } catch (error) {
    console.error("Could not delete subject:", error);
    alert("Noe gikk galt ved sletting av fag.");
  }
};

const handleRefresh = async () => {
  await fetchSubjects();
  sessions.value = await getSessions(selectedDate.value);
};

const handleCloseSessionsModal = async () => {
  showSessionsModal.value = false;
};

onMounted(() => {
  fetchSubjects();
});

</script>

<template>
  <div class="app">
    <!-- DATE PICKER -->
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

    <!-- TABLE HEADER -->
    <div class="table-header">
      <span class="header-fag">Fag</span>
      <span class="header-total">Tot. Min</span>
      <span class="header-minutes">Minutter</span>
      <span class="header-time">Starttid</span>
      <span class="header-actions">Handlinger</span>
    </div>

    <!-- And update the row structure slightly: -->
    <li v-for="subject in subjects" :key="subject.id" class="row">
      <span class="subject-name">{{ subject.name }}</span>

      <span class="total-minutes">{{ subject.totalMinutes }}</span>

      <input type="number" min="1" v-model.number="subjectInputs[subject.id].inputMinutes" placeholder="Min"
        class="minutes-input" />

      <input type="datetime-local" v-model="subjectInputs[subject.id].selectedDateTime" class="datetime-input" />

      <div class="actions">
        <button title="Legg til økt" @click="handleAddSession(subject)">➕</button>
        <button title="Slett fag" @click="handleRemoveSubject(subject.id)">❌</button>
      </div>
    </li>


    <!-- TOTAL -->
    <h3>📊 Totalt i dag: {{ totalMinutesToday }} min</h3>

    <button class="sessions-btn" @click="openSessionsModal">
      Se økter
    </button>

    <SessionsModal :visible="showSessionsModal" :sessions="sessions" :date="selectedDate"
      @close="handleCloseSessionsModal" @refresh="handleRefresh" />
  </div>
</template>