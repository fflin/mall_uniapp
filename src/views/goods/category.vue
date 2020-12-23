<template>
	<com-card label="商品类型">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUpTitle" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form ref="child" :rules="rules" :formLabel="upLoadLabel" :form="upLoadForm"  />
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
				
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="dialog(false)">新增</el-button>
				
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear" >
					<template slot="button">
						<el-button type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
			<!-- 表格数据 -->
			<com-tabel :resData="tabData" :tabLabel="tabLabel" 
				@del="del" @edit="dialog"
				:config="config" @Size="init()"
				@Current="init()" @getTos="getTos">
			</com-tabel>
		</template>
	</com-card>
</template>

<script>
	// 引入card组件
	import ComCard from '@/components/common/card.vue';
	// com-tabel
	import ComTabel from '@/components/common/table.vue';
	// com-form from
	import ComForm from '@/components/common/form.vue';
	export default {
		components: {ComCard,ComTabel,ComForm},
		
		data() {
			return {
				// 列表数据承载
				tabData: [],
				// 表格
				tabLabel: [
					{label: '类型名称',prop:'name'},
					{
						label: '属性数量',
						prop:'parent',
						type:'total',
					},
					// {label: '参数数量',prop:'parameter'},
					{
						label:'设置',
						prop:'',
						type:'button',
						list:[
							{name:'属性列表',url:'specs'},
							// {name:'参数列表',url:'parameter'}
						]
						
					}
				],
				// 分页
				config: {page: 1,sizes: [20, 30, 40, 50],size: 20,total: 0},
				// 新增/编辑
				upLoad: false,
				// 新增、编辑标题
				popUp: -1,
				upLoadLabel: [
					{model:'name',label: '类型名称',width:'24rem'},
					{model:'sort',label: '排序',width:'24rem',type:'InputNumber'},
				],
				upLoadForm: {name:'',sort:''},
				rules:{//校验
					name:[{required:true,message:'类型名称不能为空',trigger:'change'}],
					sort:[{required:true,message:'排序不能为空',trigger:'change'}]
				},
				id: '',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{model: 'keyword',label: '类型名称',type: ''}],
			
			}
		},
		
		created() {this.init()},
		computed:{
			popUpTitle() {return this.popUp > -1 ? '编辑' : '新增'}
		},
		methods: {
			
			//列表数据
			async init() {
				const res = await this.axios.get('http://127.0.0.1:3336/category')
				this.tabData = res.data
				console.log(res.data)
			},
			//清除查询
			clear() {this.init()},
			// 新增、编辑弹框
			dialog(e = false){
				if(!e){//新增
					this.upLoadForm = {name:'',sort:50}
					this.popUp = -1
				}else{//编辑
					this.upLoadForm = {name:e.row.name,sort:e.row.sort}
					this.id = e.row._id
					this.popUp = e.$index
				}
				this.upLoad = true
			},
			//删除
			del(row) {
				this.$confirm('您确定删除该条数据吗？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/rest/Category/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			cancel(){//取消
				this.upLoad = false
			},
			// 提交
			async confirm() {
				let res;
				let msg = this.popUp !==-1 ? '编辑' : '新增';
				if (this.id && this.popUp !==-1 ) {
					res = await this.axios.put(`/rest/Category/${this.id}`, this.upLoadForm)
				}else{
					res = await this.axios.post('/rest/Category', this.upLoadForm)
				}
				this.upLoad = false
				this.init()
				this.$notify({title: '提示',message: msg + '成功',type: 'success',duration: '1200'})
			},
			//设置
			getTos(e,row){
				this.$router.push({name:e,params:{ids:row._id,row:row.name} })
				
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
