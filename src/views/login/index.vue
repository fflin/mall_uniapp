<template>
	<div class="body">
		<h1>奶爸-鲜奶智慧服务平台</h1>
		<div class="main-agileinfo">
			<h2>立即登录</h2>
			<!-- @keyup.enter="submit"回车事件 -->
			<el-form @submit.native.prevent="login" @keyup.enter="submit">
				<el-form-item prop="account">
					<el-input class="input" v-model="form.account" clearable type="text" placeholder="请输入账号" suffix-icon="el-icon-user-solid">
					</el-input>
				</el-form-item>
				
				<el-form-item prop="password">
					<el-input class="input" v-model="form.password" clearable type="password" placeholder="请输入密码" suffix-icon="el-icon-s-goods">
					</el-input>
				</el-form-item>
				
				<el-form-item>
					<el-input  placeholder="请输入验证码" v-model="form.code" clearable>
					    <template slot="append">
							<img :src="imgsrc" style="height: 30px;width: 100px;" @click="changeimg" >
						</template>
					  </el-input>
				</el-form-item>
				
				<el-form-item>
					<el-button type="danger" class="w-100" native-type="submit" :loading="loading" @click.native="login()"> {{loading ? '登录中...':'立即登录'}}
					</el-button>
				</el-form-item>
				
			</el-form>
		</div>
		<div class="footer-w3l">
			
			<p class="agile" @click="login()"> &copy; 2020 浙ICP备16028135号-1 All Rights Reserved | 百灵鸟 </p>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 登录按钮加载
				loading: false,
				form: {},
				imgsrc:'http://localhost:3337/admin/users/code'//验证码
			}
		},
		computed: {

		},
		methods: {
			changeimg(){//验证码刷新
				this.imgsrc='http://localhost:3337/admin/users/code?'+Math.random();
			},
			login() {
				
				this.loading = true
				
				// this.axios.post('/admin/users/signIn', this.form).then(res => {
				  
				// 	// 存到vuex
				// 	this.$store.commit('login', res.data)
				// 	// 跳转
				// 	this.$router.push({name: 'layout'})
				// 	// 成功提示
				// 	this.$notify.success({title: '提示',message: '登录成功',duration: '1200'})
				// 	// console.log(res.data)
				// }).catch(err => {
				// 	this.loading = false
				// }) 
				// 存到vuex
				this.$store.commit('login', "res.data")
				// 跳转
				this.$router.push({name: 'home'})
				// 成功提示
				this.$notify.success({title: '提示',message: '登录成功',duration: '1200'})
				this.loading = false
			}
		},
	}
</script>

<style lang="scss" scoped="scoped">
	.body {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		font-family: Verdana;
		background: url('../../assets/images/bg.jpg') no-repeat 0px 0px;
		background-size: cover;
		background-attachment: fixed;
		background-position: center;
	}

	h1 {
		text-align: center;
		font-size: 42px;
		margin-top: 50px;
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 5px;
	}

	.main-agileinfo {
		margin: 10% auto 13%;
		width: 28%;
	}

	.main-agileinfo h2 {
		color: #fff;
		font-size: 30px;
		margin-bottom: 30px;
	}

	.footer-w3l p {
		font-size: 14px;
		line-height: 25px;
		color: #fff;
		text-align: center;
		margin-bottom: 15px;
	}

	.footer-w3l p a {
		color: #fff;
	}

	.footer-w3l p a:hover {
		text-decoration: underline;
	}

	.w-100 {
		width: 100%;
	}

	.input {
		width: 100%;
		padding: 2px 2px 2px 2px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.15);
		background: #fff;
		border: none;
		outline: none;
		font-size: 14px;
		margin-bottom: 20px;
		background: rgb(255, 255, 255) url("../../assets/images/user.png") no-repeat 412px 11px;
	}
</style>
