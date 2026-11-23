<!-- 搜索表单 -->
<template>
  <el-form class="order-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-input size="mini" clearable v-model="where.condition" placeholder="请扫描或输入单号" />
    <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
      查询
    </el-button>
    <el-select @change="search" v-model="where.state" size="mini">
      <el-option label="全部" value=""></el-option>
      <el-option label="待确认" value="0"></el-option>
      <el-option label="待提交" value="1"></el-option>
      <el-option label="已提交" value="2"></el-option>
    </el-select>
    <el-button size="mini" type="primary" @click="platformConsumeEditShow">编辑</el-button>
  </el-form>
</template>

<script>
import {
  CreateTemplet,
  UpdateCommon,
  UpdateCommon2
} from '@/api/KSInventory/ApplyTemp';
import AdvanceReceiptNumberEdit from './AdvanceReceiptNumberEdit.vue';
export default {
  props: {
    // 修改回显的数据
    rowData: Object
  },
  components: {
    AdvanceReceiptNumberEdit
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      state: '',
      condition: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      BZ: '',
      TempletName: '',
      rules: {
        TempletName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入模板名称'
          }
        ]
      }
    };
  },
  methods: {
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    platformConsumeEditShow() {
      this.$emit('platformConsumeEditShow', true);
    },
    /* 创建申领单 */
    Temp_FoundPlanSingle() {
      if (!this.TempletName) {
        this.$message.warning('请输入模板名称');
        return;
      }
      // const loading = this.$loading({ lock: true });

      const loading = this.$messageLoading('添加中..');
      var data = {
        TempletName: this.TempletName,
        DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
        Operater: this.$store.state.user.info.UserName
      };
      CreateTemplet(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.$emit('search', this.where);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    UpdateCommon_btn() {
      if (this.rowData == null) {
        this.$message.warning('请先选择模板');
        return;
      }
      const loading = this.$messageLoading('设置中..');

      var data = {
        ID: this.rowData.ID
      };
      UpdateCommon(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
          this.search();
        });
    },
    UpdateCommon2_btn() {
      const loading = this.$messageLoading('设置中..');
      UpdateCommon2()
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
          this.search();
        });
    }
  },
  created() {}
};
</script>

<style scoped>
  .order-search {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    min-width: 0;
    margin: 0;
  }

  .order-search ::v-deep > .el-input {
    flex: 1 1 0;
    width: auto;
    min-width: 0;
  }

  .order-search ::v-deep .el-select {
    flex: none;
    width: 84px;
    margin-left: 4px;
  }

  .order-search ::v-deep .el-button {
    flex: none;
    margin-left: 4px;
    padding: 5px 8px;
  }
</style>
