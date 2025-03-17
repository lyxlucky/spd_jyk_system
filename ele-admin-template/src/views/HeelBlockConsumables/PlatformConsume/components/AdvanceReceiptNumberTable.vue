<template>
  <div class="ele-body">
    <AdvanceReceiptNumberSearch
      @search="reload"
      @platformConsumeEditShow="platformConsumeEditShow"
      :rowData="current"
    />

    <AdvanceReceiptNumberEdit
      @search="reload"
      :visible.sync="showEdit"
      :rowData="current"
    />
    <!-- 数据表格 -->
    <ele-pro-table
      height="260"
      highlight-current-row
      @current-change="onCurrentChange"
      :row-class-name="tableRowClassName"
      ref="table"
      :rowClickChecked="true"
      :stripe="false"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :needPage="true"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="ApplyTempTable"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
      </template>

      <template v-slot:State="{ row }">
        <el-tag v-if="row.State == 0" type="success">新增</el-tag>
        <el-tag v-if="row.State == 1">已提交</el-tag>
        <el-tag v-if="row.State == 2" type="primary">配送中</el-tag>
        <el-tag v-if="row.State == 5" type="primary" color="#2ee693"
          >已审核</el-tag
        >
        <el-tag
          v-if="row.State == 10"
          type="primary"
          color="#e60000"
          style="color: white"
          >强制结束</el-tag
        >
        <el-tag
          v-if="
            (row.State == 6 || row.State == 4) &&
            row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty
          "
          type="success"
          >已审批</el-tag
        >
        <el-tag
          v-if="
            row.SUM_Left_Apply_Qty > 0 &&
            row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty
          "
          type="danger"
          >未收全</el-tag
        >
        <el-tag v-if="row.SUM_Left_Apply_Qty == 0" type="success"
          >已收全</el-tag
        >
        <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
      </template>

      <template v-slot:CommonState="{ row }">
        <el-tag v-if="row.CommonState == 0" type="success">新增</el-tag>
        <el-tag v-if="row.CommonState == 1">已提交</el-tag>
      </template>

      <template v-slot:TempletName="{ row }">
        <span
          style="color: #409eff"
          type="primary"
          @dblclick="editTempletName(row.TempletCode)"
          v-if="row.TempletName"
          :underline="false"
          >{{ row.TempletName }}</span
        >
        <span
          style="color: #409eff"
          type="primary"
          @dblclick="editTempletName(row.TempletCode)"
          v-else
          :underline="false"
          >无</span
        >
      </template>

      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-link
          type="danger"
          @click="handleDelete(row)"
          :underline="false"
          icon="el-icon-delete"
        >
          剔除
        </el-link>
      </template>
    </ele-pro-table>
  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #65bb37;
  }
</style>

