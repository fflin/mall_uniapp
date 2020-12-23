<template>
	<com-card label="商品参数">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUp === 'add' ? '新增商品参数' : '编辑商品参数'" :visible.sync="upLoad" width="42%" center>
				<!-- form表单 -->
				<com-form :formLabel="upLoadLabel" :form="upLoadForm.Specs"></com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="addUser">新增参数</el-button>
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
	import ComCard from '@/components/common/card.vue'
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
				tabData: [],
				// 新增/编辑
				upLoad: false,
				// 默认为新增
				popUp: 'add',
				upLoadLabel: [
					{model: 'name',label: '参数名称',width: '26rem'},
					{
						model: 'parent',
						label: '商品类型',
						type: 'select',
						width: '26rem',
						roleList: []
					},
					{
						model: 'ys',
						label: '分类筛选样式',
						type: 'radio',
						opts: [{
								label: '1',
								text: '普通'
							},
							{
								label: '2',
								text: '颜色'
							}
						]
					},
					{
						model: 'js',
						label: '能否进行检索',
						type: 'radio',
						opts: [{
								label: '1',
								text: '不检索'
							},
							{
								label: '2',
								text: '关键字检索'
							},
							{
								label: '3',
								text: '范围检索'
							}
						]
					},
					{
						model: 'gl',
						label: '商品参数关联',
						type: 'radio',
						opts: [{
								label: '1',
								text: '是'
							},
							{
								label: '2',
								text: '否'
							}
						]
					},
					{
						model: 'kx',
						label: '参数是否可选',
						type: 'radio',
						opts: [{
								label: '1',
								text: '唯一'
							},
							{
								label: '2',
								text: '单选'
							},
							{
								label: '3',
								text: '复选'
							}
						]
					},
					{
						model: 'lrfs',
						label: '参数值的录入方式',
						type: 'radio',
						opts: [
							{label: '1',text: '手工'},
							{label: '2',text: '列表选择'}
						]
					},
					{model: '',label: '参数值可选值列表',type: 'textarea',width: '26rem'},
					{
						model: 'add',
						label: '是否支持手动新增',
						type: 'radio',
						opts: [
							{label: '1',text: '是'},
							{label: '2',text: '否'}
						]
					},
					{model: 'order',label: '排序',type: 'InputNumber',pl: '默认为50,最小为1',width: '26rem',}
				],
				upLoadForm: {
					//参数标题
					Specs: {
						name: '',
						parent: '',
						order: '',
						unit: '', //单位
					},

				},
				id: '',
				// 搜索条件
				serachForm: {
					keyword: ''
				},
				// 搜索
				formLabel: [{
					model: 'keyword', //值
					label: '参数名称',
					type: ''
				}],
				// 表格
				tabLabel: [{
						label: '参数名称',
						prop: 'name'
					},
					{
						label: '商品类型',
						prop: 'parent'
					},
					{
						label: '参数是否可选',
						prop: 'ischeck'
					},
					{
						label: '参数值的录入方式',
						prop: 'way'
					},
					{
						label: '可选值列表',
						prop: 'ischeckList'
					},
					{
						label: '排序',
						prop: 'order'
					},

				],
				// 分页
				config: {
					page: 1,
					sizes: [20, 40, 50, 100],
					size: 20,
					total: 0
				},
			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				const res = await this.axios.get('/rest/Specs', {
					params: {
						keyword: this.serachForm.keyword,
						page: this.config.page,
						pageSize: this.config.size
					}
				})
				let rul = res.data.items
				this.tabData = rul
				this.config.total = res.data.total

				let key = this.upLoadLabel
				for (let i = 0; i < key.length; i++) {
					key[i].roleList = rul
				}
			},
			clear() { //清除keyword
				this.init()
			},

			addUser() { //新增商品参数
				this.popUp = 'add'
				this.upLoadForm.Specs = {}
				this.upLoad = true
			},

			editUser(row) { //编辑商品参数
				this.popUp = 'edit'
				this.upLoadForm.Specs = row
				this.id = row._id
				this.upLoad = true
			},
			del(row) { //删除
				this.$confirm('您确定删除该条数据吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/rest/Specs/${row._id}`)
					const msg = res.data.msg
					this.$notify({
						title: '提示',
						message: msg,
						type: 'success',
						duration: '1200'
					})
					this.init()
				})
			},

			async confirm() { //确定
				let res;
				let msg = this.popUp === 'edit' ? '编辑商品参数' : '新增商品参数';
				if (this.popUp === 'edit') {
					res = await this.axios.put(`/rest/Specs/${this.id}`, this.upLoadForm.Specs)
					this.upLoad = false
					this.init()

				} else {
					res = await this.axios.post('/rest/Specs', this.upLoadForm.Specs)
					this.upLoad = false
					this.init()
				}
				this.$notify({
					title: '提示',
					message: msg + '成功',
					type: 'success',
					duration: '1200'
				})
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
