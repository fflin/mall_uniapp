<template>
	<com-card label="权限列表">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUpTitle + '权限'" :visible.sync="upLoad" width="60%" center>
				<!-- form表单 -->
				<com-form :formLabel="upLoadLabel" :form="upLoadForm"  />
				<el-table :data="upLoadForm.children" style="width: 100%;" border>
					<el-table-column v-for="item in PtabLabel" :key="item.prop" :label="item.label" align="center">
						<template slot-scope="scope">
							<el-input v-model="scope.row[item.prop]" clearable :placeholder="'请输入'+item.label"></el-input>
						</template>
					</el-table-column>
				
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button size="medium" type="danger" @click="upLoadForm.children.splice(scope.row,1)">DEL</el-button>
						</template>
					</el-table-column>
				</el-table>
				
				<div style="margin-left: 1rem; margin-top: 1rem;">
					<el-button type="primary" @click="upLoadForm.children.push({})">新增子菜单</el-button>
					<el-button type="info" @click="upLoad = false">取 消</el-button>
					<el-button type="success" @click="confirm">确 定</el-button>
				</div>
				
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button size="medium" type="primary" @click.stop="dialog(false)">新增</el-button>
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
					<template slot="button">
						<el-button size="medium" type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
			<!-- 表格数据 -->
			<com-tabel :resData="tabData" :tabLabel="tabLabel" 
				@edit="dialog" 
				@del="del" :config="config" @Size="init()"
				@Current="init()">
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
			defaultProps: {children: 'children',label: 'label'},
			
			// 新增/编辑
			upLoad: false,
			// 新增、编辑标题
			popUp:-1,
			tabLabel: [// 表格
				{label:'父级Label',prop: 'label'},
				{label:'子菜单数量',prop:'children',type:'count'},
				{label:'图标',prop:'icon',type:'icon'},
				{label:'路径',prop:'path'},
				{label:'排序',prop:'sort'},
				{label:'状态',prop:'status',type:'status'},
			],
			config: {page: 1,sizes: [20, 30, 40, 50],size: 20,total: 0},// 分页
			// 搜索条件
			serachForm: {keyword:''},
			// 搜索
			formLabel: [{model:'keyword',label: '父级Label',type: ''}],
			// 数据承载
			upLoadLabel: [
				{ model:'label',label:'父级Label',width:'24rem' },
				{ model:'name', label: '别名',width:'24rem' },
				{ model:'icon', label: '图标',width:'24rem' },
				{ model:'path', label: '路径',width:'24rem' },
				{ model:'sort', label: '排序',width:'24rem',type:'InputNumber' },
				{
					model: 'status',
					label: '状态',
					type: 'radio',
					opts: [{ label: "1", text: '启用' }, { label: "0", text: '禁用' }]
				}
				
			],
			PtabLabel: [//popup
				{label: 'Label',prop: 'label'},
				{label: '别名',prop: 'name'},
				{label: '图标',prop: 'icon'},
				{label: '路径',prop: 'path'},
				{label: '排序',prop: 'sort'},
				{label: '状态',prop: 'status'}
			],
			upLoadForm: {
				label: '',
				name: '',
				icon: '',
				path: '',
				sort: '',
				status: '',
				children:[]
			},
			
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
			const res = await this.axios.get('/admin/rules',{
				params: {
					keyword: this.serachForm.keyword,
					page: this.config.page,
					pageSize: this.config.size
				}
			})
			console.log("/admin/rules---- "+res)
			this.tabData = res.data.items
			this.config.total = res.data.total
			
		},
		// 新增、编辑
		dialog(e = false){
			if(!e){//新增
				this.upLoadForm = {
					label: '',
					name: '',
					icon: '',
					path: '',
					sort: 50,
					status: '1',
					children:[]
				}
				this.popUp = -1
			}else{//编辑
				this.upLoadForm = {
					label: e.row.label,
					name: e.row.name,
					icon: e.row.icon,
					path: e.row.path,
					sort: e.row.sort,
					status: e.row.status,
					children:e.row.children
				}
				this.id = e.row._id
				this.popUp = e.$index
			}
			this.upLoad = true
		},
		
		clear(){this.init()},
		del(row){
			this.$confirm('您确定删除该条数据吗？','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res = await this.axios.delete(`/rest/Rule/${row._id}`)
				const msg = res.data.msg
				this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
				this.init()
			})
		},
		async confirm(){
			let res;
			let msg = this.popUp !== -1 ? '编辑' : '新增';
			if (this.id && this.popUp !== -1) {
				res = await this.axios.put(`/rest/Rule/${this.id}`, this.upLoadForm)
				
			} else {
				res = await this.axios.post('/rest/Rule', this.upLoadForm)
				
			}
			this.upLoad = false
			this.init()
			this.$notify({title: '提示',message: msg + '成功',type: 'success',duration: '1200'})
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
	margin-bottom: 2rem;
}
.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 1rem;
	padding-right: 0.5rme;
	
}
</style>
