<template>
  <div class="body">
    <el-card
      style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05); margin-top: 20px"
    >
      <div
        slot="header"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <span>手术排期</span>
      </div>
      <!-- 筛选表单 -->
      <el-form
        :inline="true"
        :model="where"
        size="mini"
        style="
          padding: 8px 0 16px 0;
          margin-bottom: 12px;
          border-bottom: 1px solid #ebeef5;
        "
      >
        <el-form-item
          label="日期范围"
          style="margin-right: 16px; margin-bottom: 8px"
        >
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
        <el-form-item style="margin-right: 16px; margin-bottom: 8px">
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
        <el-form-item style="margin-right: 16px; margin-bottom: 8px">
          <el-input
            v-model="where.patientOrSurgeryName"
            placeholder="请输入患者姓名或手术名称"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 8px">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="reload"
            style="margin-right: 8px"
            >查询</el-button
          >

          <el-button
            type="primary"
            icon="el-icon-download"
            @click="handlePrint"
            style="margin-right: 8px"
            >打印</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 数据表格 -->
      <ele-pro-table
        size="mini"
        ref="table"
        @row-click="handleRowClick"
        :columns="columns"
        height="50vh"
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
  import { BACK_BASE_URL } from '@/config/setting';
  import {
    getBdSzYyHisSs,
    GetBdszZgsjMainPsDelExcel
  } from '@/api/Task/OPSConsumables';
  export default {
    name: 'OPSConsumablesTable',
    data() {
      return {
        currentRow: null,
        // 查询参数
        where: {
          dateRange: [],
          MZZY: '',
          patientOrSurgeryName: ''
        },
        // 术间选项
        MZZYOptions: [
          { value: '', label: '全部' },
          { value: '1', label: '已提交' },
          { value: '2', label: '已拣配' },
          { value: '3', label: '已交接' },
          { value: '4', label: '已完成' }
        ],
        // 表格列配置
        columns: [
          // {
          //   prop: 'MZZY',
          //   label: '门诊/住院',
          //   align: 'center',
          //   width: 100,
          //   formatter: (row, column, cellValue, index) => {
          //     return cellValue === '1' ? '门诊' : '住院';
          //   }
          // },
          {
            prop: 'STATE',
            label: '状态',
            align: 'center',
            width: 150,
            formatter: (row, column, cellValue) => {
              switch (cellValue) {
                case '1':
                  return '已提交';
                case '2':
                  return '已拣配';
                case '3':
                  return '已交接';
                case '4':
                  return '已完成';
                default:
                  return '未知状态';
              }
            }
          },
          {
            prop: 'SSBH',
            label: '手术编号',
            align: 'center',
            width: 120
          },
          {
            prop: 'SSTH',
            label: '手术台号',
            align: 'center',
            width: 120
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
            width: 100,
            formatter: (row, column, cellValue) => {
              if (!cellValue || cellValue.length == 2)
                return cellValue[0] + '*';
              const firstChar = cellValue[0];
              const lastChar = cellValue[cellValue.length - 1];
              const middleStars = '*'.repeat(cellValue.length - 2);
              return firstChar + middleStars + lastChar;
            }
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
            width: 120,
            formatter: (row, column, cellValue, index) => {
              return this.$util.toDateString(cellValue, 'YYYY-MM-DD HH:mm:ss');
            },
            showOverflowTooltip: true
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
      handlePrint() {
        // 这里不实现具体方法，仅返回空数据结构
        console.log({ current: this.currentRow });
        if (this?.currentRow == undefined)
          return this.$message.error('请先选择一行数据！');
        const loading = this.$loading({
          lock: true,
          text: '正在下载...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const params = {
          SSBH: this.currentRow.SSBH
        };
        GetBdszZgsjMainPsDelExcel(params)
          .then((res) => {
            var url = `${BACK_BASE_URL}/Excel/files/${res.msg}`;
            window.open(url.replace('/undefined', ''));
          })
          .catch((err) => {
            this.$message.error(err.msg || '下载失败，请稍后重试！');
          })
          .finally(() => {
            loading.close();
          });
      },
      handleRowClick(row, column, event) {
        this.currentRow = row;
        this.$bus.$emit('OPSConsumablesTableRowClick', row);
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
