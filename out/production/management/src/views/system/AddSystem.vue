<template>
  <div style="padding: 20px;">

    <h2 style="margin-bottom: 20px;">新增租户系统</h2>

    <el-card>
      <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="100px"
      >

        <el-form-item label="系统名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入系统名称" />
        </el-form-item>

        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="如 v1.0" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>

        <el-form-item label="功能列表" prop="features">
          <el-select
              v-model="form.features"
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

        <el-form-item label="到期时间" prop="expire">
          <el-date-picker
              v-model="form.expire"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>

      </el-form>
    </el-card>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

// 新增表单
const form = ref({
  name: "",
  version: "",
  status: "",
  features: [],
  expire: ""
});

// 所有功能
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
  "档案共享"
];

// 校验
const rules = {
  name: [{ required: true, message: "请输入系统名称", trigger: "blur" }],
  version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
  features: [
    { required: true, message: "请选择至少一个功能", trigger: "change" }
  ],
  expire: [{ required: true, message: "请选择到期时间", trigger: "change" }]
};

const formRef = ref(null);

// 提交
function submitForm() {
  formRef.value.validate((valid) => {
    if (!valid) return;

    const newSystem = {
      id: Date.now(),
      name: form.value.name,
      version: form.value.version,
      status: form.value.status,
      features: form.value.features,
      expire: form.value.expire
    };

    // 读取本地
    const list = JSON.parse(localStorage.getItem("tenantSystems") || "[]");

    // 添加新系统
    list.push(newSystem);

    // 存回 localStorage
    localStorage.setItem("tenantSystems", JSON.stringify(list));

    ElMessage.success("创建成功");

    // 跳转回系统列表
    router.push("/app/systems/list");
  });
}

function goBack() {
  router.back();
}
</script>

<style scoped>
</style>