<script>
  import AdvanceReceiptNumberSearch from './AdvanceReceiptNumberSearch.vue';
  import AdvanceReceiptNumberEdit from './AdvanceReceiptNumberEdit.vue';
  import {
    SerachTempletList,
    DeleteTemplet,
    EditTempName
  } from '@/api/KSInventory/ApplyTemp';
  import { HOME_HP } from '@/config/setting';
  import {
    SearchGoodsDeliveryNumbers,
    UpdatePatientInfo,
    delGtGoodsDeliveryNumber
  } from '@/api/HeelBlockConsumables/PlatformConsume';
  export default {
    name: 'ApplyTempTable',
    components: {
      AdvanceReceiptNumberSearch,
      AdvanceReceiptNumberEdit
    },
    data() {
      return {
        // 表格列配置
        columns: [
          // {
          //   columnKey: 'selection',
          //   type: 'selection',
          //   width: 45,
          //   align: 'center',
          //   fixed: 'left'
          // },
          // {
          //   label: '序',
          //   columnKey: 'index',
          //   type: 'index',
          //   width: 45,
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   fixed: 'left'
          // },
          {
            prop: 'Delivery_Note_Number',
            label: '收货单号',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'Hospitalization_Number',
            label: '住院号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          // {
          //   prop: 'Operater',
          //   label: '住院号',
          //   // sortable: 'custom',
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   minWidth: 70
          // },
          {
            prop: 'Patient',
            label: '病患',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'Dept_Two_Name',
            label: '使用科室',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'Receive_Receipt_State',
            label: '确认状态',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter(row, column, cellValue) {
              if (cellValue == '0') {
                return '待确认';
              } else if (cellValue == '1') {
                return '待提交';
              } else if (cellValue == '2') {
                return '已提交';
              } else if (cellValue == '3') {
                return '已审批';
              } else if (cellValue == '4') {
                return '已审批';
              } else {
                return cellValue;
              }
            }
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 150,
            align: 'center',
            resizable: false,
            slot: 'action',
            showOverflowTooltip: true
            //fixed: 'right'
          }
        ],
        paginationStyle: {
          height: '18px',
          padding: '0px 0px 5px 0px',
          'margin-top': '-5px'
        },
        toolbar: false,
        pageSize: 100,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        showEdit: false,
        // 是否显示导入弹窗
        showImport: false,
        // datasource: [],
        data: []
      };
    },
    methods: {
      /* 表格数据源 */
      async datasource({ page, limit, where, order }) {
        var deptTwoList = [];
        var deptTwoJson = this.$store.state.user.info.userDept;
        for (let i = 0; i < deptTwoJson.length; i++) {
          deptTwoList.push(deptTwoJson[i].Dept_Two_Code);
        }
        where.depts = JSON.stringify(deptTwoList);
        where.supplierId = 0;
        where.hp = HOME_HP;
        const res = await SearchGoodsDeliveryNumbers({
          page,
          limit,
          where,
          order
        });
        return { list: res.result, count: res.total };
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      handleDelete(data) {
        //二次确认
        this.$confirm(
          `此操作将删除${data.Delivery_Note_Number}数据, 是否继续?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            // 删除数据
            const loading = this.$messageLoading('删除中...');
            delGtGoodsDeliveryNumber({
              DELIVERY_NOTE_NUMBER: data.Delivery_Note_Number
            })
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: res?.msg
                });
              })
              .catch((err) => {
                this.$message({
                  type: 'error',
                  message: err
                });
              })
              .finally(() => {
                loading.close();
                this.reload(this.where);
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      platformConsumeEditShow(data) {
        if (this.current == undefined) {
          this.$message.info('请选择一条数据！');
          return;
        } else {
          this.showEdit = true;
        }
      },
      editTempletName(code) {
        this.$prompt('请输入模板名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            EditTempName({
              TempCode: code,
              TempName: value
            })
              .then((res) => {
                if (res?.code != 200) return this.$message.error(res?.msg);
                this.$message.success(res?.msg);
              })
              .catch((err) => {
                this.$message.error(err);
              })
              .finally(() => {
                this.reload(this.where);
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
      },
      onDone(res) {
        // console.log('res:', res);
        // 例如选中第一条数据
        if (res.data?.length) {
          this.$refs.table.setCurrentRow(res.data[0]);
        }
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
        this.$emit('getCurrent', current);
      },

      /* 删除数据 */
      remove(row) {
        // const loading = this.$loading({ lock: true });
        const loading = this.$messageLoading('删除中...');
        DeleteTemplet(row)
          .then((res) => {
            this.$message.success(res.msg);
            loading.close();
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },

      tableRowClassName({ row, rowIndex }) {
        if (row.CommonState == 1) {
          return 'success-row';
        } else {
          return '';
        }
      }
    },
    mounted() {
      this.$bus.$on(
        'handleSubmitConsumeVarietiesAndRefreshTopTable',
        (data) => {
          this.reload();
        }
      );
      this.$bus.$on('handleCommand', (data) => {
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('handleCommand');
    },
    created() {
      // this.getdatasource();
      // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
    }
  };
</script>
