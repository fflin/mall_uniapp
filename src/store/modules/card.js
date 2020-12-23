import Cookie from 'js-cookie'
export default{
	state:{
		//当前选中的菜单
		currentMenu:{path:'/',label:'控制台',name:'home'}
		
	},
	getters:{},
	mutations:{
		selectMenu(state, val){
			if(val.name !== 'home'){
				state.currentMenu = val
				
			}else{
				state.currentMenu = null
			}
		},
		
		
	},
	actions:{}
}