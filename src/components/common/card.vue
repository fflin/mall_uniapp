<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span style="font-weight: bold;">{{label}}</span>
		</div>
		<!-- 插槽 -->
		<slot name="content"></slot>
	</el-card>
</template>

<script>
	// import { mapState } from 'vuex'
	export default{
		props: {
			label: {
				type: String,
				default: '控制台'
			},
		},
		computed: {
			// ...mapState({
			// 	current: state => state.card.currentMenu,
				
			// })
		},
	}
</script>

<style>
</style>
