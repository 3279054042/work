<template>
  <div class="admin-center-main">
    <!-- 标题 + 搜索 -->
    <div class="header-row">
      <div class="title-block">
        <h1>行政中心</h1>
        <p class="subtitle">杭州宏玥工程信息咨询服务有限公司 · 行政管理看板</p >
      </div>

      <div class="actions-block">
        <el-input
            v-model="search"
            placeholder="搜索员工 / 项目 / 合同"
            size="medium"
            class="search-input"
            clearable
            @clear="onSearchClear"
        >
          <template #prefix>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </el-input>

        <el-button type="primary" size="medium" @click="openNewIssue">新建工单</el-button>
        <el-button type="info" size="medium" plain @click="refreshData">刷新</el-button>
      </div>
    </div>
    <!-- 仪表卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in statCards" :key="card.key">
        <el-card class="stat-card">
          <div class="stat-left">
            <div class="stat-icon" v-html="card.icon"></div>
          </div>
          <div class="stat-right">
            <div class="stat-number">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 快捷操作 & 待办 -->
    <el-row :gutter="20" class="main-row">
      <el-col :xs="24" :md="12">
        <el-card class="panel-card">
          <div slot="header" class="card-header">
            <span>快捷操作</span>
            <el-button type="text" @click="openQuickSettings">设置</el-button>
          </div>

          <div class="quick-actions">
            <el-button v-for="btn in quickButtons" :key="btn.key" :icon="btn.icon" @click="doQuickAction(btn.key)">
              {{ btn.label }}
            </el-button>
          </div>

          <el-divider></el-divider>

          <div class="notes">
            <strong>今日提醒：</strong>
            <el-tag v-for="n in todayRemind" :key="n" class="remind-tag" effect="plain">{{ n }}</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card class="panel-card">
          <div slot="header" class="card-header">
            <span>待办 / 审批</span>
            <el-button type="text" @click="goToWorkflow">查看全部</el-button>
          </div>

          <el-list class="todo-list">
            <el-list-item v-for="item in todoList" :key="item.id" class="todo-item">
              <div class="todo-left">
                <el-badge :value="item.type" class="todo-badge"></el-badge>
                <div class="todo-title">{{ item.title }}</div>
                <div class="todo-meta">{{ item.meta }}</div>
              </div>
              <div class="todo-right">
                <el-button size="small" type="primary" @click="handleApprove(item)">通过</el-button>
                <el-button size="small" @click="handleReject(item)">驳回</el-button>
              </div>
            </el-list-item>
            <div v-if="!todoList.length" class="empty-todo">当前没有待办事项</div>
          </el-list>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动表 & 部门统计图（简洁版）-->
    <el-row :gutter="20" class="lower-row">
      <el-col :xs="24" :md="14">
        <el-card class="panel-card">
          <div slot="header" class="card-header">
            <span>最近活动</span>
            <el-button type="text" @click="viewAllActivities">全部活动</el-button>
          </div>

          <el-table :data="recentActivities" stripe size="small" style="width:100%">
            <el-table-column prop="time" label="时间" width="160" />
            <el-table-column prop="actor" label="操作者" width="140" />
            <el-table-column prop="action" label="操作内容" />
            <el-table-column prop="project" label="项目/合同" width="180" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="10">
        <el-card class="panel-card">
          <div slot="header" class="card-header">
            <span>部门 / 员工概况</span>
            <el-button type="text" @click="openOrgChart">组织结构</el-button>
          </div>

          <div class="dept-stats">
            <div class="dept-row" v-for="d in deptStats" :key="d.name">
              <div class="dept-name">{{ d.name }}</div>
              <div class="dept-progress">
                <el-progress :text-inside="false" :stroke-width="12" :percentage="Math.min(d.util,100)"></el-progress>
              </div>
              <div class="dept-count">{{ d.count }} 人</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 底部快捷链接 -->
    <div class="bottom-links">
      <el-button type="text" @click="openHR">人事管理</el-button>
      <el-button type="text" @click="openFinance">财务报表</el-button>
      <el-button type="text" @click="openContracts">合同档案</el-button>
      <el-button type="text" @click="openHelp">帮助</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "AdminCenterMain",
  data() {
    return {
      search: "",
      // 仪表卡片示例数据
      statCards: [
        {
          key: "projects",
          label: "在管项目",
          value: 28,
          icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M3 13h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 6h10v12H7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`
        },
        {
          key: "employees",
          label: "员工数",
          value: 64,
          icon: `<svg viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M4 20c1-4 7-6 8-6s7 2 8 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`
        },
        {
          key: "pending",
          label: "待审批",
          value: 7,
          icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 8v5l3 3" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`
        },
        {
          key: "receivable",
          label: "应收款 (万)",
          value: 183,
          icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M4 7h16M12 3v18" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`
        }
      ],

      quickButtons: [
        { key: "new_contract", label: "新建合同", icon: "" },
        { key: "apply_leave", label: "发起请假", icon: "" },
        { key: "book_room", label: "会议室预订", icon: "" },
        { key: "expense", label: "费用报销", icon: "" }
      ],
      todayRemind: [
        "本周末预算评审会议 10:00",
        "项目A 进展汇报需准备资料",
        "三方合同到期提醒：合同#2024-095"
      ],

      todoList: [
        { id: 1, type: "审批", title: "项目租赁审批（项目A）", meta: "提交人：张三 · 2 天前" },
        { id: 2, type: "审核", title: "费用报销：李四", meta: "金额：¥3,200 · 1 天前" },
        { id: 3, type: "转交", title: "合同变更审批（合同#2024-095）", meta: "提交人：王五 · 5 小时前" }
      ],

      recentActivities: [
        { time: "2025-11-30 17:22", actor: "张经理", action: "上传：项目B 招标文件", project: "项目B" },
        { time: "2025-11-30 15:11", actor: "李四", action: "发起：费用报销", project: "日常费用" },
        { time: "2025-11-29 09:05", actor: "王五", action: "审批通过：合同#2024-091", project: "合同#2024-091" }
      ],
      deptStats: [
        { name: "工程咨询部", count: 22, util: 78 },
        { name: "造价部", count: 14, util: 64 },
        { name: "项目管理部", count: 10, util: 50 },
        { name: "行政财务部", count: 8, util: 40 }
      ]
    };
  },
  methods: {
    onSearchClear() {
      // 这里可以触发重新加载或清空筛选
      this.search = "";
    },
    openNewIssue() {
      this.$message({ type: "success", message: "打开新建工单弹窗（示例）" });
      // 真实项目中：打开工单表单对话框或跳路由
    },
    refreshData() {
      this.$message({ type: "info", message: "数据已刷新（示例）" });
      // 真实项目中在此调用 API 刷新各类数据
    },
    openQuickSettings() {
      this.$message("打开快捷设置（示例）");
    },
    doQuickAction(key) {
      this.$message(`执行快捷操作：${key}`);
      // 根据 key 跳转或打开表单
    },
    goToWorkflow() {
      this.$router.push("/admin/workflow");
    },
    handleApprove(item) {
      this.$confirm(`确认通过：${item.title} ?`, "操作确认", { type: "warning" })
          .then(() => {
            this.$message({ type: "success", message: "已通过" });
            this.todoList = this.todoList.filter((t) => t.id !== item.id);
          })
          .catch(() => {});
    },
    handleReject(item) {
      this.$prompt("请输入驳回原因", "驳回", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
          .then(({ value }) => {
            this.$message({ type: "info", message: "已驳回：" + value });
            this.todoList = this.todoList.filter((t) => t.id !== item.id);
          })
          .catch(() => {});
    },
    viewAllActivities() {
      this.$router.push("/admin/overview#activities");
    },
    openOrgChart() {
      this.$message("打开组织结构视图（示例）");
    },
    openHR() {
      this.$router.push("/admin/staff");
    },
    openFinance() {
      this.$router.push("/admin/finance");
    },
    openContracts() {
      this.$router.push("/admin/contract");
    },
    openHelp() {
      this.$message("跳转到帮助文档（示例）");
    }
  }
};
</script>
<style scoped>
.admin-center-main {
  padding: 22px;
  min-height: calc(100vh - 80px);
}

