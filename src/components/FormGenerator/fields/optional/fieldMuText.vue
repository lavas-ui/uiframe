<template lang="pug">
   div.mu-box
     v-text-field(v-model="value",:hintText="schema.hintText",:type="schema.inputType",:multiLine="schema.multiLine",:fullWidth="schema.fullWidth",:errorText="schema.errorText",:icon="schema.icon",:disabled="schema.disabled",:rows="schema.rows",:rowsMax="schema.rowsMax",:maxLength="schema.maxLength",:helpText="schema.helpText",:underlineShow="schema.underlineShow",:required="schema.required",@change='handleChanged')
</template>

<script>
import {isObject} from "lodash";
import abstractField from "../abstractField";
export default {
    mixins: [ abstractField ],
    mounted(){
        this.$on('validated',(isValid,errors)=>{
            this.schema.errorText=isValid?'':errors[0];
        });
    },
    methods:{
        handleChanged(){
            console.log('changed....validate')
            this.validate();
        }
    }
}
</script>

<style lang="css">
    .field-wrap .mu-text-field-content .mu-text-field-input{
       height: 35px;
    }
</style>