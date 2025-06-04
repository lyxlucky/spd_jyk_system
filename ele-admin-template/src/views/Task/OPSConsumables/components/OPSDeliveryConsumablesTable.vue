<template>
  <div class="ele-box">
    <!-- <el-card> -->
    <!-- <div slot="header">手术配送耗材</div> -->
    <ele-pro-table
      ref="table"
      :initLoad="false"
      size="mini"
      :columns="columns"
      height="180px"
      :datasource="datasource"
    >
      <template v-slot:ACTION="{ row }">
        <el-button
          size="mini"
          icon="el-icon-delete"
          @click="handleDeleteItem(row)"
          type="danger"
          >删除</el-button
        >
      </template>
    </ele-pro-table>
    <!-- </el-card> -->
  </div>
</template>

<script>
  import {
    getBdszZgsjMainPsDel,
    deleteBdszPsDetail
  } from '@/api/Task/OPSConsumables';
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
          },
          {
            prop: 'CHARGING_CODE',
            label: '计费编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            width: 120
          },
          {
            slot: 'ACTION',
            prop: 'ACTION',
            label: '操作',
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
        return getBdszZgsjMainPsDel({ page, limit, where })
          .then((data) => {
            this.$bus.$emit('OPSDeliveryConsumablesTableData', data.data);
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
      },

      handleDeleteItem(row) {
        this.$confirm('是否删除该行数据?', '提示', {
          type: 'warning'
        })
          .then(() => {
            deleteBdszPsDetail({ ID: row.ID, TYPE: row.TYPE })
              .then(() => {
                this.$message.success('删除成功!');
              })
              .catch(() => {
                this.$message.error('删除失败!');
              });
          })
          .catch(() => {
            this.$message.info('已取消删除!');
          })
          .finally(() => {
            this.reload();
          });
      }
    },
    mounted() {
      this.$bus.$on('OPSConsumablesTableRowClick', (row) => {
        //this.currentRow = row;
        this.reload({ SSBH: row.SSBH });
      });
      //
      this.$bus.$on('OPSPlanConsumablesTableRowClick', (row) => {
        this.reload();
      });
      //
      this.$bus.$on('OPSPlanConsumablesTableAddDefNoPkgCode', (row) => {
        this.reload();
      });
      //
      this.$bus.$on('OPSPlanConsumablesOperateTableDone', (row) => {
        this.reload();
      });
    },
    beforeDestroy() {
      this.$bus.$off('OPSConsumablesTableRowClick');
      this.$bus.$off('OPSPlanConsumablesTableRowClick');
      this.$bus.$off('OPSDeliveryConsumablesTableData');
    }
  };
</script>

<style scoped>
  .ele-box {
    background-color: white;
    height: 100%;
    box-sizing: border-box;
  }
  .ele-box .ele-box {
    padding: 10px;
  }

  .ele-box,
  .ele-box .ele-pro-table {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .ele-box .el-table {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .ele-box .el-table .el-table__body-wrapper {
    flex: 1;
    overflow: auto;
    flex-basis: 0;
    max-height: calc(100vh - 200px);
  }
  .ele-box .ele-pro-table .el-pagination {
    margin-top: 7px !important;
    padding: 0px 0;
    box-sizing: border-box;
  }
</style>
