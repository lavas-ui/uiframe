<template lang="pug">
   div.mu-box
     mu-slider(v-model="value",:max="schema.max",:min="schema.min",:step="schema.step")
</template>

<script>
import {isObject} from "lodash";
import abstractField from "../abstractField";
export default {
    mixins: [ abstractField ]
}
</script>

<style lang="css">
    .field-wrap .mu-slider{
        top:6px;
        margin-bottom: 12px;
    }
</style>