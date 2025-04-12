<template>
  <div>
    <el-card>
      <div slot="header">手术配送耗材</div>
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-input placeholder="编码/名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="reload">查询</el-button>
        </el-form-item>
      </el-form>
      <ele-pro-table
        ref="table"
        size="mini"
        :columns="columns"
        height="180px"
        :datasource="datasource"
      />
    </el-card>
  </div>
</template>

<script>
  import { getBdszZgsjMainPsDel } from '@/api/Task/OPSConsumables';
  export default {
    name: 'OPSDeliveryConsumablesTable',
    props: {
      MZZY: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        where: {},
        columns: [
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'CHARGING_CODE',
            label: '计费编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
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
            prop: 'APPROVAL_NUMBER',
            label: '注册证号',
            align: 'center',
            width: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            minWidth: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'PS_COUNT',
            label: '配送数量',
            align: 'center',
            width: 100
          }
        ]
      };
    },
    methods: {
      datasource({ page, limit, where }) {
        // 这里不实现具体方法，仅返回空数据结构
        where.MZZY = this.MZZY;
        return getBdszZgsjMainPsDel({ where })
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
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    mounted() {
      this.$bus.$on('OPSConsumablesTableRowClick', (row) => {
        //this.currentRow = row;
        this.reload({ SSBH: row.SSBH });
      });
      this.$bus.$on('OPSPlanConsumablesTableRowClick', (row) => {
        this.reload();
      });

    },
    beforeDestroy() {
      this.$bus.$off('OPSConsumablesTableRowClick');
      this.$bus.$off('OPSPlanConsumablesTableRowClick');
    }
  };
</script>

<style scoped></style>
