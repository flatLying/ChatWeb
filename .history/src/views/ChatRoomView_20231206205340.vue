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
	  :room-id="roomId"
	  :rooms="JSON.stringify(rooms)"
	  :messages="JSON.stringify(messages)"
	  :room-actions="JSON.stringify(roomActions)"
	  :loading-rooms="loadingRooms"
	  :rooms-loaded="roomsLoaded"
	  :room-message="roomMessage"
	  @send-message="sendMessage($event.detail[0])"
	  @fetch-messages="fetchMessages($event.detail[0])"
	/>
</template>

<script>
import { register } from 'vue-advanced-chat'
import request from '@/utils/request';
import VueNativeSock from 'vue-native-websocket-vue3'
import { parseTimestamp, formatTimestamp } from '@/utils/dates'
import {useTokenStore} from '../stores/counter.js';

register()

  export default {

	emits: ['show-demo-options'],
    data() {
      return {
		socket: null,
        currentUserId: '1',
		loadingRooms: false,
		roomsLoaded: true,
		messagesLoaded: false,
		roomMessage: '',
		roomId: '',
		// roomsLoadedCount: 0,
		messagesPerPage: 10,
        rooms: [],
        messages: [],
        roomActions: [
  		 {name: 'archiveRoom',title: 'Archive Room'},
          { name: 'inviteUser', title: 'Invite User' },
          { name: 'removeUser', title: 'Remove User' },
          { name: 'deleteRoom', title: 'Delete Room' }
        ]
      }
    },
	methods: {
		sendMessage(message) {
			this.messages = [
				...this.messages,
				{
					_id: this.messages.length,
					content: message.content,
					senderId: this.currentUserId,
					timestamp: new Date().toString().substring(16, 21),
					date: new Date().toDateString(),
					files: message.files,
					replyMessage: message.replyMessage
				}
			]
      // 发送消息
	  console.log(message)
      this.$socket.sendObj(message);

    },
	fetchMessages({ options = {} }) {
			setTimeout(() => {
				if (options.reset) {
					this.messages = this.addMessages(true)
				} else {
					this.messages = [...this.addMessages(), ...this.messages]
					this.messagesLoaded = true
				}
				// this.addNewMessage()
			})
		},

		addMessages(reset) {
			const messages = []

			for (let i = 0; i < 30; i++) {
				messages.push({
					_id: reset ? i : this.messages.length + i,
					content: `${reset ? '' : 'paginated'} message ${i + 1}`,
					senderId: '4321',
					username: 'John Doe',
					date: '13 November',
					timestamp: '10:20'
				})
			}

			return messages
		},

	},
	// computed: {
	// 	loadedRooms() {
	// 		return this.rooms.slice(0, this.roomsLoadedCount)
	// 	}
	// },
	mounted() {
		var that=this;
		request.get('http://localhost:8080/user/islogin', {
			//headers:{authorization:sessionStorage.getItem("token")}
			}).then(function (response){
				that.currentUserId=response.data
			}).catch((error) => {
				console.log(error);
				});
			request.post('http://localhost:8080/rooms', {
			//headers:{authorization:sessionStorage.getItem("token")}
			}).then(function (response) {
				that.rooms=response.data
				// this.rooms=response.data;
  			})
		// 获取 token
		const tokenStore = useTokenStore();
		let token = tokenStore.token;
		const wsAddress = `ws://localhost:8081/chat?token=${encodeURIComponent(token)}`;

		this.$connect(wsAddress, {
		format: 'json',
		reconnection: true,
		reconnectionAttempts: 1,
		reconnectionDelay: 3000,
		});
		// 连接 WebSocket
		// this.$connect();

		// 监听接收消息
		this.$options.sockets.onmessage = (event) => {
			console.log(event)
		if (event.data) {
			const data = JSON.parse(event.data);
			console.log(data);
		}
	};
},
  beforeUnmount() {
    // 断开 WebSocket 连接
    this.$disconnect();
  }
}
</script>
