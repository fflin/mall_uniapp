module.exports = {
	lintOnSave: false,
	devServer:{
		host: '0.0.0.0',
		port: 3339,
		open: true,
		https: false,
		// 代理
		proxy:{
			'/admin':{
				target:'http://127.0.0.1:3337/admin',//API
				ws:true,
				changreOrigin: true,//允许跨域
				pathRewrite:{
					//重写路径
					'^/admin':''
				}
			}
		}
	},
	// 引用scss
	css:{
		loaderOptions:{
			sass:{
				
				prependData:`@import "@/assets/scss/demo.scss";`
			}
		}
	}
}