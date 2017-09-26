<template lang="pug">
    div.v-box
      v-checkbox(v-model="value",v-if="items.length",v-for="item,index in items", :key="index" ,:value="getItemID(item)" ,:label="getItemName(item)" ,:disabled="disabled", :name="schema.inputName", :id="getFieldID(schema)")
</template>

<script>
	import {isObject} from "lodash";
	import abstractField from "../abstractField";
	
	export default {
		mixins: [ abstractField ],

		computed: {
			selectOptions() {
				return this.schema.selectOptions || {};
			},

			items() {
				let values = this.schema.values;
				if (typeof(values) == "function") {
					return values.apply(this, [this.model, this.schema]);
				} else
					return values;
			}      
		},

		methods: {
			getItemID(item) {
				if (isObject(item) && item.id)
					return item.id;
				return item;
			},

			getItemName(item) {
				if (isObject(item) && item.name)
					return item.name;

				return item;
			}
		}
	};
</script>
<style lang="css">
    .form-group .field-wrap label.v-checkbox{
        width: auto;
        line-height: 36px;
        background-color: transparent;
        height: 36px;
        padding: 0px;
    }
    .field-wrap label.v-checkbox .v-checkbox-ripple-wrapper{
        width: 36px;
        height: 36px;
        top: 0px;
        left: 10px;
    }
    .field-wrap label.v-checkbox .v-checkbox-icon{
        margin-right: 4px;
        margin-left: 16px;
        top: 6px;
    }
    .field-wrap label.v-checkbox .v-checkbox-label{
        margin-top: 12px;
    }
  
</style>
