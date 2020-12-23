<template>
	<com-card label="交易设置">
		<template slot="content">
			<el-tabs v-model="activeName">
				<el-tab-pane v-for="(item,index) in tabPane" :key="index" :label="item.label" :name="item.name">
					<el-form :ref='form' :model="form" label-width="140px">
						<!-- 支付设置 -->
						<el-table v-if="index == 0" :data="resData" style="width: 100%;" border>

							<el-table-column v-for="items in tabLabel" :key="items.prop" :label="items.label" align="center">
								<template slot-scope="scope">
									<div class="items">
										<img :src="scope.row.src" />
										<div class="content">
											<h6>{{ scope.row[items.prop] }}</h6>
											<small>{{ scope.row.desc }}</small>
										</div>
									</div>
								</template>


							</el-table-column>

							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<el-button size="mini" plain type="success" @click="open(scope.row)">配置</el-button>
								</template>
							</el-table-column>
						</el-table>
						<!-- 购物设置 -->
						<el-form-item v-if="index == 1" v-for="shop in shopForm" :key="shop.label" :label="shop.label">

							<div v-if="shop.type == 'input'">
								<el-input v-model="shop.model" clearable :style="'width:'+shop.width">
									<template slot="append">{{shop.append}}</template>
								</el-input>
								<small style="display: block;">{{shop.model}}{{shop.append}}{{shop.dc}}；设置为0不自动关闭。</small>

							</div>
							<el-button v-if="shop.type == 'btn'" type="success">保存</el-button>
						</el-form-item>
						<!-- 优惠券设置 -->
					</el-form>
				</el-tab-pane>
			</el-tabs>
			<!-- 抽屉弹框 -->
			<el-drawer :visible.sync="drawer" :with-header="false">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>配置({{this.drawerTitle}})</span>
					</div>
					<el-form :ref="payForms" :model="payForms" label-width="50px">
						<el-form-item v-for="pay in payForm" :key="pay.label" :label="pay.label">

							<el-input v-if="!pay.type" v-model="pay.model" clearable :style="'width:'+pay.width" />

							<el-input v-if="pay.type =='textarea'" type="textarea" v-model="pay.model" clearable :autosize="{ minRows: 2, maxRows: 4}"
							 :style="'width:'+pay.width" />
						</el-form-item>
					</el-form>
					<div class="footer">
						<el-button type="info" @click="close">取消</el-button>
						<el-button type="primary">确定</el-button>
					</div>

				</el-card>

			</el-drawer>
		</template>
	</com-card>
</template>

<script>
	import ComCard from '@/components/common/card.vue'
	export default {
		components: {
			ComCard
		},
		data() {
			return {
				activeName: 'Bucket',
				form: {},
				tabPane: [{
						label: '支付设置',
						name: 'Bucket'
					},
					{
						label: '购物/订单设置',
						name: 'shop'
					}
				],
				tabLabel: [{
					prop: 'pay',
					label: '支付'
				}],
				resData: [{
						pay: '支付宝支付',
						desc: '该系统支付即时到帐接口',
						src: 'http://wxcs.niuteam.cn/addons/NsAlipay/ico.png'
					},
					{
						pay: '微信支付',
						desc: '该系统支持微信网页支付和扫码支付',
						src: 'http://wxcs.niuteam.cn/addons/NsWeixinpay/ico.png'
					}
				],
				shopForm: [{
						model: '40',
						label: '秒杀订单超过',
						type: 'input',
						width: '20rem',
						append: '分钟',
						dc: '未付款，订单自动关闭'
					},
					{
						model: '20',
						label: '正常订单超过',
						type: 'input',
						width: '20rem',
						append: '分钟',
						dc: '未付款，订单自动关闭'
					},
					{
						model: '1',
						label: '发货超过',
						type: 'input',
						width: '20rem',
						append: '小时',
						dc: '未收货，订单自动完成'
					},
					{
						model: '1',
						label: '订单完成超过',
						type: 'input',
						width: '20rem',
						append: '天',
						dc: '自动结束交易，不能申请售后'
					},
					{
						model: '2',
						label: '订单完成',
						type: 'input',
						width: '20rem',
						append: '天',
						dc: '自动五星好评'
					},
					{
						model: '',
						label: '',
						type: 'btn'
					}
				],
				// 抽屉弹框
				drawer: false,
				drawerTitle: '',
				payForms: {},
				payForm: [{
						model: '',
						label: 'APP_ID',
						width: '20rem'
					},
					{
						model: '',
						label: '公钥',
						width: '20rem',
						type: 'textarea'
					},
					{
						model: '',
						label: '私钥',
						width: '20rem',
						type: 'textarea'
					}
				]
			}
		},
		methods: {
			open(row) {
				this.drawerTitle = row.pay
				this.drawer = true
			},
			close(){
				this.drawer = false
			}
		},
	}
</script>

<style lang="scss" scoped>
	.items {
		display: flex;
		align-items: center;

		&>img {
			width: 3rem;
			height: 3rem;
		}

		.content {
			margin-left: 1rem;

			&>h6 {
				font-weight: bolder;
			}

			&>small {
				display: block;
			}
		}
	}
</style>
