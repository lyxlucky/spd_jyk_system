<template>
  <div>
    <el-card>
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-input placeholder="编码/名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reload">查询</el-button>
        </el-form-item>
      </el-form>
      <ele-pro-table
        ref="table"
        size="mini"
        :columns="columns"
        height="240px"
        :datasource="datasource"
      >
        <template v-slot:operate="{ row }">
          <el-button type="primary" @click="handleEdit(row)"
            >配置耗材</el-button
          >
        </template>
      </ele-pro-table>
    </el-card>

    <el-dialog title="配置耗材" :visible.sync="isShowDialog" width="80%">
      <OPSPlanConsumablesOperateTable></OPSPlanConsumablesOperateTable>
    </el-dialog>
  </div>
</template>

<script>
  import { getBdszgsjMainDel } from '@/api/Task/OPSConsumables';
  import OPSPlanConsumablesOperateTable from './OPSPlanConsumablesOperateTable.vue';
  export default {
    name: 'OPSPlanConsumablesTable',
    components: {
      OPSPlanConsumablesOperateTable
    },
    data() {
      return {
        isShowDialog: false,
        where: {
          MZZY: '1'
        },
        columns: [
          {
            prop: 'ID',
            label: 'ID',
            align: 'center',
            width: 100
          },
          {
            prop: 'MZZY',
            label: '门诊/住院',
            align: 'center',
            width: 100
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
            prop: 'BRXB',
            label: '病人性别',
            align: 'center',
            width: 80
          },
          {
            prop: 'CSNY',
            label: '出生年月',
            align: 'center',
            width: 120
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
            width: 100
          },
          {
            prop: 'SSRQ_TIME',
            label: '手术时间',
            align: 'center',
            width: 150
          },
          {
            prop: 'FYXH',
            label: '费用序号',
            align: 'center',
            width: 100
          },
          {
            prop: 'FYMC',
            label: '费用名称',
            align: 'center',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'WJXMBM',
            label: '物价项目编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'FYSL',
            label: '费用数量',
            align: 'center',
            width: 100
          },
          {
            prop: 'FYDJ',
            label: '费用单价',
            align: 'center',
            width: 100
          },
          {
            prop: 'VARIETIE_CODE',
            label: '品种编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '新品种编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格/型号',
            align: 'center',
            width: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            width: 80
          },
          {
            prop: 'PRICE',
            label: '价格',
            align: 'center',
            width: 100
          },
          {
            prop: 'BATCH',
            label: '批次',
            align: 'center',
            width: 100
          },
          {
            prop: 'BATCH_ID',
            label: '批次ID',
            align: 'center',
            width: 120
          },
          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            align: 'center',
            width: 120
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效期',
            align: 'center',
            width: 120
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            width: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业名称',
            align: 'center',
            minWidth: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'CREATE_TIME',
            label: '创建时间',
            align: 'center',
            width: 160,
            formatter: (row) => {
              return row.CREATE_TIME
                ? this.$moment(row.CREATE_TIME).format('YYYY-MM-DD HH:mm:ss')
                : '';
            }
          },
          {
            prop: 'operate',
            label: '配置耗材',
            align: 'center',
            float: 'right',
            minWidth: 180
          }
        ]
      };
    },
    methods: {
      datasource({ page, limit, where }) {
        // 这里不实现具体方法，仅返回空数据结构
        return getBdszgsjMainDel({ where })
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
      reload() {
        this.$refs.table.reload({ page: 1, where: this.where });
      },
      handleEdit(row) {
        console.log(row);
        this.isShowDialog = true;
      }
    }
  };
</script>

<style scoped></style>
