// 引入mockjs
import Mock from 'mockjs'

// 图表数据
let List = []
export default {
	getData:()=>{
		for (let i = 0; i < 7; i++) {
			List.push(
				Mock.mock({
					贵州山花: Mock.Random.float(100, 1000000, 0, 2),
					特伦苏: Mock.Random.float(100, 1000000, 0, 2),
					蒙牛: Mock.Random.float(100, 1000000, 0, 2),
					伊利: Mock.Random.float(100, 1000000, 0, 2),
					一鸣真鲜: Mock.Random.float(100, 1000000, 0, 2),
					Weidendorf德亚: Mock.Random.float(100, 1000000, 0, 2),
				})
			)
		}
		return {
			//状态码
			code:20000,
			data:{
				//统计一数据
				tjyList:[
					{title:'总会员数 (个)',icon:'el-icon-user-solid',color:'bg-danger',total:Mock.Random.integer(10,5000)},
					{title:'总访问数 (次)',icon:'el-icon-info',color:'bg-violet',total:Mock.Random.integer(10,5000)},
					{title:'本月销量 (笔)',icon: 'el-icon-picture', color: 'bg-primary',total:Mock.Random.integer(10,5000)},
					{title:'总订单数 (笔)',icon: 'el-icon-s-shop', color: 'bg-blue',total:Mock.Random.integer(10,5000)},
					{title:'今日订单总金额 (元)', icon: 'el-icon-s-order', color: 'bg-warning',total:Mock.Random.integer(10,5000)},
					{title:'总金额 (元)',        icon: 'el-icon-s-claim', color: 'bg-green',total:Mock.Random.integer(10,5000)}
				],
				//统计二数据
				totalCount: [
					{ title: '今日注册',    icon: 'el-icon-circle-plus',            color: 'success', total: Mock.Random.integer(430,800)},
					{ title: '今日登录',    icon: 'el-icon-user',                   color: 'success', total: Mock.Random.integer(321,800)},
					{ title: '今日订单',    icon: 'el-icon-s-order',                color: 'success', total: Mock.Random.integer(4310,8000)},
					{ title: '未处理订单',  icon: 'el-icon-s-opportunity',          color: 'success', total: Mock.Random.integer(430,800)},
					{ title: '七日新增',    icon: 'el-icon-s-finance',              color: 'success', total: Mock.Random.float(60, 100, 0, 2)},
					{ title: '出售中',      icon: 'el-icon-s-shop',                 color: 'success', total: Mock.Random.integer(430,800)},
					{ title: '等待回复',    icon: 'el-icon-folder-opened',          color: 'success', total: Mock.Random.integer(430,800)},
					{ title: '库存预警',    icon: 'el-icon-coordinate',             color: 'success', total: Mock.Random.integer(1,10)},
					{ title: '仓库中',      icon: 'el-icon-s-marketing',            color: 'success', total: Mock.Random.integer(1,10) },
					{ title: '待付款' ,     icon: 'el-icon-s-flag',                 color: 'success', total: Mock.Random.integer(1,10)},
					{ title: '待配送',      icon: 'el-icon-s-finance',              color: 'success', total: Mock.Random.integer(1,300)},
					{ title: '已配送',      icon: 'el-icon-s-data',                 color: 'success', total: Mock.Random.integer(1,900)},
					{ title: '已接收',      icon: 'el-icon-s-ticket',               color: 'success', total: Mock.Random.integer(1,900) },
					{ title: '已接收' ,     icon: 'el-icon-picture-outline-round',  color: 'success', total: Mock.Random.integer(1,8)},
					{ title: '待售后' ,     icon: 'el-icon-picture-outline',        color: 'success', total: Mock.Random.integer(1,2000)}
				],
				// 单品销量(饼图)
				salesData:[
					{name:'贵州山花',value:Mock.Random.float(100, 1000000, 0, 2)},
					{name:'特伦苏',value:Mock.Random.float(100, 1000000, 0, 2)},
					{name:'蒙牛',value:Mock.Random.float(100, 1000000, 0, 2)},
					{name:'伊利',value:Mock.Random.float(100, 1000000, 0, 2)},
					{name:'一鸣真鲜',value:Mock.Random.float(100, 1000000, 0, 2)},
					{name:'Weidendorf德亚',value:Mock.Random.float(100, 1000000, 0, 2)}
					
				],
				// 销量统计(拆线图)
				orderData:{
					date:['2020/1', '2020/2', '2020/3', '2020/4', '2020/5', '2020/6', '2020/7'],
					data:List
				},
				// 用户活跃统计(柱状图)
				userData:[
					{
						date:'周一',
						new: Mock.Random.integer(100, 1000),
						active: Mock.Random.integer(100, 1000)
					},
					{
						date:'周二',
						new: Mock.Random.integer(100, 1000),
						active: Mock.Random.integer(100, 1000)
					},
					{
						date:'周三',
						new: Mock.Random.integer(100, 1000),
						active: Mock.Random.integer(100, 1000)
					},
					{
						date:'周四',
						new: Mock.Random.integer(100, 1000),
						active: Mock.Random.integer(100, 1000)
					},
					{
						date:'周五',
						new: Mock.Random.integer(100, 1000),
						active: Mock.Random.integer(100, 1000)
					},
					{
						date:'周六',
						new: Mock.Random.integer(100, 1000),
						active: Mock.Random.integer(100, 1000)
					},
					{
						date:'周日',
						new: Mock.Random.integer(100, 1000),
						active: Mock.Random.integer(100, 1000)
					}
				]

			}
		}
	}
}