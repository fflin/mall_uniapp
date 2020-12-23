<template>
	<com-card label="品牌管理">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUp === 'add' ? '新增品牌' : '编辑品牌'" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form :formLabel="upLoadLabel" :form="upLoadForm.Brand"
				@afterUpload="afterUpload" :headers="getAuthHeaders()"></com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="addUser">新增品牌</el-button>
				<!-- @clear="clear" -->
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
					<template slot="button">
						<el-button type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
			<!-- 表格数据 -->
			<com-tabel :resData="tabData" :tabLabel="tabLabel" @edit="editUser" @del="del" :config="config" @Size="init()"
			 @Current="init()">
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
		components: {
			ComCard,
			ComTabel,
			ComForm
		},
		data() {
			return {
				// 列表数据承载
				tabData: [],
				// 表格
				tabLabel: [
					{
						label: '品牌LOGO',
						prop: 'src',
						type: 'imageUrl'
					},
					{
						label: '品牌名称',
						prop: 'name',
					},
					{
						label: '品牌首字母',
						prop:'initial',
					},
					{
						label: '排序',
						prop: 'order',
					},
					{
						label: '品牌制造商',
						prop: 'ismake',
						type: 'switch'
					},
					{
						label: '状态',
						prop: 'status',
						type: 'status'
					},
					{
						label: '相关',
						prop: 'correlation',
						type: 'goodInfo',
						
					},
					{
						label: '品牌故事',
						prop: 'desc',
					},
				],
				// 分页
				config: {
					page: 1,
					sizes: [20, 30, 40, 50],
					size: 20,
					total: 0
				},
				// 新增/编辑
				upLoad: false,
				// 默认为新增
				popUp: 'add',
				upLoadLabel: [
					{model:'src',label: '品牌LOGO',type:'imageUrl'},
					{model:'name',label: '品牌名称',width:'24rem'},
					{model:'initial',label:'品牌首字母',width:'24rem'},
					{model:'order',label:'排序',type:'InputNumber',width:'24rem'},
					{model:'ismake',label:'品牌制造商',type:'radio',opts:[{label: "1",text: '是'},{label: "0",text: '否'}]},
					{model:'correlation',label:'相关',width:'24rem'},
					{model:'desc',label:'品牌故事',width:'24rem'},
					{
						model: 'status',
						label: '是/否启用',
						type:'radio',
						opts: [{label: "1",text: '启用'},{label: "0",text: '禁用'}]
					}
				],
				upLoadForm: {
					Brand: {
						src:'',
						name:'',
						initial:'',
						order:'',
						ismake:'',
						correlation:'',
						desc:'',
						status: ''
					}
				},
				id: '',
				// 搜索条件
				serachForm: {
					keyword: ''
				},
				// 搜索
				formLabel: [{
					model: 'keyword', //值
					label: '品牌/字母',
					type: ''
				}],
			}
		},
		created() {this.init()},
		methods: {
			
			//列表数据
			async init() {
				const res = await this.axios.get('/rest/Brand',{
					params:{
						keyword: this.serachForm.keyword,
						page: this.config.page,
						pageSize: this.config.size
					}
				})
				this.tabData = res.data.items
				this.config.total = res.data.total
			},
			//清除查询
			clear() {this.init()},
			// 新增
			addUser() {
				this.popUp = 'add'
				this.upLoadForm.Brand = {
					src:'',
					name:'',
					initial:'',
					order:'50',
					ismake:'1',
					correlation:'',
					desc:'',
					status: '1'
				}
				this.upLoad = true
			},
			// 修改
			editUser(row) {
				this.popUp = 'edit'
				this.upLoadForm.Brand = row
				this.id = row._id
				this.upLoad = true
			},
			//删除
			del(row) {
				this.$confirm('您确定删除该条数据吗？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/rest/Brand/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			// 提交
			async confirm() {
				let res;
				let msg = this.popUp === 'edit' ? '编辑' : '新增';
				if (this.popUp === 'edit') {
					res = await this.axios.put(`/rest/Brand/${this.id}`, this.upLoadForm.Brand)
					this.upLoad = false
					this.init()

				} else {
					res = await this.axios.post('/rest/Brand', this.upLoadForm.Brand)
					this.upLoad = false
					this.init()
				}
				this.$notify({
					title: '提示',
					message: msg + '成功',
					type: 'success',
					duration: '1200'
				})
			},
			afterUpload(res){//显示上传的图片
				this.upLoadForm.Brand.src = res.url
			},
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
