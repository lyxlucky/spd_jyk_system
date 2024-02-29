<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="科室方式:">
          <el-select v-model="where.deptState" clearable placeholder="科室方式：">
            <el-option v-for="item in deptStateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="品种方式:">
          <el-select v-model="where.varState" clearable placeholder="品种方式：">
            <el-option v-for="item in varStateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="品种方式:">
          <el-select v-model="where.IS_CHARGE" clearable placeholder="是否收费：">
            <el-option v-for="item in isChargeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="日期方式:">
          <el-select v-model="where.timeState" clearable placeholder="日期方式：">
            <el-option v-for="item in timeStateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="排序:">
          <el-select v-model="where.orderState" clearable placeholder="排序：">
            <el-option v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="本期时间:">
          <el-date-picker v-model="where.time1Range" value-format="yyyy-MM" type="monthrange" range-separator="至" start-placeholder="本期开始日期" end-placeholder="本期结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="环期时间:">
          <el-date-picker v-model="where.time2Range" value-format="yyyy-MM" type="monthrange" range-separator="至" start-placeholder="环期开始日期" end-placeholder="环期结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button type="primary" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
            导出
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      BIND_MACHINE: '',
      VARIETIE_CODE_NEW: '',
      SPECIFICATION_OR_TYPE: '',
      deptState: '1',
      varState: '1',
      IS_CHARGE: '',
      timeState: '1',
      orderState: '1',
      time1Range: ['2023-01', '2023-12'],
      time2Range: ['2022-01', '2022-12']
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      deptStateOptions: [
        {
          value: '1',
          label: '一级科室'
        },
        {
          value: '2',
          label: '二级科室'
        },
        {
          value: '3',
          label: '三级科室'
        }
      ],
      varStateOptions: [
        {
          value: '1',
          label: '品种编码'
        },
        {
          value: '2',
          label: '品种名称'
        }
      ],
      isChargeOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      timeStateOptions: [
        {
          value: '1',
          label: '自然日'
        },
        {
          value: '2',
          label: '月结'
        }
      ],
      orderStateOptions: [
        {
          value: '1',
          label: '金额'
        },
        {
          value: '2',
          label: '环比增幅'
        },
        {
          value: '3',
          label: '环比增幅金额'
        }
      ]
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
    exportData() {
      this.$emit('exportData', this.where);
    }
  }
};
</script>
