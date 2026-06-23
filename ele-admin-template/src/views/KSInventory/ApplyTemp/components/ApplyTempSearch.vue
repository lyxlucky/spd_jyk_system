<!-- 搜索表单 -->
<template>
  <div class="spd-panel__body">
    <el-form
      size="mini"
      :inline="true"
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="模板名称">
        <el-input
          v-model="TempletName"
          clearable
          placeholder="模板名称"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="Temp_FoundPlanSingle()">确认创建</el-button>
      </el-form-item>
      <!-- <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.SerachName" placeholder="请输入模板名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </el-col> -->
      <el-form-item>
        <el-input
          v-model="where.SerachName"
          clearable
          placeholder="请输入模板名称"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="UpdateCommon_btn">设置常规模板</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-close" @click="UpdateCommon2_btn">取消常规模板</el-button>
      </el-form-item>
      <!-- <el-row :gutter="15" style="margin-top:5px">
      <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" class="ele-btn-icon" @click="search">
            设置为常规模板
          </el-button>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 9, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button size="small" type="warning" @click="reset">取消设置为常规模板</el-button>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button size="small" type="danger" @click="reset">删除</el-button>
        </div>
      </el-col>
    </el-row> -->
    </el-form>
  </div>
</template>

<script>
import {
  CreateTemplet,
  UpdateCommon,
  UpdateCommon2
} from '@/api/KSInventory/ApplyTemp';

const defaultWhere = () => ({
  SerachName: ''
});

export default {
  props: {
    // 修改回显的数据
    rowData: Object
  },
  data() {
    return {
      where: defaultWhere(),
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
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  methods: {
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = defaultWhere();
      this.search();
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

<style scoped lang="scss">
.apply-temp-search-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.apply-temp-search-actions :deep(.el-button) {
  margin: 0;
}
</style>