/* Header */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.title-block h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}
.subtitle {
  margin: 4px 0 0;
  color: #8c98a8;
  font-size: 13px;
}

/* Actions */
.actions-block {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  width: 360px;
}

/* Stat cards */
.stats-row {
  margin-bottom: 18px;
}
.stat-card {
  display: flex;
  align-items: center;
  padding: 14px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(16,23,42,0.04);
}

.stat-left {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: linear-gradient(135deg,#f0f7ff,#ffffff);
  margin-right: 12px;
}
.stat-icon svg { color: #3b82f6; }

.stat-number {
  font-size: 18px;
  font-weight: 700;
}

.stat-label {
  color: #7b8a9a;
  font-size: 12px;
}

/* Panels */
.panel-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(16,23,42,0.04);
}
.card-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-weight:600;
}

/* Quick actions */
.quick-actions {
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  padding: 8px 0;
}

.quick-actions .el-button {
  min-width: 130px;
}
/* todo list */
.todo-list { padding: 6px 0; }
.todo-item {
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:10px 0;
  border-bottom:1px solid #f0f2f5;
}
.todo-left { display:flex; align-items:flex-start; gap:12px; }
.todo-title { font-weight:600; }
.todo-meta { color:#9aa6b6; font-size:12px; margin-top:4px; }

/* dept stats */
.dept-stats { display:flex; flex-direction:column; gap:12px; margin-top:6px; }
.dept-row { display:flex; align-items:center; gap:10px; }
.dept-name { width:110px; font-weight:600; }
.dept-count { color:#7b8a9a; width:60px; text-align:right; }

/* lower row spacing */
.lower-row { margin-top: 14px; }
/* bottom links */
.bottom-links {
  margin-top: 18px;
  display:flex;
  gap: 12px;
  align-items:center;
  justify-content:flex-end;
}

/* small screens */
@media (max-width: 768px) {
  .search-input { width: 200px; }
  .actions-block { flex-direction: column; align-items: stretch; }
  .bottom-links { justify-content:flex-start; flex-wrap:wrap; }
}
</style>