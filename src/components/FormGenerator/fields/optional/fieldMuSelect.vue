<template lang="pug">
	v-select(v-model="value",:label="schema.inputName",:disabled="disabled", :name="schema.inputName", :id="getFieldID(schema)",:items="items",max-height="400",:multiple="schema.multiple")
        
</template>

<script>
	import {isObject,isFunction} from "lodash";
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
				}
                else{
                    
					return values;
                }
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
			},
            isMultiple(item) {
				if (isObject(item) && item.multiple)
					return item.multiple;

				return item;
			}
		}
	};
</script>


<style lang="css">
    .field-wrap .mu-select-field .mu-dropDown-menu-text{
        line-height: 32px;
        height: 32px;
        padding-left: 8px;
        padding-right: 24px;
        display: inline-flex;
        width: 100%;
    }
    .field-wrap .mu-select-field .mu-dropDown-menu .mu-dropDown-menu-icon{
        color: #f53737;
        top:4px;
    }
    .field-wrap .mu-select-field .mu-dropDown-menu{
        display: inline-flex;
        font-size: 14px;
        height: 32px;
        line-height: 32px;
    }
</style>
