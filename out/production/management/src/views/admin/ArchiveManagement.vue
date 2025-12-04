<template>
  <h2>档案管理</h2>
  <div class="archive-management">
    <!-- 操作区 -->
    <div class="header-row">
      <el-input
          v-model="searchKeyword"
          placeholder="搜索档案名称/编号"
          size="medium"
          clearable
          @clear="onSearchClear"
          class="search-input"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>

      <el-select v-model="categoryFilter" placeholder="按部门筛选" clearable style="width: 160px;">
        <el-option v-for="c in categories" :key="c" :label="c" :value="c"></el-option>
      </el-select>

      <el-upload
          :show-file-list="false"
          :before-upload="handleUpload"
      >
        <el-button type="primary">上传档案</el-button>
      </el-upload>

      <el-button type="warning" plain @click="exportSelected" :disabled="!multipleSelection.length">导出选中</el-button>
      <el-button type="danger" plain @click="deleteSelected" :disabled="!multipleSelection.length">删除选中</el-button>
    </div>

    <!-- 档案表格 -->
    <el-card shadow="hover" class="table-card">
      <el-table
          :data="pagedArchives"
          stripe
          border
          size="medium"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="档案编号" width="120" />
        <el-table-column prop="name" label="档案名称" width="180" />
        <el-table-column prop="department" label="部门" width="140" />
        <el-table-column prop="uploadDate" label="上传日期" width="120" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="success" size="small" @click="downloadArchive(scope.row)">下载</el-button>
            <el-button type="danger" size="small" @click="deleteArchive(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredArchives.length"
            :page-size="pageSize"
            v-model:current-page="currentPage"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ArchiveManagement",
  data() {
    return {
      searchKeyword: "",
      categoryFilter: "",
      categories: ["工程咨询部","造价部","项目管理部","行政财务部"],
      archives: [
        { id: "A1001", name: "项目A档案", department: "工程咨询部", uploadDate: "2025-10-01", status: "有效" },
        { id: "A1002", name: "项目B档案", department: "造价部", uploadDate: "2025-11-05", status: "有效" }
      ],
      multipleSelection: [],
      pageSize: 5,
      currentPage: 1
    };
  },
  computed: {
    filteredArchives() {
      let list = this.archives;
      if(this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        list = list.filter(a=>a.name.toLowerCase().includes(kw) || a.id.includes(kw));
      }
      if(this.categoryFilter) list = list.filter(a=>a.department===this.categoryFilter);
      return list;
    },
    pagedArchives() {
      const start=(this.currentPage-1)*this.pageSize;
      return this.filteredArchives.slice(start,start+this.pageSize);
    }
  },
  methods: {
    onSearchClear(){ this.searchKeyword=""; },
    handleSelectionChange(val){ this.multipleSelection = val; },
    handleUpload(file){
      this.$message.info(`已上传档案: ${file.name} (前端模拟)`);
      return false;
    },
    downloadArchive(row){ this.$message.info(`已下载档案: ${row.name}`); },
    deleteArchive(row){
      this.$confirm(`确认删除档案 ${row.name}?`,"删除提示",{type:"warning"})
          .then(()=>{ this.archives=this.archives.filter(a=>a.id!==row.id); this.$message.success("已删除"); })
          .catch(()=>{});
    },
    deleteSelected(){
      this.$confirm(`确认删除选中的 ${this.multipleSelection.length} 个档案?`,"批量删除",{type:"warning"})
          .then(()=>{
            const ids=this.multipleSelection.map(a=>a.id);
            this.archives=this.archives.filter(a=>!ids.includes(a.id));
            this.multipleSelection=[];
            this.$message.success("已删除选中档案");
          }).catch(()=>{});
    },
    exportSelected(){
      const names=this.multipleSelection.map(a=>a.name).join(", ");
      this.$message.info(`已导出档案: ${names}`);
    }
  }
};
</script>

<style scoped>
.archive-management{ padding:20px; background:#f5f7fa; min-height:calc(100vh-80px);}
.header-row{ display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:16px; }
.search-input{ width:260px; }
.table-card{ border-radius:12px; padding:16px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.pagination{ text-align:right; margin-top:12px; }
</style>