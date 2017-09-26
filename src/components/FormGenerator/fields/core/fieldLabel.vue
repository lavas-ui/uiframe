<template lang="pug">
	span(:id="getFieldID(schema)") {{ value }}
</template>

<script>
	import abstractField from "../abstractField";

	export default {
		mixins: [ abstractField ]
	};
</script>

<style lang="stylus">
.vue-form-generator 
    .field-label
      span {
		display: block;
		width: 100%;
		margin-left: 12px;
      }
</style>
