import './assets/main.css'

import countTo from 'vue3-count-to'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(countTo)

app.use(vue3GoogleLogin, {
    clientId: '7546974332-jcn60jnfl10e7a14bdi7uba8ap4g5n82.apps.googleusercontent.com'
  })

app.mount('#app')
