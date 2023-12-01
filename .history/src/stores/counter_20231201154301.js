/*
 * @Author: txy 2679150788@qq.com
 * @Date: 2023-11-30 10:42:58
 * @LastEditors: txy 2679150788@qq.com
 * @LastEditTime: 2023-12-01 15:41:58
 * @FilePath: \frontend\src\stores\counter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
export const useTokenStore = defineStore('token',()=>{
  //定义状态的内容

  //1.响应式变量
  const token = ref('')

  //2.定义一个函数,修改token的值
  const setToken = (newToken)=>{
      token.value = newToken
  }

  //3.函数,移除token的值
  const removeToken = ()=>{
      token.value=''
  }

  return {
      token,setToken,removeToken
  }
},{
  persist:true//持久化存储
});