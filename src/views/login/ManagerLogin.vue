<template>
  <div class="login-container">
    <!-- 左侧公司介绍 -->
    <div class="login-left">
      <h1 class="company-name">杭州宏玥工程管理咨询有限公司</h1>

      <p class="company-desc">
        杭州宏玥工程管理咨询有限公司是一家专业从事工程造价咨询、招投标代理、
        工程项目管理、全过程工程咨询的综合性服务机构。公司以“专业、规范、
        高效、可信赖”为服务宗旨，为政府单位、企事业单位及社会投资项目提供
        全方位、全流程的专业工程咨询服务。
      </p >

      <ul class="company-features">
        <li>✔ 多行业、多类型工程项目咨询经验</li>
        <li>✔ 完整的技术团队与专业咨询体系</li>
        <li>✔ 全流程工程造价管理与全过程咨询</li>
        <li>✔ 坚持公开、公正、透明的服务原则</li>
        <li>✔ 丰富的政府采购与招投标代理经验</li>
      </ul>
    </div>

    <!-- 右侧登录框 -->
    <div class="login-right">
      <el-card class="login-card">
        <h2 class="login-title">管理员登录</h2>

        <el-form :model="form" :rules="rules" ref="formRef" label-width="0">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入管理员账号" clearable prefix-icon="User" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" show-password prefix-icon="Lock" />
          </el-form-item>

          <el-button type="primary" class="login-btn" @click="login" round>
            登录系统
          </el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import {useRouter} from "vue-router";

const formRef = ref();

const router =useRouter();

const form = ref({
  username: "",
  password: ""
});

const rules = {
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
};

function login() {
  formRef.value.validate((valid) => {
    if (!valid) return;

    if (form.value.username === "admin" && form.value.password === "123456") {
      ElMessage.success("登录成功！");
      router.push("/app/tenants/list"); // 跳转到首页
    } else {
      ElMessage.error("账号或密码错误");
    }
  });
}
</script>

<style scoped>
/************ 主体布局 ************/
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #4e9eff 0%, #67c1ff 100%);
}

/************ 左侧公司介绍 ************/
.login-left {
  flex: 1.2;
  padding: 80px 60px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.company-name {
  font-size: 34px;
  font-weight: bold;
  margin-bottom: 25px;
}

.company-desc {
  font-size: 16px;
  line-height: 1.8;
  width: 85%;
  margin-bottom: 35px;
}

.company-features li {
  font-size: 16px;
  margin-bottom: 12px;
}

/************ 右侧登录框 ************/
.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 380px;
  padding: 30px;
  border-radius: 14px;
}

.login-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 25px;
  color: #333;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
  height: 40px;
  font-size: 16px;
}
</style>