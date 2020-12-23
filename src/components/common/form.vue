<template>
	<el-form :inline="inline" :rules="rules" ref="form" :model="form" label-width="96px">
		<el-form-item v-for="item in formLabel" :key="item.model" :label="item.label" :prop="item.model">
			<!-- input -->
			<el-input size="medium" autosize v-model="form[item.model]" :placeholder="'请输入'+item.label" v-if="!item.type" clearable @clear="clear"
			 :style="'width:'+item.width" />
			
			<!-- (文本)textarea -->
			<el-input v-if="item.type === 'textarea'" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form[item.model]"
			 :placeholder="'请输入'+item.label" :style="'width:'+item.width" />

			<!-- 复合型输入框 -->
			<div v-if="item.type === 'InputNumber'">
				<el-input-number size="medium" controls-position="right" :placeholder="item.pl" v-model="form[item.model]" :min="1"
				 :max="200" :style="'width:'+item.width">
				</el-input-number>
				<small style="display: flex;flex-direction: column-reverse;">设置排序（数字越大，排序越靠前）</small>
			</div>
			
			<!-- 复合型输入框二 -->
			<div v-if="item.type === 'unit'" >
				<el-input :placeholder="item.pl"
					v-model="form[item.model]" :style="'width:'+item.width" clearable>
					<template slot="prepend" v-if="item.show">{{item.prepend}}</template>
				    <template slot="append">{{item.append}}</template>
					
				</el-input>
				<small style="display: flex;flex-direction: column-reverse;">{{item.desc}}</small>
			</div>
			
			<!-- password -->
			<el-input v-model="form[item.model]" :placeholder="'请输入'+item.label" v-if="item.type === 'password'" show-password
			 clearable :style="'width:'+item.width" />
			
			<!-- 上传图片 -->
			<!-- :headers="getAuthHeaders()"获取token 在main.js 中定义的-->
			<el-upload v-if="item.type === 'imageUrl'" class="avatar-uploader" 
				:action="uploadUrl" :headers="headers"
				:on-success="afterUpload">
				<img v-if="form[item.model]" :src="form[item.model]" class="avatar" style="width: 50px;height: 50px;border-radius: 100%;">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			
			<!-- 品牌 -->
			<el-select filterable v-if="item.type === 'brand'" v-model="form[item.model]" clearable :placeholder="'请选择'+item.label" >
				<el-option v-for="roles in item.brandList" :key="roles._id" :label="roles.name" :value="roles._id">
				</el-option>
			</el-select>
			
			<!-- 广告类型(单个)选择 -->
			<el-select filterable v-if="item.type === 'gyselect'" v-model="form[item.model]" clearable 
				value-key="_id" :placeholder="'请选择'+item.label" :style="'width:'+item.width">
				<el-option v-for="roles in item.Single" :key="roles._id" :label="roles.type" 
				:value="roles._id">
				</el-option>
			</el-select>
			<!-- 商品分类 -->
			<el-select filterable v-if="item.type === 'selects'" v-model="form[item.model]" clearable
				value-key="_id" :placeholder="'请选择'+item.label" :style="'width:'+item.width">
				<el-option v-for="roles in item.Single" :key="roles._id" :label="roles.name" 
				:value="roles">
				</el-option>
			</el-select>
			
			<!-- 权限 -->
			<el-select filterable v-if="item.type === 'label'" v-model="form[item.model]" clearable
				 :placeholder="'请选择'+item.label" :style="'width:'+item.width">
				<!-- <el-option label="顶级规则" :value="0"></el-option> -->
				<el-option v-for="roles in item.Single" :key="roles._id" :label="roles.label" 
				:value="roles._id">
				</el-option>
			</el-select>
			
			
			
			<!-- (单个)选择 -->
			<el-select filterable v-if="item.type === 'select'" v-model="form[item.model]" clearable 
				value-key="_id" :placeholder="'请选择'+item.label" :style="'width:'+item.width">
				<el-option v-for="k in item.Single" :key="k._id" :label="k.name" 
				:value="k._id"
				v-if="k.super === '1' ? '': `show:true`">
				</el-option>
			</el-select>
			
			<!-- 多个选择 -->
			<el-select filterable multiple clearable v-if="item.type === 'multiple'" v-model="form[item.model]"
				value-key="_id" :placeholder="'请选择'+item.label" :style="'width:'+item.width">
				<el-option v-for="m in item.multipleList" :key="m._id" 
				:label="m.name" :value="m">
				</el-option>
			</el-select>
			
			<!-- 状态 -->
			<el-radio v-model="form[item.model]" v-if="item.type === 'radio'" v-for="k in item.opts" :key="k.status" border
			 :label="k.label">{{k.text}}</el-radio>
			 
			<!-- 升级条件 -->
			<el-form-item v-if="item.type === 'tj'">
				<small>{{item.small}}</small>
				<el-input type="number" class="mx-4" :placeholder="'请输入'+item.small" v-model="form[item.model]" clearable style="width: 240px;">
					<template slot="append">{{item.dw}}</template>
				</el-input>

			</el-form-item>
			<!-- 日期和时间 -->
			<div v-if="item.type === 'date'">
				<el-date-picker v-model="form[item.model]"
				    :style="'width:'+item.width"
					type="datetimerange" 
					range-separator="至" 
					start-placeholder="开始日期" 
					end-placeholder="结束日期">
				</el-date-picker>
				<small style="display: flex;flex-direction: column-reverse;">{{item.desc}}</small>
			</div>
		</el-form-item>
		
		<!-- 按钮插槽 -->
		<el-form-item>
			<slot name="button"></slot>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		props: {
			// 表单(model)
			form: [Object,Array],
			// 表单内容
			formLabel: Array,
			// 默认(水平)否
			inline: Boolean,
			headers: Object,
			rules:Object,
			show: {// 是否显示
				type:Boolean,
				default:false
			},

		},
		data() {
			return {
				dataIndex:0,
			}
		},
		methods: {
			clear() {//数据重新渲染
				this.$emit('clear')
			},
			afterUpload(res) {//图片上传
				this.$emit('afterUpload', res)
			},
			childMethods(){//校验方法
				this.$refs.form.validate(v => {
					if(!v) return
				})
			}
			
		},
	}
</script>

<style lang="scss" scoped>
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 108px;
		height: 108px;
		line-height: 108px;
		text-align: center;
		border: 1px dashed #18BC9C;

	}

	.mx-4 {
		margin-left: 20px;
	}

	.mt-2 {
		margin-top: 20px;
	}
</style>
