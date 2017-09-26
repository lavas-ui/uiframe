<template lang="pug">
   v-container(fluid,'grid-list-md')
     v-form(v-model='valid')
       v-layout(row,wrap)
         v-flex(d-flex,xs12,sm6,md4,v-for="col in schema.columns",v-if="isRender(col)")
           v-text-field(:label='col.label',v-model='model[col.name]',:required='col.allowNull!=1')
  
</template>

<script>
   export default {
       
       name:'bean-create',
       data(){
           return {
               schema:{
                   name:'tsys_application',
                   schema:'isdun',
                   columns :[
                       {"typeName":"INT","columnSize":"10","columnName":"APP_ID","name":"appId","label":"APP_ID","primaryKey":true},
                       {"typeName":"VARCHAR","allowNull":"1","columnSize":"64","columnName":"APP_CODE","name":"appCode","label":"应用系统编码"},
                       {"typeName":"VARCHAR","allowNull":"1","columnSize":"128","columnName":"APP_NAME","name":"appName","label":"应用系统名称"},
                       {"typeName":"VARCHAR","allowNull":"1","columnSize":"10","decimalDigits":null,"columnName":"SECRET_LEVEL","name":"secretLevel","label":"密级"},
                       {"typeName":"INT","allowNull":"1","columnSize":"10","decimalDigits":"0","columnName":"APP_SORT","name":"appSort","label":"排序"},
                       {"typeName":"VARCHAR","allowNull":"1","columnSize":"1024","decimalDigits":null,"columnName":"APP_ICON","name":"appIcon","label":"应用系统图标"},
                       {"typeName":"VARCHAR","allowNull":"1","columnSize":"128","decimalDigits":null,"columnName":"CREATE_BY","name":"createBy","label":"分配人"},
                       {"typeName":"DATE","allowNull":"1","columnSize":null,"columnName":"CREATE_DATE","name":"createDate","label":"创建时间"},
                       {"typeName":"DATE","allowNull":"1","columnSize":null,"columnName":"MODIFY_DATE","name":"modifyDate","label":"最后修改时间"},
                   ]
               },
               valid:false
           }
       },
       computed: {
           model(){
              if(!this.schema.columns || this.schema.columns.length===0){
                  return {}
              }
              let md={};   
              for(let i in this.schema.columns){
                  let col = this.schema.columns[i];
                  if(col.typeName=='VARCHAR'){
                    md[col.name]=''
                  }
                  else if(col.typeName=='INT'){
                    md[col.name]=null
                  }
                  else{
                    md[col.name]=null
                  }
                  
              }
              return md   
           }
       },
       props: {
           dataSource: {type:String,default:'default'},
           beanName: {type:String,default:'default'},
           mode: {type:String,default:'create'}
       },
       methods:{
           isRender(col){
              if(col.primaryKey){
                  return this.mode=='edit';
              }
              return true;      
           }
       },
       activated(){
           console.log('--===---')
           this.$request.get(`/web/db/schema/${this.dataSource}/${this.beanName}`)
           .then((res)=>{
               if(res.data.code=='200'){
                   console.log('+++==+++',this.schema)
                   this.schema=res.data.data
               }
           });
           
       }
       
   }
</script>

<style lang="stylus">
  .input-group__input
      border-bottom:solid 0.5px #ccc


  .input-group
      margin:0 30px;
      

</style>