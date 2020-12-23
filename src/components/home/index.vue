<template>
	<div>
		<!-- 第一个统计 -->
		<el-row :gutter="20">
		  <el-col :span="4" v-for="(item,index) in dataList" :key="index">
			  <div class="info">
				  <i :class="[item.icon,item.color]"></i>
				  <div class="ml-1">
					  <h4 class="mb-1">{{item.total}}</h4>
					  <small class="small">{{item.title}}</small>
				  </div>
			  </div>
		  </el-col>
		</el-row>
		<!-- 第二个统计 -->
		<div style="margin-top: 50px;height: 500px;">
			<el-row :gutter="20">
				<el-col :span="14">
					<el-card style="height: 500px;" shadow="hover">
						<!-- 插槽echarts -->
						<slot name="order"></slot>
					</el-card>
				</el-col>
				
				<el-col :span="10">
					<div class="row">
						<el-card  shadow="hover" 
						style="margin-bottom:10px;width: 30%;cursor: pointer;"
						v-for="(item,index) in tjeList" :key="index">
							<div class="desc">
								<div class="infos">
									<i :class="item.icon"></i>
									<div class="ml-1">
										<h5 class="mb-1">{{item.total}}</h5>
										<small class="small">{{item.title}}</small>
									</div>
								</div>
								<div class="border"></div>
							</div>
						</el-card>
						
					</div>
				</el-col>
			</el-row>
		</div>
		<!-- 第三个统计 -->
		<el-row :gutter="20">
			<!-- 销量行榜(圆形) -->
			<el-col :span="12">
				<el-card style="height: 500px;" shadow="hover">
					<!-- 销量排行数据 -->
					<slot name="sales"></slot>
				</el-card>
			</el-col>
			<el-col :span="12">
				<!-- 会员统计 -->
				<el-card style="height: 500px;" shadow="hover">
					<!-- 用户数据（有坐标） -->
					<slot name="user"></slot>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	
	export default{
		
		props: {
			dataList:Array,
			tjeList:Array
		},
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/home'
</style>
