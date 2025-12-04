<template>
  <div style="padding: 20px;">
    <h2 style="margin-bottom: 20px;">租户系统列表</h2>

    <el-row :gutter="20">
      <el-col
          v-for="system in systemList"
          :key="system.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
      >
        <el-card shadow="hover" class="system-card">
          <h3>{{ system.name }}</h3>

          <p><strong>系统版本：</strong>{{ system.version }}</p >
          <p><strong>启用状态：</strong>
            <el-tag :type="system.status === '启用' ? 'success' : 'danger'">
              {{ system.status }}
            </el-tag>
          </p >

          <p><strong>分配功能：</strong></p >
          <el-tag
              v-for="f in system.features"
              :key="f"
              type="info"
              style="margin-right: 5px; margin-bottom: 5px;"
          >
            {{ f }}
          </el-tag>

          <p style="margin-top: 10px;"><strong>到期时间：</strong>{{ system.expire }}</p >

          <div style="text-align: right; margin-top: 15px;">
            <el-button type="primary" size="small">进入系统</el-button>
            <el-button size="small" @click="openDetail(system)">详情</el-button>
            <el-button size="small" type="warning" @click.native="openEdit(system)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteSystem(system.id)">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详情弹窗 -->
    <el-dialog v-model="dialogVisible" :title="current?.name || '系统详情'" width="500px">
      <p><strong>系统名称：</strong>{{ current?.name }}</p >
      <p><strong>版本：</strong>{{ current?.version }}</p >
      <p><strong>状态：</strong>{{ current?.status }}</p >
      <p><strong>到期时间：</strong>{{ current?.expire }}</p >
      <p><strong>功能列表：</strong></p >
      <ul>
        <li v-for="f in current?.features" :key="f">{{ f }}</li>
      </ul>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

<!--    编辑-->
    <el-dialog v-model="editDialog" title="编辑系统信息" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="系统名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="editForm.version"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item label="功能列表">
          <el-select
              v-model="editForm.features"
              multiple
              placeholder="选择功能"
              style="width: 100%;"
          >
            <el-option
                v-for="f in allFeatures"
                :key="f"
                :label="f"
                :value="f"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-date-picker
              type="date"
              v-model="editForm.expire"
              value-format="YYYY-MM-DD"
              placeholder="选择日期"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialog=false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// ---------------------
// 本地模拟数据（纯前端）
// ---------------------
const systemList = ref([
  {
    id: 1,
    name: "项目管理系统",
    version:"v1.0",
    status: "启用",
    expire: "2026-12-31",
    tenant: "A公司",
    features: ["项目管理", "进度跟踪", "合同登记"]
  },
  {
    id: 2,
    name: "档案管理系统",
    version: "v2.0",
    status: "禁用",
    expire: "2027-05-01",
    tenant: "B集团",
    features: ["档案录入", "档案查询", "档案共享"]
  }
]);

// 可选功能列表
const allFeatures = [
  "项目管理",
  "进度跟踪",
  "文档存储",
  "审批流程",
  "合同登记",
  "费用统计",
  "预算控制",
  "用户管理",
  "角色权限控制",
  "档案录入",
  "档案查询",
  "档案共享",
];

// ---------------------
// 页面加载
// ---------------------
onMounted(() => {
  systemList.value=JSON.parse(localStorage.getItem("tenantSystems")) || "[]" ;
  console.log("系统列表加载成功：", systemList.value);
});

// ---------------------
// 详情
// ---------------------
const dialogVisible = ref(false);
const current = ref(null);

function openDetail(row) {
  current.value = { ...row };
  dialogVisible.value = true;
}

// ---------------------
// 编辑功能
// ---------------------
const editDialog = ref(false);
const editForm = ref({});
const editTargetId = ref(null);

function openEdit(row) {
  editTargetId.value = row.id;
  editForm.value = { ...row };
  editDialog.value = true;
}

// 保存编辑（仅修改前端本地数据）
function saveEdit() {
  const idx = systemList.value.findIndex(s => s.id === editTargetId.value);
  if (idx !== -1) {
    systemList.value[idx] = { ...editForm.value };
  }

  ElMessage.success("保存成功（前端测试版）");
  editDialog.value = false;
}

// ---------------------
// 删除
// ---------------------
function deleteSystem(id) {
  ElMessageBox.confirm(
      "确认要删除该系统吗？删除后不可恢复！！！",
      "警告！！！",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
  )
      .then(() => {
        systemList.value = systemList.value.filter(sys => sys.id !== id);
        ElMessage.success("删除成功");
      })
      .catch(() => {
        ElMessage.info("已取消删除");
      });
}
</script>

<style scoped>
.system-card {
  margin-bottom: 20px;
  border-radius: 10px;
  min-height: 260px;
}
</style>