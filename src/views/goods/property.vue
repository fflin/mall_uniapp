<template>
	<com-card label="商品属性">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUp === 'add' ? '新增商品属性' : '编辑商品属性'" :visible.sync="upLoad" width="50%" center>
				<!-- form表单 -->
				<el-form ref="form" :model="form" label-width="100px" class="demo-dynamic">
					<el-row :gutter="20">
						<!-- 标题 -->
						<el-form-item v-for="k in pLabel" :key="k.model" :label="k.label">
							<el-input v-model="form[k.model]" :placeholder="'请输入'+k.label" :style="'width:'+k.width" clearable />
						</el-form-item>
						<!-- 内容 -->
						<el-table :data="form.list" style="width: 100%;" border>
							<el-table-column v-for="item in PtabLabel" :key="item.prop" :label="item.label" align="center">
								<template slot-scope="scope">
									<el-input v-model="scope.row[item.prop]" clearable :placeholder="'请输入'+item.label"></el-input>
								</template>
							</el-table-column>

							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<el-button size="medium" type="danger" @click="form.list.splice(scope.row,1)">DEL</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-row>
					<!-- button -->
					<div style="margin-left: 1rem; margin-top: 1rem;">
						<el-button type="primary" @click="form.list.push({})">新增</el-button>
						<el-button type="info" @click="upLoad = false">取 消</el-button>
						<el-button type="success" @click="confirm">提交</el-button>
					</div>
				</el-form>

			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="addUser">新增商品属性</el-button>

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
		components: {ComCard,ComTabel,ComForm},
		data() {
			return {
				form:{
					title: '',
					sort: '',
					list: []
				},
				tabData: [],// 列表数据承载
				pLabel:[
					{model:'title',label:'属性标题',width:'24rem'},
					{model:'sort',label:'排序',width:'24rem'}
				],
				tabLabel: [// 表格
					{label: '属性标题',prop: 'title'},
					{label: '排序',prop: 'sort'},
					{label: '属性数量',prop: 'list',type: 'count'},
					{label: '参数数量',prop: ''}
				],
				PtabLabel: [//popup
					{label: '图标',prop: 'icon'},
					{label: '名称',prop: 'name'},
					{label: '容量',prop: 'sub_name'},
					{label: '数量',prop: 'numb'},
					{label: '价格',prop: 'price'}
				],
				config: {page: 1,sizes: [20, 30, 40, 50],size: 20,total: 0},// 分页
				upLoad: false,// 新增/编辑
				// 默认为新增
				popUp: 'add',
				id: '',
				// 搜索条件
				serachForm: {keyword:''},
				// 搜索
				formLabel: [{model:'keyword',label: '属性标题',type: ''}],

			}
		},
		created() {
			this.init()
		},
		methods: {

			//列表数据
			async init() {
				const res = await this.axios.get('/rest/Property', {
					params: {
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
				this.form = {
					title: '',
					sort: 50,
					list: []
				}
				this.upLoad = true
			},
			// 修改
			editUser(row) {
				this.popUp = 'edit'
				this.form = row
				this.id = row._id
				this.upLoad = true
			},
			//删除
			del(row) {
				this.$confirm('您确定删除该条数据吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/rest/Property/${row._id}`)
					const msg = res.data.msg
					this.$notify({title: '提示',message: msg,type: 'success',duration: '1200'})
					this.init()
				})
			},
			cancel() { //取消
				this.upLoad = false
			},
			// 提交
			async confirm() {
				let res;
				let msg = this.popUp === 'edit' ? '编辑' : '新增';
				if (this.popUp === 'edit') {
					res = await this.axios.put(`/rest/Property/${this.id}`, this.form)
					this.upLoad = false
					this.init()

				} else {
					res = await this.axios.post('/rest/Property', this.form)
					this.upLoad = false
					this.init()
				}
				this.$notify({title: '提示',message: msg + '成功',type: 'success',duration: '1200'})
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
