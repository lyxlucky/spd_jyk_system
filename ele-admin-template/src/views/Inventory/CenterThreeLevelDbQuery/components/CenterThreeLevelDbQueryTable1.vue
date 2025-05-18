<template>
  <div class="ele-container">
    <ele-pro-table
      class="style-table"
      ref="table"
      :columns="columns"
      :datasource="datasource"
      size="mini"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      highlight-current-row
      cache-key="CenterThreeLevelDbQueryTable1"
    >
      <template v-slot:toolbar>
        <el-form
          :model="form"
          ref="form"
          :inline="true"
          class="ele-form-search"
          size="mini"
        >
          <el-form-item prop="MONTHLY_TIME">
            <el-input
              v-model="form.MONTHLY_TIME"
              placeholder="请输入年份(SPD)"
              clearable
            />
          </el-form-item>
          <el-form-item prop="OPEARTION_CHARGING_TIME">
            <el-input
              v-model="form.OPEARTION_CHARGING_TIME"
              placeholder="请输入年份(HIS)"
              clearable
            />
          </el-form-item>
          <el-form-item prop="DEPT_ONE_NAME">
            <el-input
              v-model="form.DEPT_ONE_NAME"
              placeholder="请输入科室名称"
              clearable
            />
          </el-form-item>
          <el-form-item prop="HERP_ID">
            <el-input
              v-model="form.HERP_ID"
              placeholder="请输入SPD科室编码"
              clearable
            />
          </el-form-item>
          <el-form-item prop="APPLY_DEPT">
            <el-input
              v-model="form.APPLY_DEPT"
              placeholder="请输入HIS科室编码"
              clearable
            />
          </el-form-item>
          <el-form-item prop="SPD_CHARGING_CODE">
            <el-input
              v-model="form.SPD_CHARGING_CODE"
              placeholder="请输入SPD计费编码"
              clearable
            />
          </el-form-item>
          <el-form-item prop="CHARGING_CODE">
            <el-input
              v-model="form.CHARGING_CODE"
              placeholder="请输入HIS计费编码"
              clearable
            />
          </el-form-item>
          <el-form-item prop="CHARGE_NAME">
            <el-input
              v-model="form.CHARGE_NAME"
              placeholder="请输入HIS项目名称"
              clearable
            />
          </el-form-item>
          <el-form-item class="ele-form-actions">
            <el-button type="primary" @click="reload()">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
  import { getCenterThreeLevelDbQuery } from '@/api/Inventory/CenterThreeLevelDbQuery';
  export default {
    name: 'CenterThreeLevelDbQueryTable1',
    components: {},
    props: {},
    data() {
      return {
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        form: {
          MONTHLY_TIME: '', // 年份(SPD)
          OPEARTION_CHARGING_TIME: '', // 年份(HIS)
          DEPT_ONE_NAME: '', // 科室名称
          HERP_ID: '', // HIS科室编码(SPD)
          APPLY_DEPT: '', // HIS科室编码(HIS)
          SPD_CHARGING_CODE: '', // 计费编码(SPD)
          CHARGING_CODE: '', // 计费编码(HIS)
          CHARGE_NAME: '' // HIS项目名称
        },
        columns: [
          {
            prop: 'MONTHLY_TIME',
            label: '年份(SPD)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'DEPT_ONE_NAME',
            label: '科室名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'HERP_ID',
            label: 'HIS科室编码(SPD)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'SPD_CHARGING_CODE',
            label: '计费编码(SPD)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'HISQTY',
            label: '消耗数量(SPD)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'OPEARTION_CHARGING_TIME',
            label: '年份(HIS)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'APPLY_DEPT',
            label: 'HIS科室编码(HIS)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'CHARGING_CODE',
            label: '计费编码(HIS)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'CHARGE_NAME',
            label: '计费项目名称(HIS)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'USED_QTY',
            label: '计费数量(HIS)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'PRICE',
            label: '计费单价',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          }
        ]
      };
    },
    methods: {
      datasource({ page, size, where }) {
        return getCenterThreeLevelDbQuery({ page, size, where })
          .then((res) => {
            return {
              list: res.data,
              count: res.total
            };
          })
          .catch(() => {
            return {
              list: [],
              count: 0
            };
          });
      },
      reload() {
        this.$refs.table.reload({ page: 1, where: this.form });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/common';
  :deep(.ele-form-search .el-input--mini .el-input__inner) {
    width: 140px;
  }
</style>
