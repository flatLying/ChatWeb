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
	/>
</template>

<script>
import { register } from 'vue-advanced-chat'
import request from '@/utils/request';
import VueNativeSock from 'vue-native-websocket-vue3'
import {useTokenStore} from '../stores/counter.js';

register()

  export default {
    data() {
      return {
		socket: null,
        currentUserId: '1234',
		loadingRooms: false,
		roomsLoaded: true,
		roomMessage: '',
		roomId: '',
		// roomsLoadedCount: 0,
		messagesPerPage: 10,
        rooms: [
    {
        "roomId": 1,
        "roomName": "testroom_0",
        "avatar": "https://th.bing.com/th/id/R.3a92f56a81f7aabf19e9085a439edbb5?rik=yEUblrAsqjAGhg&riu=http%3a%2f%2fpic16.nipic.com%2f20110921%2f8321961_093340500167_2.jpg&ehk=Tx8G98JikAshw%2bTyVYZDYUg8HOmexLivN6BF35geDDQ%3d&risl=&pid=ImgRaw&r=0",
        "unreadCount": 2,
        "index": 2,
        "users": [
            {
                "_id": 1,
                "username": "彼岸星光",
                "avatar": "https://img2.woyaogexing.com/2021/04/17/c242fdada04b440e80ab613175aa3d0e!400x400.jpeg",
                "status": {
                    "state": "online",
                    "lastChanged": "26十一月, 15:26"
                }
            },
            {
                "_id": 2,
                "username": "测试机器人0",
                "avatar": "https://th.bing.com/th/id/OIP.-cdDkdSsW26cIvrT5QtwNQAAAA?rs=1&pid=ImgDetMain",
                "status": {
                    "state": "offline",
                    "lastChanged": "3十二月, 22:37"
                }
            }
        ]
    },
    {
        "roomId": 6,
        "roomName": "TestRoom_4",
        "avatar": "https://th.bing.com/th/id/R.4e0fde231ad9e17721610e4d54e5cc14?rik=PfmO09P%2biw%2bqYw&pid=ImgRaw&r=0",
        "unreadCount": 2,
        "index": 8,
        "users": [
            {
                "_id": 1,
                "username": "彼岸星光",
                "avatar": "https://img2.woyaogexing.com/2021/04/17/c242fdada04b440e80ab613175aa3d0e!400x400.jpeg",
                "status": {
                    "state": "online",
                    "lastChanged": "26十一月, 15:26"
                }
            },
            {
                "_id": 2,
                "username": "测试机器人0",
                "avatar": "https://th.bing.com/th/id/OIP.-cdDkdSsW26cIvrT5QtwNQAAAA?rs=1&pid=ImgDetMain",
                "status": {
                    "state": "offline",
                    "lastChanged": "3十二月, 22:37"
                }
            },
            {
                "_id": 3,
                "username": "测试机器人1",
                "avatar": "https://c-ssl.duitang.com/uploads/blog/202102/24/20210224181345_c9473.jpg",
                "status": {
                    "state": "offline",
                    "lastChanged": "3十二月, 22:37"
                }
            },
            {
                "_id": 4,
                "username": "测试机器人2",
                "avatar": "https://th.bing.com/th/id/R.ccfe574d132ca2dc38bf76858f77e941?rik=IW%2bSoAn93nM4Dg&pid=ImgRaw&r=0&sres=1&sresct=1",
                "status": {
                    "state": "offline",
                    "lastChanged": "3十二月, 22:37"
                }
            }
        ]
    }
],
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

    }
		
	},
	// computed: {
	// 	loadedRooms() {
	// 		return this.rooms.slice(0, this.roomsLoadedCount)
	// 	}
	// },
	mounted() {
		request.get('http://localhost:8080/user/islogin', {
			//headers:{authorization:sessionStorage.getItem("token")}
			}).then(function (response) {
				console.log("服务器响应");
    			console.log(response);
  			})
			request.post('http://localhost:8080/rooms', {
			//headers:{authorization:sessionStorage.getItem("token")}
			}).then(function (response) {
				console.log(response.data)
				console.log(JSON.stringify(this.rooms) == JSON.stringify(response.data));
				let agentsList=response.data
				// console.log(Object.prototype.toString.call(response.data[0]))    
				// this.rooms.splice(0,response.data.length-1,response.data)
				this.rooms=response.data
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
