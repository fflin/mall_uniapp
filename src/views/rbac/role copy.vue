<template>
	<div>
		<com-card label="角色列表">
			<template slot="content">
				<!-- 新增/编辑 -->
				<el-dialog :title="popUpTitle+'角色'" :visible.sync="upLoad" width="40%" center>
					<!-- form表单 -->
					<com-form :formLabel="upLoadLabel" :form="upLoadForm"></com-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="upLoad = false">取 消</el-button>
						<el-button type="primary" @click="confirm">确 定</el-button>
					</span>
				</el-dialog>
				<!-- 查询 -->
				<div class="time">
					<el-button type="primary" @click.stop="dialog(false)">新增角色</el-button>
					<!-- @clear="clear" -->
					<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
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
					:config="config"
					@Size="init()"
					@Current="init()"
					@drawer="drawers"
					isShow>
				</com-tabel>
				<!-- 抽屉弹框 -->
				<el-drawer :visible.sync="drawer" :with-header="false">
					<div class="header">
						<span>配置权限</span>
						<span class="el-icon-close" @click="drawer = false"></span>
					</div>
					<div class="wrap">
						<div class="main">
							<el-tree
							  :data="treeData"
							  show-checkbox
							  node-key="_id"
							  default-expand-all
							  :default-checked-keys="upLoadForm.rules"
							  @check="check"
							  :props="defaultProps"
							  accordion
							  highlight-current>
							</el-tree>
							<!-- ref="treeRef" -->
							<!-- :default-checked-keys="['5fb37af12eef7d12dc037413','5fb37af12eef7d12dc037414']" -->
						</div>
					    <div class="footer">
						   <el-button size="medium" type="info" @click.stop="drawer = false">取消</el-button>
						   <el-button size="medium" type="primary" @click="submit">确定</el-button>
					   </div>
					</div>
					
				</el-drawer>
			</template>
		</com-card>
	</div>
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
			formLabel: [{model: 'keyword',label: '角色',type: ''}],
			// 表格
			tabLabel: [
				{ label: '角色名称', prop:'name'},
				{ label: '角色描述', prop:'desc'},
				{ label: '时间', prop:'date'},
				{ label: '状态', prop:'status',type:'status' }
			],
			// 新增/编辑
			upLoad: false,
			// 新增、编辑标题
			popUp: -1,
			id:'',
			// 权限提交时（当前分配角色的ID）
			_id:'',
			defKeys:[],//默认选中的节点
			// 数据承载
			upLoadLabel: [
				{ model: 'name', label: '角色名称' },
				{ model: 'desc', label: '角色描述' },
				{
					model: 'status',
					label: '状态',
					type: 'radio',
					opts: [{ label: "1", text: '启用' }, { label: "0", text: '禁用' }]
				}
			],
			upLoadForm: {
				name: '',
				desc: '',
				status: '',
				rules:''
			},
			// 分页
			config:{page:1,sizes:[20,40,50,100],size:20,total:0},//授权
			drawer:false,
			treeData:[],//权限数据承载
			defaultProps: {//显示的权限
			  children: 'children',
			  label: 'label'
			}
		};
	},
	computed: {
		popUpTitle() {
			return this.popUp > -1 ? '编辑':'新增'
		}
	},
	created() {this.init()},
	methods:{
		async init(){//角色数据
			const res = await this.axios.get('/admin/roles',{
				params:{
					keyword: this.serachForm.keyword,
					page: this.config.page,
					pageSize: this.config.size,
				}
			})
			this.tabData = res.data.items
			this.config.total = res.data.total
		},
		
		dialog(e = false){//编辑、新增
			if(!e){
				this.upLoadForm = {
					name: '',
					desc: '',
					status: '1'
				}
				this.popUp = -1
			}else{
				this.upLoadForm = {
					name: e.row.name,
					desc: e.row.desc,
					status: e.row.status,
					rules: e.row.rules
				}
				this.id = e.row._id
				this.popUp = e.$index
			}
			this.upLoad = true
			
		},
		
		clear(){this.init()},
		del(row){//删除
			this.$confirm('您确定删除该条数据吗？','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res = await this.axios.delete(`/admin/roles/${row._id}`)
				const msg = res.data.msg
				this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
				this.init()
			})
			
		},
		async confirm(){//编辑/确定
			let res;
			let msg = this.popUp !== -1 ? '编辑' : '新增';
			if (this.id && this.popUp !== -1) {
				res = await this.axios.put(`/admin/roles/${this.id}`, this.upLoadForm)
			} else {
				res = await this.axios.post('/admin/roles', this.upLoadForm)
				
			}
			this.upLoad = false
			this.init()
			this.$notify({title: '提示',message: msg + '成功',type: 'success',duration: '1200'})
		},
		
		async drawers(row){//授权
			this.drawer = true
			let rule = await this.axios.get('/admin/rules')//权限数据
			this.treeData = rule.data.items
			//转换格式
			// this.upLoadForm.rules = row.rules.map(item => item._id)
			this._id = row._id
			
			
		},
		check(...e){//当前选中
			this.upLoadForm.rules = e[1].checkedKeys;
		},
		async submit(){//权限提交
			const res = await this.axios.put(`/admin/roles/${this._id}`,{rules: this.upLoadForm.rules})
			this.drawer = false,
			this.init()
			this.$notify({title:'提示',message:'权限配置成功',type:'success',duration:'1200'})
		},
		// closeKeys(){//监听分配权限对话框关闭事件
		// 	this.upLoadForm.rules = []
		// }
		
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
//抽屉弹框
.header{
	display: flex;
	padding: 1rem;
	&>span{font-size:1rem;font-weight: bolder;}
	justify-content: space-between;
}
.wrap{
	position: absolute;
	top: 3rem;
	left: 0;
	right: 0;
	bottom: 0;
	border-top: #E8EDF0 solid 1px;
	.heider{
		height: 3rem;
	}
	.main{
		position: absolute;
		top: 0;
		bottom: 4rem;
		left: 0;
		right: 0;
		overflow-y: auto;
	}
	.footer{
		height: 3rem;
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		padding: 0.5rem 0.5rem;
		display: flxe;
		align-content: center;
		background-color: white;
		border-top: #E8EDF0 solid 1px;
	}
	
}

  
</style>
