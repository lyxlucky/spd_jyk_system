<template>
  <div class="dept-instock-search">
    <el-form class="ele-form-search" @submit.native.prevent>
      <!-- 主筛选：与老系统 DepaStorageQuery.cshtml:55-75 逐项对齐 -->
      <el-row :gutter="8">
        <el-col v-bind="responsiveCol">
          <el-input
            v-model="where.name"
            size="mini"
            clearable
            placeholder="请输入规格型号/品种编码/品种全称"
          />
        </el-col>
        <el-col v-bind="responsiveCol">
          <el-input
            v-model="where.packagerSpec"
            size="mini"
            clearable
            placeholder="请输入规格型号"
          />
        </el-col>
        <el-col v-bind="responsiveCol">
          <el-input
            v-model="where.batch"
            size="mini"
            clearable
            placeholder="请输入生产批号"
          />
        </el-col>
        <el-col v-bind="responsiveCol">
          <el-input
            v-model="where.type"
            size="mini"
            clearable
            placeholder="请输入入库类型"
          />
        </el-col>
        <el-col v-bind="responsiveCol">
          <el-input
            v-model="where.code"
            size="mini"
            clearable
            placeholder="请输入库单号"
          />
        </el-col>
        <el-col v-bind="responsiveCol">
          <el-input
            v-model="where.factory"
            size="mini"
            clearable
            placeholder="生产企业"
          />
        </el-col>
      </el-row>

      <el-row :gutter="8" class="search-actions-row">
        <el-col v-bind="responsiveDateCol">
          <span class="date-label">入库时间：</span>
          <el-date-picker
            v-model="where.timeStart"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            style="width: 140px"
          />
          <span class="date-label date-label-to">至</span>
          <el-date-picker
            v-model="where.timeEnd"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            style="width: 140px"
          />
        </el-col>
        <el-col :span="24" class="search-buttons">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="onSearch">
            查询
          </el-button>
          <el-button type="success" icon="el-icon-download" size="mini" @click="onExport('legacy')">
            导出Excel
          </el-button>
          <el-button type="success" icon="el-icon-download" size="mini" plain @click="onExport('current')">
            导出Excel(新)
          </el-button>
          <el-button icon="el-icon-mobile-phone" size="mini" @click="$emit('scan')">
            扫单入库
          </el-button>
          <el-button icon="el-icon-data-analysis" size="mini" @click="$emit('summary', currentWhere())">
            查看汇总
          </el-button>
          <el-button type="text" size="mini" @click="showAdvanced = !showAdvanced">
            {{ showAdvanced ? '收起高级筛选' : '展开高级筛选' }}
            <i :class="showAdvanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
          </el-button>
          <el-button type="text" size="mini" @click="onReset">重置</el-button>
        </el-col>
      </el-row>

      <!-- 高级筛选：老系统 #ShowOut 默认隐藏且切换按钮失效，这里修好 -->
      <el-row v-show="showAdvanced" :gutter="8" class="advanced-row">
        <el-col v-for="item in advancedOptions" :key="item.key" v-bind="responsiveAdvCol">
          <div class="advanced-item">
            <span class="advanced-label">{{ item.label }}</span>
            <el-select v-model="where[item.key]" size="mini" style="width: 100%">
              <el-option
                v-for="opt in item.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import moment from 'moment';
  import { ADVANCED_FILTERS } from '@/api/KSInventory/DeptInStockQuery/index';

  const OPTIONS_YES_NO = [
    { value: '-1', label: '全部' },
    { value: '0', label: '否' },
    { value: '1', label: '是' }
  ];

  /** 与老页面 DepaStorageQuery.cshtml:103-187 的 12 个 select 逐项一致 */
  const ADVANCED_OPTIONS = [
    { key: 'IS_CHARGE', label: '是否收费', options: OPTIONS_YES_NO },
    {
      key: 'HIGH_OR_LOW_CLASS',
      label: '高低值分类',
      options: [
        { value: '-1', label: '全部' },
        { value: '0', label: '低值' },
        { value: '1', label: '高值' },
        { value: '5', label: '危化品' }
      ]
    },
    {
      key: 'IS_BIDDING',
      label: '是否中标',
      options: [
        { value: '-1', label: '全部' },
        { value: '0', label: '不中标' },
        { value: '1', label: '中标' }
      ]
    },
    {
      key: 'SPECIAL_PURCHASE',
      label: '专购',
      options: [
        { value: '-1', label: '全部' },
        { value: '0', label: '非专购' },
        { value: '1', label: '专购' }
      ]
    },
    { key: 'ONEOFF_STERILIZATION_PACKAGING', label: '一次性灭菌包装', options: OPTIONS_YES_NO },
    {
      key: 'STORAGE_TYPE',
      label: '存储条件',
      options: [
        { value: '-1', label: '全部' },
        { value: '0', label: '常温' },
        { value: '1', label: '阴凉' },
        { value: '2', label: '冷藏(2~8°C)' },
        { value: '3', label: '冷冻' }
      ]
    },
    {
      key: 'IS_EMBEDDED',
      label: '是否植入',
      options: [
        { value: '-1', label: '全部' },
        { value: '0', label: '不植入' },
        { value: '1', label: '植入' }
      ]
    },
    { key: 'IS_SERIAL_NUMBER', label: '是否sn码', options: OPTIONS_YES_NO },
    { key: 'IS_PROTECT', label: '是否防护物质', options: OPTIONS_YES_NO },
    {
      key: 'IS_INTERVENED',
      label: '是否介入',
      options: [
        { value: '-1', label: '全部' },
        { value: '0', label: '不介入' },
        { value: '1', label: '介入' }
      ]
    },
    {
      key: 'HIGH_OR_LOW_CLASS_TWO',
      label: '高低值分类下级分类',
      options: [
        { value: '-1', label: '全部' },
        { value: '1', label: '重点治理' },
        { value: '2', label: '非重点治理' }
      ]
    },
    { key: 'IS_EQUIPMENT_CHANGE', label: '设备科是否修改', options: OPTIONS_YES_NO }
  ];

  function defaultWhere() {
    const where = {
      name: '',
      packagerSpec: '',
      batch: '',
      type: '',
      code: '',
      factory: '',
      supplier: '',
      timeStart: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      timeEnd: moment().format('YYYY-MM-DD')
    };
    ADVANCED_FILTERS.forEach((key) => {
      where[key] = '-1';
    });
    return where;
  }

  export default {
    name: 'DeptInStockSearchForm',
    data() {
      return {
        where: defaultWhere(),
        advancedOptions: ADVANCED_OPTIONS,
        showAdvanced: false,
        // 首屏按老系统默认近 7 天自动查一次
        autoSearched: false
      };
    },
    computed: {
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      responsiveCol() {
        return this.styleResponsive
          ? { lg: 4, md: 8, sm: 12 }
          : { span: 4 };
      },
      responsiveAdvCol() {
        return this.styleResponsive
          ? { lg: 4, md: 6, sm: 12 }
          : { span: 6 };
      },
      responsiveDateCol() {
        return this.styleResponsive ? { lg: 12, md: 24 } : { span: 12 };
      }
    },
    mounted() {
      if (!this.autoSearched) {
        this.autoSearched = true;
        // ele-pro-table 初次会自动 datasource，这里只同步条件给父组件
        this.$emit('where-change', this.currentWhere());
      }
    },
    methods: {
      currentWhere() {
        return { ...this.where };
      },
      onSearch() {
        this.$emit('where-change', this.currentWhere());
        this.$emit('search', this.currentWhere());
      },
      onExport(mode) {
        this.$emit('where-change', this.currentWhere());
        this.$emit('export', mode);
      },
      onReset() {
        this.where = defaultWhere();
        this.$emit('where-change', this.currentWhere());
        this.$emit('search', this.currentWhere());
      }
    }
  };
</script>

<style lang="scss" scoped>
  .dept-instock-search {
    .el-row {
      margin-bottom: 4px;
    }
    .el-col {
      margin-bottom: 4px;
    }
    .search-actions-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .date-label {
      font-size: 13px;
      color: #606266;
    }
    .date-label-to {
      margin: 0 6px;
    }
    .search-buttons {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
      padding-left: 8px;
    }
    .advanced-row {
      padding: 6px 0 2px;
      border-top: 1px solid #ebeef5;
      margin-top: 4px !important;
    }
    .advanced-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
    }
    .advanced-label {
      flex: 0 0 auto;
      color: #606266;
      white-space: nowrap;
    }
  }
</style>
