import './assets/main.css'

import countTo from 'vue3-count-to';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(countTo);

app.mount('#app')
