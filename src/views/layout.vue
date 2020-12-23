<template>
	<el-container>
		<el-aside width="auto">
			<com-aside></com-aside>
		</el-aside>
		<el-container>
			<el-header>
				<com-header></com-header>
			</el-header>
			<el-main>
				<router-view></router-view>
				<!-- 回到顶部 -->
				<el-backtop target=".el-main" :bottom="100">
					<div class="up">
						<i class="el-icon-caret-top">1111</i>
					</div>
				</el-backtop>
				
			</el-main>
			
		</el-container>
	</el-container>
</template>

<script>
// 引入aside组件
import ComAside from '@/components/common/aside.vue'
import ComHeader from '@/components/common/header.vue'

export default {
	components:{
		ComAside,ComHeader
	}
};
</script>

<style lang="scss" scoped>
.el-container {
	height: 100%;
}
.el-header {
	background-color: $header-bg-color;
	color: #333;
	text-align: center;
	line-height: 60px;

}
.el-aside {
	background-color: $aside-bg-color;
	color: #333;
	text-align: left;
	line-height: 200px;
	
}
.el-main {
	background-color: $main-bg-color;
	color: #333;

}
// 回到顶部
.up{
	height: 100%;
	width: 100%;
	background-color: #f2f5f6;
	box-shadow: 0 0 6px rgba(0,0,0, .12);
	text-align: center;
	line-height: 40px;
	color: #18BC9C;
	border-radius: 100%;
}

</style>
