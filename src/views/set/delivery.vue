<template>
	<com-card label="配送设置">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUp === 'add' ? '新增配送设置' : '编辑配送设置'" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form ref="child" :formLabel="upLoadLabel" :form="upLoadForm" :rules="rules"></com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="addUser">新增配送设置</el-button>
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
					<template slot="button">
						<el-button type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
			<!-- 表格数据 -->
			<com-tabel :resData="tabData" :tabLabel="tabLabel" 
				@edit="editUser" @del="del" :config="config" @Size="init()"
				@Current="init()" isShow butConfig="配置">
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
	export default{
		components: {ComCard,ComTabel,ComForm},
		data() {
			return {
				tabData:[],
				// 新增/编辑
				upLoad: false,
				// 默认为新增
				popUp: 'add',
				upLoadLabel: [
					{model:'name',label: '配送名称',width:'24rem'},
					{model:'jfpay',label: '计费方式',width:'24rem'},
					{
						model: 'status',
						label: '状态',
						type: 'radio',
						width:'24rem',
						opts: [
							{label: '1',text: '启用'},
							{label: '0',text: '禁用'}
						]
					},
					{
						model: 'sort',
						label: '排序',
						type: 'InputNumber',
						pl:'默认为50,最小为1',
						width:'24rem'
					}
				],
				rules:{
					name:[
						{required:true,message:'配送名称不能为空',trigger:'change'}
					]
					
				},
				upLoadForm: {name: '',status: '',sort:''},
				id: '',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{model: 'keyword',label: '配送名称',type: ''}],
				// 表格
				tabLabel: [
					{label: '配送名称',prop: 'name'},
					{label: '计费方式',prop: 'jfpay'},
					{label: '排序',prop: 'sort'},
					{label: '状态',prop: 'status',type:'status'},
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				
				const res = await this.axios.get('/rest/Delivery',{
					params:{
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
					key[i].Single = rul
				}
			},
			clear(){//清除keyword
				this.init()
			},
			
			addUser(){//新增配送设置
				this.popUp = 'add'
				this.upLoadForm = {
					name:'',
					jfpay:'按距离',
					status:'1',
					sort:'50',
				}
				this.upLoad = true
			},
			
			editUser(row){//编辑配送设置
				this.popUp = 'edit'
				this.upLoadForm= row
				this.id = row._id
				this.upLoad = true
			},
			del(row){//删除
				this.$confirm('您确定删除该条数据吗？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/rest/Delivery/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			
			async confirm() {//确定
				//校验
				this.$refs.child.childMethods()
				let res;
				let msg = this.popUp === 'edit' ? '编辑配送设置' : '新增配送设置';
				if (this.popUp === 'edit') {
					res = await this.axios.put(`/rest/Delivery/${this.id}`, this.upLoadForm)
					this.upLoad = false
					this.init()
			
				} else {
					res = await this.axios.post('/rest/Delivery', this.upLoadForm)
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
