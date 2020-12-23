import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'



import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/layout.scss'


import router from './router.js'
import store from './store'

import './mock'// 引入mock

import Moment from 'moment'//引入时间转换
// 定义全局时间戳过滤器
Vue.filter('formatDate',(v => {
	return Moment(v).format('YYYY-MM-DD HH:mm:ss')
}))


Vue.use(ElementUi);
Vue.prototype.axios = axios



// 引入element-ui message提示
import { Message } from 'element-ui'
// 拦截器(请求之前)
axios.interceptors.request.use(config => {
	// 获取token
	if(sessionStorage.token){
		config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
	}
	
	return config;
},(error)=> {
	// 对请求错误做些什么
	return Promise.reject(error);
})

// 拦截器(请求之后)
axios.interceptors.response.use(res => {
	return res
},err => {
	if(err.response.data.message){
		Message({
			type:'error',
			message:err.response.data.message
		})
	}
	
})


Vue.config.productionTip = false

/* 为上传图片获取token mixin*/ 
Vue.mixin({
	computed: {
		uploadUrl() {//图片上传地址
			return 'http://127.0.0.1:3336/admin/upload'
		}
	},
	methods: {//获取token
		getAuthHeaders() {
			return {
				Authorization: `Bearer ${sessionStorage.token || ''} `
			}
		}
	},
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
