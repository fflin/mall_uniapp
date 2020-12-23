export default {
	state:{
		token:false,
		user:{}
	},
	getters:{},
	mutations:{
		// 初始化用户信息(在App.vue调用)
		initUser(state){
			let user = window.sessionStorage.getItem('user')
			if(user){
				state.user = JSON.parse(user)
				state.token = state.token
			}
		},
		// 
		login(state,user){
			state.user = user
			state.token = user.token
			
			window.sessionStorage.setItem('user',JSON.stringify(state.user))
			window.sessionStorage.setItem('token',state.token)
		},
		
		
		//退出
		logout(state){
			state.token = false
			state.user = {}
			window.sessionStorage.clear()
		}
		
	},
	actions:{}
}