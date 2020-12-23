<template>
	<com-card label="会员列表">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUpTitle+'会员'" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form :formLabel="upLoadLabel" :form="upLoadForm.Member" 
				@afterUpload="afterUpload" :headers="getAuthHeaders()"></com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="dialog(false)">新增会员</el-button>
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
				tabLabel: [
					{
						label: '会员',
						prop: '',
						type: 'names'
					},
					{
						label: '头像',
						prop: 'src',
						type: 'imageUrl'
					},
					{
						label: '会员等级',
						prop:'parent',
						list:[],
						type:'member'
					},
					{
						label: '注册/登录时间',
						prop: 'date',
					},
					{
						label: '状态',
						prop: 'status',
						type: 'status'
					}
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
				
				upLoad: false,
				// 新增/编辑标题
				popUp: -1,
				upLoadLabel: [
					{
						model: 'parent',
						label: '等级',
						type:'select',
						Single:[],
						width:'24rem'
					},
					{model: 'mobile',label:'手机',width:'24rem'},
					{model:'nickname',label:'昵称',width:'24rem'},
					{model:'password',label:'密码',type:'password',width:'24rem'},
					{model:'src',label:'头像',type:'imageUrl'},
					{
						model:'sex',label:'性别',type:'radio',
						opts: [
							{label: '0',text: '保密'},
							{label: '1',text: '男'},
							{label: '2',text: '女'}
						]
					},
					{
						model: 'status',
						label: '是/否启用',
						type:'radio',
						opts: [
							{label: '1',text: '启用'},
							{label: '0',text: '禁用'}
						]
					}
				],
				upLoadForm: {
					//会员等级
					Member: {
						parent:'',
						nickname:'',
						mobile:'',
						sex:'',
						password:'',
						src:'',
						status: ''
					}
				},
				id: '',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{
					model: 'keyword', //值
					label: '会员账号',
					type: ''
				}],
			}
		},
		created() {
			this.init()
		},
		computed: {
			popUpTitle() {
				return this.popUp > -1 ? '编辑':'新增'
			}
		},
		methods: {
			
			//会员列表数据
			async init() {
				const res = await this.axios.get('/rest/Member',{
					params:{
						keyword: this.serachForm.keyword,
						page: this.config.page,
						pageSize: this.config.size
					}
				})
				this.tabData = res.data.items
				this.config.total = res.data.total
				
				//新增会员使用
				const rul = await this.axios.get('/rest/Level')
				let key = this.upLoadLabel
				for (let i = 0; i < key.length; i++) {
					key[i].Single = rul.data.items
				}
			},
			//清除查询
			clear() {this.init()},
			dialog(e = false){
				if(!e){
					this.upLoadForm.Member = {
						parent:'5f9aa3a7282a77481d1b8f7b',
						nickname:'',
						mobile:'',
						sex:'0',
						password:'',
						src:'',
						status: '1'
					}
					this.popUp = -1
				}else{
					this.upLoadForm.Member = {
						parent:e.row.parent._id,
						nickname:e.row.nickname,
						mobile:e.row.mobile,
						sex:e.row.sex,
						password:e.row.password,
						src:e.row.src,
						status: e.row.status
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
					const res = await this.axios.delete(`/rest/Member/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			// 提交
			async confirm() {
				let res;
				let msg = this.popUp !==-1 ? '编辑' : '新增';
				if (this.id && this.popUp !==-1) {
					res = await this.axios.put(`/rest/Member/${this.id}`, this.upLoadForm.Member)
					
				} else {
					res = await this.axios.post('/rest/Member', this.upLoadForm.Member)
				
				}
				this.upLoad = false
				this.init()
				this.$notify({title: '提示',message: msg + '成功',type: 'success',duration: '1200'})
			},
			afterUpload(res){//显示上传的图片
				this.upLoadForm.Member.src = res.url
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
