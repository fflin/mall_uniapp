<template>
	<com-card label="奶爸潮品">
		<template slot="content">
			<!-- 选择商品 -->
			<el-dialog title="选择商品" :visible.sync="upLoad" width="40%" center>
				<!-- inputSelect -->
				<el-input v-model="serachForm.keyword" placeholder="请输入商品名称" clearable  style="width: 20rem;"
					@clear="clear">
					<template slot="append"> 
						<span class="el-icon-search" @click="__init(serachForm.keyword)"></span> 
					</template>
				</el-input>
				<!-- table -->
				<el-table :data="selectData" tooltip-effect="dark" border style="margin-top: 1rem;margin-bottom:1rem; width: 100%;"
					@selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" align="center"></el-table-column>
					<el-table-column label="商品名称" prop="title" align="center"></el-table-column>
					<el-table-column label="货号" align="center">
						<template slot-scope="scope">
							<i>NO.</i>
							<span>{{scope.row.numbers}}</span>
						</template>
					</el-table-column>
					<el-table-column label="价格" align="center">
						<template slot-scope="scope">
							<i>￥</i>
							<span>{{scope.row.price}}</span>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-pagination @size-change="__init()" 
					@current-change="__init()" 
					:current-page.sync="configs.page" 
					:page-sizes="configs.sizes"
					:page-size="configs.size" 
					layout="total, sizes, prev, pager, next, jumper" 
					:total="configs.total">
				</el-pagination>
				
				<span slot="footer" class="dialog-footer">
					<el-button @click="upLoad = false">取 消</el-button>
					<el-button type="primary" @click="choose">确 定</el-button>
				</span>
			</el-dialog>
			
			<!-- 设置排序 -->
			<el-dialog title="设置排序" :visible.sync="setSort" width="40%" center>
				<com-form :formLabel="upLoadLabel" :form="upLoadForm" />
				<span slot="footer" class="dialog-footer">
					<el-button @click="setSort = false">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 主页表格查询 -->
			<div class="time">
				<el-button type="primary" @click.stop="addUser">选择商品</el-button>
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear">
					<template slot="button">
						<el-button type="info" @click="init(serachForm.keyword)">搜索</el-button>
					</template>
				</com-form>
			</div>
			<!-- 主页表格数据 -->
			<com-tabel :resData="tabData" :tabLabel="tabLabel" 
				:config="config" @Size="init()"
				@Current="init()" @edit="set" @del="del">
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
				// 选择商品
				upLoad: false,
				// 设置排序
				setSort: false,
				// 默认为新增
				popUp: 'add',
				upLoadLabel: [
					{
						model:'status',label:'状态',type:'radio',
						opts: [
							{label: '1',text: '是'},
							{label: '0',text: '否'},
						]
						
					},
					{model:'sort',label:'排序',width:'24rem',type:'InputNumber'},
				],
				
				upLoadForm: {
					parent:'',
					status:'',
					sort:'',
				},
				id: '',
				// 搜索条件
				serachForm: {keyword:''},
				// 搜索
				formLabel: [{model:'keyword',label: '商品名称',type: ''}],
				// 主页表格数据
				tabLabel: [
					{label: '商品名称',prop:'parent',type:'goodsTitle'},
					{label: '是否推荐',prop:'status',type:'switchStatus'},
					{label: '排序',prop:'sort'}
				],
				// 分页
				config: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
				configs: {page: 1,sizes: [20, 40, 50, 100],size: 20,total: 0},
				//选择商品(数据)
				selectData:'',
				multipleSelection:{}
			}
		},
		created() {
			this.init()
			this.__init()
		},
		computed: {
			ids() {//记录选中id组成的数组
				return this.multipleSelection.map(item => {
					return item._id
				})
			}
			
		},
		methods: {
			async init() {//主页表格数据
				const res = await this.axios.get('/rest/Newshop',{
					params:{
						keyword: this.serachForm.keyword,
						page: this.config.page,
						pageSize: this.config.size
					}
				})
				this.tabData = res.data.items
				this.config.total = res.data.total
				
			},
			async __init(){//获取商品数据(弹框表格)
				const goods = await this.axios.get('/rest/Good',{
					params:{
						keyword: this.serachForm.keyword,
						page: this.config.page,
						pageSize: this.config.size
					}
				})
				this.selectData = goods.data.items
				this.configs.total = goods.data.total
			},
			clear(){//清除keyword
				this.init()
				this.__init()
			},
			
			addUser(){//选择商品
				this.popUp = 'add'
				this.upLoadForm = {}
				this.upLoad = true
			},
			set(row){//设置排序
				this.upLoadForm = row
				this.id = row._id
				this.setSort = true
			},
			
			del(row){//删除
				this.$confirm('您确定删除该条数据吗？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(async () => {
					const res = await this.axios.delete(`/rest/Newshop/${row._id}`)
					const msg = res.data.msg
					this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
					this.init()
				})
			},
			
			async submit() {//设置排序（确定）
				let res = await this.axios.put(`/rest/Newshop/${this.id}`, this.upLoadForm)
				this.setSort = false
				this.init()
				this.$notify({title: '提示',message:'更新成功',type: 'success',duration: '1200'})
			},
			
			//选择商品
			handleSelectionChange(e){
				this.multipleSelection = e;
			},
			// (提交)选择的商品
			choose(){
				if(this.ids.length === 0){
					return this.$message({message:'请选择需要推荐的商品',type:'error'})
				}
				this.$confirm('使用并进行添加操作？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(async() => {
					const res = await this.axios.post('/rest/Newshop',{parent:this.ids})
					this.upLoad = false
					this.init()
					
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
