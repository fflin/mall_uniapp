<template>
	<div>
		<el-table stripe border :data="resData" style="width: 100%" @selection-change="hsc">
			<!-- 全选 -->
			<el-table-column v-if="selectShow" type="selection" width="55" align="center"></el-table-column>
			<!-- 序号 -->
			<el-table-column v-if="indexShow" label="序号" type="index" width="50" align="center">
				<template slot-scope="scope">
					<span>{{ (config.page -1) * 20 + scope.$index + 1}}</span>
				</template>
			</el-table-column>
			<!-- 内容 -->
			<el-table-column v-for="item in tabLabel" :key="item.prop" :label="item.label" align="center" :width="item.width">
				<template slot-scope="scope">
					<!-- 默认 -->
					<span v-if="!item.type">{{ scope.row[item.prop] ? scope.row[item.prop]:item.desc }}</span>
					<span v-if="item.type === 'count'">{{ scope.row[item.prop].length }}</span>
					<span v-if="item.type === 'icon'" :class="'el-icon-'+scope.row[item.prop]"></span>
					<span v-if="item.type === 'j'">{{ scope.row[item.prop].replace(/\n/g,',') }}</span>
					<span v-if="item.type === 'kxset'">{{ scope.row.kx === '0' ? '唯一':'单选' && scope.row.kx === '2' ? '复选':'单选'}}</span>
					<span v-if="item.type === 'wayset'">{{ scope.row.way === '0' ? '手工':'列表选择'}}</span>
					<span v-if="item.type === 'goodsTitle'">{{ scope.row[item.prop].title }}</span>
					<span v-if="item.type === 'gyselect'">{{ scope.row[item.prop].type }}</span>
					<!-- 优惠券标题与金额 -->
					<span v-if="item.type === 'tp'">
						{{scope.row.name}}
						{{'￥'+scope.row.limit}}
					</span>
					<!-- price -->
					<span v-if="item.type === 'price'">
						{{'￥'+scope.row.price}}
					</span>
					
					<!-- 优惠券标总数、使用、领取-->
					<span v-if="item.type === 'totals'">
						{{scope.row.employ}}/
						{{scope.row.draw}}/
						{{scope.row.total}}
					</span>
					
					<!-- 支付方式 -->
					<span v-if="item.type === 'pay'">
						{{ scope.row.pay === 'alpay' ? '支付宝':'' }}
						{{ scope.row.pay === 'wxpay' ? '微信支付':'' }}
					</span>
					
					<!-- 订单状态 -->
					<span v-if="item.type === 'orderStatus'">
						{{ scope.row.status === '0' ? '待付款':'' }}
						{{ scope.row.status === '1' ? '待发货':'' }}
						{{ scope.row.status === '2' ? '已发货':'' }}
						{{ scope.row.status === '3' ? '已完成':'' }}
						{{ scope.row.status === '4' ? '已关闭':'' }}
					</span>
					
					<!-- 申请状态 -->
					<span v-if="item.type === 'saleStatus'">
						{{ scope.row.status === '0' ? '待处理':'' }}
						{{ scope.row.status === '1' ? '退货中':'' }}
						{{ scope.row.status === '2' ? '已拒绝':'' }}
						{{ scope.row.status === '3' ? '已完成':'' }}
					</span>
					
					<!-- 优惠券有效时间 -->
					<span v-if="item.type === 'coupon'">{{ '领取后'+ scope.row[item.prop] +'天内有效' }}</span>
					
					<!-- 优惠券领取截止时间 -->
					<span v-if="item.type === 'btimes'" v-for="p in scope.row[item.prop]" :key="p">
						{{p | formatDate }}
					</span>

					<!-- names -->
					<div style="color: #f56c6c;" v-if="item.type === 'names'" width="200">
						<el-tag class="tagItem">
							{{ '账号:'+scope.row.mobile}}
						</el-tag>
						<el-tag class="tagItem">
							{{ '昵称:'+scope.row.nickname }}
						</el-tag>
					</div>

					<!-- 商品、评价 -->
					<div style="color: #f56c6c;" v-if="item.type === 'goodInfo'" width="200">
						<el-tag class="tagItem">
							{{ '商品:'+'100'}}
						</el-tag>
						<el-tag class="tagItem">
							{{ '评价:'+'100' }}
						</el-tag>
					</div>
					
					<!-- 商品、评价 -->
					<div v-if="item.type === 'pn'" width="200">
						<el-tag class="tagItem" type="danger">
							{{ '价格:'+ '￥'+scope.row.price}}
						</el-tag>
						<el-tag class="tagItem" type="danger">
							{{ '货号:'+ scope.row.numbers}}
						</el-tag>
					</div>

					<!-- 商品分类 -->
					<div v-if="item.type === 'isParent'">
						<span style="color: #008080;">{{scope.row.parent ? scope.row.parent.name:'一级' }}</span>
					</div>

					<!-- 会员等级 -->
					<div v-if="item.type === 'member'">
						<span style="color: #008080;">{{scope.row.parent ? scope.row.parent.name:'' }}</span>
					</div>

					<!-- 广告位置父级id -->
					<div v-if="item.type === 'adsParent'">
						<div v-for="(ads,adsIndex) in scope.row.parents" :key="adsIndex">
							<el-tag class="tagItem">
								{{ads.name}}
							</el-tag>
						</div>
					</div>

					<!-- 升级条件 -->
					<div style="color: #f56c6c;" v-if="item.type === 'tj'">
						<el-tag class="tagItem" type="danger" effect="dark">
							{{ '累计消费:'+scope.row.maxPrice +'元'}}
						</el-tag>
						<el-tag class="tagItem" type="danger" effect="dark">
							{{ '累计次数:'+scope.row.maxTimes+'次' }}
						</el-tag>
					</div>

					<!-- 头像 -->
					<img v-if="item.type === 'imageUrl'" style="width: 3rem;height: 3rem;border-radius: 100%;" :src="scope.row.src" />
					<!-- 广告 -->
					<img v-if="item.type === 'slogan'" style="width: 3rem;height: 3rem;" :src="scope.row.src" />
					
					<!-- 角色 -->
					<div v-if="item.type === 'userList'">
						<el-tag type="warning" v-if="scope.row.roleId" class="tagItem">
							{{ scope.row.roleId.name }}
							({{ scope.row.roleId.desc }})
						</el-tag>
					</div>
					<div v-if="item.type === 'parent'">
						<el-tag v-if="scope.row.parent" class="tagItem">
							{{ scope.row.parent.name }}
							{{scope.row.parent}}
						</el-tag>
					</div>

					

					<!-- 开关 -->
					<!-- <el-switch v-if="item.type === 'switch'" 
						v-model="scope.row.ismake" active-color="#67c23a" 
						inactive-color="#ff4949"
					 active-value="1" inactive-value="0" /> -->
					 
					 <el-switch v-if="item.type === 'switch'" 
						v-model="scope.row.status" 
						active-color="#13ce66"
						inactive-color="#ff4949"
						active-value="1"
						inactive-value="0"
						@change="userStateChange(scope.row)"
					/>
					 
					<!-- 标签 -->
					<div class="center" v-if="item.type === 'switchStatus'">
						<span class="span">产品：</span>
						<el-button round
							:type="scope.row.status=== '1' ? 'warning':'danger'" 
							size="mini" @click="changeStatus(scope.row)">
							{{scope.row.status === '1' ? '下架':'上架'}}
						</el-button>
					</div>
					
					<div class="center" v-if="item.type === 'switchStatus'">
						<span class="span">潮品：</span>
						<el-button round
							:type="scope.row.cptj=== '1' ? 'info':'danger'" 
							size="mini" @click="cptj(scope.row)">
							{{scope.row.cptj === '1' ? '不推荐':'推荐'}}
						</el-button>
					</div>
					
					<div class="center" v-if="item.type === 'switchStatus'">
						<span class="span">喜欢：</span>
						<el-button round
							:type="scope.row.cnxh=== '1' ? 'success':'danger'" 
							size="mini" @click="cnxh(scope.row)">
							{{scope.row.cnxh === '1' ? '不推荐':'推荐'}}
						</el-button>
					</div>
					
					<div class="center" v-if="item.type === 'switchStatus'">
						<span class="span">商品：</span>
						<el-button round
							:type="scope.row.spy=== '1' ? '':'danger'" 
							size="mini" @click="spy(scope.row)">
							{{scope.row.spy === '1' ? '不推荐':'推荐'}}
						</el-button>
					</div>
					
					<el-button round v-if="item.type === 'ischeck'"
						:type="scope.row.ischeck=== '1' ? 'success':'danger'" 
						size="mini" @click="ischeck(scope.row)">
						{{scope.row.ischeck === '1' ? '拒绝':'同意'}}
					</el-button>
					
					<!-- 管理员按钮/状态-->
					<el-button round v-if="item.type === 'roleIdButton'"
						v-show="scope.row.roleId.super === '1' ? '':'show'" 
						:type="scope.row.status === '1' ? 'success':'danger'" 
						size="mini" @click="statusChange(scope.row)">
						{{scope.row.status === '1' ? '禁用':'启用'}}
					</el-button>
					<!-- 通用按钮/状态 -->
					<el-button round v-if="item.type === 'status'"
						v-show="scope.row.super === '1' ? '':'show'" 
						:type="scope.row.status === '1' ? 'success':'danger'" 
						size="mini" @click="statusChange(scope.row)">
						{{scope.row.status === '1' ? '禁用':'启用'}}
					</el-button>
					
					<!-- 统计 -->
					<div v-if="item.type === 'total'">
						{{scope.row.list.length}}
					</div>

					<!-- 设置-操作按钮 -->
					<el-button-group v-if="item.type === 'button'">
						<el-button size="mini" plain v-for="(btn,btnIndex) in item.list" :key="btnIndex" 
						@click="getTos(btn.url,scope.row)">{{btn.name}}</el-button>
					</el-button-group>
					
					<!-- 设置-订单操作按钮 -->
					<el-button-group v-if="item.type === 'orderButton'">
						<el-button size="mini" plain> 查看订单 </el-button>
						<el-button size="mini" plain v-for="(btn,btnIndex) in item.list" :key="btnIndex" 
						@click="getTos(btn.url,scope.row)">
						
							{{scope.row.status === '0' ? btn.name:''}}
							{{scope.row.status === '1' ? '订单发货':''}}
							{{scope.row.status === '2' ? '订单跟踪':''}}
							{{scope.row.status === '3' ? '订单跟踪':''}}
							{{scope.row.status === '4' ? '删除订单':''}}
						</el-button>
					</el-button-group>

			
					<!-- 通用 操作相关 -->
					<el-button-group v-if="item.type === 'cz' "
						v-show="scope.row.super  === '1' ? '' : 'show'">
						<el-button size="mini" plain type="success" @click="edit(scope)">修改</el-button>
						<el-button size="mini" plain type="primary" v-if="isShow" @click="drawer(scope.row)">{{butConfig}}</el-button>
						<el-button size="mini" plain type="danger" @click="del(scope.row)">删除</el-button>
						
					</el-button-group>
					<!-- 管理员 操作相关 -->
					<el-button-group v-if="item.type === 'roleId' "
						v-show="scope.row.roleId.super  === '1' ? '' : 'show'">
						<el-button size="mini" plain type="success" @click="edit(scope)">修改</el-button>
						<el-button size="mini" plain type="danger" @click="del(scope.row)">删除</el-button>
						
					</el-button-group>
					
					
					
				</template>
			</el-table-column>
			
			
			
			<!-- 操作 -->
			<!-- <el-table-column v-if="handle" align="center" label="操作" width="200">
				<template slot-scope="scope" >
					
					<el-button-group 
						v-if="scope.row.super  === '1' ? '' : 'show'">
						<el-button size="mini" plain type="success" @click="edit(scope)">修改</el-button>
						<el-button size="mini" plain type="primary" v-if="isShow" @click="drawer(scope.row)">{{butConfig}}</el-button>
						<el-button size="mini" plain type="danger" @click="del(scope.row)">删除</el-button>
					</el-button-group>
					
				</template>
			</el-table-column> -->

		</el-table>
		<!-- 分页 -->
		<el-pagination @size-change="Size" @current-change="Current" :current-page.sync="config.page" :page-sizes="config.sizes"
		 :page-size="config.size" layout="total, sizes, prev, pager, next, jumper" :total="config.total">
		</el-pagination>

	</div>
