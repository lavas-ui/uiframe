'use strict';

import axios from 'axios';




let objFlat=function(prefix,json,cbItem,isArr){
    for(let key in json){
       let val = json[key];
       let kk=prefix;
       if(!isArr){
          kk=prefix+"."+key;
       }
       if(Array.isArray(val)){
           objFlat(kk,val,cbItem,true);  
       }       
       else if(typeof(val)=='object'){
          objFlat(kk,val,cbItem);        
       }
       else{
           kk = kk.substring(1);
           cbItem(`${kk}=${val}`);
       }
    }
}


let rq = axios.create({
          baseURL: '',
          timeout: 60*1000,
          transformRequest:[(data,headers)=>{
              if(!data || data.length===0){
                  return '';
              }
              if(typeof(data)==='string'){
                  return data;
              }
              
              let result='';
              objFlat("",data,(item)=>{
                  result+='&'+item;
              });
              
              return result.substring(1);
          }],    
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8','X-Auth-Header': '--+++--+++'}
    });

export default{
	install(Vue){
        console.log('auios installing')
        Vue.prototype.$request = rq;
        console.log('auios installed')
    }
};

export const request= rq;
