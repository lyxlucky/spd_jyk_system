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
    <el-form-item
    class="SSRQ-form-item"
    style="width: 240px;"
    >
      <el-date-picker
        class="SSRQ-range"
        v-model="where.SSRQDateRange"
        style="width: 100%;"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-input
        clearable
        v-model="where.condition"
        style="width: 180px"
        placeholder="请输入手术编号或住院号"
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
        <el-option label="全部" value="ALL"></el-option>
        <el-option label="已提交" value="1"></el-option>
        <el-option label="已拣配" value="2"></el-option>
        <el-option label="已交接" value="3"></el-option>
        <el-option label="已完成" value="4"></el-option>
        <el-option label="已交接/已完成" value="-1"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-select
        v-model="where.SSFJ"
        filterable
        remote
        reserve-keyword
        placeholder="请输入术间"
        :remote-method="remoteSearch"
        :loading="loading"
        style="width: 120px"
        size="mini"
        clearable
        @focus="handleFocus"
        ref="ssfjSelect"
      >
        <el-option
          v-for="item in ssfjOptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
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
    <!-- <el-form-item>
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
        </el-form-item> -->

    <el-form-item>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-thumb"
        @click="handleScanQrCode"
        >扫码交接</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="showViewHandoverRecords()"
        >查看交接记录</el-button
      >
    </el-form-item>
    <!-- <el-form-item>
      <el-button
        size="mini"
        type="primary"
        class="ele-btn-icon"
        icon="el-icon-reading"
        @click="catDefNoPkgCode"
      >
        查看定数码标签
      </el-button>
    </el-form-item> -->
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
    <el-dialog
      title="交接记录"
      :visible.sync="isShowViewHandoverRecords"
      width="80%"
      top="5vh"
    >
      <ViewHandoverRecords
        :rowData="rowData"
        :visible="isShowViewHandoverRecords"
      ></ViewHandoverRecords>
    </el-dialog>
  </el-form>
</template>



<script>
  import {
    CreateTemplet,
    UpdateCommon,
    UpdateCommon2
  } from '@/api/KSInventory/ApplyTemp';
  import { getBdszZqsjSsfjList } from '@/api/Task/SurgicalVerification';
  import AdvanceReceiptNumberEdit from './AdvanceReceiptNumberEdit.vue';
  import ViewHandoverRecords from './ViewHandoverRecords.vue';
  import { DATE_SHORTCUTS } from '@/directives/dateShortcuts';

  export default {
    props: {
      // 修改回显的数据
      rowData: Object
    },
    components: {
      AdvanceReceiptNumberEdit,
      ViewHandoverRecords
    },
    data() {
      // 默认表单数据
      const today = new Date();
      const startTime = today.toDateString("yyyy-mm-dd");
      const defaultWhere = {
        SSRQDateRange: startTime,
        // SSRQStartTime: new Date(),
        MZZY: '-1',
        condition: '',
        SSFJ: ''
      };
      return {
        isShowViewHandoverRecords: false,
        // 表单数据
        where: { ...defaultWhere },
        BZ: '',
        TempletName: '',
        loading: false,
        ssfjOptions: [],
        searchTimer: null,
        rules: {
          TempletName: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入模板名称'
            }
          ]
        },
        pickerOptions: {
          shortcuts: DATE_SHORTCUTS
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
      showViewHandoverRecords() {
        this.isShowViewHandoverRecords = true;
      },
      /* 搜索 */
      search() {
        this.$emit('search', this.where);
      },
      // approve() {
      //   this.$emit('approve', this.where);
      // },
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
      },
      // 处理选择框获得焦点事件
      handleFocus() {
        this.remoteSearch('');
      },

      // 远程搜索方法（带节流）
      remoteSearch(query) {
        if (this.searchTimer) {
          clearTimeout(this.searchTimer);
        }
        
        this.loading = true;
        this.searchTimer = setTimeout(() => {
          getBdszZqsjSsfjList({ SSFJ: query })
            .then(res => {
              this.ssfjOptions = res.data || [];
            })
            .catch(err => {
              this.$message.error(err.msg || '获取术间列表失败');
              this.ssfjOptions = [];
            })
            .finally(() => {
              this.loading = false;
            });
        }, 300); // 300ms 的节流时间
      },
    },
    mounted() {
      // 组件挂载后立即获取数据
      this.remoteSearch('');
      this.$bus.$on('AdvanceReceiptNumberTableDialogCurrentSSBHChange', (data) => {
        this.where.condition = data;
      });
    }
  };
</script>

<style lang="scss" scoped>
:deep(.SSRQ-form-item .el-form-item__content) {
  max-width: max-content !important;
}
</style>
