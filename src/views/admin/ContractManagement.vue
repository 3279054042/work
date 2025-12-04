<template>
  <h2>合同管理</h2>
  <div class="contract-management">
    <!-- 合同概览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card class="overview-card" shadow="hover">
          <div class="card-title">合同总数</div>
          <div class="card-value">{{ contracts.length }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card" shadow="hover">
          <div class="card-title">已签合同</div>
          <div class="card-value">{{ signedContracts }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card" shadow="hover">
          <div class="card-title">待签合同</div>
          <div class="card-value">{{ pendingContracts }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card" shadow="hover">
          <div class="card-title">已过期合同</div>
          <div class="card-value">{{ expiredContracts }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作区 -->
    <div class="header-row">
      <el-input
          v-model="searchKeyword"
          placeholder="搜索合同名称/编号"
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
        <el-option label="已签" value="已签"></el-option>
        <el-option label="待签" value="待签"></el-option>
        <el-option label="已过期" value="已过期"></el-option>
      </el-select>

      <el-button type="primary" @click="openAddDialog">新增合同</el-button>
      <el-button type="warning" plain @click="exportSelected" :disabled="!multipleSelection.length">导出选中</el-button>
      <el-button type="danger" plain @click="deleteSelected" :disabled="!multipleSelection.length">删除选中</el-button>
    </div>

    <!-- 合同表格 -->
    <el-card shadow="hover" class="table-card">
      <el-table
          :data="pagedContracts"
          stripe
          border
          size="medium"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="合同编号" width="120" />
        <el-table-column prop="name" label="合同名称" width="180" />
        <el-table-column prop="signDate" label="签署日期" width="120" />
        <el-table-column prop="expiryDate" label="到期日期" width="120" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteContract(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredContracts.length"
            :page-size="pageSize"
            v-model:current-page="currentPage"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑合同弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="480px" custom-class="contract-dialog">
      <el-form :model="formData" :rules="formRules" ref="contractForm" label-width="100px" class="contract-form">
        <el-form-item label="合同编号" prop="id">
          <el-input v-model="formData.id" :disabled="isEdit" clearable></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="name">
          <el-input v-model="formData.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="签署日期" prop="signDate">
          <el-date-picker v-model="formData.signDate" type="date" placeholder="选择日期" style="width:100%;" />
        </el-form-item>
        <el-form-item label="到期日期" prop="expiryDate">
          <el-date-picker v-model="formData.expiryDate" type="date" placeholder="选择日期" style="width:100%;" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="选择状态">
            <el-option label="已签" value="已签"></el-option>
            <el-option label="待签" value="待签"></el-option>
            <el-option label="已过期" value="已过期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" clearable></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveContract">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ContractManagement",
  data() {
    return {
      searchKeyword: "",
      statusFilter: "",
      contracts: [
        { id: "C1001", name: "工程咨询合同A", signDate: "2025-01-10", expiryDate: "2026-01-09", status: "已签", remark: "" },
        { id: "C1002", name: "造价合同B", signDate: "2025-02-15", expiryDate: "2026-02-14", status: "待签", remark: "" },
        { id: "C1003", name: "租赁合同C", signDate: "2024-10-01", expiryDate: "2025-10-01", status: "已过期", remark: "办公室租赁" }
      ],
      dialogVisible: false,
      dialogTitle: "新增合同",
      formData: {},
      isEdit: false,
      multipleSelection: [],
      pageSize: 5,
      currentPage: 1,
      formRules: {
        id: [{ required: true, message: "请输入合同编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入合同名称", trigger: "blur" }],
        signDate: [{ required: true, message: "请选择签署日期", trigger: "change" }],
        expiryDate: [{ required: true, message: "请选择到期日期", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  computed: {
    filteredContracts() {
      let list = this.contracts;
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(kw) || c.id.includes(kw));
      }
      if (this.statusFilter) list = list.filter(c => c.status === this.statusFilter);
      return list;
    },
    pagedContracts() {
      const start = (this.currentPage-1)*this.pageSize;
      return this.filteredContracts.slice(start, start+this.pageSize);
    },
    signedContracts() { return this.contracts.filter(c => c.status==="已签").length; },
    pendingContracts() { return this.contracts.filter(c => c.status==="待签").length; },
    expiredContracts() { return this.contracts.filter(c => c.status==="已过期").length; }
  },
  methods: {
    onSearchClear(){ this.searchKeyword=""; },
    handleSelectionChange(val){ this.multipleSelection = val; },
    openAddDialog(){ this.dialogTitle="新增合同"; this.formData={}; this.isEdit=false; this.dialogVisible=true; },
    openEditDialog(c){ this.dialogTitle="编辑合同"; this.formData={...c}; this.isEdit=true; this.dialogVisible=true; },
    saveContract(){
      this.$refs.contractForm.validate(valid=>{
        if(valid){
          if(this.isEdit){
            const idx=this.contracts.findIndex(c=>c.id===this.formData.id);
            if(idx!==-1) this.contracts.splice(idx,1,this.formData);
            this.$message.success("合同已更新");
          }else{
            this.contracts.push({...this.formData});
            this.$message.success("新增合同成功");
          }
          this.dialogVisible=false;
        }
      });
    },
    deleteContract(c){
      this.$confirm(`确认删除合同 ${c.name}？`,"删除提示",{type:"warning"})
          .then(()=>{ this.contracts=this.contracts.filter(x=>x.id!==c.id); this.$message.success("已删除"); })
          .catch(()=>{});
    },
    deleteSelected(){
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个合同？`,"批量删除",{type:"warning"})
          .then(()=>{
            const ids=this.multipleSelection.map(c=>c.id);
            this.contracts=this.contracts.filter(c=>!ids.includes(c.id));
            this.multipleSelection=[];
            this.$message.success("已删除选中合同");
          }).catch(()=>{});
    },
    exportSelected(){
      const names=this.multipleSelection.map(c=>c.name).join(", ");
      this.$message.info(`已导出合同: ${names}`);
    }
  }
};
</script>

<style scoped>
.contract-management{ padding:20px; background:#f5f7fa; min-height:calc(100vh-80px);}
.overview-cards{ margin-bottom:20px; }
.overview-card{ border-radius:12px; text-align:center; padding:20px 0; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
.overview-card .card-title{ font-size:16px; color:#888; margin-bottom:10px; }
.overview-card .card-value{ font-size:24px; font-weight:bold; }
.header-row{ display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:16px; }
.search-input{ width:260px; }
.table-card{ border-radius:12px; padding:16px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.pagination{ text-align:right; margin-top:12px; }
.contract-dialog .el-dialog__body{ padding:20px 24px; }
.contract-form .el-form-item{ margin-bottom:16px; }
.contract-form .el-input, .contract-form .el-select, .contract-form .el-date-picker{ border-radius:6px; }
.dialog-footer{ text-align:right; }
.dialog-footer .el-button{ min-width:80px; }
</style>