<template>
	<com-card :label="id ? '编辑商品':'发布商品'" >
		<template slot="content">
			<div class="main">
				<el-steps :active="active" finish-status="success" align-center>
					<el-step v-for="(step,stepIndex) in stepList" :key="stepIndex" :title="step.title"> </el-step>
				</el-steps>
				<!-- 填写商品信息 -->
				<div class="form" v-if="active==0">
					<el-form ref="form" :model="form" label-width="80px">
						<el-form-item :label="item0.label" v-for="item0 in formItem" :key="item0.model">

							<el-select filterable v-if="item0.type === 'select'" :placeholder="item0.pl+item0.label" 
								v-model="form[item0.model]" clearable :style="'width:'+item0.width">
								<el-option v-for="k in item0.Single" :key="k._id" :label="k.name" :value="k._id"> </el-option>
							</el-select>
							
							<el-select filterable v-if="item0.type === 'selectBrand'" :placeholder="item0.pl+item0.label"
								v-model="form[item0.model]" clearable :style="'width:'+item0.width">
								<el-option v-for="y in item0.Brand" :key="y._id" :label="y.name" :value="y._id"> </el-option>
							</el-select>

							<el-input v-if="!item0.type" :placeholder="item0.pl+item0.label" 
								v-model="form[item0.model]" clearable :style="'width:'+item0.width" />
							
							<el-input v-if="item0.type === 'append'" :placeholder="item0.pl+item0.label" 
								v-model="form[item0.model]"
								clearable :style="'width:'+item0.width">
							    <template slot="append">{{item0.append}}</template>
							</el-input>
							
							<el-input-number v-if="item0.type === 'inputNumber'" 
								v-model="form[item0.model]" :style="'width:'+item0.width"
								controls-position="right" :min="1">
							</el-input-number>
							
						</el-form-item>

					</el-form>
					<el-button type="primary" style="margin-top: 1rem;" @click="next">下一步，填写商品促销</el-button>
					<el-button type="success" @click="confirm">提交</el-button>
				</div>

				<!-- 填写商品促销 -->
				<div class="form" v-if="active==1">
					<el-form ref="form" :model="form" label-width="80px">
						<el-form-item :label="item.label" v-for="item in formItem2" :key="item.model">

							<el-switch v-if="item.type === 'switch'" v-model="form[item.model]" />

							<el-checkbox v-if="item.type === 'checkbox'" v-model="k.model" v-for="(k,kIndex) in item.list" :key="kIndex">
								{{k.text}}
							</el-checkbox>

							<!-- Tabs -->
							<el-tabs type="border-card" style="width: 34rem;" v-if="item.type === 'tabs'">
								<el-tab-pane v-for="(y,yIndex) in item.list" :key="yIndex" :label="y.text">
									<div v-if="yIndex == 0">
										无优惠
									</div>
									<div v-if="yIndex==1 ">
										<el-form-item label="促销时间">
											<el-date-picker style="width: 24rem;" v-model="form[item.model]" type="datetimerange" range-separator="至"
											 start-placeholder="开始日期" end-placeholder="结束日期">
											</el-date-picker>

										</el-form-item>
										<el-form-item label="促销价">
											<el-input clearable style="width: 24rem;margin-top: 1rem;" v-model="form[item.model]"></el-input>
										</el-form-item>

									</div>
									<div v-if="yIndex == 2">
										<el-form-item v-for="(hy,hyIndex) in y.lists" :key="hyIndex" :label="hy.label">
											<el-input clearable style="width: 24rem;margin-bottom: 1rem;" v-model="hy.model"></el-input>
										</el-form-item>
									</div>
									<div v-if="yIndex == 3">
										<el-table :data="y.jtjgList" border>
											<el-table-column label="数量" align="center">
												<template slot-scope="scope">
													<el-input v-model="scope.row.numb" size="mini" clearable>
														<template slot="append">份</template>
													</el-input>
												</template>
											</el-table-column>
											<el-table-column label="折扣" align="center">
												<template slot-scope="scope">
													<el-input v-model="scope.row.discount" size="mini" clearable>
														<template slot="append">%</template>
													</el-input>
												</template>
											</el-table-column>

											<!-- <el-table-column label="操作" align="center">
											<template slot-scope="scope">
												<el-button size="mini" type="danger"  @click="y.jtjgList.splice(scope.row,1)">删除</el-button>
												<el-button size="mini" type="primary" @click="y.jtjgList.push({})">添加</el-button>
											</template>
										</el-table-column> -->

										</el-table>
									</div>
									<div v-if="yIndex == 4">
										<el-table :data="y.List" border>
											<el-table-column label="满" align="center">
												<template slot-scope="scope">
													<el-input v-model="scope.row.numb" size="mini" clearable>
														<template slot="append">元</template>
													</el-input>
												</template>
											</el-table-column>
											<el-table-column label="立减" align="center">
												<template slot-scope="scope">
													<el-input v-model="scope.row.discount" size="mini" clearable>
														<template slot="append">元</template>
													</el-input>
												</template>
											</el-table-column>

										</el-table>
									</div>
								</el-tab-pane>
							</el-tabs>

						</el-form-item>
					</el-form>

					<el-button style="margin-top: 1rem;" @click="back">上一步，填写商品信息</el-button>
					<el-button type="primary" style="margin-top: 1rem;" @click="next">下一步，填写商品属性</el-button>
				</div>

				<!-- 填写商品属性 -->
				<div class="form" v-if="active==2">
					<el-form ref="form" :model="form" label-width="80px">
						<el-form-item :label="item2.label" v-for="(item2,Iindex) in formItem3" :key="Iindex">
							<!-- 商品属性值 -->
							<el-select filterable v-if="item2.type === 'select'" v-model="form[item2.model]" clearable
									@change="changeSkus"
									:placeholder="item2.pl+item2.label" :style="'width:'+item2.width">
							 	<el-option v-for="p in item2.Single" :key="p._id" :label="p.name" 
									:value="p._id">
							 	</el-option>
							</el-select>

							<!-- 商品规格 -->
							<el-card v-if="item2.type === 'checkbox'" class="box-card" shadow="hover">
								<!-- <el-checkbox :indeterminate="form.isIndeterminate" v-model="form.checkAll" @change="CheckAllChange">全选</el-checkbox> -->
								<div v-if="form.skusIndex == k._id" v-for="(k,kIndex) in item2.list" :key="kIndex">
									
									<div class="checkBoxs" v-for="(y,i) in  k.list" v-model="y.model">
										<span>{{y.name}}：</span>
										<div>
											<el-checkbox-group v-model="form.checkList" @change="check">
												<el-checkbox v-for="(key,kIndex) in y.lb.split('\n')" 
												:key="kIndex" :label="key" />
											</el-checkbox-group>
										</div>
									</div>
									
								</div>
								
								
							</el-card>
							
							<!-- sku -->
							<el-card v-if="item2.type === 'sku'" class="box-card" shadow="hover">
								
								<el-table :data="form.skuList" style="width: 100%;" border>
									<el-table-column v-for="item in PtabLabel" :key="item.prop" :label="item.label" align="center">
										<template slot-scope="scope">
											<span v-if="item.type ==='tablcolumn'">{{scope.row[item.prop] }}</span>
											<el-input v-if="!item.type" v-model="scope.row[item.prop]" clearable></el-input>
										</template>
									</el-table-column>
								
									<el-table-column label="操作" align="center">
										<template slot-scope="scope">
											<el-button size="medium" type="danger" @click="form.list.splice(scope.row,1)">DEL</el-button>
										</template>
									</el-table-column>
									
								</el-table>
								<el-button-group style="margin-top:1rem;">
									<el-button type="success" size="medium" >刷新列表</el-button>
									<el-button type="warning" size="medium" >同步价格</el-button>
									<el-button type="info" size="medium" >同步库存</el-button>
								</el-button-group>
							</el-card>
							
							<!-- 商品相册 -->
							<el-card  v-if="item2.type ==='image'">
								
								<el-upload  class="avatar-uploader"
									:action="uploadUrl" :headers="getAuthHeaders()" 
									:on-success="afterUpload">
									<img v-if="form[item2.model]" :src="form[item2.model]" class="avatar">
									<i v-else class="el-icon-plus avatar-uploader-icon"></i>
								</el-upload>
								
								
								
							</el-card >
							<!-- 富文本编辑 -->
							<vue-editor v-if="item2.type === 'textbox'" id="editor" useCustomImageHandler @image-added="handleImageAdded"
							 v-model="form[item2.model]" />

						</el-form-item>
					</el-form>


					<el-button style="margin-top: 1rem;" @click="back">上一步，填写商品促销</el-button>
					<el-button type="primary" style="margin-top: 1rem;" @click="next">下一步，选择商品关联</el-button>
				</div>

				<!-- 选择商品关联 -->
				<div class="form" v-if="active==3">
					<div>选择商品关联</div>
					<el-button style="margin-top: 1rem;" @click="back">上一步，填写商品属性</el-button>
					<el-button type="primary" style="margin-top: 1rem;" @click="sumbit">完成，提交商品</el-button>

				</div>
			</div>
		</template>

	</com-card>
