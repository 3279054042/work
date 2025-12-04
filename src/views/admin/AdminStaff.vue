<template>
  <div class="admin-staff">
    <div class="header-row">
      <h2>人员管理</h2>
      <div class="actions">
        <el-input
            v-model="searchKeyword"
            placeholder="搜索姓名/工号"
            clearable
            @clear="onSearchClear"
            class="search-input"
        >
          <template #prefix>
            <i class="el-icon-search"></i>
          </template>
        </el-input>
        <el-button type="primary" @click="openAddDialog">新增员工</el-button>
        <el-button type="info" plain @click="refreshList">刷新</el-button>
        <el-button type="warning" plain @click="exportSelected" :disabled="!multipleSelection.lenth">导出选中</el-button>
        <el-button type="danger" plain @click="deleteSelected" :disabled="!multipleSelection.lenth">删除选中</el-button>
        <el-upload
          :show-file-list="false"
          :before-upload="handleImport">
          <el-button type="success" plain>导入</el-button>
        </el-upload>
      </div>
    </div>

    <!-- 员工列表表格 -->
    <el-card shadow="hover" class="table-card">
    <el-table
        :data="filteredStaff"
        stripe
        border
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="工号" width="100" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="department" label="部门" width="150" />
      <el-table-column prop="position" label="岗位" width="140" />
      <el-table-column prop="hireDate" label="入职日期" width="120" />
      <el-table-column prop="phone" label="联系方式" width="140" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteStaff(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredStaff.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
      >
      </el-pagination>
    </div>
    </el-card>

    <!-- 新增/编辑员工弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="formData" :rules="formRules" ref="staffForm" label-width="100px">
        <el-form-item label="工号" prop="id">
          <el-input v-model="formData.id" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="formData.department" placeholder="选择部门">
            <el-option v-for="d in departments" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="position">
          <el-input v-model="formData.position"></el-input>
        </el-form-item>
        <el-form-item label="入职日期" prop="hireDate">
          <el-date-picker v-model="formData.hireDate" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveStaff">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AdminStaff",
  data() {
    return {
      searchKeyword: "",
      departmentFilter: "",
      staffList: [
        { id: "1001", name: "张三", department: "工程咨询部", position: "咨询工程师", hireDate: "2022-03-15", phone: "13800138001" },
        { id: "1002", name: "李四", department: "造价部", position: "造价工程师", hireDate: "2021-06-10", phone: "13800138002" },
        { id: "1003", name: "王五", department: "项目管理部", position: "项目经理", hireDate: "2020-09-01", phone: "13800138003" }
      ],
      dialogVisible: false,
      dialogTitle: "新增员工",
      formData: {},
      isEdit: false,
      departments: ["工程咨询部","造价部","项目管理部","行政财务部"],
      formRules: {
        id: [{ required: true, message: "请输入工号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        department: [{ required: true, message: "请选择部门", trigger: "change" }],
        position: [{ required: true, message: "请输入岗位", trigger: "blur" }],
        hireDate: [{ required: true, message: "请选择入职日期", trigger: "change" }],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }]
      },
      multipleSelection: [],
      pageSize: 5, currentPage: 1
    };
  },
  computed: {
    filteredStaff() {
      let list = this.staffList;
      if (!this.searchKeyword){
        const keyword = this.searchKeyword.toLowerCase();
        list=list.filter(s=>s.name.toLowerCase().includes(keyword)||s.id.includes(keyword))
      }
      if(this.departmentFilter){
        list=list.filter(s=>s.department===this.departmentFilter)
      }
      return list;

      // const keyword = this.searchKeyword.toLowerCase();
      // return this.staffList.filter(
      //     s => s.name.toLowerCase().includes(keyword) || s.id.includes(keyword)
      // );
    },
    pagedStaff(){
      const start=(this.currentPage-1)* this.pageSize
      return this.filteredStaff.slice(start,start+this.pageSize)
    }
  },
  methods: {
    onSearchClear() { this.searchKeyword = ""; },
    refreshList() { this.$message.info("已刷新列表（示例）"); },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    openAddDialog() {
      this.dialogTitle = "新增员工";
      this.formData = {};
      this.isEdit = false;
      this.dialogVisible = true;
    },
    openEditDialog(staff) {
      this.dialogTitle = "编辑员工";
      this.formData = { ...staff };
      this.isEdit = true;
      this.dialogVisible = true;
    },
    saveStaff() {
      this.$refs.staffForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            const index = this.staffList.findIndex(s => s.id === this.formData.id);
            if (index !== -1) this.staffList.splice(index, 1, this.formData);
            this.$message.success("新增员工成功");
          }else{
            this.staffList.push({ ...this.formData });
            this.$message.success("新增员工成功");
          }
          this.dialogVisible = false;
        }
      });
    },
    deleteStaff(staff) {
      this.$confirm(`确认删除员工 ${staff.name}？`, "删除提示", { type: "warning" })
          .then(() => {
            this.staffList = this.staffList.filter(s => s.id !== staff.id);
            this.$message.success("员工已删除");
          })
          .catch(() => {});
    },
    deleteSelected() {
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个员工？`, "批量删除", { type: "warning" })
          .then(() => {
            const ids = this.multipleSelection.map(s => s.id);
            this.staffList = this.staffList.filter(s => !ids.includes(s.id));
            this.multipleSelection = [];
            this.$message.success("已删除选中员工");
          })
          .catch(() => {});
    },
    exportSelected(){
      const names=this.multipleSelection.map(s=>s.name).join(",")
      this.$message.info(`已导出选中员工:${names}`);
    },
    handleImport(){
      this.$message.info("导入文件：￥{file.name");
      return false
    }
  }
};
</script>

<style scoped>
.admin-staff {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 80px);
}

.header-row {
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.header-row h2 {
  margin: 0;
  font-weight: 600;
  font-size: 20px;
}

.actions {
  display:flex;
  gap:10px;
  flex-wrap: wrap;
}

.search-input {
  width: 260px;
}

.table-card {
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* 弹窗美化 */
.staff-dialog .el-dialog__body {
  padding: 20px 24px;
}

.staff-form .el-form-item {
  margin-bottom: 16px;
}

.staff-form .el-input,
.staff-form .el-select,
.staff-form .el-date-picker {
  border-radius: 6px;
}

/* 按钮间距 */
.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  min-width: 80px;
}
</style>