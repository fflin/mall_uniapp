 // 引入mockjs
 import Mock from 'mockjs'
 
 // 数据请求响应时间
 Mock.setup({
	 timeout:'200-600'
 })
 
 //引入模拟数据Api
 import homeApi from './apiData/home.js'
// 管理员
 import managerApi from './apiData/manager.js'
 
 // 接口(正则表示(/home/getData))
 Mock.mock(/\/home\/getData/,'get',homeApi.getData)

 // 管理员列表数据
 Mock.mock(/\/manager\/getData/,'get',managerApi.get)
 // 新增管理员
 Mock.mock(/\/manager\/AddData/,'post',managerApi.create)
 // 修改管理员
 Mock.mock(/\/manager\/UpData/,'post',managerApi.update)
 // 删除管理员
 Mock.mock(/\/manager\/del/,'get',managerApi.del)