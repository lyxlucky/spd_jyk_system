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
        <el-form-item label="计费时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="执行科室">
          <el-input
            v-model="searchForm.ZX_DEPT"
            placeholder="请输入执行科室"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="收货科室">
          <el-input
            v-model="searchForm.DEPT_TWO_NAME"
            placeholder="请输入收货科室"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="品种名称">
          <el-input
            v-model="searchForm.VARIETIE_NAME"
            placeholder="请输入品种名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="品种编码">
          <el-input
            v-model="searchForm.VARIETIE_CODE_NEW"
            placeholder="请输入品种编码"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="searchForm.SPECIFICATION_OR_TYPE"
            placeholder="请输入规格型号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="计费编码">
          <el-input
            v-model="searchForm.CHARGING_CODE"
            placeholder="请输入计费编码"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input
            v-model="searchForm.SUPPLIER_NAME"
            placeholder="请输入供应商"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            v-model="searchForm.MANUFACTURING_ENT_NAME"
            placeholder="请输入生产企业"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="确认状态">
          <el-select
            v-model="searchForm.USE_APP_STATE"
            placeholder="请选择确认状态"
            clearable
            style="width: 150px"
          >
            <el-option label="未确认" value="0" />
            <el-option label="已确认" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            icon="el-icon-check"
            :disabled="mainTableSelection.length === 0"
            @click="confirmUse"
          >
            确认使用
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 主表（汇总表） -->
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
          :checkbox-config="{ highlight: true }"
          @checkbox-change="onMainTableCheckboxChange"
          @checkbox-all="onMainTableCheckboxAll"
          @current-change="onMainTableCurrentChange"
          @row-click="onMainTableRowClick"
        >
          <vxe-column type="checkbox" width="50" align="center" />
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column field="YEAR" title="年份" width="80" align="center" />
          <vxe-column field="MONTH" title="月份" width="80" align="center" />
          <vxe-column
            field="ZX_DEPT"
            title="执行科室"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="DEPT_TWO_NAME"
            title="收货科室"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="CHARGING_CODE"
            title="计费编码"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="VARIETIE_CODE_NEW"
            title="品种编码"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="VARIETIE_NAME"
            title="品种名称"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="SPECIFICATION_OR_TYPE"
            title="规格型号"
            min-width="120"
            show-overflow
          />
          <vxe-column field="UNIT" title="单位" width="80" align="center" />
          <vxe-column
            field="GOODS_QTY"
            title="数量"
            width="100"
            align="right"
          />
          <vxe-column
            field="SUPPLY_PRICE"
            title="单价"
            width="100"
            align="right"
            :formatter="formatPrice"
          />
          <vxe-column
            field="SUM_PRICE"
            title="金额"
            width="120"
            align="right"
            :formatter="formatPrice"
          />
          <vxe-column
            field="SUPPLIER_NAME"
            title="供应商"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="MANUFACTURING_ENT_NAME"
            title="生产企业"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="APPROVAL_NUMBER"
            title="注册证号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="SPD_COST_DEPT_NAME"
            title="成本科室"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="USE_APP_STATE"
            title="确认状态"
            width="100"
            align="center"
            :formatter="formatUseAppState"
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

      <!-- 明细表 -->
      <div style="margin-top: 30px">
        <vxe-table
          ref="detailTable"
          :data="detailTableData"
          :loading="detailTableLoading"
          border
          stripe
          size="mini"
          height="400"
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="DEF_NO_PKG_CODE"
            title="定数码"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="OPERATE_PERSON"
            title="操作人"
            width="100"
            align="center"
          />
          <vxe-column
            field="ACCOUNT"
            title="账号"
            width="120"
            show-overflow
          />
          <vxe-column field="BATCH" title="批次" width="120" show-overflow />
          <vxe-column
            field="BATCH_VALIDITY_PERIOD"
            title="有效期"
            width="120"
            align="center"
            :formatter="formatDate"
          />
          <vxe-column
            field="MJXQ"
            title="灭菌效期"
            width="120"
            align="center"
          />
          <vxe-column
            field="DISINFECTION_VALID_DATE"
            title="消毒有效期"
            width="120"
            align="center"
          />
          <vxe-column
            field="PATIENT_NAME"
            title="患者姓名"
            width="100"
            align="center"
          />
          <vxe-column
            field="PATIENT_DEPT"
            title="患者科室"
            width="120"
            show-overflow
          />
          <vxe-column
            field="HOSPITALIZATION_NUMBER"
            title="住院号"
            width="120"
            show-overflow
          />
          <vxe-column field="SSBH" title="手术编号" width="100" align="center" />
          <vxe-column
            field="ZDMC"
            title="主刀名称"
            width="100"
            align="center"
          />
          <vxe-column
            field="IS_GT"
            title="是否高值"
            width="100"
            align="center"
            :formatter="formatIsGt"
          />
          <vxe-column
            field="ZD_DEPT"
            title="主刀科室"
            width="120"
            show-overflow
          />
          <vxe-column
            field="SS_PLAN_DATE"
            title="手术计划日期"
            width="120"
            align="center"
            :formatter="formatDate"
          />
          <vxe-column
            field="IS_INTERVENED"
            title="是否介入"
            width="100"
            align="center"
          />
          <vxe-column
            field="OPEARTION_CHARGING_TIME"
            title="计费时间"
            width="150"
            align="center"
            :formatter="formatDate"
          />
        </vxe-table>
        <!-- 明细表分页 -->
        <vxe-pager
          :current-page="detailTablePage.page"
          :page-size="detailTablePage.size"
          :total="detailTablePage.total"
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
          @page-change="onDetailTablePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { TOKEN_STORE_NAME } from '@/config/setting';
