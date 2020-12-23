<template>
	
	<el-menu
		:default-active="$route.path"
		:collapse="isCollapse"
		class="el-menu-vertical-demo"
		background-color="#222d32"
		text-color="#fff"
		active-text-color="#ffd04b"
		unique-opened
	>
	<!-- 单个菜单 -->
	<el-menu-item :index="item.path" v-for="item in onChildren" :key="item.path"
		@click="checkMenu(item)">
		<i :class="'el-icon-'+item.icon"></i>
		<span slot="title">{{item.label}}</span>
	</el-menu-item>
	
	<!-- 带子菜单 -->
	<el-submenu :index="item.label" v-for="(item,index) in hasChildren" :key="index">
		<template slot="title">
			<i :class="'el-icon-'+item.icon"></i>
			<span>{{item.label}}</span>
		</template>
		<el-menu-item-group>
			<el-menu-item :index="subItem.path" 
				v-for="(subItem,index) in item.children" :key="index"
				@click="checkMenu(subItem)">{{subItem.label}}</el-menu-item>
			
		</el-menu-item-group>
		
	</el-submenu>
		
	</el-menu>
</template>

<script>
	export default{
		data() {
			return {
				navMenu: []
			}
		},
		computed: {
			// 单个菜单
			onChildren() {
				// return this.navMenu.filter(item => !item.children)
				return this.navMenu.filter(item => item.children == 0)
			},
			// 带子菜单
			hasChildren(){
				return this.navMenu.filter(item => item.children && item.children != 0)
			},
			// 接收折叠事件
			isCollapse(){
				return this.$store.state.menu.isCollapse
			}
			
		},
		created() {
			this.init()
		},
		methods:{
			checkMenu(item){
				//实现页面的切换
				this.$router.push({name:item.name})
				
				// 动态获取标题
				this.$store.commit('selectMenu',item)
				// 获取动态tag
				this.$store.commit('asideTagMenu',item)
			},
			async init(){//获取菜单数据
				let res = await this.axios.get('/admin/rules')
				this.navMenu = res.data.items
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.el-menu{
		height: 100%;
		border-right:none;
	}
	// 防止折叠卡
	.el-menu-vertical-demo:not(.el-menu--collapse){
		width: 200px;
	}
</style>
