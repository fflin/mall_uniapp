<template>
	<div class="group">
		<el-button v-for="(item,index) in buttonList" :key="index" :type="item.type" round size="small"  @click="way(item)">{{item.name}}</el-button>
		
	</div>
</template>

<script>
	export default{
		props: {
			buttonList:Array,
		},
		methods: {
			way(item) {
				this.$emit('way',item)
			}
		},
	}
</script>

<style>
</style>
