<script setup lang="ts">
import "./css/SessionModal.css";
import api from "../api/axios";


interface Session {
    id: number;
    subjectName: string;
    minutes: number;
    startedAt: string;
    subjectId: number;
}

const props = defineProps<{
    visible: boolean;
    sessions: Session[];
    date: string;
}>();

const closeModal = () => {
    emit("close");
};

const emit = defineEmits<{
    (e: "close"): void;
    (e: "refresh"): void;
}>();

// Format time to HH:mm
const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('no-NO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

// Format date to DD.MM.YYYY
const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('no-NO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Check if we should show date (if different from modal's date)
const shouldShowDate = (dateTimeString: string) => {
    const sessionDate = formatDate(dateTimeString);
    return sessionDate !== props.date;
};

const handleDeleteSession = async (sessionId: number) => {
    const confirmed = window.confirm("Er du sikker på at du vil slette denne økten?");
    if (!confirmed) return;

    try {
        await api.delete("/session/" + sessionId);
        emit("refresh");
    } catch (err) {
        console.error("Failed to delete session:", err);
        alert("Noe gikk galt ved sletting av økten.");
    }
};
</script>

<template>
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
            <div class="modal-header">
                <h2>📚 Økter for {{ date }}</h2>
            </div>

            <div class="modal-content">
                <div v-if="sessions.length === 0" class="empty-state">
                    <p>Ingen økter registrert for denne dagen.</p>
                </div>

                <div v-else class="sessions-container">
                    <div v-for="s in sessions" :key="s.id" class="session-row">
                        <div class="session-info">
                            <div class="subject-cell">{{ s.subjectName }}</div>
                            <div class="minutes-cell">{{ s.minutes }} min</div>
                            <div class="time-cell">{{ formatTime(s.startedAt) }}</div>
                            <div v-if="shouldShowDate(s.startedAt)" class="date-cell">
                                {{ formatDate(s.startedAt) }}
                            </div>
                        </div>
                        <button class="delete-btn" @click="handleDeleteSession(s.id)" title="Slett økten">
                            Slett
                        </button>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <p class="total-summary">
                    Totalt: <strong>{{sessions.reduce((sum, s) => sum + s.minutes, 0)}} minutter</strong>
                    ({{ sessions.length }} økt{{ sessions.length !== 1 ? 'er' : '' }})
                </p>
                <button class="close-button" @click="closeModal">Lukk</button>
            </div>
        </div>
    </div>
</template>