<template>
  <div class="body">
    <el-card>
      <div slot="header">手术排期</div>
      <!-- 筛选表单 -->
      <el-form :inline="true" :model="where" size="mini" class="filter-form">
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="where.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 240px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="where.MZZY"
            placeholder="请选择术间"
            clearable
            style="width: 160px"
            @change="changeMZZY"
          >
            <el-option
              v-for="item in MZZYOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="where.patientOrSurgeryName"
            placeholder="请输入患者姓名或手术名称"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload"
            >查询</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <ele-pro-table
        size="mini"
        ref="table"
        height="calc(100vh - 400px)"
        row-click="handleRowClick"
        :columns="columns"
        :datasource="datasource"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        highlight-current-row
        :stripe="true"
        :needPage="true"
      >
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
  import { getBdSzYyHisSs } from '@/api/Task/OPSConsumables';
  export default {
    name: 'OPSConsumablesTable',
    data() {
      return {
        currentRow: {},
        // 查询参数
        where: {
          dateRange: [],
          MZZY: '',
          patientOrSurgeryName: ''
        },
        // 术间选项
        MZZYOptions: [
          { value: '', label: '全部' },
          { value: '1', label: '门诊' },
          { value: '2', label: '住院' }
        ],
        // 表格列配置
        columns: [
          {
            prop: 'MZZY',
            label: '门诊/住院',
            align: 'center',
            width: 100,
            formatter: (row, column, cellValue, index) => {
              return cellValue === '1' ? '门诊' : '住院';
            }
          },
          {
            prop: 'ZYHM',
            label: '住院号码',
            align: 'center',
            width: 120
          },
          {
            prop: 'BRXM',
            label: '病人姓名',
            align: 'center',
            width: 100
          },
          {
            prop: 'SSMC',
            label: '手术名称',
            align: 'center',
            minWidth: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'SSRQ',
            label: '手术日期',
            align: 'center',
            width: 100,
            formatter: (row, column, cellValue, index) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
          },
          {
            prop: 'SSRQ_TIME',
            label: '手术时间',
            align: 'center',
            width: 150
          }
        ],
        // 分页配置
        pageSize: 10,
        pageSizes: [10, 20, 50, 100]
      };
    },
    methods: {
      changeMZZY(val) {
        this.$emit('changeMZZY', val);
      },
      handleRowClick(row, column, event) {
        this.currentRow = row;
      },
      // 表格数据源
      datasource({ page, limit, where }) {
        // 这里不实现具体方法，仅返回空数据结构
        where.MZZY = this.where.MZZY;
        return getBdSzYyHisSs({ page, limit, where })
          .then((data) => {
            return {
              list: data.data || [],
              count: data.total
            };
          })
          .catch(() => {
            return {
              list: [],
              count: 0
            };
          });
      },
      // 查询按钮点击事件
      reload() {
        this.$refs.table.reload({ page: 1, where: this.where });
      }
    },
    created() {
      // 不实现具体方法
    }
  };
</script>

<style lang="scss" scoped>
  //   .body {
  //     padding: 10px;
  //     background-color: #fff;
  //   }

  //   .filter-form {
  //     margin-bottom: 15px;
  //     padding: 15px;
  //     background-color: #f5f7fa;
  //     border-radius: 4px;
  //   }
</style>
