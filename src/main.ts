import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
app.use(createPinia());
// Initialize the auth store when the app starts
const authStore = useAuthStore();
authStore.initialize();
app.use(router);
app.mount('#app');