<template>
	<div style="height: 100%;" ref="echart"></div>
</template>

<script>
// 引入echarts
import echarts from 'echarts';
export default {
	props: {
		// 传参
		echartData: {
			type: Object,
			//通过函数返回
			default(){
				return {
					// X轴数据
					xData:[],
					// Y轴数据
				    series:[]
				}
			} 
		},
		//默认是有坐标
		isAxisChart:{
			type:Boolean,
			default: true
		},
		// title
		title:{
			type:String,
			default:'销量统计'
		}
	},
	computed: {
		options() {
			// 判断是哪种图表
			return this.isAxisChart ? this.isOption : this.normalOption
		},
		// 通过判断是否折叠
		isCollapse(){
			return this.$store.state.menu.isCollapse
		}
	},
	// 监听
	watch:{
		// 监听echartData变化(异步操作)
		echartData:{
			//异步操作
			handler(){
				this.initEchart()
			},
			//打开
			deep:true
		},
		// 监听折叠
		isCollapse(){
			setTimeout(()=>{
				// 图表自适应
				this.resizeEchart()
			},300)
		}
	},
	data() {
		return {
			// 数据承载
			echart: null,
			// 有坐标图表
			isOption:{
				// 标题
				title: {text: this.title},
				//X轴
				xAxis:{
					type:'category',
					data:[],
					//轴线颜色
					axisLine:{lineStyle:{color:'#17b3a3'}},
					//字体颜色
					axisLabel:{color:'#333'}
				},
				//Y轴
				yAxis:[
					{
						type:'value',
						//轴线颜色
						axisLine:{lineStyle:{color:'#17b3a3'}},
					}
				],
				//图表样式
				series:[],
				// 颜色
				color: [
					'#2ec7c9',
					'#b6a2de',
					'#5ab1ef',
					'#ffb980',
					'#d87a80',
					'#8d98b3',
					'#e5cf0d',
					'#97b552',
					'#95706d',
					'#dc69aa',
					'#07a2a4',
					'#9a7fd1',
					'#588dd5',
					'#f5994e',
					'#c05050',
					'#59678c',
					'#c9ab00',
					'#7eb00a',
					'#6f5553',
					'#c14089'
				],
				// 图例字体颜色
				legend:{textStyle:{color:'#333'}},
				// 图表位置
				grid:{left:'20%',width:'auto'},
				// 悬浮提示
				tooltip:{trigger:'axis'}
			},
			// 无坐标图表
			normalOption:{
				title: {text: '销量排行'},
				// 悬浮提示
				tooltip: {trigger: 'item'},
				// 颜色
				color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],
				// 图表样式
				series: []
			}
		}
	},
	methods: {
		// 数据初始化(图表)
		initEchart(){
			//调用initEchartData
			this.initEchartData();
			if(this.echart){
				// 存在就赋值
				this.echart.setOption(this.options)
			}else{
				//不存在，先初始
				this.echart = echarts.init(this.$refs.echart)
				//再赋值
				this.echart.setOption(this.options)
			}
		},
		//数据处理方法
		initEchartData(){
			if(this.isAxisChart){
				// 有坐标值，赋值给prpos-->echartData.xData
				this.isOption.xAxis.data = this.echartData.xData
				// 图表样式
				this.isOption.series = this.echartData.series
			}else{
				//无坐标
				this.normalOption.series = this.echartData.series
			}
		},
		// 图表自动适应窗口
		resizeEchart(){
			this.echart ? this.echart.resize() : ''
		}
		
	},
	// mounted勾子定义resize
	// 自动计算
	mounted() {
		window.addEventListener('resize',this.resizeEchart)
	},
	// 关闭时销毁resize
	destroyed() {
		window.removeEventListener('resize',this.resizeEchart)
	}
};
</script>

<style>
	
</style>
