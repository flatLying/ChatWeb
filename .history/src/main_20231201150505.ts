import './assets/main.css'
import axios from 'axios';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
// import { createPersistedState } from 'pinia-persistedstate-plugin'
import App from './App.vue'
import router from './router'
import instance from './utils/request'
 

const app = createApp(App)
// const pinia = createPinia();
// const persist = createPersistedState();
// pinia.use(persist)
// app.use(pinia)
app.use(router)
app.use(ElementPlus)
Vue.prototype.$axios = instance
app.mount('#app')
