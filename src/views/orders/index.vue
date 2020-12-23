<template>
	<com-card label="订单列表">
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
					{ label: '订单号', prop:'orderid'},
					{ label: '提交时间', prop:'date'},
					{ label: '用户', prop:'memberid'},
					{ label: '订单金额', prop:'price',type:'price'},
					{ label: '支付方式', prop:'pay',type:'pay'},
					{ label: '订单状态', prop:'status',type:'orderStatus'},
					{ label: '操作', prop:'',type:'orderButton',
					list:[
						{name:'关闭订单'}
					]
					}
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
				// 创建/编辑
				upLoad: false,
				
				id: '',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{model: 'keyword',label: '订单号',type: ''}],
			}
		},
		created() {
			this.init()
		},
		methods: {
			//列表数据
			async init() {
				const res = await this.axios.get('/rest/Order',{
					params:{
						keyword:this.serachForm.keyword,
						page: this.config.page,
						pageSize: this.config.size
					}
				})
				console.log(res)
				// this.tabData = res
				// this.config.total = res.data.total
				
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
					const res = await this.axios.delete(`/rest/Order/${row._id}`)
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
