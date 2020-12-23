<template>
	<com-card label="退货申请列表">
		<template slot="content">
			
			<!-- 查询 -->
			<div class="time">
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
					<template slot="button">
						<el-button type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
			<!-- 表格数据 -->
			<com-tabel :resData="tabData" :tabLabel="tabLabel" 
				:indexShow="false"
			    :handle="false"
				@del="del" 
				:config="config" 
				@Size="init()"
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
				tabLabel: [
					{ label: '服务单号', prop:'odd'},
					{ label: '申请时间', prop:'date'},
					{ label: '用户账号', prop:'memberid'},
					{ label: '退款金额', prop:'price',type:'price'},
					{ label: '申请状态', prop:'status',type:'saleStatus'},
					{ label: '处理时间', prop:'cldate'},
					{ label: '操作', prop:'',type:'orderButton',}
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
				// 创建/编辑
				upLoad: false,
				
				id: '',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{model: 'keyword',label: '服务单号',type: ''}],
			}
		},
		created() {
			this.init()
		},
		methods: {
			//列表数据
			async init() {
				const res = await this.axios.get('/rest/Sale',{
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
			
			//删除
			del(row) {
				this.$confirm('您确定删除该条数据吗？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/rest/Sale/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			// 提交
			async confirm() {
				console.log('提交')
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
