/*
 * @Author: txy 2679150788@qq.com
 * @Date: 2023-11-30 10:42:58
 * @LastEditors: txy 2679150788@qq.com
 * @LastEditTime: 2023-12-01 15:05:08
 * @FilePath: \frontend\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
