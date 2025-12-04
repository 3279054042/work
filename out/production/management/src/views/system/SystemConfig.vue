<template>
  <el-container style="height: 100vh; padding: 20px;">
    <el-header height="60px" class="header">
      <span class="title">系统菜单管理</span>
    </el-header>

    <el-main style="background-color: #F4F6F9; padding: 20px;">
      <!-- 操作按钮 -->
      <el-button type="primary" @click="openAddDialog">新增菜单</el-button>

      <!-- 树形菜单 -->
      <el-tree
          :data="menuList"
          :props="treeProps"
          accordion
          default-expand-all
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
          check-strictly
          node-key="id"
          :expand-on-click-node="false"
          style="max-height: 400px; overflow-y: auto; width: 100%;"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <el-row>
              <el-col :span="20" style="cursor: pointer;">
                <el-icon :component="expandedMenus.has(data.id) ? 'ArrowDown' : 'ArrowRight'" @click="toggleSubMenu(data.id)" />
                {{ data.name }}
              </el-col>
              <el-col :span="4">
                <el-button size="mini" @click.stop="openEditDialog(data)" type="text">编辑</el-button>
                <el-button size="mini" @click.stop="deleteMenu(data)" type="text" style="color: red;">删除</el-button>
              </el-col>
            </el-row>
          </span>
        </template>
      </el-tree>

      <!-- 新增/编辑菜单的弹窗 -->
      <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
        <el-form :model="form" ref="form" label-width="120px" status-icon>
          <el-form-item label="菜单名称" prop="name" :rules="[{ required: true, message: '请输入菜单名称', trigger: 'blur' }]">
            <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
          </el-form-item>

          <el-form-item label="菜单路径" prop="path">
            <el-input v-model="form.path" placeholder="请输入菜单路径"></el-input>
          </el-form-item>

          <el-form-item label="父级菜单">
            <el-select v-model="form.parentId" placeholder="选择父级菜单">
              <el-option v-for="item in menuList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveMenu">保存</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { ElTree, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElIcon, ElRow, ElCol } from 'element-plus';

// 模拟菜单列表数据
const menuList = ref([
  { id: 1, name: '首页', path: '/home', parentId: 0, children: [] },
  { id: 2, name: '系统管理', path: '/system', parentId: 0, children: [
      { id: 3, name: '用户管理', path: '/system/user', parentId: 2 },
      { id: 4, name: '权限管理', path: '/system/permission', parentId: 2 }
    ]},
  { id: 5, name: '其他管理', path: '/other', parentId: 0, children: [] }
]);

// 控制弹窗的显示
const dialogVisible = ref(false);
const dialogTitle = ref('新增菜单');
const form = ref({
  id: null,
  name: '',
  path: '',
  parentId: 0
});

// 控制子菜单的展开
const expandedMenus = ref(new Set());

// 树形结构的属性设置
const treeProps = {
  children: 'children',
  label: 'name',
  disabled: 'disabled',
};

// 打开新增菜单弹窗
const openAddDialog = () => {
  form.value = { id: null, name: '', path: '', parentId: 0 };
  dialogTitle.value = '新增菜单';
  dialogVisible.value = true;
};

// 打开编辑菜单弹窗
const openEditDialog = (menu) => {
  form.value = { ...menu };
  dialogTitle.value = '编辑菜单';
  dialogVisible.value = true;
};

// 删除菜单
const deleteMenu = (menu) => {
  const index = menuList.value.findIndex(item => item.id === menu.id);
  if (index !== -1) {
    menuList.value.splice(index, 1);
  }
};

// 保存菜单（新增或编辑）
const saveMenu = () => {
  if (form.value.id) {
    // 编辑操作
    const index = menuList.value.findIndex(item => item.id === form.value.id);
    if (index !== -1) {
      menuList.value[index] = { ...form.value };
    }
  } else {
    // 新增操作
    form.value.id = Date.now(); // 使用时间戳模拟一个唯一的 ID
    menuList.value.push({ ...form.value });
  }
  dialogVisible.value = false; // 关闭弹窗
};

// 切换子菜单的展开状态
const toggleSubMenu = (menuId) => {
  if (expandedMenus.value.has(menuId)) {
    expandedMenus.value.delete(menuId);
  } else {
    expandedMenus.value.add(menuId);
  }
};

// 处理树节点点击
const handleNodeClick = (node) => {
  console.log('Clicked node: ', node);
};

// 处理树节点的勾选变化
const handleCheckChange = (checked, node) => {
  console.log('Checked node: ', node);
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409EFF;
  color: white;
  height: 60px;
  padding: 0 20px;
}
.title {
  font-size: 18px;
  font-weight: bold;
}

.el-button {
  margin-bottom: 20px;
}

.custom-tree-node {
  padding: 10px;
}

.el-icon {
  margin-right: 10px;
  cursor: pointer;
}

/* 设置树形菜单的样式，使其不会被挤压显示 */
.el-tree {
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
  margin-top: 10px;
}
</style>
