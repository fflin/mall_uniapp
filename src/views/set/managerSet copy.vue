<template>
	<com-card label="管理员设置">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUp === 'add' ? '新增用户' : '更新用户'" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form :formLabel="upLoadLabel" :form="upLoadForm.manager"></com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="addUser">新增管理员</el-button>
				<!-- @clear="clear" -->
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
					<template slot="button">
						<el-button type="info" @click="__init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
	
			<!-- 表格数据 -->
			<com-tabel :resData="tabData" 
				:tabLable="tabLable" 
				@edit="editUser" 
				@del="del"
				:config="config"
				@Size="__init()"
				@Current="__init()">
			</com-tabel>
		</template>
	</com-card>
</template>

<script>
// com-card
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
			tabLable: [
				{ lable: '用户头像', prop: 'avatar', width: '', type: 'image' },
				{ lable: '登录账号', prop: 'username', width: '' },
				{ lable: '所属用户组', prop: 'user', width: '', type: 'userList' },
				{ lable: '状态', prop: 'status', width: '', type: 'status' }
			],
			// 搜索条件
			serachForm: { keyword: '' },
			// 搜索
			formLabel: [
				{
					model: 'keyword', //值
					label: '账户',
					type: ''
				}
			],
			// 新增/编辑
			upLoad: false,
			// 默认为新增
			popUp: 'add',
			// 数据承载
			upLoadLabel: [
				{ model: 'username', label: '帐号' },
				{ model: 'password', label: '密码', type: 'password' },
				{ model: 'avatar', label: '头像', type: 'imageUrl' },

				{
					model: 'role_id',
					label: '角色',
					type: 'select',
					roleList: [{ id: 2, label: '站长' }, { id: 3, label: '运营' }]
				},
				{
					model: 'status',
					label: '状态',
					type: 'radio',
					opts: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }]
				}
			],
			upLoadForm: {
				// 管理员
				manager: {
					username: '',
					password: '',
					avatar: '',
					role_id: '',
					status: ''
				}
			},
			// 分页
			config:{
				page:1,
				sizes:[20,30,40,50],
				size:20,
				total:0
			}
		};
	},
	created() {
		this.__init()
	},
	methods: {
		
		// 获取列表数据
		__init(username = ''){
			// 搜索时，页码需要设置为1，才能正确返回数据，因为数据是从第一页开始返回的
			username ? (this.config.page = 1) : ''
			this.axios.get('/manager/getData',{
				params:{
					page:this.config.page,
					username
				}
			}).then(res => {
				let rulest = res.data
				this.tabData = rulest.list
				this.config.total = rulest.count
			})
		},
		//数据重新渲染
		clear(){
			this.__init()
		},
		// 新增
		addUser(){
			this.popUp = 'add'
			this.upLoadForm.manager = {}
			this.upLoad = true
		},
		// 修改
		editUser(row){
			this.popUp = 'edit'
			this.upLoadForm.manager = row
			this.upLoad = true
		},
		// 提交
		confirm(){
			let msg = this.popUp === 'edit' ? '编辑':'新增'
			if(this.popUp === 'edit'){
				// 编辑
				this.axios.post('/manager/UpData',this.upLoadForm.manager)
				.then(res => {
					this.upLoad = false
					this.__init()
				});
			}else{
				// 新增
				this.axios.post('/manager/AddData',this.upLoadForm.manager)
				.then(res => {
					this.upLoad = false
					this.__init()
				})
			}
			this.$notify({title:'提示',message:msg+'成功',type:'success',duration:'1200'})
		},
		// 删除
		del(row){
			// 提示
			this.$confirm('您确定删除该条数据吗？','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(() => {
				let id = row.id
				this.axios.get('/manager/del',{
					params:{id}
				}).then(res => {
				  let code = res.data.code
				  let msg = res.data.message
				  if(code === -999){
					  this.$notify({title:'提示',message:msg,type:'warning',duration:'1200'})
				  }else{
					  this.$notify({title:'提示',message:'删除成功',type:'success',duration:'1200'})
					  this.__init()
				  }
				})
			})
		}
	},
	
};
</script>

<style lang="scss" scoped>
.time {
	display: flex;
	justify-content: space-between;
	// 顶部对齐
	align-items: flex-start;
}
</style>
