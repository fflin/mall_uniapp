<template>
	<com-card label="广告列表">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUpTitle+'广告'" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form :formLabel="upLoadLabel" :form="upLoadForm" 
					@afterUpload="afterUpload" :headers="getAuthHeaders()">
				</com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="dialog(false)">新增广告</el-button>
				<!-- @clear="clear" -->
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
					<template slot="button">
						<el-button type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
			<!-- 表格数据 -->
			<com-tabel :resData="tabData" :tabLabel="tabLabel" 
				@edit="dialog" @del="del" :config="config" @Size="init()"
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
	export default{
		components: {
			ComCard,ComTabel,ComForm
		},
		data() {
			return {
				tabData:[],
				// 新增/编辑
				upLoad: false,
				// 新增、编辑标题
				popUp: -1,
				upLoadLabel: [
					{
						model: 'name',
						label: '广告名称',
						width: '24rem'
					},
					{
						model:'parents',
						label:'广告位置',
						type:'multiple',
						multipleList:[],//多个
						width: '24rem',
					},
					{
						model: 'src',
						label: '广告图片',
						type: 'imageUrl',
						width: '24rem'
					},
					{
						model: 'status',
						label: '状态',
						type: 'radio',
						opts: [
							{label: '1',text: '启用'},
							{label: '0',text: '禁用'}
						],
						width: '24rem'
					},
					{
						model: 'sort',
						label: '排序',
						type: 'InputNumber',
						pl:'默认为50',
						width: '24rem'
					},
					{
						model: 'url',
						label: '广告链接',
						width: '24rem'
					},
					{
						model: 'desc',
						label: '广告描述',
						type: 'textarea',
						width: '24rem'
					}
				],
				upLoadForm: {
					name: '',
					adsites:'',
					src:'',
					status:'',
					sort:'',
					url:'',
					desc:''
				},
				id: '',
				// 搜索条件
				serachForm: {keyword: ''},
				// 搜索
				formLabel: [{model: 'keyword',label: '广告名称',type: ''}],
				// 表格
				tabLabel: [
					{label:'广告名称',prop: 'name',width:'180px'},
					{label:'广告位置',prop:'parents',type:'adsParent'},
					{label:'广告图片',prop:'src',type:'slogan'},
					{label:'时间',prop:'date',type:'',width:'180px'},
					{label:'状态',prop:'status',type:'status'},
					{label:'排序',prop:'sort',type:'',width:'80px'},
					{label:'操作',prop:'',type:'cz' }
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
			}
		},
		computed: {
			popUpTitle() {
				return this.popUp > -1 ? '编辑' :'新增' 
			}
		},
		created() {
			this.init()
			this.__init()
		},
		methods: {
			
			async init() {// 广告列表数据
				const res = await this.axios.get('/admin/ads',{
					params:{
						keyword: this.serachForm.keyword,
						page: this.config.page,
						pageSize:this.config.size
					}
				})
				this.tabData = res.data
				this.config.total = res.data.total
			},
			
			async __init(){// 广告位置数据
				const rul = await this.axios.get('/admin/adsite')
				// 新增使用
				let k = this.upLoadLabel
				for (let i = 0; i < k.length; i++) {
					k[i].multipleList = rul.data.items
				}
				
			},
			
			
			clear(){//清除keyword
				this.init()
			},
			dialog(e = false){
				if(!e){
					this.upLoadForm = {
						name: '',
						parents:'',
						src:'',
						status:'1',
						sort:'50',
						url:'',
						desc:''
					}
					this.popUp = -1
				}else{
					this.upLoadForm = {
						name: e.row.name,
						parents:e.row.parents,
						src:e.row.src,
						status:e.row.status,
						sort:e.row.sort,
						url:e.row.url,
						desc:e.row.desc
					}
					this.id = e.row._id
					this.popUp = e.$index
				}
				this.upLoad = true
			},
			del(row){//删除
				this.$confirm('您确定删除该条数据吗？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/admin/ads/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			
			async confirm() {//确定
				let res;
				let msg = this.popUp !== -1 ? '编辑' : '新增';
				if (this.id) {
					res = await this.axios.put(`/admin/ads/${this.id}`, this.upLoadForm)
					
				} else {
					res = await this.axios.post('/admin/ads', this.upLoadForm)
					
				}
				this.upLoad = false
				this.init()
				// const code = res.data.code
				// if(code === 422) return
				this.$notify({title: '提示',message: msg + '成功',type: 'success',duration: '1200'})
			},
			afterUpload(res){//显示上传的图片
				this.upLoadForm.src = res.url
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
