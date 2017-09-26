<template lang="pug">
  v-btn(flat,primary) {{label}}
  
</template>
<script>
	import abstractField from "../abstractField";

	export default {
		mixins: [ abstractField ],
        methods:{
            clearValidationErrors(){
                console.log('kkkkk+++==')
            }
        }
	};
</script>

<style lang="css">
    
</style>