<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="searchForm"
        :inline="true"
        class="ele-form-search"
        size="mini"
        @keyup.enter.native="search"
      >
        <el-form-item label="手术地点">
          <el-select
            v-model="searchForm.SURGERY_LOCATION"
            placeholder="请选择手术地点"
            clearable
            filterable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in surgeryLocationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请科室">
          <el-select
            v-model="searchForm.APPLY_DEPT"
            placeholder="请选择申请科室"
            clearable
            filterable
            style="width: 200px"
          >
            <el-option
              v-for="item in deptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手术单状态">
          <el-select
            v-model="searchForm.SURGERY_STATUS"
            placeholder="请选择手术单状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已暂停" value="已暂停" />
            <el-option label="已作废" value="已作废" />
          </el-select>
        </el-form-item>
        <el-form-item label="消耗状态">
          <el-select
            v-model="searchForm.CONSUME_STATUS"
            placeholder="请选择消耗状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="消耗未确认" value="消耗未确认" />
            <el-option label="消耗已确认" value="消耗已确认" />
          </el-select>
        </el-form-item>
        <el-form-item label="提交HIS状态">
          <el-select
            v-model="searchForm.SUBMIT_HIS_STATUS"
            placeholder="请选择提交HIS状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="未提交" value="未提交" />
            <el-option label="已提交" value="已提交" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否上传消耗单">
          <el-select
            v-model="searchForm.IS_UPLOAD_CONSUME"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="手术单号">
          <el-input
            v-model="searchForm.SURGERY_NO"
            placeholder="请输入手术单号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input
            v-model="searchForm.PATIENT_NAME"
            placeholder="请输入患者姓名"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="患者住院号码">
          <el-input
            v-model="searchForm.HOSPITALIZATION_NUMBER"
            placeholder="请输入患者住院号码"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="手术计划">
          <el-date-picker
            v-model="surgeryPlanDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="手术时间">
          <el-date-picker
            v-model="surgeryTimeDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="是否上传植入物单">
          <el-select
            v-model="searchForm.IS_UPLOAD_IMPLANT"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="病人科室">
          <el-input
            v-model="searchForm.PATIENT_DEPT"
            placeholder="请输入病人科室"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            v-model="searchForm.CREATOR"
            placeholder="请输入创建人"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="院内寄售耗材">
          <el-select
            v-model="searchForm.IS_HOSPITAL_CONSIGNMENT"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="跟台耗材">
          <el-select
            v-model="searchForm.IS_FOLLOW_STAGE"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 主表（手术单列表） -->
      <div style="margin-top: 15px">
        <vxe-table
          ref="mainTable"
          :data="mainTableData"
          :loading="mainTableLoading"
          border
          stripe
          size="mini"
          height="400"
          highlight-current-row
          resizable
          @current-change="onMainTableCurrentChange"
          @row-click="onMainTableRowClick"
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="SURGERY_NO"
            title="手术单号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="HOSPITALIZATION_NUMBER"
            title="住院号"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="PATIENT_NAME"
            title="患者姓名"
            width="120"
            align="center"
          />
          <vxe-column field="GENDER" title="性别" width="80" align="center" />
          <vxe-column field="AGE" title="年龄" width="100" align="center" />
          <vxe-column
            field="DIAGNOSIS"
            title="诊断结果"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="SURGERY_LOCATION"
            title="手术地点"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="SURGERY_NAME"
            title="手术名称"
            min-width="200"
            show-overflow
          />
          <vxe-column
            field="SURGERY_STATUS"
            title="手术状态"
            width="120"
            align="center"
          />
          <vxe-column
            field="CHIEF_SURGEON"
            title="主刀医生"
            width="120"
            align="center"
          />
          <vxe-column
            field="SMART_CABINET"
            title="智能柜"
            width="120"
            align="center"
          />
          <vxe-column
            field="APPLY_DEPT"
            title="申请科室"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="ACTUAL_SURGERY_DATE"
            title="实际手术日期"
            width="180"
            align="center"
            :formatter="formatDateTime"
          />
          <vxe-column
            field="CHARGE_AMOUNT"
            title="收费金额"
            width="120"
            align="right"
            :formatter="formatPrice"
          />
          <vxe-column
            field="CONSUME_STATUS"
            title="消耗状态"
            width="120"
            align="center"
          />
          <vxe-column
            field="CHARGE_STATUS"
            title="收费状态"
            width="120"
            align="center"
          />
        </vxe-table>
        <!-- 主表分页 -->
        <vxe-pager
          :current-page="mainTablePage.page"
          :page-size="mainTablePage.size"
          :total="mainTablePage.total"
          :page-sizes="[10, 20, 50, 100]"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
          @page-change="onMainTablePageChange"
        />
      </div>

      <!-- 明细表1：已登记手术消耗品种 -->
      <div style="margin-top: 30px">
        <div style="margin-bottom: 10px; font-weight: bold; font-size: 14px">
          >>已登记手术消耗品种
        </div>
        <vxe-table
          ref="registeredTable"
          :data="registeredTableData"
          :loading="registeredTableLoading"
          border
          stripe
          size="mini"
          height="300"
          resizable
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="ZX_DEPT"
            title="执行科室"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="LABEL_BARCODE"
            title="标签条码"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="IS_IMPLANT"
            title="植入类耗材"
            width="120"
            align="center"
          />
          <vxe-column
            field="VARIETIE_NAME"
            title="品种名称"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="HOSPITAL_VARIETIE_NAME"
            title="医院品种名称"
            min-width="200"
            show-overflow
          />
          <vxe-column
            field="SPECIFICATION_OR_TYPE"
            title="规格型号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="REGISTRATION_TIME"
            title="登记时间"
            width="180"
            align="center"
            :formatter="formatDateTime"
          />
          <vxe-column
            field="VARIETIE_CODE_NEW"
            title="品种编码"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="MANUFACTURER"
            title="厂家"
            min-width="150"
            show-overflow
          />
        </vxe-table>
        <!-- 明细表1分页 -->
        <vxe-pager
          :current-page="registeredTablePage.page"
          :page-size="registeredTablePage.size"
          :total="registeredTablePage.total"
          :page-sizes="[10, 20, 50, 100]"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
          @page-change="onRegisteredTablePageChange"
        />
      </div>

      <!-- 明细表2：领用未登记耗材 -->
      <div style="margin-top: 30px">
        <div style="margin-bottom: 10px; font-weight: bold; font-size: 14px">
          >>领用未登记耗材
        </div>
        <!-- 筛选条件 -->
        <el-form
          :inline="true"
          size="mini"
          style="margin-bottom: 10px"
        >
          <el-form-item label="筛选条件">
            <el-select
              v-model="unregisteredFilter.FILTER_TYPE"
              placeholder="请选择"
              clearable
              style="width: 200px"
              @change="onUnregisteredFilterChange"
            >
              <el-option label="全部" value="" />
              <el-option label="院内、寄售耗材" value="0" />
              <el-option label="跟台耗材" value="1" />
            </el-select>
          </el-form-item>
        </el-form>
        <vxe-table
          ref="unregisteredTable"
          :data="unregisteredTableData"
          :loading="unregisteredTableLoading"
          border
          stripe
          size="mini"
          height="300"
          resizable
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="SOURCE"
            title="来源"
            width="120"
            align="center"
          />
          <vxe-column
            field="LABEL_BARCODE"
            title="标签条码"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="VARIETIE_NAME"
            title="品种名称"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="GENERIC_NAME"
            title="通用名"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="SPECIFICATION_OR_TYPE"
            title="规格型号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="COLLECTION_DATE"
            title="领用日期"
            width="120"
            align="center"
            :formatter="formatDate"
          />
          <vxe-column
            field="QUANTITY"
            title="数量"
            width="100"
            align="right"
          />
          <vxe-column field="UNIT" title="单位" width="80" align="center" />
          <vxe-column
            field="UNIT_PRICE_WITH_TAX"
            title="含税单价"
            width="120"
            align="right"
            :formatter="formatPrice"
          />
          <vxe-column
            field="AMOUNT_WITH_TAX"
            title="含税金额"
            width="120"
            align="right"
            :formatter="formatPrice"
          />
          <vxe-column
            field="DEPT"
            title="科室"
            min-width="120"
            show-overflow
          />
        </vxe-table>
        <!-- 明细表2分页 -->
        <vxe-pager
          :current-page="unregisteredTablePage.page"
          :page-size="unregisteredTablePage.size"
          :total="unregisteredTablePage.total"
          :page-sizes="[10, 20, 50, 100]"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
          @page-change="onUnregisteredTablePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getSurgeryOrderHzInfo,
  getRegisteredConsumablesInfo,
  getUnregisteredConsumablesInfo
} from '@/api/Settle/SurgeryOrderManagement';