</template>

<script>
	// com-card
	import ComCard from '@/components/common/card.vue';
	// 富文本编辑
	import {VueEditor} from "vue2-editor";
	export default {
		props:{
			id:{}
		},
		components: {ComCard,VueEditor},
		data() {
			return {
				
				active: 0,
				value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
				stepList: [
					{title: '填写商品信息',},
					{title: '填写商品促销',},
					{title: '填写商品属性',},
					{title: '选择商品关联',}
				],
				formItem: [ //填写商品信息
					{
						model: 'parent',
						label: '商品分类',
						type: 'select',
						pl: '请选择',
						width: '20rem',
						Single:[],
					},
					{
						model: 'title',
						label: '商品名称',
						type: '',
						pl: '请输入',
						width: '20rem'
					},
					{
						model: 'subtitle',
						label: '副标题',
						type: '',
						pl: '请输入',
						width: '20rem'
					},
					{
						model: 'brands',
						label: '商品品牌',
						type: 'selectBrand',
						pl: '请选择',
						width: '20rem',
						Brand:[]
					},
					{
						model: 'numbers',
						label: '商品货号',
						type: '',
						pl: '请输入',
						width: '20rem'
					},
					{
						model: 'price',
						label: '商品售价',
						type: 'append',
						append:'元',
						pl: '请输入',
						width: '20rem'
					},
					{
						model: 'maxnum',
						label: '商品库存',
						type: 'append',
						append:'件',
						pl: '请输入',
						width: '20rem'
					},
					{
						model: 'minnum',
						label: '库存预警',
						type: 'append',
						append:'件',
						pl: '请输入',
						width: '20rem'
					},
					{
						model: 'unit',
						label: '计量单位',
						type: '',
						pl: '请输入',
						width: '20rem'
					},
					{
						model: 'sort',
						label: '排序',
						type: 'inputNumber',
						pl: '请输入',
						width: '20rem'
					},
				],
				formItem2: [ //填写商品促销
					{
						model: 'b',
						label: '商品上架',
						type: 'switch'
					},
					{
						model: 'tj',
						label: '商品推荐',
						type: 'checkbox',
						list: [{
								model: '',
								text: '奶爸精品'
							},
							{
								model: '',
								text: '猜你喜欢'
							}
						]
					},
					{
						model: 'wf',
						label: '服务保证',
						type: 'checkbox',
						list: [{
								model: '',
								text: '快速退款'
							},
							{
								model: '',
								text: '免费配送'
							},
							{
								model: '',
								text: '无忧退货'
							}
						]
					},
					{
						model: 'yhfs',
						label: '优惠方式',
						type: 'tabs',
						list: [{
								model: 'wyh',
								text: '无优惠',
								key: 'wyh'
							},
							{
								model: 'thcs',
								text: '特惠促销',
								key: 'thcs'
							},
							{
								model: 'hyjg',
								text: '会员价格',
								key: 'hyjg',
								lists: [{
										model: '',
										label: '黄金会员'
									},
									{
										model: '',
										label: '白金会员'
									},
									{
										model: '',
										label: '钻石会员'
									}
								]
							},
							{
								model: '',
								text: '阶梯价格',
								key: 'jtjg',
								jtjgList: [{
									numb: '0', //数量
									discount: '0', //折扣
								}]
							},
							{
								model: '',
								text: '满减价格',
								key: 'mjjg',
								List: [{
									numb: '0', //数量
									discount: '0', //折扣
								}]
							}
						]
					},

				],
				formItem3: [ //填写商品类型
					{
						model: 'parent',
						label: '商品类型',
						type: 'select',
						pl: '请选择',
						width: '20rem',
						Single:[],
					},
					
					{
						label: '商品规格',
						type: 'checkbox',
						width: '20rem',
						list: []
						
						
					},
					{model: 'sku',label: 'SKU',type: 'sku'},
					{model: 'src',label: '商品相册',type: 'image'},
					{model: 'details',label: '商品图文',type: 'textbox'},


				],
				form: {
					parent: '',//商品分类
					title:'',
					src:'',
					brands: '',//商品品牌
					types: '',//首页奶爸潮品
					ps:'',
					subtitle:'',
					numbers:'',
					price:'8',
					maxnum:'2000',
					minnum:'100',
					unit:'瓶',
					sort:'50',
					descList:[],
					imagetext:'',
					
					skusIndex:'',
					checkList:[],//承载选中的规格
					checkAll: false,
					isIndeterminate: true,
					
				},
				PtabLabel: [//popup
					{label: '容量',prop: 'rl',type:'tablcolumn'},
					{label: '模式',prop: 'ms',type:'tablcolumn'},
					{label: '周期',prop: 'zq',type:'tablcolumn'},
					{label: '销售价格',prop: 'xsjg'},
					{label: '市场价格',prop: 'scjg'},
					{label: '成本价格',prop: 'cbjg'},
					{label: '库存',prop: 'kc'},
					{label: '库存预警',prop: 'kcyj'},
					{label: '编号',prop: 'bh'}
				],
			}
		},
		
		
		created() {
			this.init()
			this.id && this.__init()
			this.gg()
		},
		
		methods: {
			
			changeSkus(e){//选择商品类型返回的数据ID
				this.form.skusIndex = e
			},
			check(v){//单个
				this.form.checkList = v
			},
			// CheckAllChange(v){//全选
			// 	this.form.checkList = v,
			// 	this.form.isIndeterminate = false
			// },
			
			async gg(){//商品类型
				const res = await this.axios.get('http://127.0.0.1:3336/category')
				
				let key = this.formItem3
				for (let i = 0; i < key.length; i++) {
					key[i].list = res.data//对应商品类型ID的规格数据
					key[i].Single = res.data//商品类型
					
				}
				
			},
			
			async init(){//获取数据
				const res = await this.axios.get('/rest/Classify')
				// 发布商品，获取商品分类
				let key = this.formItem
				for (let i = 0; i < key.length; i++) {
					key[i].Single = res.data.items
				}
				
				const rul = await this.axios.get('/rest/Brand')
				// 发布商品，获取商品品牌
				let k = this.formItem
				for (let j = 0; j < k.length; j++) {
					k[j].Brand = rul.data.items
				}
			},
			
			async __init(){//获取商品编辑的数据
				const res = await this.axios.get(`/rest/Good/${this.id}`)
				this.form = res.data
			},
			async confirm(){//提交
				let res;
				let msg = this.id !== null ? '编辑' : '新增';
				if(this.id){//编辑
					res = await this.axios.put(`rest/Good/${this.id}`,this.form)
					this.$router.push('/goods')
					this.init()
				}else{//发布
					res = this.axios.post('/rest/Good',this.form)
					this.$router.push('/goods')
					this.init()
				}
				this.$notify({title: '提示',message: msg + '成功',type: 'success',duration: '1200'})
				
			},

			next() { //下一步
				if (this.active++ > 2) this.active = 0;
			},
			back(e) { //上一步
				if (this.active-- < 2) this.active = 0;
			},
			sumbit() { //完成
				console.log('submi')
			},
			// 商品相册
			afterUpload(res) { //显示上传的图片
				this.form.src = res.url
			},
			
			// 富文本(图片上传)
			async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
				const formData = new FormData();
				formData.append("file", file);
				const res = await this.axios.post(this.uploadUrl, formData); // 后端上传方法

				Editor.insertEmbed(cursorLocation, "image", res.data.url); //插入图片
				resetUploader(); //重置上传

			}
		},
	}
</script>

<style lang="scss" scoped>
	.main {
		width: 50rem;
		.form {
			margin-top: 3rem;
			margin-left: 2rem;
			margin-right: 2rem;
			.avatar-uploader-icon {
				font-size: 28px;
				color: #8c939d;
				width: 108px;
				height: 108px;
				line-height: 108px;
				text-align: center;
				border: 1px dashed #18BC9C;
			
			}
			.avatar{
				width: 10rem;
				height: 10rem;
			}
			.ml-5{margin-left: 5rem;}
			.mt-1{
				margin-top: 0.5rem;
			}
			// 商品规格
			.checkBoxs{
				display: flex;
				flex-direction: column;
			}
		
		}
		
	}
</style>
