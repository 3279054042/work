<template>
    <div class="flex flex-wrap gap-1">
        <!--搜索框-->
        <el-input
        v-model="search"
        placeholder="搜索租户名称"
        clearable
        style="width: 300px; margin-bottom: 20px;"
        />
      <el-button
          class="!ml-0"
          type="primary"
          plain @click="dialogFormVisible=true"
          style="width: 100px; margin-bottom: 20px;"
      >增加租户
      </el-button>

      <el-dialog v-model="dialogFormVisible" title="增加租户" width="500"  >
        <el-form :model="form " ref="formRef" label-width="80px">
          <el-form-item label="租户名称" >
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="租户编码">
            <el-input v-model="form.code" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="form.contact" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.phone" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="联系邮箱">
            <el-input v-model="form.email" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input v-model="form.address" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option label="激活" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click="addTenant">确认</el-button>
        </template>
      </el-dialog>
        <el-table :data="pageList" stripe style="width: 100%">
            <el-table-column prop="name" label="租户名称" width="180"/>
            <el-table-column prop="code" label="租户编码" width="180"/>
            <el-table-column prop="contact" label="联系人" width="180"/>
            <el-table-column prop="phone" label="联系电话" width="180"/>
            <el-table-column prop="email" label="联系邮箱" width="220"/>
            <el-table-column prop="address" label="联系地址"/>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                    <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
                        {{ scope.row.status === 'active' ? '激活' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="viewItem(scope.row)">查看</el-button>
                    <el-button type="warning" size="small" @click="eidtItem(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteItem(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
        background
        layout="prev, pager, next"
        :total="filterredList.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        class="mt-4"
        style="text-align: right;margin-top: auto;"
        />


    </div>
</template>

<script setup>
import {ref, computed, reactive} from 'vue'

const search = ref('')
const currentPage = ref(1)
const pageSize = 5
// const dialogVisible = ref(false)
const dialogFormVisible = ref(false)

const tenantList = ref([
    { name: '租户A', code: 'TEN001', contact: '张三', phone: '12345678901', email: ''},
    { name: '租户B', code: 'TEN002', contact: '李四', phone: '19876543210', email: ''},
    { name: '租户C', code: 'TEN003', contact: '王五', phone: '13579246810', email: ''},
    { name: '租户D', code: 'TEN004', contact: '赵六', phone: '14725836901', email: ''},
    { name: '租户E', code: 'TEN005', contact: '孙七', phone: '15975348620', email: ''},
    { name: '租户F', code: 'TEN006', contact: '周八', phone: '12312312345', email: ''},
    ])
const filterredList = computed(() => {
    return tenantList.value.filter(tenant =>
        tenant.name.includes(search.value) ||
        tenant.code.includes(search.value) ||
        tenant.contact.includes(search.value) ||
        tenant.phone.includes(search.value)
    )
    })
const pageList = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filterredList.value.slice(start, start + pageSize)
    })

    function viewItem(row) {
        alert(`查看租户: ${row.name}`)
    }
    function eidtItem(row) {
        alert(`编辑租户: ${row.name}`)
    }
    function deleteItem(row) {
        alert(`删除租户: ${row.name}`)
    }

const form = reactive({
  name:'',
  code:'',
  contact:'',
  phone:'',
  email:'',
  address:'',
  status:'active'
})

const addTenant =  () =>{
  if(!form.name||!form.code){
    alert('租户名称和编码不能为空');
    return;
  }
  tenantList.value.push({
    name: form.name,
    code: form.code,
    contact: form.contact,
    phone: form.phone,
    email: form.email
  });
  form.name="";
  form.code="";
  form.contact="";
  form.phone="";
  form.email="";
  form.address="";
  dialogFormVisible.value = false;
};
</script>
