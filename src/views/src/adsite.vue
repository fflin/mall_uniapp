<template>
	<div>
		<com-card label="广告位置">
			<template slot="content">
				<!-- 新增/编辑 -->
				<el-dialog :title="pupUpTitle+'广告位置'" :visible.sync="upLoad" width="40%" center>
					<!-- form表单 -->
					<com-form :formLabel="upLoadLabel" :form="upLoadForm.Adsite"></com-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="upLoad = false">取 消</el-button>
						<el-button type="primary" @click="confirm">确 定</el-button>
					</span>
				</el-dialog>
				<!-- 查询 -->
				<div class="time">
					<el-button type="primary" @click.stop="dialog(false)">新增广告位置</el-button>
					<!-- @clear="clear" -->
					<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
						<template slot="button">
							<el-button type="info" @click="init(serachForm.keyword)">搜索</el-button>
						</template>
					</com-form>
				</div>
				<!-- 表格数据 -->
				<com-tabel :resData="tabData" :tabLabel="tabLabel" @edit="dialog" @del="del" :config="config" @Size="init()"
				 @Current="init()">
				</com-tabel>
			</template>
		</com-card>
	</div>
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
					{label: '广告位置',prop: 'name',width: '',type: ''},
					{label: '排序',prop: 'sort',width: ''},
					{label: '状态',prop: 'status',width: '',type: 'status'},
					{ label:'操作',prop:'',type:'cz' }
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
				// 新增/编辑
				upLoad: false,
				// 新增、编辑标题
				popUp: -1,
				upLoadLabel: [
					{
						model: 'name',
						label: '广告位置',
						width: '24rem'
					},
					{
						model: 'sort',
						label: '排序',
						type: 'InputNumber',
						pl:'默认为50',
						width: '24rem'
					},
					{
						model: 'status',
						label: '状态',
						type: 'radio',
						opts: [
							{label: "1",text: '启用'},
							{label: "0",text: '禁用'}
						]
					}
				],
				upLoadForm: {
					//广告位置标题
					Adsite: {
						name: '',
						sort: '',
						status: ''
					}
				},
				id: '',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{
					model: 'keyword', //值
					label: '广告位置',
					type: ''
				}],
			}
		},
		computed: {
			pupUpTitle() {
				return this.popUp > -1 ? '编辑':'新增'
			}
		},
		created() {this.init()},
		methods: {
			//列表数据
			async init() {
				const res = await this.axios.get('/admin/adsite',{
					params:{
						keyword:this.serachForm.keyword,
						page: this.config.page,
						pageSize: this.config.size
					}
				})
				this.tabData = res.data.items
				this.config.total = res.data.total
			},
			//清除查询
			clear() {this.init()},
			dialog(e = false){
				if(!e){
					this.upLoadForm.Adsite = {name:'',sort:50,status:'1'}
					this.popUp = -1
				}else{
					this.upLoadForm.Adsite = {name:e.row.name,sort:e.row.sort,status:e.row.status}
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
					const res = await this.axios.delete(`/admin/adsite/${row._id}`)
					const msg = res.data.message
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			// 提交
			async confirm() {
				let res;
				let msg = this.popUp !==-1 ? '编辑' : '新增';
				if (this.id) {
					res = await this.axios.put(`/admin/adsite/${this.id}`, this.upLoadForm.Adsite)
					
				} else {
					res = await this.axios.post('/admin/adsite', this.upLoadForm.Adsite)
				}
				this.upLoad = false
				this.init()
				const code = res.data.code
				if(code === 422) return
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
