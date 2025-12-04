<template>
  <h2>财务管理</h2>
  <div class="finance-management">
    <!-- 财务概览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="8">
        <el-card class="overview-card" shadow="hover">
          <div class="card-title">总收入</div>
          <div class="card-value">{{ totalIncome | currency }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="overview-card" shadow="hover">
          <div class="card-title">总支出</div>
          <div class="card-value">{{ totalExpense | currency }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="overview-card" shadow="hover">
          <div class="card-title">当前余额</div>
          <div class="card-value">{{ balance | currency }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作区 -->
    <div class="header-row">
      <el-input
          v-model="searchKeyword"
          placeholder="搜索备注/类型"
          size="medium"
          clearable
          @clear="onSearchClear"
          class="search-input"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>

      <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
      ></el-date-picker>

      <el-select v-model="typeFilter" placeholder="筛选类型" clearable style="width: 160px;">
        <el-option label="收入" value="收入"></el-option>
        <el-option label="支出" value="支出"></el-option>
      </el-select>

      <el-button type="primary" @click="openAddDialog">新增账单</el-button>
      <el-button type="warning" plain @click="exportSelected" :disabled="!multipleSelection.length">导出选中</el-button>
      <el-button type="danger" plain @click="deleteSelected" :disabled="!multipleSelection.length">删除选中</el-button>
    </div>

    <!-- 账单表格 -->
    <el-card shadow="hover" class="table-card">
      <el-table
          :data="pagedBills"
          stripe
          border
          size="medium"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="date" label="日期" width="120" sortable />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="amount" label="金额" width="120" sortable />
        <el-table-column prop="method" label="支付方式" width="120" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteBill(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredBills.length"
            :page-size="pageSize"
            v-model:current-page="currentPage"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑账单弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="480px" custom-class="bill-dialog">
      <el-form :model="formData" :rules="formRules" ref="billForm" label-width="100px" class="bill-form">
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="formData.date" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" placeholder="选择类型">
            <el-option label="收入" value="收入"></el-option>
            <el-option label="支出" value="支出"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="formData.amount" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="支付方式" prop="method">
          <el-input v-model="formData.method" placeholder="如：现金/支付宝/银行转账" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="可选" clearable></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveBill">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FinanceManagement",
  data() {
    return {
      searchKeyword: "",
      dateRange: [],
      typeFilter: "",
      bills: [
        { id: 1, date: "2025-11-01", type: "收入", amount: 12000, method: "银行转账", remark: "项目款" },
        { id: 2, date: "2025-11-03", type: "支出", amount: 500, method: "现金", remark: "办公用品" },
        { id: 3, date: "2025-11-05", type: "支出", amount: 3000, method: "银行转账", remark: "租金" }
      ],
      dialogVisible: false,
      dialogTitle: "新增账单",
      formData: {},
      formRules: {
        date: [{ required: true, message: "请选择日期", trigger: "change" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        amount: [{ required: true, message: "请输入金额", trigger: "blur" }],
        method: [{ required: true, message: "请输入支付方式", trigger: "blur" }]
      },
      multipleSelection: [],
      pageSize: 5,
      currentPage: 1
    };
  },
  computed: {
    filteredBills() {
      let list = this.bills;
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        list = list.filter(b => b.remark.toLowerCase().includes(kw) || b.type.includes(kw));
      }
      if (this.typeFilter) list = list.filter(b => b.type === this.typeFilter);
      if (this.dateRange.length === 2) {
        const [start, end] = this.dateRange;
        list = list.filter(b => b.date >= start && b.date <= end);
      }
      return list;
    },
    pagedBills() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredBills.slice(start, start + this.pageSize);
    },
    totalIncome() {
      return this.bills.filter(b => b.type === "收入").reduce((sum, b) => sum + b.amount, 0);
    },
    totalExpense() {
      return this.bills.filter(b => b.type === "支出").reduce((sum, b) => sum + b.amount, 0);
    },
    balance() {
      return this.totalIncome - this.totalExpense;
    }
  },
  methods: {
    onSearchClear() { this.searchKeyword = ""; },
    handleSelectionChange(val) { this.multipleSelection = val; },
    openAddDialog() { this.dialogTitle="新增账单"; this.formData={}; this.dialogVisible=true; },
    openEditDialog(bill) { this.dialogTitle="编辑账单"; this.formData={...bill}; this.dialogVisible=true; },
    saveBill() {
      this.$refs.billForm.validate(valid=>{
        if(valid){
          if(this.formData.id){
            const idx=this.bills.findIndex(b=>b.id===this.formData.id);
            if(idx!==-1)this.bills.splice(idx,1,this.formData);
            this.$message.success("账单已更新");
          }else{
            this.formData.id = Date.now();
            this.bills.push({...this.formData});
            this.$message.success("新增账单成功");
          }
          this.dialogVisible=false;
        }
      });
    },
    deleteBill(bill){
      this.$confirm(`确认删除此账单？`, "删除提示", {type:"warning"})
          .then(()=>{ this.bills = this.bills.filter(b=>b.id!==bill.id); this.$message.success("已删除"); })
          .catch(()=>{});
    },
    deleteSelected(){
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 条账单？`, "批量删除", {type:"warning"})
          .then(()=>{
            const ids=this.multipleSelection.map(b=>b.id);
            this.bills=this.bills.filter(b=>!ids.includes(b.id));
            this.multipleSelection=[];
            this.$message.success("已删除选中账单");
          }).catch(()=>{});
    },
    exportSelected(){
      const remarks = this.multipleSelection.map(b=>b.remark).join(", ");
      this.$message.info(`已导出账单: ${remarks}`);
    }
  },
  filters: {
    currency(val){ return "¥ " + Number(val).toLocaleString(); }
  }
};
</script>
<style scoped>
.finance-management {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 80px);
}
.overview-cards {
  margin-bottom: 20px;
}
.overview-card {
  border-radius: 12px;
  text-align: center;
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.overview-card .card-title {
  font-size: 16px;
  color: #888;
  margin-bottom: 10px;
}
.overview-card .card-value {
  font-size: 24px;
  font-weight: bold;
}
.header-row {
  display:flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
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
.pagination {
  text-align: right;
  margin-top: 12px;
}
.bill-dialog .el-dialog__body {
  padding: 20px 24px;
}
.bill-form .el-form-item {
  margin-bottom: 16px;
}
.bill-form .el-input,
.bill-form .el-input-number,
.bill-form .el-select,
.bill-form .el-date-picker {
  border-radius: 6px;
}
.dialog-footer {
  text-align: right;
}
.dialog-footer .el-button {
  min-width: 80px;
}
</style>