<template lang="pug">
   bean-create(dataSource='biz',beanName='TsysUser')
</template>

<script>
  import {mapActions} from 'vuex'       
  import BeanCreate from '@/components/BeanCreate.vue'
         
  export default {
    components:{BeanCreate},
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
    },
    activated(){
       this.setAppHeader({show: true});
    }  
  }
</script>