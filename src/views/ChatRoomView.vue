<template>
	<vue-advanced-chat
	:style="{ 
			height: 'calc(100vh - 80px)', 
			width: '90vw',
			margin: 'auto', /* 水平和垂直居中 */
			position: 'absolute', /* 绝对定位 */
			top: '50%', /* 垂直居中 */
			left: '50%', /* 水平居中 */
			transform: 'translate(-50%, -50%)' /* 调整位置以确保真正的居中 */
		}"
	  :current-user-id="currentUserId"
	  :rooms="JSON.stringify(rooms)"
	  :messages="JSON.stringify(messages)"
	  :room-actions="JSON.stringify(roomActions)"
	/>
  </template>

<script>
  import { register } from 'vue-advanced-chat'
  register()

  // Or if you used CDN import
  // window['vue-advanced-chat'].register()

  export default {
    data() {
      return {
		socket: null,
        currentUserId: '1234',
        rooms: [],
        messages: [],
        roomActions: [
          { name: 'inviteUser', title: 'Invite User' },
          { name: 'removeUser', title: 'Remove User' },
          { name: 'deleteRoom', title: 'Delete Room' }
        ]
      }
    },
	methods: {
		connect() {
      this.socket = new WebSocket('ws://localhost:8081/chat');

      this.socket.onopen = () => {
        console.log('WebSocket连接已打开！');
      };

      this.socket.onmessage = (event) => {
        console.log('收到消息：', event.data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket错误：', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket连接已关闭！');
      };
    },
    sendMessage() {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send('你好，WebSocket！');
      } else {
        console.log('WebSocket连接未开启！');
      }
    }
		
	},
	created() {
		this.connect()
	},
	beforeDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  },
  }
</script>
