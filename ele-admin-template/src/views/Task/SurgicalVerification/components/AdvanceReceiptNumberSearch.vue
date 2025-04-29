<!-- 搜索表单 -->
<template>
  <el-form
    label-width="0px"
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
    size="mini"
    :inline="true"
  >
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.condition"
        style="width: 180px"
        placeholder="请输入手术编号或住院号"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.SSFJ"
        style="width: 120px"
        placeholder="请输入术间"
      />
    </el-form-item>
    <el-form-item>
      <el-select
        @change="search"
        v-model="where.MZZY"
        size="mini"
        placeholder=""
        style="width: 100px"
      >
        <el-option label="全部" value="-1"></el-option>
        <el-option label="已提交" value="1"></el-option>
        <el-option label="已拣配" value="2"></el-option>
        <el-option label="已交接" value="3"></el-option>
        <el-option label="已完成" value="4"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-search"
        class="ele-btn-icon"
        @click="search"
      >
        查询
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-check"
        class="ele-btn-icon"
        @click="approve"
      >
        护士审批
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        class="ele-btn-icon"
        icon="el-icon-reading"
        @click="catDefNoPkgCode"
      >
        查看定数码标签
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-thumb"
        @click="handleScanQrCode"
        >扫码交接</el-button
      >
    </el-form-item>

    <!-- <el-row :gutter="5" style="margin-top: 5px">
      <el-col v-bind="styleResponsive ? { lg: 14, md: 12 } : { span: 12 }">
        <el-input
          size="mini"
          clearable
          v-model="where.condition"
          placeholder="请输入手术编号或住院号"
        />
      </el-col>
    </el-row> -->
    <!-- <el-row :gutter="5">
      <el-col v-bind="styleResponsive ? { lg: 24, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" class="ele-btn-icon" @click="platformConsumeEditShow">编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
          >
            查询
          </el-button>

          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            class="ele-btn-icon"
            @click="approve"
          >
            护士审批
          </el-button>

          <el-button
            size="mini"
            type="primary"
            class="ele-btn-icon"
            icon="el-icon-reading"
            @click="catDefNoPkgCode"
          >
            查看定数码标签
          </el-button>

          <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 16 }">
            <el-select
              @change="search"
              v-model="where.MZZY"
              size="mini"
              placeholder=""
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="已提交" value="1"></el-option>
              <el-option label="已拣配" value="2"></el-option>
              <el-option label="已交接" value="3"></el-option>
              <el-option label="已完成" value="4"></el-option>
            </el-select>
          </el-col>
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
        MZZY: '3',
        condition: '',
        SSFJ: ''
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
      approve() {
        this.$emit('approve', this.where);
      },
      catDefNoPkgCode() {
        this.$emit('catDefNoPkgCode', this.where);
      },
      handleScanQrCode() {
        this.$emit('handleScanQrCode', this.where);
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
