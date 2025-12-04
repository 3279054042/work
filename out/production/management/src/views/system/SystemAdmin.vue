<template>
  <div class="page-container">
    <h2 style="margin-bottom: 15px">系统用户管理</h2>

    <!--    搜索区域-->
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="关键词">
        <el-input
            v-model="searchForm.keyword"
            placeholder="输入姓名/手机号"
            clearable
        ></el-input>
      </el-form-item>

      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </el-form>

    <!--    顶部按钮-->
    <div style="margin: 10px 0;">
      <el-button type="primary" @click="openAddDialog">新增用户</el-button>
    </div>

    <!--    用户列表-->
    <el-table :data="filteredUsers" border style="width:100%;">
      <el-table-column prop="account" label="账号" width="140"></el-table-column>
      <el-table-column prop="name" label="姓名" width="140"></el-table-column>
      <el-table-column prop="gender" label="性别" width="140"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="140"></el-table-column>
      <el-table-column prop="department" label="部门" width="140"></el-table-column>
      <el-table-column prop="tenant" label="租户" width="140"></el-table-column>
      <el-table-column prop="role" label="身份" width="140"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" text @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" text @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    新增/编辑对话框-->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="账号" prop="account">
          <span style="color:red">*</span>
          <el-input
              v-model="form.account"
              :disabled="isEdit"
              placeholder="请输入用户账号">
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <span style="color:red">*</span>
          <el-input
              v-model="form.name"
              placeholder="请输入用户姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <span style="color:red">*</span>
          <el-input
              v-model="form.phone"
              :disabled="isEdit"
              placeholder="请输入用户手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="form.department" placeholder="请选择部门">
            <el-option v-for="d in departmentList" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="租户">
          <el-select v-model="form.tenant" filterable clearable placeholder="请选择租户">
            <el-option v-for="t in tenantList" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份">
          <el-radio-group v-model="form.role">
            <el-radio label="管理员"/>
            <el-radio label="普通用户"/>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script setup>
import {ref,computed} from "vue";
import {ElMessage} from "element-plus";
import {rules} from "vue-grid-layout/.eslintrc.js";

const dialogVisible=ref(false)
const dialogTitle=ref("新增用户")
const isEdit=ref(false)

const searchForm=ref({
  keyword:""
})

const userList=ref([
  {
    account: "001",
    name: "张三",
    gender: "男",
    phone: "12345678910",
    department: "工程部",
    tenant: "总公司",
    role: "管理员"
  },
  {
    account: "002",
    name: "李四",
    gender: "女",
    phone: "12345678911",
    department: "开发部",
    tenant: "租户1",
    role: "普通用户"
  },
])

const departmentList=["工程部","开发部","业务部"]
const tenantList=["总公司","租户1","租户2"]

const filteredUsers=computed(()=>{
  if(!searchForm.value.keyword) return userList.value

  return userList.value.filter((u)=>
      Object.values(u).some((value)=>
          String(value).includes(searchForm.value.keyword))
  )
})
function handleSearch(){

}

function resetSearch(){
  searchForm.value.keyword=""
}


const form=ref({
  account:"",
  name:"",
  gender:"",
  phone:"",
  department:"",
  tenant:"",
  role:""
})

const formRef=ref(null)
formRef.value = undefined;

//新增
function openAddDialog(){
  dialogTitle.value="新增用户"
  isEdit.value=false

  Object.assign(form.value,{
    account:"",
    name:"",
    gender:"",
    phone:"",
    department:"",
    tenant:"",
    role:""
  })
  dialogVisible.value=true
}

//编辑
function openEditDialog(row){
  dialogTitle.value="编辑用户"
  isEdit.value=true
  Object.assign(form.value,row)
  dialogVisible.value=true
}

//保存
function handleSubmit(){
  formRef.value.validate((valid)=>{
    if(!valid) return;
    if(isEdit.value){
      //编辑模式
      const idx=userList.value.findIndex((u)=>u.account===form.value.account)
      userList.value[idx]={...form.value}
      ElMessage.success("修改成功")
    }else{
      //新增模式
      userList.value.push({...form.value})
      ElMessage.success("新增成功")
    }
    dialogVisible.value=false
  })
}

//删除
function deleteUser(row){
  const i=userList.value.findIndex((u)=>u.account===row.account)
  userList.value.splice(i,1)
  ElMessage.success("删除成功")
}

</script>

<style scoped>
.page-container {
  background: #f5f7fa;
  padding: 25px 30px;
  border-radius: 10px;
  min-height: calc(100vh - 80px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* 搜索区域 */
.search-bar {
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #e5e5e5;
}

.search-bar .el-form-item {
  margin-right: 20px;
}

/* 新增按钮区域 */
.top-action {
  background: white;
  padding: 12px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* 表格区块 */
.el-table {
  border-radius: 10px;
  overflow: hidden;
  font-size: 14px;
  background: white;
}

.el-table th {
  background: #f0f2f5 !important;
  font-weight: bold;
  color: #333;
}

.el-table td {
  padding: 12px 0;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #f5fbff !important;
}

/* 对话框美化 */
:deep(.el-dialog) {
  border-radius: 12px;
  padding-bottom: 10px;
}

:deep(.el-dialog__header) {
  background: #f7f9fb;
  padding: 15px 20px;
  font-size: 18px;
  border-bottom: 1px solid #eee;
}

:deep(.el-dialog__body) {
  padding: 20px 30px;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

/* 让星号更美观 */
.required-star {
  color: red;
  font-weight: bold;
  margin-right: 3px;
}

/* 按钮风格 */
.el-button--primary {
  border-radius: 6px;
}

.el-input, .el-select {
  width: 240px;
}

/* 对话框底部按钮 */
:deep(.el-dialog__footer) {
  padding: 15px 25px;
  border-top: 1px solid #eee;
}

/* 标题 */
.page-title {
  font-size: 22px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}
</style>