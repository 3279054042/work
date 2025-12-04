<template>
    <el-container style="height: 100vh;">
        <el-header height="60px" class="header">
            <div class="header-left">  
                <img src="https://via.placeholder.com/150" alt="Logo" class="logo" />
                <span class="title">工程信息咨询服务系统</span>
            </div>
            <div class="header-right">
                <el-menu
                    :default-active="activeTopMenu"
                    mode="horizontal"
                    class="el-menu-demo"
                    router
                    unique-opened
                    background-color="transparent"
                    text-color="#ffffff"
                    active-text-color="#ffd04b"
                >
                    <el-menu-item index="/app/tenants/list">租户管理</el-menu-item>
                    <el-menu-item index="/app/appManages/appHome">应用管理</el-menu-item>
                    <el-menu-item index="/app/projects/projectHome">项目管理</el-menu-item>
                    <el-menu-item index="/app/admins/adminHome">行政中心</el-menu-item>
                    <el-menu-item index="/app/systems/system">系统管理</el-menu-item>
                </el-menu>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        用户中心<el-icon class="el-icon--right">
                      <arrow-down />
                    </el-icon>
                    </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人信息</el-dropdown-item>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item  @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
            </div>
        </el-header>
        <el-container>
          <el-aside v-if="sideMenus.length" width="200px" style="background-color: #f5f7fa">
            <el-menu
            :default-active="activeMenu"
              class="el-menu-vertical-demo"
              background-color="#f5f7fa"
            text-color="#333"
            active-text-color="#409eff"
            @select="handleMenuSelect"
            router
            unique-opened
            >
              <template v-for="item in sideMenus" :key="item.name">
                <el-sub-menu v-if="item.children" :index="item.name">
                  <template #title>{{ item.name }}</template>
                  <el-menu-item
                      v-for="child in item.children"
                      :key="child.path"
                      :index="child.path"
                  >
                    {{ child.name }}
                  </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.path">
                  {{ item.name }}
                </el-menu-item>
              </template>

            </el-menu>
          </el-aside>
            <el-main style="padding: 20px; background-color: #E9EEF3;">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>
<script setup>
import {ref, watch} from 'vue'
import { useRouter,useRoute } from 'vue-router'
import {ArrowDown} from "@element-plus/icons-vue";

const router = useRouter()
const route = useRoute()
const activeTopMenu = ref('/app')
const activeMenu = ref(route.path)

const menuMap={
  '/app/systems/system': [
    { name: '系统菜单', path: '/app/systems/config' },
    { name: '用户管理', path: '/app/systems/admin' },
    {
      name: '租户系统管理',
      children: [
        { name: '租户系统列表', path: '/app/systems/list' },
        { name: '新建租户系统', path: '/app/systems/add' }
      ]
    },
    { name: '日志管理', path: '/app/system/log' }
  ],
  '/app/tenants/list': [
    { name: '租户列表', path: '/app/tenants/list' },
    { name: '施工单位', path: '/app/tenants/list' },
    { name: '建设单位', path: '/app/tenants/authority' },
    { name: '监理单位', path: '/app/tenants/journal' },
    { name: '咨询单位', path: '/app/tenants/journal' },
    { name: '材料单位', path: '/app/tenants/journal' },
    { name: '检测单位', path: '/app/tenants/journal' },
    { name: '机械单位', path: '/app/tenants/journal' },
    { name: '劳务单位', path: '/app/tenants/journal' },
    { name: '其他单位', path: '/app/tenants/journal' },
    { name: '新建租户类型', path: '/app/tenants/journal' }
  ],
  '/app/appManages/appHome': [
    { name: '租户用户', path: '/app/appManages/appHome' },
  ],
  '/app/admins/adminHome':[
      { name: '部门管理', path: '/app/admins/department' },
      { name: '人员管理', path: '/app/admins/adminStaff' },
      { name: '财务管理', path: '/app/admins/financeManagement' },
      { name: '合同管理', path: '/app/admins/contractManagement' },
      { name: '档案管理', path: '/app/admins/archiveManagement' },
    { name: '工单流程管理', path: '/app/admins/workOrder' }
  ]
}
const sideMenus=ref(menuMap[route.path]||[])

function handleMenuSelect(path){
  if(!path) return
  activeMenu.value = path
  router.push(path)
}

watch(() => route.path, (newPath) => {
  // 根据路径前缀选择菜单
  if (newPath.startsWith('/app/systems')) {
    sideMenus.value = menuMap['/app/systems/system']
  } else if (newPath.startsWith('/app/tenants')) {
    sideMenus.value = menuMap['/app/tenants/list']
  } else if (newPath.startsWith('/app/admins')) {
    sideMenus.value = menuMap['/app/admins/adminHome']
  }
  else {
    sideMenus.value = [] // 其他页面不显示侧边栏
  }
  activeMenu.value = newPath
})

function logout() {
    // 退出登录逻辑
    alert('用户已退出登录');
    console.log('测试')
    router.push({ path:"/login"})
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 30px;
    background-color: #409EFF;
    color: rgb(121, 41, 41);
    height: 60px;
    box-sizing: border-box;
  overflow: visible;
}
.header-left {
    display: flex;
    align-items: center;
    gap:10px;
}
.logo {
    width:36px;
    height: 36px;
    margin-right: 10px;
}
/* .system-name {
    font-size: 18px;
    font-weight: bold;
} */
 .title {
    font-size: 18px;
    font-weight: bold;
    white-space: nowrap;
}
.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 300px;
    flex:1;
}
.sidebar {
    height: calc(100vh - 60px);
    background-color: #6092df;
    color: #09111a;
}
.el-menu-demo{
    display:flex;
    flex:1;
    justify-content: flex-start;
}
.el-menu-demo .el-menu-item {
    min-width: 90px;
    text-align: center;
}
.el-dropdown{
    position: relative;
    z-index: 1000;
}
.el-dropdown-link {
    display:flex;
    align-content: center;
    gap:5px;
    cursor: pointer;
}
.el-dropdown-menu{
    background-color: #6092df;
    color: #303133;
    border-radius: 4px;
    min-width:150px;
    box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
}
.el-dropdown-item{
    padding:10px 20px;
}
.el-dropdown-item:hover{
    background-color: #f5f7fa
}
.el-aside{
    background-color: #D3DCE6;
}
.el-menu-vertical-demo {
    border-right: none;
    background-color: #D3DCE6;
}
.el-main{
    padding: 20px;
    background-color: #E9EEF3;
    overflow-y: auto;
}
@media (max-width:1200px){
    .header-right{
        flex-wrap:wrap;
        gap:15px;
    }
    .el-menu-demo{
        flex-wrap:wrap;
    }
}
@media (max-width:768px){
    .el-menu-demo{
        display:none;
    }
}
/* .el-menu-vertical-demo .el-menu-item,
.el-menu-vertical-demo .el-sub-menu__title {
    border-right: none;
    color :#215a94;
} */
/* .main-content {
    padding: 20px;
    background-color: #153463;
    height: calc(100vh - 60px);
    overflow-y: auto;
} */
</style>