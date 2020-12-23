import Vue from 'vue'
import Vuex from 'vuex'

// 引入card
import card from './modules/card.js'
// 引入menu.js
import menu from './modules/menu.js'
//login.js
import user from './modules/user.js'
// 侧边菜单
import sideMenu from './modules/sideMenu.js'
Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		card,menu,user,sideMenu
	}
})