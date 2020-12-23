<template>
	<com-card label="商品属性">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUpTitle" :visible.sync="upLoad" width="42%" center>
				<!-- form表单 -->
				<com-form ref="child" :rules="rules" :formLabel="upLoadLabel" :form="upLoadForm" />
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="dialog(false)">新增属性</el-button>
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
					<template slot="button">
						<el-button type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
			<!-- 表格数据 -->
			<com-tabel
				:resData="tabData" :tabLabel="tabLabel"
				@edit="dialog" @del="del" :config="config" 
				@Size="init()" @Current="init()" />
			
		</template>
	</com-card>
</template>

<script>
	// 引入card组件
	import ComCard from '@/components/common/card.vue'
	// com-tabel
	import ComTabel from '@/components/common/table.vue';
	// com-form from
	import ComForm from '@/components/common/form.vue';
	export default {
		props:{
			ids:{},
			row:String
		},
		components: {ComCard,ComTabel,ComForm},
		data() {
			return {
				tabData: [],
				// 新增/编辑
				upLoad: false,
				// 新增、编辑标题
				popUp:-1,
				upLoadLabel: [
					{model: 'name',label: '属性名称',width: '26rem'},
					{model: 'parent',label:'商品类型',type: 'selects',width: '26rem',Single: []},
					{
						model: 'ys',
						label: '分类筛选样式',
						type: 'radio',
						opts: [
							{label: '0',text: '文字 '},
							{label: '1',text: '颜色'},
							{label: '2',text: '图片'}
						]
					},
					{
						model: 'js',
						label: '能否进行检索',
						type: 'radio',
						opts: [{
								label: '0',
								text: '不检索'
							},
							{
								label: '1',
								text: '关键字检索'
							},
							{
								label: '2',
								text: '范围检索'
							}
						]
					},
					{
						model: 'gl',
						label: '商品属性关联',
						type: 'radio',
						opts: [
							{label: '1',text: '是'},
							{label: '0',text: '否'},
						]
					},
					{
						model: 'kx',
						label: '属性是否可选',
						type: 'radio',
						opts: [{
								label: '0',
								text: '唯一'
							},
							{
								label: '1',
								text: '单选'
							},
							{
								label: '2',
								text: '复选'
							}
						]
					},
					{
						model: 'way',
						label: '属性值的录入方式',
						type: 'radio',
						opts: [
							{label: '0',text: '手工'},
							{label: '1',text: '列表选择'}
						]
					},
					{model: 'lb',label: '属性值可选值列表',type: 'textarea',width: '26rem'},
					{
						model: 'add',
						label: '是否支持手动新增',
						type: 'radio',
						opts: [
							{label: '1',text: '是'},
							{label: '0',text: '否'},
						]
					},
					{model: 'sort',label: '排序',type: 'InputNumber',pl: '默认为50,最小为1',width: '26rem',}
				],
				rules:{
					name:[
						{required:true,message:'属性名称不能为空',trigger:'change'}
					],
					lb:[
						{required:true,message:'属性值可选值列表不能为空',trigger:'change'}
					]
				},
				upLoadForm: {//属性标题
					name:'',
					parent:'',
					ys:'',
					js:'', 
					gl:'',
					kx:'',
					way:'',
					lb:'',
					add:'',
					sort:''

				},
				id:'',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{model: 'keyword',label: '属性名称',type: ''}],
				// 表格
				tabLabel: [
					{label: '属性名称',prop:'name'},
					{label: '商品类型',prop:'parent',type:'parent'},
					{label: '属性是否可选',prop:'kx',type:'kxset'},
					{label: '属性值的录入方式',prop:'way',type:'wayset'},
					{label: '可选值列表',prop:'lb',type:'j',width:'200px'},
					{label: '排序',prop: 'sort'},
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
			}
		},
		
		created() {
			this.__init()
			this.init()
		},
		computed:{
			popUpTitle() {return this.popUp > -1 ? '编辑属性' : '新增属性'}
		},
		
		methods: {
			async __init(){//对应ID的数据
				const res = await this.axios.get('http://127.0.0.1:3336/category')
				let obj = res.data
				for (let i = 0; i < obj.length; i++) {
					let k = obj[i].list
					for (let j = 0; j < k.length; j++) {
						if(k[j].parent===this.ids){
							this.tabData = k
							// console.log(k)
						}
					}
				}
			},
			async init() {// 商品类型
				const rul = await this.axios.get('/rest/Category')
				let key = this.upLoadLabel
				for (let i = 0; i < key.length; i++) {
					key[i].Single = rul.data.items
				}
				
				
			},
			//清除keyword
			clear() {this.init()},
			// 新增、编辑弹框
			dialog(e = false){
				if(!e){//新增
					this.upLoadForm = {
						name:'',
						parent:'',
						ys:'0',
						js:'0', 
						gl:'0',
						kx:'1',
						way:'1',
						lb:'',
						add:'1',
						sort:50
					}
					this.popUp = -1
				}else{//编辑
					this.upLoadForm = {
						name:e.row.name,
						parent:e.row.parent,
						ys:e.row.ys,
						js:e.row.js, 
						gl:e.row.gl,
						kx:e.row.kx,
						way:e.row.way,
						lb:e.row.lb,
						add:e.row.add,
						sort:e.row.sort
					}
					this.id = e.row._id
					this.popUp = e.$index
				}
				this.upLoad = true
			},
			
			del(row) { //删除
				this.$confirm('您确定删除该条数据吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/rest/Spec/${row._id}`)
					const msg = res.data.msg
					this.$notify({title: '提示',message: msg,type: 'success',duration: '1200'})
					this.init()
				})
			},

			async confirm() { //确定
			
				let res;
				let msg = this.popUp !==-1 ? '编辑' : '新增';
				if (this.id) {
					res = await this.axios.put(`/rest/Spec/${this.id}`, this.upLoadForm)
				}else{
					res = await this.axios.post('/rest/Spec', this.upLoadForm)
				}
				this.upLoad = false
				this.__init()
				this.$notify({title: '提示',message: msg + '成功',type: 'success',duration: '1200'})
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	.time {
		display: flex;
		justify-content: space-between;
		// 顶部对齐
		align-items: flex-start;
	}
</style>
