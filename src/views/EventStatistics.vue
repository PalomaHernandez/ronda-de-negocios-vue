<template>
    <LayoutPage>
        <template #default>
            <div v-if="auth_info" class="alert alert-info" @click="authStore.clearMessages()">{{ auth_info }}</div>
            <Loading v-if="loading" />
            <div v-else-if="statistics">
                <div class="p-6">
                    <div v-if="error" class="alert alert-danger" @click="eventStore.clearMessages()">{{ error }}</div>
                    <div v-if="info" class="alert alert-info" @click="eventStore.clearMessages()">{{ info }}</div>
                    <h2 class="text-3xl font-bold mb-6">Estadísticas del evento</h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div class="bg-white p-4 rounded-lg shadow-md">
                            <h3 class="text-xl font-semibold mb-2">Inscripciones al evento</h3>
                            <p class="text-3xl">{{ statistics.totalInscriptions }}</p>
                        </div>

                        <div class="bg-white p-4 rounded-lg shadow-md">
                            <h3 class="text-xl font-semibold mb-2">Reuniones organizadas</h3>
                            <p class="text-3xl">{{ statistics.totalMeetings }}</p>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-md mt-5">
                            <h3 class="text-xl font-semibold mb-2">Inscriptos por día</h3>
                            <div>
                                <canvas id="inscriptosChart"></canvas>
                            </div>
                        </div>
                </div>
            </div v-else-if>
        </template>
    </LayoutPage>
</template>

<script setup>
import { onMounted } from 'vue';
import { useEventStore } from '@/stores/event';
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from 'pinia';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement, BarController } from 'chart.js';
import LayoutPage from '@/Layout.vue';
import Loading from "@/components/Loading.vue";

const eventStore = useEventStore();
const { evento, statistics, loading, error, info } = storeToRefs(eventStore);
const authStore = useAuthStore();
const { auth_info } = storeToRefs(authStore);

Chart.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController
);

const renderChart = () => {
    if (!statistics.value || !statistics.value.inscriptionsPerDay || statistics.value.inscriptionsPerDay.length === 0) {
        console.error('No hay datos disponibles para el gráfico.');
        return;
    }
    const ctx = document.getElementById('inscriptosChart').getContext('2d');
    const labels = statistics.value.inscriptionsPerDay.map(item => item.date);
    const data = statistics.value.inscriptionsPerDay.map(item => item.count);

    const maxValue = Math.max(...data); 

    new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: labels,
            datasets: [{
                label: 'Inscriptos por día',
                data: data,
                backgroundColor: '#0369A1',
                borderColor: '#0369A1',    
                borderWidth: 1,
                barThickness: 100, 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Fecha' },
                    type: 'category' 
                },
                y: {
                    title: { display: true, text: 'Cantidad' },
                    beginAtZero: true,
                    max: maxValue * 2,
                }
            }
        }
    });
};

onMounted(async () => {
    await eventStore.getStatistics(evento.value.id);
    renderChart();
});
</script>

