/**
 * @file search router
 * @author paulwang007(12900985@qq.com)
 */

import System from '@/pages/system/System.vue';
import BranchTypes from '@/pages/system/branch/types.vue';
import BranchList from '@/pages/system/branch/list.vue';
import CreateApp from '@/pages/system/application/CreateApp.vue'
export default {
    routes: [
        {
            path: '/system',
            name: 'system',
            component: System
        },
        {
            path: '/system/branch/types',
            name: 'branch-types',
            component: BranchTypes
        },
        {
            path: '/system/branch/list',
            name: 'branch-list',
            component: BranchList
        },
        {
            path: '/system/application/create',
            name: 'application-create',
            component: CreateApp
        }
    ]
};
