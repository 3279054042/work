<template>
  <div class="admin-dept-page">
    <el-row :gutter="20">

      <!-- 左侧部门树 -->
      <el-col :span="6">
        <div class="left-panel">

          <!-- 顶部操作栏 -->
          <div class="left-top-bar">
            <el-input
                v-model="searchKeyword"
                placeholder="搜索部门/公司"
                clearable
                size="small"
                class="search-input"
            >
              <template #prefix><i class="el-icon-search"></i></template>
            </el-input>

            <div class="btn-group">
              <el-button type="primary" size="small" @click="addRoot">新增</el-button>
              <el-button type="info" size="small" plain @click="addChild">增加下级</el-button>
              <el-button size="small">导入</el-button>
              <el-button size="small">导出</el-button>
              <el-button size="small">批量操作</el-button>
            </div>
          </div>

          <!-- 树形控件 -->
          <el-tree
              ref="deptTree"
              :data="treeData"
              show-checkbox
              highlight-current
              node-key="id"
              :default-expanded-keys="['1']"
              :props="treeProps"
              class="dept-tree"
              @node-click="handleNodeClick"
              @node-contextmenu="handleRightClick"
          />

          <!-- 右键菜单 -->
          <el-dropdown
              ref="rightMenu"
              trigger="manual"
              @command="handleRightCommand"
          >
            <span></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addChild">➕ 添加下级</el-dropdown-item>
              <el-dropdown-item command="rename">✏ 重命名</el-dropdown-item>
              <el-dropdown-item command="delete">🗑 删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
      </el-col>

      <!-- 右侧详细信息 -->
      <el-col :span="18">
        <div class="right-panel">
          <el-card shadow="never">
            <template #header>
              <h3 class="detail-title">{{ currentNode?.label || "请选择左侧机构" }}</h3>
            </template>

            <el-tabs v-model="activeTab">

              <!-- 基本信息 -->
              <el-tab-pane label="基本信息" name="info">
                <el-form :model="formData" label-width="120px" class="info-form">
                  <el-form-item label="机构名称">
                    <el-input v-model="formData.name"></el-input>
                  </el-form-item>

                  <el-form-item label="上级部门">
                    <el-input v-model="formData.parentName" disabled></el-input>
                  </el-form-item>

                  <el-form-item label="机构编码">
                    <el-input v-model="formData.code" disabled></el-input>
                  </el-form-item>

                  <el-form-item label="机构类型">
                    <el-select v-model="formData.type">
                      <el-option label="子公司" value="company"></el-option>
                      <el-option label="部门" value="department"></el-option>
                      <el-option label="岗位" value="role"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="职务级别">
                    <el-input v-model="formData.level" placeholder="如：一级部门"></el-input>
                  </el-form-item>

                  <el-form-item label="排序">
                    <el-input-number v-model="formData.order" :min="0" :max="999" />
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="saveInfo">保存信息</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <!-- 部门权限 -->
              <el-tab-pane label="部门权限" name="permission">
                <div class="permission-container">
                  <el-tree
                      :data="permissionList"
                      show-checkbox
                      node-key="id"
                      highlight-current
                      :default-checked-keys="checkedPermissions"
                  />
                  <el-button type="primary" class="save-btn">保存权限</el-button>
                </div>
              </el-tab-pane>

              <!-- 用户列表 -->
              <el-tab-pane label="用户列表" name="users">
                <el-button type="primary" size="small" @click="addUser">添加用户</el-button>
                <el-table :data="userList" border size="small" class="user-table">
                  <el-table-column label="姓名" prop="name" width="120" />
                  <el-table-column label="工号" prop="id" width="120" />
                  <el-table-column label="岗位" prop="role" width="140" />
                  <el-table-column label="操作" width="120">
                    <template #default="scope">
                      <el-button type="danger" size="small" @click="removeUser(scope.row)">移除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <!-- 部门负责人 -->
              <el-tab-pane label="部门负责人" name="leader">
                <el-form label-width="120px">
                  <el-form-item label="负责人">
                    <el-select v-model="currentLeader" placeholder="选择负责人">
                      <el-option
                          v-for="u in userList"
                          :key="u.id"
                          :label="u.name"
                          :value="u.id"
                      />
                    </el-select>
                  </el-form-item>

                  <el-button type="primary">保存负责人</el-button>
                </el-form>
              </el-tab-pane></el-tabs>
          </el-card>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
