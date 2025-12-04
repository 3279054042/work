import { createRouter, createWebHistory } from "vue-router"
import AppLayout from "@/layout/AppLayout.vue"
import TenantList from "@/views/tenant/TenantList.vue"
import ManagerLogin from "@/views/login/ManagerLogin.vue";
import SystemManagement from "@/views/system/SystemManagement.vue";
import SystemConfig from "@/views/system/SystemConfig.vue";
import AdminHome from "@/views/admin/AdminHome.vue";
import AppHome from "@/views/appManage/AppHome.vue";
import ProjectHome from "@/views/project/ProjectHome.vue";
import TenantUser from "@/views/tenant/TenantUser.vue";
import TenantAuthority from "@/views/tenant/TenantAuthority.vue";
import TenantJournal from "@/views/tenant/TenantJournal.vue";
import SystemList from "@/views/system/SystemList.vue";
import AddSystem from "@/views/system/AddSystem.vue";
import SystemAdmin from "@/views/system/SystemAdmin.vue";
import AdminStaff from "@/views/admin/AdminStaff.vue";
import FinanceManagement from "@/views/admin/FinanceManagement.vue";
import ContractManagement from "@/views/admin/ContractManagement.vue";
import ArchiveManagement from "@/views/admin/ArchiveManagement.vue";
import WorkOrder from "@/views/admin/WorkOrder.vue";
import DepartmentManagement from "@/views/admin/DepartmentManagement.vue";

const routes = [
    {
        path:'/login',
        component:ManagerLogin
    },
    {
        path:'/',
        redirect: '/login'
    },

  {
    path: '/app',
    component: AppLayout,
    children: [
        // 租户管理页面
        {
            path: '/app/tenants/list',
            component: TenantList
        },
        {
            path: '/app/tenants/user',
            component: TenantUser
        },
        {
            path: '/app/tenants/authority',
            component: TenantAuthority
        },
        {
            path: '/app/tenants/journal',
            component: TenantJournal
        },
        // 租户管理页面

        // 系统管理页面
        {
            path:'/app/systems/system',
            component: SystemManagement
        },
        {
            path:'/app/departments/department',
            component: DepartmentManagement
        },
        {
            path:'/app/systems/config',
            component: SystemConfig
        },
        {
            path:'/app/systems/list',
            component: SystemList
        },
        {
            path:'/app/systems/add',
            component: AddSystem
        },
        {
            path:'/app/systems/admin',
            component: SystemAdmin
        },
        // 系统管理页面

        // 行政中心页面
        {
            path:'/app/admins/department',
            component: DepartmentManagement
        },
        {
            path:'/app/admins/adminHome',
            component: AdminHome
        },
        {
            path:'/app/admins/adminStaff',
            component: AdminStaff
        },
        {
            path:'/app/admins/financeManagement',
            component: FinanceManagement
        },
        {
            path:'/app/admins/contractManagement',
            component: ContractManagement
        },
        {
            path:'/app/admins/archiveManagement',
            component: ArchiveManagement
        },
        {
            path:'/app/admins/workOrder',
            component: WorkOrder
        },
        // 行政中心页面



        {
            path:'/app/appManages/appHome',
            component: AppHome
        },
        {
            path:'/app/projects/projectHome',
            component: ProjectHome
        },
    ]
  },



  // 404 fallback
  { path: '/:pathMatch(.*)*', redirect: '/list' }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router