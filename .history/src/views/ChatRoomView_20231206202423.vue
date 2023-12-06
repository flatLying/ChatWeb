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
        currentUserId: 1,
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
	resetMessages() {
			this.messages = []
			this.messagesLoaded = false
		},
		formatMessage(room, message) {
			// const senderUser = room.users.find(user => user._id === message.sender_id)
			const formattedMessage = {
				...message,
				...{
					senderId: message.sender_id,
					_id: message.id,
					seconds: message.timestamp.seconds,
					timestamp: parseTimestamp(message.timestamp, 'HH:mm'),
					date: parseTimestamp(message.timestamp, 'DD MMMM YYYY'),
					username: room.users.find(user => message.sender_id === user._id)
						?.username,
					// avatar: senderUser ? senderUser.avatar : null,
					distributed: true
				}
			}

			if (message.replyMessage) {
				formattedMessage.replyMessage = {
					...message.replyMessage,
					...{
						senderId: message.replyMessage.sender_id
					}
				}
			}

			return formattedMessage
		},
	fetchMessages({room}) {
			this.$emit('show-demo-options', false)
			this.messages = []
			this.messagesLoaded = false
			this.selectedRoom = room.roomId
            alert(this.selectedRoom)
			let tmpmsg=[
				{
					_id: '7890',
					indexId: 12092,
					content: 'Message 1',
					senderId: 2,
					username: 'John Doe',
					avatar: 'assets/imgs/doe.png',
					date: '13 November',
					timestamp: '10:20',
					system: false,
					saved: true,
					distributed: true,
					seen: true,
					deleted: false,
					failure: true,
					disableActions: false,
					disableReactions: false,
					files: [
					{
						name: 'My File',
						size: 67351,
						type: 'png',
						audio: true,
						duration: 14.4,
						url: 'https://firebasestorage.googleapis.com/...',
						preview: 'data:image/png;base64,iVBORw0KGgoAA...',
						progress: 88
					}
					],
					reactions: {
					'😁': [
						'1234', // USER_ID
						'4321'
					],
					'🥰': [
						'1234'
					]
					},
					replyMessage: {
					content: 'Reply Message',
					senderId: '4321',
					files: [
						{
						name: 'My Replied File',
						size: 67351,
						type: 'png',
						audio: true,
						duration: 14.4,
						url: 'https://firebasestorage.googleapis.com/...',
						preview: 'data:image/png;base64,iVBORw0KGgoAA...'
						}
					]
					},
				}]
			tmpmsg.forEach(message => {
					// const formattedMessage = this.formatMessage(room, message)
					this.messages.unshift(message)
				})
			// this.messages = [...tmpmsg]
			// this.messagesLoaded = true
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
				that.senderId=response.data
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
