import Vue from 'vue'
import Router from 'vue-router'
// 引入公共路由文件
import routes from '@/common/config/router.js'

Vue.use(Router)

let router = new Router({
  routes
})

// 全局前置守卫
router.beforeEach((to,from,next) => {
	//获取token
	let token = window.sessionStorage.getItem('token')
	console.log("token - "+token)
	if(token){
		//防止重复登录
		if(to.path == '/login'){
			Vue.prototype.$message.error('请不要重复登录')
			return next({
				name: from.name ? from.name : 'home'
			})
		}
		next()
	}else{
		//跳过登录验证
		if(to.path === '/login'){
			return next()
		}
		//未登录
		next({path:'/login'})
		
	}
})



export default router