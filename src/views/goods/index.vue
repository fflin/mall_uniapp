<template>
	<com-card label="商品列表">
		<template slot="content">
			<!-- 查询 and 按钮组件 -->
			<div class="time">
				<!-- 按钮组件 -->
				<com-button :buttonList="buttonList" @way="way" />
				<com-form inline :formLabel="formLabel" :form="serachForm" @clear="clear" >
					<template slot="button">
						<el-button type="info" @click="init(serachForm.keyword)" size="small">搜索</el-button>
					</template>
				</com-form>
			</div>
	
			<!-- 表格数据 -->
			<com-tabel selectShow :indexShow="false" :resData="tabData" :tabLabel="tabLabel"
			 @hsc="hsc"
			@edit="edit" @del="del" :config="config" @Size="init()" @Current="init()"
			@changeStatus="changeStatus" @cptj="cptj" @cnxh="cnxh" @spy="spy" @ischeck="ischeck" />
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
import ComButton from '@/components/common/button.vue'
export default {
	components: {ComCard,ComTabel,ComForm,ComButton},
	data() {
		return {
			buttonList:[//按钮组
				{type:'primary',name:'发布商品',way:'add'},
				{type:'warning',name:'上架',way:''},
				{type:'danger',name:'下架',way:''},
				{type:'info',name:'潮品推荐',way:''},
				{type:'success',name:'猜你喜欢',way:''},
				{type:'',name:'商品页',way:''},
			],
			// 全选数据
			multipleSelection:[],
			// 列表数据承载
			tabData: [],
			form:{status:''},
			// 搜索条件
			serachForm: { keyword: '' },
			// 搜索
			formLabel: [{model: 'keyword',label: '商品',type: ''}],
			// 表格
			tabLabel: [
				{ label: '商品图片', prop:'src',type:'slogan',width:'80px' },
				{ label: '商品名称', prop:'title',width:'100px'},
				{ label: '价格/货号', prop:'',type:'pn',width:'160px'},
				{ label: '标签', prop:'status',type:'switchStatus',},
				{ label: '排序', prop:'sort',width:'80px' },
				{ label: '销量', prop:'sales',width:'120px' },
				{ label: '审核状态', prop:'ischeck',type:'ischeck',width:'120px' }
			],
			
			// 分页
			config:{page:1,sizes:[20,40,50,100],size:20,total:0}
		};
	},
	created() {
		this.init()
	},
	methods:{
		async init(){
			const res = await this.axios.get('/rest/Good',{
				params:{
					keyword: this.serachForm.keyword,
					page: this.config.page,
					pageSize: this.config.size
				}
			})
			
			this.tabData = res.data.items
			this.config.total = res.data.total
			
		},
		hsc(e){//全选事件
			this.multipleSelection = e
		},
		way(item){//按钮组事件
			if(item.way==='add'){
				this.$router.push({name:'addProduct'})
			}
		},
		edit(row){//编辑
			this.$router.push(`/goods/addProduct/${row._id}`)
		},
		clear(){//清除
			this.init()
		},
		del(row){//删除
			this.$confirm('您确定删除该条数据吗？','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res = await this.axios.delete(`/rest/Good/${row._id}`)
				const msg = res.data.msg
				this.$notify({title:'提示',message:msg,type:'success',duration:'1200'})
				this.init()
			})
		},
		async changeStatus(row){//上、下架
		    let status = row.status === '1' ? '0' : '1'
			let msg = status === '1' ? '上架' : '下架'
			this.$confirm('您确定'+msg+'该产品?','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res = this.axios.put(`/rest/Good/${row._id}`,{status:status})
				row.status = status
				this.$notify({title:'提示',message:msg+'成功',type:'success',duration:'1200'})
				this.init()
			})
		},
		async cptj(row){//潮品推荐
		    let cptj = row.cptj === '1' ? '0' : '1'
			let msg = cptj === '1' ? '推荐' : '不推荐'
			this.$confirm('您确定'+msg+'该产品?','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res = this.axios.put(`/rest/Good/${row._id}`,{cptj:cptj})
				row.cptj = cptj
				this.$notify({title:'提示',message:msg+'成功',type:'success',duration:'1200'})
				this.init()
			})
		},
		async cnxh(row){//猜你喜欢
		    let cnxh = row.cnxh === '1' ? '0' : '1'
			let msg = cnxh === '1' ? '推荐' : '不推荐'
			this.$confirm('您确定'+msg+'该产品?','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res = this.axios.put(`/rest/Good/${row._id}`,{cnxh:cnxh})
				row.cnxh = cnxh
				this.$notify({title:'提示',message:msg+'成功',type:'success',duration:'1200'})
				this.init()
			})
		},
		async spy(row){//商品页推荐
		    let spy = row.spy === '1' ? '0' : '1'
			let msg = spy === '1' ? '推荐' : '不推荐'
			this.$confirm('您确定'+msg+'该产品?','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res = this.axios.put(`/rest/Good/${row._id}`,{spy:spy})
				row.spy = spy
				this.$notify({title:'提示',message:msg+'成功',type:'success',duration:'1200'})
				this.init()
			})
		},
		
		async ischeck(row){//商品审核
		    let ischeck = row.ischeck === '1' ? '0' : '1'
			let msg = ischeck === '1' ? '同意' : '拒绝'
			this.$confirm('您确定'+msg+'审核?','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).then(async () => {
				const res = this.axios.put(`/rest/Good/${row._id}`,{ischeck:ischeck})
				row.ischeck = ischeck
				this.$notify({title:'提示',message:msg+'成功',type:'success',duration:'1200'})
				this.init()
			})
		}
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
