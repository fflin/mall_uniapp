
<template>
	<com-card>
		<template slot="content">
			<home-index :dataList="dataList" :tjeList="tjeList">
				<!-- 拆线统计图-->
				<template slot="order">
					<echarts-index style="height: 460px;" :echartData="echartData.order"></echarts-index>
				</template>
				<!-- 销量排行数据（饼图） -->
				<template slot="sales">
					<echarts-index style="height: 460px;" :echartData="echartData.sales" :isAxisChart="false"></echarts-index>
				</template>
				<!-- 会员统计 -->
				<template slot="user">
					<echarts-index style="height: 460px;" :echartData="echartData.user" :title="echartData.user.title"></echarts-index>
				</template>
				
			</home-index>
			
			
			
		</template>
	</com-card>
</template>

<script>
	//引入card组件
	import ComCard from '@/components/common/card.vue'
	// home->index组件
	import HomeIndex from '@/components/home/index.vue'
	// 引入echarts
	import EchartsIndex from '@/components/echarts/index.vue'
	
	export default{
		components: {
			ComCard,HomeIndex,EchartsIndex
		},
		data() {
			return {
				//统计一数据(承载)
				dataList:[],
				// 统计二数据(承载)
				tjeList:[],
				// Echarts数据承载
				echartData:{
					//销量统计(数据，有坐标)
					order:{
						xData:[],
						series:[]
					},
					//销量排行数据（饼图）
					sales:{
						series:[]
					},
					//用户数据（有坐标）
					user:{
						title:'会员统计',
						xData:[],
						series:[]
						
					}
				}
				
			}
		},
		// 生命周期钩子函数(初始化数据)
		created() {
			this.__init()
		},
		methods: {
			async __init() {
				this.axios.get('/home/getData').then(res => {
					let rulest = res.data.data
					// 统计一数据
					this.dataList = rulest.tjyList
					// 统计二数据
					this.tjeList = rulest.totalCount
					// 订单折线图数据
					let order = rulest.orderData
					
					// 获取订单拆线图X轴数据
					this.echartData.order.xData = order.date
					// 取出series-->data里面在部分键名
					let keyArray = Object.keys(order.data[0])
					// 循环数据
					keyArray.forEach(key => {
						this.echartData.order.series.push({
							name:key,
							data:order.data.map(item => item[key]),
							type: 'line'
						})
					})
					
					// 单品销量(饼图)
					this.echartData.sales.series.push({
						data:rulest.salesData,
						type:'pie'
					})
					// 用户活跃统计(柱状图)
					this.echartData.user.xData = rulest.userData.map(item => item.date)
					//赋值
					this.echartData.user.series.push({
						name:'新增用户',
						data:rulest.userData.map(item => item.active),
						type:'bar',
						barGap:'10%'
						
					})
					this.echartData.user.series.push({
						name:'活跃用户',
						data:rulest.userData.map(item => item.new),
						type:'bar',
						barGap:'10%'
						
						
					})
					
					
				}).catch(err => {
					console.log(err)
				})
			},
			
		},
		
	}
</script>


<style lang="scss" scoped>
	
</style>