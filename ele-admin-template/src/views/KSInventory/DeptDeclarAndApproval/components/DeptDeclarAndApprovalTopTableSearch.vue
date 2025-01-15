<!-- 搜索表单 -->

<template>
  <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 10, md: 4 } : { span: 4 }" style="padding-left: 40px;">
        <div class="ele-form-actions">
          <el-button size="mini " :disabled="isDisable" type="primary" class="ele-btn-icon" @click="approval">
            审批通过
          </el-button>
          <el-button size="mini" :disabled="isDisable" type="danger" class="ele-btn-icon" @click="denyApproval">
            审批不通过
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { DeptDeclarApproval, DeptDeclarDeny } from "@/api/KSInventory/DeptDeclarAndApproval"
export default {
  props: ["selection"],
  data() {
    // 默认表单数据
    const defaultWhere = {
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },
    isDisable() {
      return this.selection.length === 0;
    }
  },
  methods: {
    approval() {
      this.$confirm('确认要提交数据嘛？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeptDeclarApproval(this.selection).then((res) => {
          if (res.code == 200) {
            this.$message({ type: 'success', message: '提交成功!' });
          } else {
            this.$message({ type: 'error', message: res.msg });
          }
          this.$emit("reload","")
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        });
      });
    },
    denyApproval() {
      this.$confirm('确认要提交数据嘛？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeptDeclarDeny(this.selection).then((res) => {
          if (res.code == 200){ 
            this.$message({type: 'success',message: '提交成功!'});
          } else {
            this.$message({type: 'error',message: res.msg});
          }
          this.$emit("reload","")
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        });
      });
    },
  },
  created() {
  }
};
</script>
