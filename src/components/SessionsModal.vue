<script setup lang="ts">

interface Session {
    id: number;
    subjectName: string;
    minutes: number;
    startedAt: string;
}

const props = defineProps<{
    visible: boolean;
    sessions: Session[];
    date: string;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const closeModal = () => {
    emit("close");
};
</script>

<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal">
            <h2>Økter for {{ date }}</h2>
            <ul>
                <li v-for="s in sessions" :key="s.id">
                    {{ s.subjectName }} — {{ s.minutes }} min — {{ s.startedAt }}
                </li>
            </ul>
            <button @click="closeModal">Lukk</button>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
}
</style>
