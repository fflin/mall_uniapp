<template>
  <div id="app">
	<router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'app',
  // vue依赖注入
  provide() {
  	return {app: this,}
  },
 data() {
 	return {}
 },
 created() {
	// 防止tag标签刷新时丢失
	this.$store.commit('getTagMenu')
	this.$store.commit('initUser')
	
 }
 
}
</script>

<style lang="scss" scoped>
#app {
	// 设置屏幕高度
	height: 100vh!important;
}

</style>
