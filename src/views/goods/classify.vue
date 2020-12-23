<template>
	<com-card label="商品分类">
		<template slot="content">
			<!-- 新增/编辑 -->
			<el-dialog :title="popUpTitle+'商品分类'" :visible.sync="upLoad" width="40%" center>
				<!-- form表单 -->
				<com-form ref="child" :formLabel="upLoadLabel" :form="upLoadForm" :rules="rules"></com-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="dialog(false)">新增分类</el-button>
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
				// 默认为新增
				popUp:-1,
				upLoadLabel: [
					
					{
						model: 'parent',
						label: '顶级分类',
						type:'selects',
						Single:[],
						width:'24rem'
					},
					{
						model: 'name',
						label: '分类名称',
						width:'24rem'
					},
					{
						model: 'desc',
						label: '描述',
						width:'24rem',
						type:'textarea'
					},
					{
						model: 'unit',
						label: '单位',
						width:'24rem'
					},
					{
						model: 'order',
						label: '排序',
						type: 'InputNumber',
						pl:'默认为50,最小为1',
						width:'24rem'
					}
				],
				rules:{
					name:[
						{required:true,message:'分类名称不能为空',trigger:'change'}
					]
					
				},
				upLoadForm: {name:'',desc:'',parent:'',order:'',unit:''},
				
				id: '',
				// 搜索条件
				serachForm: {keyword:''},
				// 搜索
				formLabel: [{model: 'keyword',label: '分类名称',type: 'select'}],
				// 表格
				tabLabel: [
					{label:'分类名称',prop:'name',},
					{label:'顶级分类',prop:'parent',type:'isParent'},
					{label:'描述',prop:'desc',},
					{label:'单位',prop:'unit'},
					{label:'排序',prop: 'order'}
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
		computed: {
			popUpTitle() {
				return this.popUp > -1 ? '编辑':'新增'
			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				
				const res = await this.axios.get('/rest/Classify',{
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
			dialog(e = false){
				if(!e){
					this.upLoadForm = {name:'',desc:'',order:'50',unit:'瓶',}
					this.popUp = -1
				}else{
					
					this.upLoadForm = e.row,
					this.id = e.row._id
					this.popUp = e.$index
					console.log(this.popUp)
				}
				this.upLoad = true
			},
			
			del(row){//删除
				this.$confirm('您确定删除该条数据吗？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/rest/Classify/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			
			async confirm() {//确定
				//校验
				this.$refs.child.childMethods()
				let res;
				let msg = this.popUp !== -1 ? '编辑' : '新增';
				if (this.id && this.popUp !== -1) {
					res = await this.axios.put(`/rest/Classify/${this.id}`, this.upLoadForm)
			
				} else {
					res = await this.axios.post('/rest/Classify', this.upLoadForm)
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
