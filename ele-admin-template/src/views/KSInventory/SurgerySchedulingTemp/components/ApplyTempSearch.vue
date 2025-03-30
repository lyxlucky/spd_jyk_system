<!-- 搜索表单 -->
<template>
  <el-form
    label-width="0px"
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 16, md: 12 } : { span: 16 }">
        <el-input
          size="mini"
          clearable
          v-model="TempletName"
          placeholder="手术模板名称/编码"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 8 }">
        <div class="ele-form-actions">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            class="ele-btn-icon"
            @click="Temp_FoundPlanSingle()"
          >
            确认创建
          </el-button>
        </div>
      </el-col>
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
    </el-row>
    <el-row :gutter="5">
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
        <el-input
          size="mini"
          clearable
          v-model="where.TEMPLATE_NAME"
          placeholder="请输入模板名称/类别"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
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
        </div>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="2">
      <el-col v-bind="styleResponsive ? { lg: 24, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            class="ele-btn-icon"
            @click="UpdateCommon_btn"
            >设置常规模板</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-close"
            class="ele-btn-icon"
            @click="UpdateCommon2_btn"
            >取消常规模板</el-button
          >
        </div>
      </el-col>
    </el-row> -->
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
</template>

<script>
  import {
    CreateTemplet,
    UpdateCommon,
    UpdateCommon2
  } from '@/api/KSInventory/ApplyTemp';
  import {
    AddNaxtDayApplyPlanTemp,
  } from '@/api/KSInventory/SurgerySchedulingTemp';
  export default {
    props: {
      // 修改回显的数据
      rowData: Object
    },
    data() {
      // 默认表单数据
      const defaultWhere = {
        TEMPLATE_NAME: ''
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
        this.where = { ...this.defaultWhere };
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
          TEMPLATE_NAME: this.TempletName,
          CREATOR: this.$store.state.user.info.UserName
        };
        AddNaxtDayApplyPlanTemp(data)
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
