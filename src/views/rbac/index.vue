<template>
	<com-card label="管理员设置">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUpTitle + '管理员'" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form :formLabel="upLoadLabel" :form="upLoadForm.Manager"
					@afterUpload="afterUpload" :headers="getAuthHeaders()">
				</com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="dialog(false)">新增</el-button>
				<!-- @clear="clear" -->
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear" >
					<template slot="button">
						<el-button size="medium" type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
	
			<!-- 表格数据 -->
			<com-tabel :resData="tabData" 
				:tabLabel="tabLabel" 
				@edit="dialog" 
				@del="del"
				@statusChange="statusChange"
				:config="config"
				@Size="init()"
				@Current="init()"
				>
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
			// 搜索条件
			serachForm: { keyword: '' },
			// 搜索
			formLabel: [{model: 'keyword',label: '账号',type: ''}],
			// 表格
			tabLabel: [
				{ label:'头像', prop:'src',type:'imageUrl' },
				{ label:'账号', prop:'account'},
				{ label:'昵称', prop:'nickname'},
				{ label:'角色', prop:'roleId',type:'userList',width:'240px' },
				{ label:'状态', prop:'status',type:'roleIdButton' },
				{ label:'操作', prop:'',type:'roleId',width:'220rpx' }
			],
			// 新增/编辑
			upLoad: false,
			// 默认为新增
			popUp: 'add',
			// 数据承载
			upLoadLabel: [
				{ model: 'account', label: '帐号' },
				{ model: 'nickname', label: '昵称' },
				{ model: 'password', label: '密码', type: 'password' },
				{ model: 'src', label: '头像', type: 'imageUrl' },
				{ model: 'roleId',label: '角色',type: 'select',Single: []},
				{
					model: 'status',
					label: '状态',
					type: 'radio',
					opts: [{ label: "1", text: '启用' }, { label: "0", text: '禁用' }]
				}
			],
			upLoadForm: {
				// 管理员
				Manager: {account: '',nickname: '',password: '',src: '',roleId: '',status: ''}
			},
			// 分页
			config:{page:1,sizes:[20,40,50,100],size:20,total:0}
		};
	},
	computed: {
		popUpTitle() {
			return this.popUp > -1 ? '编辑':'新增'
		}
	},
	created() {
		this.init()
	},
	methods:{
		async init(){
			const res = await this.axios.get('/admin/users',{
				params:{
					keyword: this.serachForm.keyword,
					page: this.config.page,
					pageSize: this.config.size
				}
			})
			this.tabData = res.data.items
			this.config.total = res.data.total
			//新增用户使用
			const rul = await this.axios.get('/admin/roles')
			let k = this.upLoadLabel
			for (let i = 0; i < k.length; i++) {
				k[i].Single = rul.data.items
			}
		},
		dialog(e = false){//编辑、新增弹框
			if(!e){
				this.upLoadForm.Manager = {
					account: '',
					nickname: '',
					password: '',
					src: '',
					roleId: '',
					status: '1'
				}
				this.popUp = -1
			}else{
				this.upLoadForm.Manager = {
					account: e.row.account,
					nickname: e.row.nickname,
					password: e.row.password,
					src: e.row.src,
					roleId: e.row.roleId._id,
					status: e.row.status
				}
				this.id = e.row._id
				this.popUp = e.$index
			}
			this.upLoad = true
		},
		
		clear(){//清空
			this.init()
		},
		del(row){//删除
			this.$confirm('您确定删除该条数据吗？','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res = await this.axios.delete(`/admin/users/${row._id}`)
				const msg = res.data.msg
				this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
				this.init()
			})
		},
		async confirm(){//编辑、新增
			let res;
			let msg = this.popUp !== -1 ? '编辑用户' : '新增用户';
			if (this.id && this.popUp !== -1) {
				res = await this.axios.put(`/admin/users/${this.id}`, this.upLoadForm.Manager)
				
			} else {
				res = await this.axios.post('/admin/users', this.upLoadForm.Manager)
				
			}
			this.upLoad = false
			this.init()
			this.$notify({title: '提示',message: msg + '成功',type: 'success',duration: '1200'})
		},
		statusChange(row){//开关
			let status = row.status === '1' ? '0' : '1'
			let msg = status === '1' ? '启用' : '禁用'
			this.$confirm('您确定'+msg+'该账号?','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res =await this.axios.put(`/admin/users/upStatus/${row._id}`,{status:status})
				row.status = status
				this.$notify({title:'提示',message:msg+'成功',type:'success',duration:'1200'})
				this.init()
			})
			
		},
		afterUpload(res){//显示上传的图片
			this.upLoadForm.Manager.src = res.url
		},
	}
	
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
