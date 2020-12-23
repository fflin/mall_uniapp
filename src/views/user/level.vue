<template>
	<com-card label="会员等级标题">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUpTitle +'会员等级'" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form :formLabel="upLoadLabel" :form="upLoadForm.Level"></com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="dialog(false)">新增会员等级</el-button>
				<!-- @clear="clear" -->
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
					<template slot="button">
						<el-button size="medium" type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
			<!-- 表格数据 -->
			<com-tabel :resData="tabData" :tabLabel="tabLabel" @edit="dialog" @del="del" :config="config" @Size="init()"
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
		components: {ComCard,ComTabel,ComForm},
		data() {
			return {
				// 列表数据承载
				tabData: [],
				// 表格
				tabLabel: [{
						label: '等级名称',
						prop: 'name',
						width: '',
						type: ''
					},
					{
						label: '升级条件',
						prop:'',
						width: '',
						type:'tj'
					},
					{
						label: '折扣率(%)',
						prop: 'discount',
						width: '',
						type: ''
					},
					{
						label: '等级权重',
						prop: 'weight',
						width: '',
						type: ''
					},
					{
						label: '状态',
						prop: 'status',
						width: '',
						type: 'status'
					}
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
				// 新增/编辑
				upLoad: false,
				// 新增、编辑标题
				popUp: -1,
				upLoadLabel: [
					{model: 'name',label: '等级名称'},
					{model: 'weight',label: '等级权重',type:'InputNumber',pl:'默认为1'},
					{
						model: 'status',
						label: '是/否启用',
						type:'radio',
						opts: [
							{label: '1',text: '启用'},
							{label: '0',text: '禁用'}
						]
					},
					{model: 'maxPrice',label: '升级条件',type:'tj',small:'累计消费满',dw:'元'},
					{model: 'maxTimes',label: '',type:'tj',small:'累计次数满',dw:'次'},
					{model: 'discount',label: '折扣率(%)'}
				],
				upLoadForm: {
					//会员等级
					Level: {
						name:'',
						weight:'',
						status:'',
						maxPrice:'',
						maxTimes:'',
						discount:''
					}
				},
				id: '',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{model: 'keyword',label: '等级名称',type: ''}],
			}
		},
		computed: {
			popUpTitle() {
				return this.popUp > -1 ? '编辑':'新增'
			}
		},
		created() {this.init()},
		methods: {
			//会员等级数据
			async init() {
				const res = await this.axios.get('/rest/Level',{
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
			clear() {
				this.init()
			},
			dialog(e = false){
				if(!e){
					this.upLoadForm.Level = {name:'',weight:'1',status:'1',maxPrice:'',maxTimes:'',discount:'90'}
					this.popUp = -1
				}else{
					this.upLoadForm.Level = {
						name:e.row.name,
						weight:e.row.weight,
						status:e.row.status,
						maxPrice:e.row.maxPrice,
						maxTimes:e.row.maxTimes,
						discount:e.row.discount
					}
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
					const res = await this.axios.delete(`/rest/Level/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			// 提交
			async confirm() {
				let res;
				let msg = this.popUp !== -1 ? '编辑' : '新增';
				if (this.id) {
					res = await this.axios.put(`/rest/Level/${this.id}`, this.upLoadForm.Level)
				
				} else {
					res = await this.axios.post('/rest/Level', this.upLoadForm.Level)
					
				}
				this.upLoad = false
				this.init()
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
