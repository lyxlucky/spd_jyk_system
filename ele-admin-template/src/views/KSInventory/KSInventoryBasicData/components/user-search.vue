<!-- 搜索表单 -->
<template>
  <el-form
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 4 }">
        <el-form-item>
          <el-input
            clearable
            size="mini"
            v-model="where.Varietie_Code_New"
            placeholder="品种编码/品种名称"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 4 }">
        <el-form-item>
          <el-input
            clearable
            size="mini"
            v-model="where.APPROVAL_NUMBER"
            placeholder="注册证号"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 4 }">
        <el-form-item>
          <el-input
            clearable
            size="mini"
            v-model="where.Specification_Or_Type"
            placeholder="包装规格"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 4 }">
        <el-form-item>
          <el-input
            clearable
            size="mini"
            v-model="where.settlementDept"
            placeholder="有使用科室"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 4 }">
        <el-form-item>
          <el-input
            clearable
            size="mini"
            v-model="where.Manufacturing_Ent_Name"
            placeholder="生产企业"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 4 }">
        <el-form-item label="是否主动补货：" label-width="120px">
          <el-select
            size="mini"
            v-model="where.isDeptTwoAuth"
            @change="search()"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 4 }">
        <el-form-item label="是否启用：" label-width="100px">
          <el-select size="mini" v-model="where.type" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 4 }">
        <el-form-item>
          <div class="ele-form-actions">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              class="ele-btn-icon"
              @click="search"
            >
              查询
            </el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="reset"
              >重置</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="openEdit2()"
              >修改上下限</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-download"
              class="ele-btn-icon"
              @click="exportData"
            >
              导出
            </el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    data() {
      // 默认表单数据
      const defaultWhere = {
        Varietie_Code_New: '',
        APPROVAL_NUMBER: '',
        Manufacturing_Ent_Name: '',
        Specification_Or_Type: '',
        CLASS_NUM: '',
        DEVICE_REMARK: '',
        Dept_One_Code: '',
        isDeptTwoAuth: '',
        type: '1',
        settlementDept: ''
      };
      return {
        // 表单数据
        where: { ...defaultWhere }
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
      openEdit2() {
        this.$emit('openEdit2', this.where);
      },
      /*  重置 */
      reset() {
        this.where = { ...this.defaultWhere };
        this.search();
      },
      exportData() {
        this.$emit('exportData', this.where);
      }
    }
  };
</script>
