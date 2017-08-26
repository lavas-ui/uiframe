/**
 * Created by Paul Wang on 2017/8/19.
 */
import * as sysTypes from '../system-mutation-types';
import axios from 'axios';
const state = {

       
};

const actions = {

};

let mutations = {

}

export default {
    namespaced: true,
    actions,
    mutations,
    state,
    modules: {
        branch: {
            namespaced: true,
            state: {
                types: [],
                branch: {},
                treeData:[]
            },
            actions: {
                
                async getBranchTypes({commit}){
                    let res = await axios({
                        method:'get',
                        url: '/api/system/branch/types.json',
                        responseType: 'json'
                    });
                    if(res.status===200){
                        commit(sysTypes.GET_BRANCH_TYPES,{types:res.data.items});
                        console.log(1);
                        console.log(res.data);
                    }
                },
                
                async getBranchList({commit},{type}){
                    let res = await axios({
                        method:'get',
                        url: '/api/system/branch/list.json?type='+type,
                        responseType: 'json'
                    });
//                    console.log('branch type----',type);
                    if(res.status===200){
                        commit(sysTypes.GET_BRANCH_LIST,{branch:res.data});
                    }
                },
                
                async getBranchTrees({commit}){
                    let res = await axios({
                        method:'post',
                        url: '/special/queryCatTreeByCode.servicejson?code=matter',
                        responseType: 'json'
                    });
                    if(res.status===200){
                        commit(sysTypes.GET_BRANCH_TREES,{treeData:res.data});
                        console.log(2);
                        console.log(res.data);
                    }
                }

            },
            mutations: {
                
               [sysTypes.GET_BRANCH_TYPES](state,{types}){
                   state.types=types;
               },  
               [sysTypes.GET_BRANCH_LIST](state,{branch}){
                   state.branch=branch;
               },  
               [sysTypes.GET_BRANCH_TREES](state,{treeData}){
                   state.treeData=treeData;
               }
            }
        },
        app: {

        }
    }
}
