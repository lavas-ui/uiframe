<template lang="pug">
  v-date-picker(container='inline',landscape,actions,v-model="value")
</template>
<script>
	import abstractField from "../abstractField";

	export default {
		mixins: [ abstractField ]
	};
</script>

<style lang="css">
    .field-wrap .mu-date-picker{
        width: 100%;
    }
</style>