export default {
  name: 'SurgeryOrderManagement',
  data() {
    return {
      // 搜索表单
      searchForm: {
        SURGERY_LOCATION: '',
        APPLY_DEPT: '',
        SURGERY_STATUS: '',
        CONSUME_STATUS: '',
        SUBMIT_HIS_STATUS: '',
        IS_UPLOAD_CONSUME: '',
        SURGERY_NO: '',
        PATIENT_NAME: '',
        HOSPITALIZATION_NUMBER: '',
        SURGERY_PLAN_START: '',
        SURGERY_PLAN_END: '',
        SURGERY_TIME_START: '',
        SURGERY_TIME_END: '',
        IS_UPLOAD_IMPLANT: '',
        PATIENT_DEPT: '',
        CREATOR: '',
        IS_HOSPITAL_CONSIGNMENT: '',
        IS_FOLLOW_STAGE: '',
        ID: ''
      },
      // 日期范围
      surgeryPlanDateRange: [],
      surgeryTimeDateRange: [],
      // 选项数据
      surgeryLocationOptions: [],
      deptOptions: [],
      // 主表数据
      mainTableData: [],
      mainTableLoading: false,
      mainTablePage: {
        page: 1,
        size: 20,
        total: 0
      },
      currentMainRow: null, // 当前选中的主表行
      // 明细表1：已登记手术消耗品种
      registeredTableData: [],
      registeredTableLoading: false,
      registeredTablePage: {
        page: 1,
        size: 20,
        total: 0
      },
      // 明细表2：领用未登记耗材
      unregisteredTableData: [],
      unregisteredTableLoading: false,
      unregisteredTablePage: {
        page: 1,
        size: 20,
        total: 0
      },
      // 明细表2筛选条件
      unregisteredFilter: {
        FILTER_TYPE: ''
      }
    };
  },
  methods: {
    // 搜索
    search() {
      // 处理手术计划日期范围
      if (
        this.surgeryPlanDateRange &&
        this.surgeryPlanDateRange.length === 2
      ) {
        this.searchForm.SURGERY_PLAN_START = this.surgeryPlanDateRange[0];
        this.searchForm.SURGERY_PLAN_END = this.surgeryPlanDateRange[1];
      } else {
        this.searchForm.SURGERY_PLAN_START = '';
        this.searchForm.SURGERY_PLAN_END = '';
      }
      // 处理手术时间日期范围
      if (
        this.surgeryTimeDateRange &&
        this.surgeryTimeDateRange.length === 2
      ) {
        this.searchForm.SURGERY_TIME_START = this.surgeryTimeDateRange[0];
        this.searchForm.SURGERY_TIME_END = this.surgeryTimeDateRange[1];
      } else {
        this.searchForm.SURGERY_TIME_START = '';
        this.searchForm.SURGERY_TIME_END = '';
      }
      this.mainTablePage.page = 1;
      this.loadMainTableData();
    },
    // 重置
    reset() {
      this.searchForm = {
        SURGERY_LOCATION: '',
        APPLY_DEPT: '',
        SURGERY_STATUS: '',
        CONSUME_STATUS: '',
        SUBMIT_HIS_STATUS: '',
        IS_UPLOAD_CONSUME: '',
        SURGERY_NO: '',
        PATIENT_NAME: '',
        HOSPITALIZATION_NUMBER: '',
        SURGERY_PLAN_START: '',
        SURGERY_PLAN_END: '',
        SURGERY_TIME_START: '',
        SURGERY_TIME_END: '',
        IS_UPLOAD_IMPLANT: '',
        PATIENT_DEPT: '',
        CREATOR: '',
        IS_HOSPITAL_CONSIGNMENT: '',
        IS_FOLLOW_STAGE: '',
        ID: ''
      };
      this.surgeryPlanDateRange = [];
      this.surgeryTimeDateRange = [];
      this.mainTablePage.page = 1;
      this.loadMainTableData();
    },
    // 加载主表数据
    async loadMainTableData() {
      this.mainTableLoading = true;
      try {
        const params = {
          ...this.searchForm,
          page: this.mainTablePage.page,
          size: this.mainTablePage.size
        };
        const res = await getSurgeryOrderHzInfo(params);
        if (res.code === 200) {
          this.mainTableData = res.result || [];
          this.mainTablePage.total = res.total || 0;
          // 查询成功后，清空下面两个表格的内容
          this.currentMainRow = null;
          this.registeredTableData = [];
          this.registeredTablePage.total = 0;
          this.registeredTablePage.page = 1;
          this.unregisteredTableData = [];
          this.unregisteredTablePage.total = 0;
          this.unregisteredTablePage.page = 1;
          // 重置筛选条件
          this.unregisteredFilter = {
            FILTER_TYPE: ''
          };
        } else {
          this.$message.error(res.msg || '加载数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载数据失败');
      } finally {
        this.mainTableLoading = false;
      }
    },
    // 加载已登记手术消耗品种数据
    async loadRegisteredTableData() {
      if (!this.currentMainRow || !this.currentMainRow.SURGERY_NO) {
        this.registeredTableData = [];
        this.registeredTablePage.total = 0;
        return;
      }
      this.registeredTableLoading = true;
      try {
        const params = {
          SURGERY_NO: this.currentMainRow.SURGERY_NO,
          ID: this.currentMainRow.ID,
          page: this.registeredTablePage.page,
          size: this.registeredTablePage.size
        };
        const res = await getRegisteredConsumablesInfo(params);
        if (res.code === 200) {
          this.registeredTableData = res.result || [];
          this.registeredTablePage.total = res.total || 0;
        } else {
          this.$message.error(res.msg || '加载已登记耗材数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载已登记耗材数据失败');
      } finally {
        this.registeredTableLoading = false;
      }
    },
    // 加载领用未登记耗材数据
    async loadUnregisteredTableData() {
      if (!this.currentMainRow || !this.currentMainRow.SURGERY_NO) {
        this.unregisteredTableData = [];
        this.unregisteredTablePage.total = 0;
        return;
      }
      this.unregisteredTableLoading = true;
      try {
        const params = {
          SURGERY_NO: this.currentMainRow.SURGERY_NO,
          ID: this.currentMainRow.ID,
          FILTER_TYPE: this.unregisteredFilter.FILTER_TYPE || '',
          page: this.unregisteredTablePage.page,
          size: this.unregisteredTablePage.size
        };
        const res = await getUnregisteredConsumablesInfo(params);
        if (res.code === 200) {
          this.unregisteredTableData = res.result || [];
          this.unregisteredTablePage.total = res.total || 0;
        } else {
          this.$message.error(res.msg || '加载未登记耗材数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载未登记耗材数据失败');
      } finally {
        this.unregisteredTableLoading = false;
      }
    },
    // 明细表2筛选条件变化
    onUnregisteredFilterChange() {
      this.unregisteredTablePage.page = 1;
      this.loadUnregisteredTableData();
    },
    // 主表分页变化
    onMainTablePageChange({ currentPage, pageSize }) {
      this.mainTablePage.page = currentPage;
      this.mainTablePage.size = pageSize;
      this.loadMainTableData();
    },
    // 已登记表分页变化
    onRegisteredTablePageChange({ currentPage, pageSize }) {
      this.registeredTablePage.page = currentPage;
      this.registeredTablePage.size = pageSize;
      this.loadRegisteredTableData();
    },
    // 未登记表分页变化
    onUnregisteredTablePageChange({ currentPage, pageSize }) {
      this.unregisteredTablePage.page = currentPage;
      this.unregisteredTablePage.size = pageSize;
      this.loadUnregisteredTableData();
    },
    // 主表当前行变化
    onMainTableCurrentChange({ row }) {
      this.currentMainRow = row;
      this.registeredTablePage.page = 1;
      this.unregisteredTablePage.page = 1;
      // 重置筛选条件
      this.unregisteredFilter = {
        FILTER_TYPE: ''
      };
      this.loadRegisteredTableData();
      this.loadUnregisteredTableData();
    },
    // 主表行点击
    onMainTableRowClick({ row }) {
      if (!row) return;
      // 设置当前行
      this.currentMainRow = row;
      this.registeredTablePage.page = 1;
      this.unregisteredTablePage.page = 1;
      // 重置筛选条件
      this.unregisteredFilter = {
        FILTER_TYPE: ''
      };
      // 设置当前行为选中状态（触发高亮）
      this.$nextTick(() => {
        if (this.$refs.mainTable) {
          this.$refs.mainTable.setCurrentRow(row);
        }
      });
      // 加载明细表数据
      this.loadRegisteredTableData();
      this.loadUnregisteredTableData();
    },
    // 格式化价格
    formatPrice({ cellValue }) {
      if (cellValue == null || cellValue === '') {
        return '';
      }
      return Number(cellValue).toFixed(2);
    },
    // 格式化日期（YYYY-MM-DD）
    formatDate({ cellValue }) {
      if (!cellValue) {
        return '';
      }
      try {
        return this.$moment(cellValue).format('YYYY-MM-DD');
      } catch (error) {
        return cellValue || '';
      }
    },
    // 格式化日期时间（YYYY-MM-DD HH:mm:ss）
    formatDateTime({ cellValue }) {
      if (!cellValue) {
        return '';
      }
      try {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
      } catch (error) {
        return cellValue || '';
      }
    }
  },
  created() {
    this.loadMainTableData();
  }
};
</script>

<style scoped>
.ele-form-search {
  margin-bottom: 15px;
}
</style>