export default {
  name: "AdminDept",
  data() {
    return {
      searchKeyword: "",
      activeTab: "info",
      currentNode: null,
      rightClickNode: null,
      // ---- 树结构数据（示例，可改为后台数据） ----
      treeData: [
        {
          id: "1",
          label: "宏玥集团",
          children: [
            {
              id: "2",
              label: "杭州宏玥工程咨询有限公司",
              children: [
                {
                  id: "3",
                  label: "工程咨询部",
                  children: [
                    { id: "4", label: "咨询工程师" }
                  ]
                },
                {
                  id: "5",
                  label: "造价部",
                  children: [{ id: "6", label: "造价工程师" }]
                }
              ]
            }
          ]
        }
      ],
      treeProps: { children: "children", label: "label" },

      // ---- 右侧信息 ----
      formData: {
        name: "",
        parentName: "",
        code: "",
        type: "",
        level: "",
        order: 0
      },
      // 部门权限
      permissionList: [
        { id: "p1", label: "查看数据" },
        { id: "p2", label: "新增数据" },
        { id: "p3", label: "修改数据" },
        { id: "p4", label: "删除数据" }
      ],
      checkedPermissions: ["p1", "p2"],

      // 用户列表
      userList: [
        { id: "1001", name: "张三", role: "咨询工程师" },
        { id: "1002", name: "李四", role: "造价师" }
      ],

      currentLeader: null
    };
  },
  methods: {
    /** 左侧树点击 */
    handleNodeClick(node) {
      this.currentNode = node;
      this.formData.name = node.label;
      this.formData.parentName = this.findParentName(node.id);
      this.formData.code = "ORG-" + node.id;
      this.formData.type = "department";
      this.formData.level = "二级部门";
      this.formData.order = 0;
    },

    /** 查找上级部门名称 */
    findParentName(id) {
      let parent = null;
      const dfs = (nodes, parentNode) => {
        for (let n of nodes) {
          if (n.id === id) parent = parentNode;
          if (n.children) dfs(n.children, n);
        }
      };
      dfs(this.treeData, null);
      return parent ? parent.label : "无";
    },

    /** ---- 右键菜单 ---- */
    handleRightClick(event, node) {
      this.rightClickNode = node;

      const menu = this.$refs.rightMenu;
      menu.$el.style.left = event.clientX + "px";
      menu.$el.style.top = event.clientY + "px";
      menu.visible = true;
    },

    handleRightCommand(command) {
      if (!this.rightClickNode) return;
      if (command === "addChild") this.addChildNode();
      if (command === "rename") this.renameNode();
      if (command === "delete") this.deleteNode();
      this.$refs.rightMenu.visible = false;
    },
    /** 新增根节点 */
    addRoot() {
      this.treeData.push({
        id: Date.now() + "",
        label: "新组织",
        children: []
      });
    },

    /** 添加下级 */
    addChild() {
      if (!this.currentNode) return this.$message.warning("请先选中左侧节点");
      this.addChildNode();
    },

    addChildNode() {
      this.currentNode.children = this.currentNode.children || [];
      this.currentNode.children.push({
        id: Date.now() + "",
        label: "新下级机构"
      });
    },
    renameNode() {
      const newName = prompt("请输入新名称", this.rightClickNode.label);
      if (newName) this.rightClickNode.label = newName;
    },

    deleteNode() {
      this.$confirm("确认删除该机构？", "提示").then(() => {
        const remove = (nodes, id) => {
          return nodes.filter(n => {
            if (n.children) n.children = remove(n.children, id);
            return n.id !== id;
          });
        };
        this.treeData = remove(this.treeData, this.rightClickNode.id);
      });
    },

    /** 保存右侧信息 */
    saveInfo() {
      this.$message.success("信息已保存（示例）");
    },
    /** 用户管理示例 */
    addUser() {
      this.$message.info("添加用户功能可集成用户选择器");
    },
    removeUser(user) {
      this.userList = this.userList.filter(u => u.id !== user.id);
    }
  }
};
</script>

<style scoped>
.admin-dept-page {
  padding: 20px;
}

.left-panel {
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  height: calc(100vh - 120px);
  overflow: auto;
}

.right-panel {
  height: calc(100vh - 120px);
  overflow: auto;
}

.left-top-bar {
  margin-bottom: 10px;
}

.btn-group {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.search-input {
  width: 100%;
}

.detail-title {
  margin: 0;
  font-weight: bold;
}

.info-form {
  max-width: 500px;
}

.permission-container {
  padding: 10px;
}

.user-table {
  margin-top: 10px;
}

.save-btn {
  margin-top: 10px;
}
</style>












Cha