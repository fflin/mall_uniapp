<template>
	<header>
		<!-- 左边 -->
		<div class="l-content">
			<!-- 展开、收缩 -->
			<el-button v-show="!isCollapse" type="text" size="mini" icon="el-icon-s-fold" @click="collapseMenu"></el-button>
			<el-button v-show="isCollapse" type="text" size="mini" icon="el-icon-s-unfold" @click="collapseMenu"></el-button>
			<!-- tag标签 -->
			<div class="tag">
				<com-tag></com-tag>
			</div>
		</div>
		<!-- 右边 -->
		<div class="r-content">
			<!-- 全屏 -->
			<div class="full">
				<el-tooltip class="item" effect="dark" :content="isFullscreen === true ? '取消全屏' : '全屏'" placement="bottom">
					<i class="el-icon-rank" style="color: white;font-size: 25px;cursor: pointer;" @click="full"></i>
				</el-tooltip>
			</div>
			<!-- 头像 -->
			<el-avatar class="avatar" v-if="user" :src="user ? user.user.src:circleUrl"></el-avatar>
			<!-- 用户、下拉菜单 -->
			<el-dropdown @command="logout">
				<span class="el-dropdown-link" style="cursor: pointer;font-size: 18px;color: white;font-weight: bold;">
					{{ user.user.account }}<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="set">个人设置</el-dropdown-item>
					<el-dropdown-item command="logout">安全退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</header>
</template>

<script>
	//vuex
	import { mapState } from 'vuex'
	// 引入screenfull
	import screenfull from 'screenfull'
	// 引入tag标签
	import ComTag from './tag.vue'
	

	export default {
		components: {ComTag},

		data() {
			return {
				// 头像
				circleUrl: "https://ssjt.oss-cn-beijing.aliyuncs.com/public/jr.jpeg",
				//全屏
				isFullscreen: false
			}
		},
		computed: {
			// 折叠（判断显示）
			isCollapse() {
				return this.$store.state.menu.isCollapse
			},
			...mapState({
				user:state => state.user.user,
			})
			
		},
		methods: {
			collapseMenu() {
				this.$store.commit('collapseMenu')
			},
			//全屏方法
			full() {
				if (!screenfull.isEnabled) {
					this.$message.warning({
						message: '无法全屏'
					})
					return false
				}
				screenfull.toggle()
				this.isFullscreen = true
			},
			logout(command){//退出
				if(command === 'logout'){
					this.$store.commit('logout')
					//消息提示
					this.$notify.success({title:'提示',message: '退出成功',duration: '1200'})
					// 返回登录
					this.$router.push({name:'login'})
				}
			}
		},

	}
</script>

<style lang="scss" scoped>
	header {
		display: flex;
		justify-content: space-between;
		height: 100%;
		align-items: center;

		.l-content {
			display: flex;
			align-items: center;

			.tag {
				margin-left: 15px;
			}
		}

		.el-button {
			font-size: 25px;
			color: white;
		}

		.r-content {
			display: flex;
			align-items: center;

			.avatar {
				margin-right: 10px;
			}

			.full {
				margin-right: 20px;
				// 旋转
				transform: rotate(20deg);
				-webkit-transform: rotate(20deg);
				/*兼容-webkit-引擎浏览器*/
				-moz-transform: rotate(20deg);
				/*兼容-moz-引擎浏览器*/
			}
		}

	}
</style>
