import Cookie from 'js-cookie'

export default{
	state:{
		// 折叠
		isCollapse:false,
		// 选中的菜单
		currentMenu:null,
		// 承载tag标签
		tagList:[
			{path:'/',name:'home',label:'控制台'}
		]
	},
	getters:{},
	mutations:{
		// 折叠方法
		collapseMenu(state){
			state.isCollapse = !state.isCollapse
		},
		//获取tag标签
		asideTagMenu(state,val){
			if(val.name !== 'home')
			{
				state.currentMenu = val
				let rulest = state.tagList.findIndex(item => item.name === val.name)
				rulest === -1 ? state.tagList.push(val) : '',
				// 本地存储
				Cookie.set('tagsList',JSON.stringify(state.tagList))
			}else{
				state.currentMenu = null
			}
		},
		// 防止刷新时tag标签丢失(在app.vue调用)
		getTagMenu(state){
			if(Cookie.get('tagsList')){
				let tagsList = JSON.parse(Cookie.get('tagsList'))
				// 赋值
				state.tagList = tagsList
			}
		},
		// 关闭tag标签
		closeTag(state,val){
			let rulest = state.tagList.findIndex(item => item.name === val.name)
			state.tagList.splice(rulest,1)
			//本地存储
			Cookie.set('tagsList',JSON.stringify(state.tagList))
		},
		
		
	},
	actions:{}
}