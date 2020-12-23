<template>
	<div>
		<el-tag
		 style="cursor: pointer;"
		 v-for="(tag,index) in tagList" :key="index"
		  :closable="tag.name !== 'home'"
		  @close="handleClose(tag,index)"
		  size="medium"
		  :effect="$route.name === tag.name ? 'dark':'plain'"
		  @click="changeMenu(tag)"
		  type="warning"
		  >
		{{tag.label}}
		</el-tag>
	</div>
</template>

<script>
	import { mapState,mapMutations} from 'vuex'
	export default{
		computed: {
			...mapState({
				tagList: state => state.menu.tagList
			})
		},
		methods:{
			...mapMutations({
				close:'closeTag'
			}),
			
			//关闭
			handleClose(tag,index){
				//删除时减少一个
				let length = this.tagList.length-1
				this.close(tag)
				// 关闭的标签不是当前路由，不跳转
				if(tag.name !== this.$route.name) return 
				// 关闭标签是最右边，往左跳一个
				if(index === length){
					this.$router.push({name:this.tagList[index-1].name})
				}else{
					// 否则往右边跳
					this.$router.push({name:this.tagList[index].name})
				}
			},
			// 跳转到当前选择的路由
			changeMenu(item){
				// 跳转对应路由
				this.$router.push({name:item.name})
				//重新获取标签
				this.$store.commit('asideTagMenu',item)
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	 .el-tag + .el-tag {
	    margin-left: 10px;
	  }
</style>
