/*
 * @Author: txy 2679150788@qq.com
 * @Date: 2023-11-30 10:03:24
 * @LastEditors: txy 2679150788@qq.com
 * @LastEditTime: 2023-12-01 15:24:25
 * @FilePath: \frontend\src\utils\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
// import {useTokenStore} from '@/stores/counter.ts';
import router from '@/router';

// 设置后台服务地址
const baseURL = '';
const request = axios.create()
// request拦截器，将用户token放入头中
      let token = sessionStorage.getItem("token");
//添加请求拦截器
request.interceptors.request.use(
  (config)=>{
      //请求前的回调
      //添加token
      
      // const tokenStore = useTokenStore();
      // let token=tokenStore.token;
      //判断有没有token
      if(token){
        config.headers['authorization'] = token
      }
      return config;
  },
  (err)=>{
      //请求错误的回调
      Promise.reject(err)
  }
)

//添加响应拦截器
request.interceptors.response.use(
  response => {
    console.log(response)
    // 判断执行结果
    if (!response.data.success) {
      return Promise.reject(response.data.errorMsg)
    }
    return response.data;
      
  },
  err => {
      //判断响应状态码,如果为401,则证明未登录,提示请登录,并跳转到登录页面
      if(err.response.status===401){
          console.log('请先登录')
          router.push('/')
      }else{
        console.log('服务异常')
      }
     
      return Promise.reject(err);//异步的状态转化成失败的状态
  }
)

export default request;