/*
 * @Author: txy 2679150788@qq.com
 * @Date: 2023-11-30 10:42:58
 * @LastEditors: txy 2679150788@qq.com
 * @LastEditTime: 2023-12-01 15:31:49
 * @FilePath: \frontend\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import './assets/main.css'
import axios from 'axios';
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import {createPinia} from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import App from './App.vue'
import router from './router'
import VueNativeSock from 'vue-native-websocket-vue3'
import {useTokenStore} from './stores/counter.js';

 

const app = createApp(App)
const pinia = createPinia();
const persist = createPersistedState();
pinia.use(persist)
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 假设您的 token 存储在某个变量中
const tokenStore = useTokenStore();
let token=tokenStore.token;

// 将 token 作为查询参数添加到 WebSocket URL
const wsAddress = `ws://localhost:8081/chat?token=${encodeURIComponent(token)}`;

app.use(VueNativeSock, wsAddress, {
  connectManually: true,
  format: 'json',
  reconnection: true, // (Boolean) 是否自动重连
  reconnectionAttempts: 1, // (Number) 重连次数
  reconnectionDelay: 3000, // (Number) 重连间隔时间
});

app.mount('#app')
