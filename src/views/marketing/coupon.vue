<template>
	<com-card label="优惠券">
		<template slot="content">
			<!-- 创建/编辑 -->
			<el-dialog :title="popUpTitle+'优惠券'" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form :formLabel="upLoadLabel" :form="upLoadForm.Coupon"></com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="dialog(false)">创建优惠券</el-button>
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
					{ label: '优惠劵名称', prop:'name',type:'tp'},
					{ label: '使用门槛', prop:'mk',desc:'无金额门槛'},
					{ label: '适用范围', prop:'parent',desc:'全部商品'},
					{ label: '领取起止时间', prop:'btime',type:'btimes',width:'170px'},
					{ label: '有效起止时间', prop:'stime',type:'coupon'},
					{ label: '已使用/已领取/总数', prop:'total',type:'totals',width:'160px'}
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
				// 创建/编辑
				upLoad: false,
				// 创建、修改标题
				popUp: -1,
				upLoadLabel: [
					{model:'name',label: '优惠劵名称',width: '24rem'},
					{model:'parent',label: '适用范围',type: 'select',width: '24rem'},
					{model:'limit',label:'优惠额度',width: '24rem',type:'unit',append:'元',pl:'金额(整数)'},
					{model:'mk',label:'使用门槛',width: '24rem',type:'unit',prepend:'满',append:'元可用',show:true,pl:'金额(整数)'},
					{model:'total',label:'数量',type:'unit',width: '24rem',append:'1~9999之间的整数',pl:'数量(整数)'},
					{model:'btime',label:'领取起止时间',type:'date',width:'24rem',desc:'领取期限最长30天，期限内用户可自行领取'},
					{model:'stime',label:'有效起止时间',type:'unit',width:'24rem',show:true,prepend:'用户领取后',
						append:'天内有效',pl:'天数(整数)',desc:'有效期限最长30天'
					}
				],
				upLoadForm: {
					//广告位置标题
					Coupon: {
						name: '',
						parent:'',
						limit:'',
						mk:'',
						total:'',
						btime:'',
						stime:''
					}
				},
				id: '',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{
					model: 'keyword', //值
					label: '优惠券名称',
					type: ''
				}],
			}
		},
		computed: {
			popUpTitle() {
				return this.popUp > -1 ? '编辑':'创建'
			}
		},
		created() {this.init()},
		methods: {
			//列表数据
			async init() {
				const res = await this.axios.get('/rest/Coupon',{
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
			// 创建、修改
			dialog(e = false){
				if(!e){
					this.upLoadForm.Coupon = {name: '',limit:'',mk:'',total:'',btime:'',stime:'3'}
					this.popUp = -1
				}else{
					this.upLoadForm.Coupon = {
						name:e.row.name,
						limit:e.row.limit,
						mk:e.row.mk,
						total:e.row.total,
						btime:e.row.btime,
						stime:e.row.stime,
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
					const res = await this.axios.delete(`/rest/Coupon/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			// 提交
			async confirm() {
				let res;
				let msg = this.popUp !== -1 ? '编辑' : '创建';
				if (this.id) {
					res = await this.axios.put(`/rest/Coupon/${this.id}`, this.upLoadForm.Coupon)
					
				} else {
					res = await this.axios.post('/rest/Coupon', this.upLoadForm.Coupon)
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
