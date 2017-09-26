<template lang="pug">
    div.bpmn-form
      div.form-group(v-for='group in groups',:key='group.legend')
        mu-sub-header {{group.legend}}
        mu-flexbox(wrap="wrap",justify="center",align="stretch")
          mu-flexbox-item(v-for='field in group.fields',:key='field.model',v-if='fieldVisible(field)')
            label(v-if='fieldTypeHasLabel(field)',:for="getFieldID(field)") {{ field.label }}
            .field-wrap
              component(:is='getFieldType(field)', :disabled='fieldDisabled(field)', :model='model', :schema='field', :formOptions='options',@model-updated='modelUpdated', @validated="onFieldValidated")
          
        
    
</template>

<script>
  // import Vue from "vue";
	import {each, isFunction, isNil, isArray, isString} from "lodash";
	import { slugifyFormID } from "./utils/schema";

	// Load all fields from '../fields' folder
	let fieldComponents = {};

	let coreFields = require.context("./fields/core", false, /^\.\/field([\w-_]+)\.vue$/);

	each(coreFields.keys(), (key) => {
		let compName = key.replace(/^\.\//, "").replace(/\.vue/, "");
		fieldComponents[compName] = coreFields(key);
	});
    let Fields = require.context("./fields/optional", false, /^\.\/field([\w-_]+)\.vue$/);

    each(Fields.keys(), (key) => {
        let compName = key.replace(/^\.\//, "").replace(/\.vue/, "");
        fieldComponents[compName] = Fields(key);
    });
	

	export default {
		components: fieldComponents,

		props: {
			schema: Object,

			model: Object,

			options: {
				type: Object,
				default()  {
					return {
						validateAfterLoad: false,
						validateAfterChanged: false,
						validationErrorClass: "error",
						validationSuccessClass: "",
					};
				}
			},

			multiple: {
				type: Boolean,
				default: false
			},

			isNewModel: {
				type: Boolean,
				default: false
			},

			tag: {
				type: String,
				default: "fieldset",
				validator: function (value) {
					return value.length > 0;
				}
			}
		},

		data () {
			return {
				errors: [] // Validation errors
			};
		},

		computed: {
			fields() {
				let res = [];
				if (this.schema && this.schema.fields) {
					each(this.schema.fields, (field) => {
						if (!this.multiple || field.multi === true)
							res.push(field);
					});
				}

				return res;
			},
			groups() {
				let res = [];
				if (this.schema && this.schema.groups) {
					each(this.schema.groups, (group) => {
						res.push(group);
					});
				}

				return res;
			}
		},

		watch: {
			// new model loaded
			model: function(newModel, oldModel) {
				if (oldModel == newModel) // model property changed, skip
					return;

				if (newModel != null) {
					this.$nextTick(() => {
						// Model changed!
						if (this.options.validateAfterLoad === true && this.isNewModel !== true)
							this.validate();
						else
							this.clearValidationErrors();
					});
				}
			}
		},

		mounted() {
			this.$nextTick(() => {
				if (this.model) {
					// First load, running validation if neccessary
					if (this.options.validateAfterLoad === true && this.isNewModel !== true){
						this.validate();
					} else {
						this.clearValidationErrors();
					}
				}
			});
		},

		methods: {
			// Get style classes of field
			getFieldRowClasses(field) {
				const hasErrors = this.fieldErrors(field).length > 0;
				let baseClasses = {
					error: hasErrors,
					disabled: this.fieldDisabled(field),
					readonly: this.fieldReadonly(field),
					featured: this.fieldFeatured(field),
					required: this.fieldRequired(field)
				};

				let {validationErrorClass, validationSuccessClass} = this.options;
				if (validationErrorClass && validationSuccessClass) {
					if (hasErrors) {
						baseClasses[validationErrorClass] = true;
						baseClasses.error = false;
					}
					else {
						baseClasses[validationSuccessClass] = true;
					}
				}

				if (isArray(field.styleClasses)) {
					each(field.styleClasses, (c) => baseClasses[c] = true);
				}
				else if (isString(field.styleClasses)) {
					baseClasses[field.styleClasses] = true;
				}

				baseClasses["field-" + field.type] = true;

				return baseClasses;
			},

			// Get type of field 'field-xxx'. It'll be the name of HTML element
			getFieldType(fieldSchema) {
				return "field-" + fieldSchema.type;
			},

			// Should field type have a label?
			fieldTypeHasLabel(field) {
				let relevantType = "";
				if (field.type === "input") {
					relevantType = field.inputType;
				} else {
					relevantType = field.type;
				}

				switch (relevantType) {
				case "button":
				case "submit":
				case "reset":
					return false;
				default:
					return true;
				}
			},

			// Get disabled attr of field
			fieldDisabled(field) {
				if (isFunction(field.disabled))
					return field.disabled.call(this, this.model, field, this);

				if (isNil(field.disabled))
					return false;

				return field.disabled;
			},

			// Get required prop of field
			fieldRequired(field) {
				if (isFunction(field.required))
					return field.required.call(this, this.model, field, this);

				if (isNil(field.required))
					return false;

				return field.required;
			},

			// Get visible prop of field
			fieldVisible(field) {
				if (isFunction(field.visible))
					return field.visible.call(this, this.model, field, this);

				if (isNil(field.visible))
					return true;

				return field.visible;
			},

			// Get readonly prop of field
			fieldReadonly(field) {
				if (isFunction(field.readonly))
					return field.readonly.call(this, this.model, field, this);

				if (isNil(field.readonly))
					return false;

				return field.readonly;
			},

			// Get featured prop of field
			fieldFeatured(field) {
				if (isFunction(field.featured))
					return field.featured.call(this, this.model, field, this);

				if (isNil(field.featured))
					return false;

				return field.featured;
			},

			buttonClickHandler(btn, field, event) {
				return btn.onclick.call(this, this.model, field, event, this);
			},

			// Child field executed validation
			onFieldValidated(res, errors, field) {
				// Remove old errors for this field
				this.errors = this.errors.filter(e => e.field != field.schema);

				if (!res && errors && errors.length > 0) {
					// Add errors with this field
					errors.forEach((err) => {
						this.errors.push({
							field: field.schema,
							error: err
						});
					});
				}

				let isValid = this.errors.length == 0;
				this.$emit("validated", isValid, this.errors);
			},

			// Validating the model properties
			validate() {
				this.clearValidationErrors();
                
				this.$children.forEach((child) => {
                    
					if (isFunction(child.validate))
					{
						let errors = child.validate(true);
						errors.forEach((err) => {
							this.errors.push({
								field: child.schema,
								error: err
							});
						});
					}
                    else{
                        child.$children.forEach((cld)=>{
                            let fieldCld = cld.$children[0];
                            if (isFunction(fieldCld.validate))
                            {
                                let errors = fieldCld.validate(true);
                                errors.forEach((err) => {
                                    this.errors.push({
                                        field: fieldCld.schema,
                                        error: err
                                    });
                                });
                            }
                        });
                    }
				});

				let isValid = this.errors.length == 0;
				this.$emit("validated", isValid, this.errors);
				return isValid;
			},

			// Clear validation errors
			clearValidationErrors() {
				this.errors.splice(0);

				each(this.$children, (container) => {
                    
                    if(container.clearValidationErrors){
					   container.clearValidationErrors();
                    }
                    each(container.$children,(child) =>{
                        let fieldCld = child.$children[0];
                        if(fieldCld && fieldCld.clearValidationErrors){
                           fieldCld.clearValidationErrors();
                        }
                    })
				});
			},

			modelUpdated(newVal, schema){
				this.$emit("model-updated", newVal, schema);
			},

			buttonVisibility(field) {
				return field.buttons && field.buttons.length > 0;
			},

			fieldErrors(field) {
				let res = this.errors.filter(e => e.field == field);
				return res.map(item => item.error);
			},

			getFieldID(schema) {
				const idPrefix = this.options && this.options.fieldIdPrefix ? this.options.fieldIdPrefix : "";
				return slugifyFormID(schema, idPrefix);
			}			
		}
	};
</script>


<style lang="css">

   
    .field-wrap .mu-text-field-content{
        padding-bottom: 0px;
        padding-top: 0px;
    }
    .field-wrap .mu-text-field-icon{
        left: 8px;
        top:4px;
    }
    .field-wrap .mu-text-field{
        min-height: 32px;
        margin-bottom: 0px;
        width: 100%;
    }
    .field-wrap .mu-text-field.has-icon{
        padding-left: 32px;
    }
    .field-wrap .mu-text-field.has-icon .mu-text-field-line{
        left: 32px;
        opacity: 0;
    }
    .field-wrap .mu-text-field.has-icon .mu-text-field-focus-line{
        left: 32px;
    }
    .field-wrap .mu-text-field-content .error{
       display: none;
    }
    .field-wrap .mu-text-field.error{
        background-color: transparent !important;
        box-shadow: -1px 1px 2px rgba(208, 23, 23, 0.46), 1px -1px 2px rgba(208, 23, 23, 0.46);
    }
    .form-group .mu-flexbox .mu-flexbox-item{
        background-color: rgba(0, 0, 0, 0.03);
        margin-bottom: 36px;
        min-width: 315px !important;
        
    }
    .form-group .mu-flexbox .mu-flexbox-item:first-child{
        margin-left:8px !important;
    }
    .form-group .mu-flexbox .mu-flexbox-item label{
        width: 30%;
        display: inline-block;
        line-height: 26px;
    }
    .form-group .mu-flexbox .mu-flexbox-item .field-wrap{
        width: 70%;
        line-height: 36px;
        display: inline-block;    
        background-color: rgba(0, 0, 0, 0.03);
    }
    
    .form-group .mu-flexbox .mu-flexbox-item .field-wrap .wrapper{
        width: 100%;
        
    }
    .form-group .mu-flexbox .mu-flexbox-item .field-wrap input,.mu-flexbox .mu-flexbox-item .field-wrap select{
        padding: 0px 8px;
        width: 100%;
        color: #595c57;

    }
    .form-group .mu-flexbox .mu-flexbox-item .field-wrap [type=checkbox], [type=radio]{
        font-size: 0.01em;
        line-height: 1em;
        height: 1.4em;    
    }
    
</style>