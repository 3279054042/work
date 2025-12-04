<template>
  <div class="workorder-management">
    <!-- 操作区 -->
    <div class="header-row">
      <h2>工单流程管理</h2>
      <el-input
          v-model="searchKeyword"
          placeholder="搜索工单标题/编号"
          size="medium"
          clearable
          @clear="onSearchClear"
          class="search-input"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>

      <el-select v-model="statusFilter" placeholder="按状态筛选" clearable style="width: 160px;">
        <el-option label="新建" value="新建"></el-option>
        <el-option label="处理中" value="处理中"></el-option>
        <el-option label="已完成" value="已完成"></el-option>
        <el-option label="关闭" value="关闭"></el-option>
      </el-select>

      <el-select v-model="typeFilter" placeholder="按类型筛选" clearable style="width: 160px;">
        <el-option label="系统故障" value="系统故障"></el-option>
        <el-option label="业务咨询" value="业务咨询"></el-option>
        <el-option label="其他" value="其他"></el-option>
      </el-select>

      <el-button type="primary" @click="openAddDialog">新增工单</el-button>
      <el-button type="warning" plain @click="exportSelected" :disabled="!multipleSelection.length">导出选中</el-button>
      <el-button type="danger" plain @click="deleteSelected" :disabled="!multipleSelection.length">删除选中</el-button>
    </div>

    <!-- 工单表格 -->
    <el-card shadow="hover" class="table-card">
      <el-table
          :data="pagedWorkOrders"
          stripe
          border
          size="medium"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="工单编号" width="120" />
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="creator" label="发起人" width="120" />
        <el-table-column prop="assignee" label="处理人" width="120" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="140" />
        <el-table-column prop="dueTime" label="截止时间" width="140" />
        <el-table-column label="操作" width="400">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button type="success" size="small" @click="advanceStatus(scope.row)" :disabled="scope.row.status==='关闭'">推进状态</el-button>
            <el-button type="danger" size="small" @click="deleteWorkOrder(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredWorkOrders.length"
            :page-size="pageSize"
            v-model:current-page="currentPage"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑工单弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" custom-class="workorder-dialog">
      <el-form :model="formData" :rules="formRules" ref="workOrderForm" label-width="120px" class="workorder-form">
        <el-form-item label="工单标题" prop="title">
          <el-input v-model="formData.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="工单类型" prop="type">
          <el-select v-model="formData.type" placeholder="选择类型">
            <el-option label="系统故障" value="系统故障"></el-option>
            <el-option label="业务咨询" value="业务咨询"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发起人" prop="creator">
          <el-input v-model="formData.creator" clearable></el-input>
        </el-form-item>
        <el-form-item label="处理人" prop="assignee">
          <el-input v-model="formData.assignee" clearable></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="dueTime">
          <el-date-picker v-model="formData.dueTime" type="date" placeholder="选择截止日期" style="width:100%;" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formData.remark" clearable></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveWorkOrder">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "WorkOrderManagement",
  data() {
    return {
      searchKeyword: "",
      statusFilter: "",
      typeFilter: "",
      workOrders: [
        { id: "WO1001", title: "系统异常", type: "系统故障", creator: "张三", assignee: "李四", status: "新建", createTime: "2025-11-01", dueTime: "2025-11-03", remark: "" },
        { id: "WO1002", title: "业务咨询", type: "业务咨询", creator: "王五", assignee: "赵六", status: "处理中", createTime: "2025-11-02", dueTime: "2025-11-05", remark: "" }
      ],
      dialogVisible: false,
      dialogTitle: "新增工单",
      formData: {},
      multipleSelection: [],
      pageSize: 5,
      currentPage: 1,
      formRules: {
        title: [{ required: true, message: "请输入工单标题", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        creator: [{ required: true, message: "请输入发起人", trigger: "blur" }],
        assignee: [{ required: true, message: "请输入处理人", trigger: "blur" }],
        dueTime: [{ required: true, message: "请选择截止时间", trigger: "change" }]
      }
    };
  },
  computed: {
    filteredWorkOrders() {
      let list = this.workOrders;
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        list = list.filter(w => w.title.toLowerCase().includes(kw) || w.id.includes(kw));
      }
      if (this.statusFilter) list = list.filter(w => w.status === this.statusFilter);
      if (this.typeFilter) list = list.filter(w => w.type === this.typeFilter);
      return list;
    },
    pagedWorkOrders() {
      const start = (this.currentPage-1)*this.pageSize;
      return this.filteredWorkOrders.slice(start, start+this.pageSize);
    }
  },
  methods: {
    onSearchClear(){ this.searchKeyword=""; },
    handleSelectionChange(val){ this.multipleSelection = val; },
    openAddDialog(){ this.dialogTitle="新增工单"; this.formData={status:"新建"}; this.dialogVisible=true; },
    openEditDialog(w){ this.dialogTitle="编辑工单"; this.formData={...w}; this.dialogVisible=true; },
    saveWorkOrder(){
      this.$refs.workOrderForm.validate(valid=>{
        if(valid){
          if(this.formData.id){
            const idx = this.workOrders.findIndex(w=>w.id===this.formData.id);
            if(idx!==-1) this.workOrders.splice(idx,1,this.formData);
            this.$message.success("工单已更新");
          }else{
            this.formData.id = "WO"+Date.now();
            this.workOrders.push({...this.formData});
            this.$message.success("新增工单成功");
          }
          this.dialogVisible=false;
        }
      });
    },
    advanceStatus(w){
      const statusFlow = ["新建","处理中","已完成","关闭"];
      const idx = statusFlow.indexOf(w.status);
      if(idx<statusFlow.length-1){
        w.status = statusFlow[idx+1];
        this.$message.success(`工单状态已推进到 ${w.status}`);
      }
    },
    deleteWorkOrder(w){
      this.$confirm(`确认删除工单 ${w.title}?`,"删除提示",{type:"warning"})
          .then(()=>{ this.workOrders=this.workOrders.filter(x=>x.id!==w.id); this.$message.success("已删除"); })
          .catch(()=>{});
    },
    deleteSelected(){
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个工单?`,"批量删除",{type:"warning"})
          .then(()=>{
            const ids=this.multipleSelection.map(w=>w.id);
            this.workOrders=this.workOrders.filter(w=>!ids.includes(w.id));
            this.multipleSelection=[];
            this.$message.success("已删除选中工单");
          }).catch(()=>{});
    },
    exportSelected(){
      const titles=this.multipleSelection.map(w=>w.title).join(", ");
      this.$message.info(`已导出工单: ${titles}`);
    }
  }
};
</script>

<style scoped>
.workorder-management{ padding:20px; background:#f5f7fa; min-height:calc(100vh-80px);}
.header-row{ display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:16px; }
.search-input{ width:260px; }
.table-card{ border-radius:12px; padding:16px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.pagination{ text-align:right; margin-top:12px; }
.workorder-dialog .el-dialog__body{ padding:20px 24px; }
.workorder-form .el-form-item{ margin-bottom:16px; }
.workorder-form .el-input, .workorder-form .el-select, .workorder-form .el-date-picker, .workorder-form .el-input[type="textarea"]{ border-radius:6px; }
.dialog-footer{ text-align:right; }
.dialog-footer .el-button{ min-width:80px; }
</style>