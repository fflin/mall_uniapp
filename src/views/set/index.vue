<template>
	<com-card label="基础设置">
		<template slot="content">
			<el-tabs v-model="activeName">
			   
			    <el-tab-pane v-for="(item,index) in tabPane" :key="index" 
					:label="item.label" :name="item.name">
					<el-form :ref='form' :model="form" label-width="140px">
						<!-- 注册与访问 -->
						<el-form-item v-if="index == 0 " v-for="singUp in singUpForm" :key="singUp.model" :label="singUp.label">
							
							<el-radio-group v-model="singUp.model">
							  <el-radio-button v-for="y in singUp.list" :key="y.label" :label="y.label" />
							</el-radio-group>
							
							<el-input v-if="singUp.type == 'input'"  v-model="singUp.model" 
							clearable :style="'width:'+singUp.width"/>
							
							<el-checkbox-group v-if="singUp.type == 'checkboxGroup'" v-model="singUp.model">
							    <el-checkbox-button v-for="k in singUp.list"  :key="k.label" />
							</el-checkbox-group>
							
							<el-button v-if="singUp.type == 'btn'" type="success">保存</el-button>
							
						</el-form-item>
						
						<!-- 上传设置 -->
						<el-form-item v-if="index == 1" v-for="ups in upForm" :key="ups.label" :label="ups.label">
							<el-radio-group  v-model="ups.model" >
							  <el-radio-button  v-for="upItem in ups.list" :key="upItem.label" :label="upItem.label" />
							</el-radio-group>
							<el-input v-if="ups.type == 'input'"  v-model="ups.model"
							clearable :style="'width:'+ups.width"/>
							<el-button v-if="ups.type == 'btn'" type="success">保存</el-button>
						</el-form-item>
						<!-- API安全 -->
						<el-form-item v-if="index == 2" v-for="api in apiForm" :key="api.label" :label="api.label">
							<el-radio-group  v-model="api.model" >
							  <el-radio-button  v-for="apiItem in api.list" :key="apiItem.label" :label="apiItem.label" />
							</el-radio-group>
							
							<el-input v-if="api.type == 'input'" type="password" show-password v-model="api.model"
								clearable :style="'width:'+api.width"/>
							<el-button v-if="api.type == 'btn'" type="success">保存</el-button>
						</el-form-item>
					</el-form>
					
				</el-tab-pane>
			</el-tabs>
			
			
		</template>
	</com-card>
</template>

<script>
	import ComCard from '@/components/common/card.vue'
	export default{
		components: {ComCard},
		data() {
			return {
				activeName: 'singUp',
				tabPane:[
					{label:'注册与访问',name:'singUp'},
					{label:'上传设置',name:'up'},
					{label:'API安全',name:'api'}
				],
				form:{},
				
				singUpForm:[
					{
						model:'status',
						label:'是否允许注册会员',
						type:'radioGroup',
						list:[
							{label:'是'},
							{label:'否'}
						]
					},
					{
						model:'class',
						label:'注册类型',
						type:'radioGroup',
						list:[
							{label:'普通注册'},
							{label:'手机注册'}
						]
					},
					{
						model:'8',
						label:'密码长度',
						type:'input',
						width:'13rem'
					},
					{
						model:'pwd',
						label:'密码复杂度',
						type:'checkboxGroup',
						list:[
							{label:'数字'},
							{label:'小写字母'},
							{label:'大写字母'},
							{label:'符号'}
						]
					},
					{model:'',label:'',type:'btn'}
				],
				upForm:[
					{
						model:'',
						label:'默认上传方式',
						type:'radioGroup',
						list:[
							{label:'本地'},
							{label:'oss'}
						],
					},
					{model:'',label:'Bucket',type:'input',width:'20rem'},
					{model:'',label:'ACCESS_KEY',type:'input',width:'20rem'},
					{model:'',label:'SECRET_KEU',type:'input',width:'20rem'},
					{model:'',label:'空间域名',type:'input',width:'20rem'},
					{model:'',label:'',type:'btn'}
				],
				apiForm:[
					{
						model:'',
						label:'是否开启API安全',
						type:'radioGroup',
						list:[
							{label:'是'},
							{label:'否'}
						],
					},
					{model:'',label:'秘钥',type:'input',width:'20rem'},
					{model:'',label:'',type:'btn'}
				],
				
			}
		},
		methods: {
			// handleClick(tab,event) {
			// 	console.log(tab,event)
			// }
		},
	}
</script>

<style>
</style>