import {
  getSzseSpUseHzInfo,
  getSzseSpUseDelInfo,
  appSzseUseInfo
} from '@/api/Settle/DepartmentConsumptionConfirmation';

export default {
  name: 'DepartmentConsumptionConfirmation',
  data() {
    return {
      // 搜索表单
      searchForm: {
        OPEARTION_CHARGING_TIME_START: '',
        OPEARTION_CHARGING_TIME_END: '',
        ZX_DEPT: '',
        DEPT_TWO_NAME: '',
        SPECIFICATION_OR_TYPE: '',
        VARIETIE_NAME: '',
        VARIETIE_CODE_NEW: '',
        CHARGING_CODE: '',
        SUPPLIER_NAME: '',
        MANUFACTURING_ENT_NAME: '',
        USE_APP_STATE: '',
        ID: ''
      },
      dateRange: [], // 日期范围
      // 主表数据
      mainTableData: [],
      mainTableLoading: false,
      mainTablePage: {
        page: 1,
        size: 20,
        total: 0
      },
      mainTableSelection: [], // 主表选中数据
      currentMainRow: null, // 当前选中的主表行
      // 明细表数据
      detailTableData: [],
      detailTableLoading: false,
      detailTablePage: {
        page: 1,
        size: 20,
        total: 0
      }
    };
  },
  methods: {
    // 搜索
    search() {
      // 处理日期范围
      if (this.dateRange && this.dateRange.length === 2) {
        this.searchForm.OPEARTION_CHARGING_TIME_START = this.dateRange[0];
        this.searchForm.OPEARTION_CHARGING_TIME_END = this.dateRange[1];
      } else {
        this.searchForm.OPEARTION_CHARGING_TIME_START = '';
        this.searchForm.OPEARTION_CHARGING_TIME_END = '';
      }
      this.mainTablePage.page = 1;
      this.loadMainTableData();
    },
    // 重置
    reset() {
      this.searchForm = {
        OPEARTION_CHARGING_TIME_START: '',
        OPEARTION_CHARGING_TIME_END: '',
        ZX_DEPT: '',
        DEPT_TWO_NAME: '',
        SPECIFICATION_OR_TYPE: '',
        VARIETIE_NAME: '',
        VARIETIE_CODE_NEW: '',
        CHARGING_CODE: '',
        SUPPLIER_NAME: '',
        MANUFACTURING_ENT_NAME: '',
        USE_APP_STATE: '',
        ID: ''
      };
      this.dateRange = [];
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
        const res = await getSzseSpUseHzInfo(params);
        if (res.code === 200) {
          this.mainTableData = res.result || [];
          this.mainTablePage.total = res.total || 0;
        } else {
          this.$message.error(res.msg || '加载数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载数据失败');
      } finally {
        this.mainTableLoading = false;
      }
    },
    // 加载明细表数据
    async loadDetailTableData() {
      if (!this.currentMainRow || !this.currentMainRow.ID) {
        this.detailTableData = [];
        this.detailTablePage.total = 0;
        return;
      }
      this.detailTableLoading = true;
      try {
        const params = {
          ...this.searchForm,
          ID: this.currentMainRow.ID,
          page: this.detailTablePage.page,
          size: this.detailTablePage.size
        };
        const res = await getSzseSpUseDelInfo(params);
        if (res.code === 200) {
          this.detailTableData = res.result || [];
          this.detailTablePage.total = res.total || 0;
        } else {
          this.$message.error(res.msg || '加载明细数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载明细数据失败');
      } finally {
        this.detailTableLoading = false;
      }
    },
    // 主表分页变化
    onMainTablePageChange({ currentPage, pageSize }) {
      this.mainTablePage.page = currentPage;
      this.mainTablePage.size = pageSize;
      this.loadMainTableData();
    },
    // 明细表分页变化
    onDetailTablePageChange({ currentPage, pageSize }) {
      this.detailTablePage.page = currentPage;
      this.detailTablePage.size = pageSize;
      this.loadDetailTableData();
    },
    // 主表复选框变化
    onMainTableCheckboxChange({ records }) {
      this.mainTableSelection = records;
    },
    // 主表全选变化
    onMainTableCheckboxAll({ records }) {
      this.mainTableSelection = records;
    },
    // 主表当前行变化
    onMainTableCurrentChange({ row }) {
      this.currentMainRow = row;
      this.detailTablePage.page = 1;
      this.loadDetailTableData();
    },
    // 主表行点击
    onMainTableRowClick({ row }) {
      if (!row) return;
      // 设置当前行
      this.currentMainRow = row;
      this.detailTablePage.page = 1;
      // 设置当前行为选中状态（触发高亮）
      this.$nextTick(() => {
        if (this.$refs.mainTable) {
          this.$refs.mainTable.setCurrentRow(row);
        }
      });
      // 加载明细表数据
      this.loadDetailTableData();
    },
    // 确认使用
    async confirmUse() {
      if (this.mainTableSelection.length === 0) {
        this.$message.warning('请选择要确认的数据');
        return;
      }
      this.$confirm('确定要确认使用选中的数据吗？', '提示', {
        type: 'warning'
      })
        .then(async () => {
          const loading = this.$messageLoading('处理中...');
          try {
            // 构建请求数据
            const SzseSpUseHzInfoList = this.mainTableSelection.map((item) => {
              return {
                ...item,
                Token: sessionStorage.getItem(TOKEN_STORE_NAME) || '',
                state: '1', // 确认状态
                mark: '' // 备注
              };
            });
            const res = await appSzseUseInfo({
              SzseSpUseHzInfoList: SzseSpUseHzInfoList,
              state: '1',
              mark: ''
            });
            loading.close();
            if (res.code === 200) {
              this.$message.success(res.msg || '确认成功');
              this.mainTableSelection = [];
              this.loadMainTableData();
              // 如果当前行被确认，重新加载明细
              if (this.currentMainRow) {
                this.loadDetailTableData();
              }
            } else {
              this.$message.error(res.msg || '确认失败');
            }
          } catch (error) {
            loading.close();
            this.$message.error(error.message || '确认失败');
          }
        })
        .catch(() => {});
    },
    // 格式化价格
    formatPrice({ cellValue }) {
      if (cellValue == null || cellValue === '') {
        return '';
      }
      return Number(cellValue).toFixed(2);
    },
    // 格式化日期
    formatDate({ cellValue }) {
      if (!cellValue) {
        return '';
      }
      if (typeof cellValue === 'string') {
        return cellValue;
      }
      const date = new Date(cellValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    // 格式化确认状态
    formatUseAppState({ cellValue }) {
      if (cellValue === '0' || cellValue === 0) {
        return '未确认';
      } else if (cellValue === '1' || cellValue === 1) {
        return '已确认';
      }
      return cellValue || '';
    },
    // 格式化是否高值
    formatIsGt({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) {
        return '是';
      } else if (cellValue === '0' || cellValue === 0) {
        return '否';
      }
      return cellValue || '';
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
