let routes = [
	{
		// 公共视图文件layout
		path:'/',
		name:'layout',
		// 重定向
		redirect: {name: 'home'},
		component:()=>import ('@/views/layout'),
		// 子界面
		children:[
			
			/** 首页 */
			{
				path:'/',
				name:'home',
				component:()=>import ('@/views/home')
			},
			/**end  首页 */
			
			{//广告位置
				path:'/src/adsite',
				name:'adsite',
				component:()=>import ('@/views/src/adsite')
			},
			{//广告列表
				path:'/src/ads',
				name:'ads',
				component:()=>import ('@/views/src/ads')
			},
			/** end 相册管理 */
			
			/** 商品管理 */
			{
				path:'/goods',
				name:'goods',
				component:()=>import ('@/views/goods/index')
				
			},
			{//商品属性
				path:'/goods/property',
				name:'property',
				component:()=>import ('@/views/goods/property')
			},
			
			{
				path:'/goods/addProduct',
				name:'addProduct',
				component:()=>import ('@/views/goods/addProduct')
				
			},
			{
				path:'/goods/addProduct/:id',
				name:'addProduct',
				component:()=>import ('@/views/goods/addProduct'),
				props:true
			},
			{
				path:'/goods/classify',
				name:'classify',
				component:()=>import ('@/views/goods/classify')
				
			},
			{
				path:'/goods/category',
				name:'category',
				component:()=>import ('@/views/goods/category')
				
			},
			
			{
				path:'/goods/comment',
				name:'comment',
				component:()=>import ('@/views/goods/comment')
				
			},
			{ //商品属性
				path:'/goods/specs/:ids/:row',
				name:'specs',
				component:()=>import ('@/views/goods/specs'),
				props:true
				
			},
			{ //商品参数
				path:'/goods/parameter/:id',
				name:'parameter',
				component:()=>import ('@/views/goods/parameter')
				
			},
			{
				path:'/goods/brand',
				name:'brand',
				component:()=>import ('@/views/goods/brand')
			},
			/**end  商品管理 */
			
			/** 订单管理 */
			{
				path:'/orders',
				name:'orders',
				component:()=>import ('@/views/orders/index')
				
			},
			
			{
				path:'/orders/sales',
				name:'sales',
				component:()=>import ('@/views/orders/sales')
				
			},
			{
				path:'/orders/returnSet',
				name:'returnSet',
				component:()=>import ('@/views/orders/returnSet')
				
			},
			
			/**end  订单管理 */
			
			/** 营销管理 */
			{
				path:'/marketing',
				name:'marketing',
				component:()=>import ('@/views/marketing/index')
				
			},
			{
				path:'/marketing/coupon',
				name:'coupon',
				component:()=>import ('@/views/marketing/coupon')
				
			},
			{
				path:'/marketing/like',
				name:'like',
				component:()=>import ('@/views/marketing/like')
				
			},
			
			{
				path:'/marketing/newShop',
				name:'newShop',
				component:()=>import ('@/views/marketing/newShop')
				
			},
			/**end  营销管理 */
			
			/** 会员管理 */
			{
				path:'/user',
				name:'user',
				component:()=>import ('@/views/user')
			},
			{
				path:'/user/level',
				name:'level',
				component:()=>import ('@/views/user/level')
			},
			/**end 会员管理 */
			
			/** 权限设置 */
			{
				path:'/rbac',
				name:'manager',
				component:()=>import('@/views/rbac')
			},
			{//角色列表
				path:'/rbac/role',
				name:'role',
				component:()=>import('@/views/rbac/role')
			},
			{//权限列表
				path:'/rbac/rule',
				name:'rule',
				component:()=>import('@/views/rbac/rule')
			},
			{//资源列表
				path:'/rbac/resource',
				name:'resource',
				component:()=>import('@/views/rbac/resource')
			},
			
			/**end 权限设置 */
			
			/** 系统设置 */
			{
				path:'/set',
				name:'sets',
				component:()=>import ('@/views/set')
			},
			{
				path:'/set/delivery',
				name:'delivery',
				component:()=>import ('@/views/set/delivery')
			},
			{
				path:'/set/deal',
				name:'deal',
				component:()=>import ('@/views/set/deal')
			},
			/**end 系统设置 */
			
		],
		
	},
	{
		//login
		path:'/login',
		name:'login',
		component:()=>import('@/views/login')
	},
	{
		// 重定向
		path: '*',
		redirect: {
			name: 'home'
		}
	}
]
export default routes