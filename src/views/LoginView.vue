<template>
  <div style="width: 100vw; height: 100vh; margin-left: -60px;">
    <!-- 其他组件内容 -->

    <!-- iframe引入loginsign.html -->
    <iframe 
      src="/LoginSignupPage.html" 
      style="width: 100%; height: 100%; border: none;"
      id="myIframe"
    ></iframe>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import {useTokenStore} from '@/stores/counter.js';
export default {
  name: 'MyComponent',
  data(){
    return{
      isLoginPage: 1,  // 1表示在直接密码登录， 0表示在验证码登录
    }
    
  },
  // 组件逻辑
  methods: {
    
  setupIframeListener() {
    const iframe = document.getElementById('myIframe');
    iframe.onload = () => {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const signInButton = iframeDocument.getElementById("form2");
      const signUpButton = iframeDocument.getElementById("form1");
      const sendCodeButton = iframeDocument.getElementById("send-code-button")
      signInButton.addEventListener('submit', this.handleSignIn);
      signUpButton.addEventListener('submit', this.handleSignUp);
      sendCodeButton.addEventListener('click', this.handleSendCode)
    };
  },
  handleSignUp(e){
    e.preventDefault();
    alert(this.getSignupUserFromIframe())
    alert(this.getSignupEmailFromIframe())
    alert(this.getSignupPasswordFromIframe())
    // 这里可以执行后续操作，比如使用 Axios 发送请求
  },
  
  handleSignIn(e) {
    e.preventDefault();

    if (this.getSigninStatusFromIframe() === 'login'){
      alert(this.getSigninEmailFromIframe())
      alert(this.getSigninPasswordFromIframe())
      const tokenStore=useTokenStore();
      request.post('http://localhost:8080/user/login2', {
        phone: this.getSigninEmailFromIframe(),
        password: this.getSigninPasswordFromIframe()
      })
      .then(response => {
        console.log("登录响应：");
        console.log(response);
        if (response.success === true) {
          // 登录成功，跳转到 /chat
          alert("login_success")
          // sessionStorage.setItem("token", response.data.data);
          tokenStore.setToken(response.data);
          this.$router.push('/chat');
        } else {
          // 处理登录失败的情况
          alert("login_fail")
          console.log('Login failed:', response.data);
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        // 处理错误
      });

    }
    else{
      alert(this.getSigninEmailFromIframe())
      alert(this.getSigninVerifyCodeFromIframe())
    }


    // 这里可以执行后续操作，比如使用 Axios 发送请求
  },
  handleSendCode(){
    alert("send_code")
  },

  sendSignInRequest() {
    // 获取输入数据，例如邮箱和密码
    const email = this.getSigninEmailFromIframe();
    const password = this.getSigninPasswordFromIframe();

    // 使用 Axios 发送请求
    request.post('YOUR_SERVER_ENDPOINT', {
      email: email,
      password: password
    })
    .then(response => {
      console.log(response);
      // 处理响应
    })
    .catch(error => {
      console.error(error);
      // 处理错误
    });
  },



  // 下面都是获取数据
  getSigninEmailFromIframe() {
    const iframe = document.getElementById('myIframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const emailInput = iframeDocument.querySelector('.container--signin input[type="phone"]');
    return emailInput ? emailInput.value : null;
  },
  getSigninVerifyCodeFromIframe() {
    const iframe = document.getElementById('myIframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const emailInput = iframeDocument.querySelector('.container--signin .verify-code-input');
    return emailInput ? emailInput.value : null;
  },
  getSigninStatusFromIframe(){
    const iframe = document.getElementById('myIframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const emailInput = iframeDocument.querySelector('.container--signin .status');
    return emailInput ? emailInput.value : null;
  },

  getSigninPasswordFromIframe() {
    const iframe = document.getElementById('myIframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const passwordInput = iframeDocument.querySelector('.container--signin input[type="password"]');
    return passwordInput ? passwordInput.value : null;
  },
  getSignupUserFromIframe() {
    const iframe = document.getElementById('myIframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const passwordInput = iframeDocument.querySelector('.container--signup input[type="text"]');
    return passwordInput ? passwordInput.value : null;
  },
  getSignupEmailFromIframe() {
    const iframe = document.getElementById('myIframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const passwordInput = iframeDocument.querySelector('.container--signup input[type="phone"]');
    return passwordInput ? passwordInput.value : null;
  },
  getSignupPasswordFromIframe() {
    const iframe = document.getElementById('myIframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const passwordInput = iframeDocument.querySelector('.container--signup input[type="password"]');
    return passwordInput ? passwordInput.value : null;
  },
  

},

setup(){
  
},

mounted() {
  this.setupIframeListener();
}

}
</script>

<style>
  body, html {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden; /* 如果您不想页面出现滚动条 */
  }
</style>
