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
		roomId: '1',
		messagesPerPage: 10,
        rooms: [{
			roomId: '1',
			roomName: 'Room 1',
			avatar: 'https://www.bing.com/images/search?view=detailV2&ccid=JmgB%2brCO&id=F65AB598884EEDD2EF68FEE4A76A2EA9BEEC677D&thid=OIP.JmgB-rCOyrEBuZCazT8cCAAAAA&mediaurl=https%3a%2f%2fimg2.woyaogexing.com%2f2021%2f04%2f17%2fc242fdada04b440e80ab613175aa3d0e!400x400.jpeg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.266801fab08ecab101b9909acd3f1c08%3frik%3dfWfsvqkuaqfk%252fg%26pid%3dImgRaw%26r%3d0%26sres%3d1%26sresct%3d1%26srh%3d800%26srw%3d800&exph=400&expw=400&q=%e5%a4%b4%e5%83%8f&simid=608044228712822748&FORM=IRPRST&ck=1550D37382E9B9CD6D46D4F42E2956F8&selectedIndex=1&itb=0',
			unreadCount: 4,
			index: 3,
			lastMessage: {
				_id: 'xyz',
				content: 'Last message received',
				senderId: '1234',
				username: 'John Doe',
				timestamp: '10:20',
				saved: true,
				distributed: false,
				seen: false,
				new: true
				},
			users: [
			{
				_id: '1234',
				username: 'John Doe',
				avatar: 'assets/imgs/doe.png',
				status: {
				state: 'online',
				lastChanged: 'today, 14:30'
				}
			},
			{
				_id: '4321',
				username: 'John Snow',
				avatar: 'assets/imgs/snow.png',
				status: {
				state: 'offline',
				lastChanged: '14 July, 20:00'
				}
			}
    		],
    		typingUsers: [ 4321 ]
		}],
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
	mounted() {
		request.get('http://localhost:8080/user/islogin', {
			//headers:{authorization:sessionStorage.getItem("token")}
			}).then(function (response) {
				console.log("服务器响应");
    			console.log(response);
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