</template>

<script>
	export default {
		props: {
			selectShow:{//全选
				type: Boolean,
				default: false
			},
			// multipleSelection:Array,
			indexShow:{//序号
				type: Boolean,
				default: true
			},
			//数据
			resData: [Array, Object, String],
			// 表格label
			tabLabel: [Array, Object],
			// 默认不显示
			isShow: {
				type: Boolean,
				default: false
			},
			handle:{//操作按钮
				type: Boolean,
				default: true
			},
			
			// 页码 
			config: Object,
			//操作按钮配置
			butConfig:{
				type:String,
				default:'授权'
			}

		},
		data() {
			return {
				// 状态默认不显示
				show: false,

			};
		},

		methods: {

			edit(row) {//编辑
				this.$emit('edit', row);
			},
			del(row) {//删除
				this.$emit('del', row);
			},
			
			Size(page) {// 每页/条
				this.$emit('Size', page)
			},
			
			Current(page) {// 当前页
				this.$emit('Current', page)
			},
			
			drawer(row) {// 授权
				this.$emit('drawer', row)
			},
			getTos(e, row) { //设置
				this.$emit('getTos', e, row)
			},
			hsc(e){//全选
				this.$emit('hsc',e)
			},
			changeStatus(row){//上下架
				this.$emit('changeStatus',row)
			},
			cptj(row){//潮品推荐
				this.$emit('cptj',row)
			},
			cnxh(row){//猜你喜欢
				this.$emit('cnxh',row)
			},
			spy(row){//商品页
				this.$emit('spy',row)
			},
			ischeck(row){//审核状态
				this.$emit('ischeck',row)
			},
			userStateChange(row){//开关
				this.$emit('userStateChange',row)
			},
			statusChange(row){//状态
				this.$emit('statusChange',row)
			}


		}
	};
</script>

<style lang="scss" scoped>
	// 页码样式
	.el-pagination {
		height: 50px;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tagItem {
		display: flex;
		margin-bottom: 1rem;
		align-items: center;
	}
	.center{
		// display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
		.span{
			color: #222D32;font-weight: 200;
		}
	}
</style>
