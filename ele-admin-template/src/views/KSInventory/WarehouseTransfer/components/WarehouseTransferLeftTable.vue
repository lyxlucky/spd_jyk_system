<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      highlight-selection-row
      ref="table"
      @current-change="onCurrentChange"
      height="65vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="WarehouseTransferLeftTable"
    >
      <template v-slot:toolbar>
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-circle-plus-outline"
            @click="createItem()"
            >创建</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="!isEnableDelete"
            @click="deleteItem()"
            >删除</el-button
          >

          <el-button
            type="success"
            size="mini"
            icon="el-icon-circle-check"
            :disabled="!isEnableDelete"
            @click="submit()"
            >确定调库</el-button
          >
        </div>
      </template>

      <template v-slot:TK_STAE="{ row }">
        <el-tag v-if="row.TK_STAE == 0" type="primary" size="small"
          >新增</el-tag
        >
        <el-tag v-if="row.TK_STAE == 1" type="success" size="small"
          >已调库</el-tag
        >
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import {
    getDEPT_TK_MAIN,
    createDEPT_TK_MAIN,
    deleteDEPT_TK_MAIN,
    commitTkInfo
  } from '@/api/KSInventory/WarehouseTransfer/index';
  export default {
    name: 'WarehouseTransferLeftTable',
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'TK_ORDER',
            label: '调库订单',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'DEPT_TWO_NAME',
            label: '科室名称',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            slot: 'TK_STAE',
            label: '调库状态',
            minWidth: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'TK_MAN',
            label: '调库人',
            minWidth: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'TK_TIME',
            label: '调库时间',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          }
        ],
        pageSize: 10,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = getDEPT_TK_MAIN({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      onCurrentChange(row) {
        this.$bus.$emit(`${this.$route.path}/LeftTableChange`, row);
        this.current = row;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      submit() {
        const data = this.selection
        const loading = this.$messageLoading('请求中..');
        commitTkInfo(data)
          .then((res) => {
            this.$message.success("处理成功");
          })
          .catch((err) => {
            this.$message.error("处理失败");
          })
          .finally(() => {
            loading.close();
            this.reload();
          });
      },
      createItem() {
        const loading = this.$messageLoading('请求中..');
        createDEPT_TK_MAIN()
          .then((res) => {
            this.reload();
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.$message.error(err.msg);
          })
          .finally(() => {
            loading.close();
          });
      },
      deleteItem() {
        this.$confirm('确定删除选中的数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$messageLoading('请求中..');
          const ids = this.selection.map((item) => item.ID).join(',');
          deleteDEPT_TK_MAIN({ ID: ids })
            .then((res) => {
              this.reload();
              this.$message.success(res.msg);
            })
            .catch((err) => {
              this.$message.error(err.msg);
            })
            .finally(() => {
              loading.close();
            });
        });
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      isEnableDelete() {
        return this.selection.length > 0;
      }
    },
    mounted() {
      // this.$bus.$on('handleCommand', () => {
      //   this.reload();
      // });
    },
    beforeDestroy() {
      // this.$bus.$off('handleCommand');
    }
  };
</script>
<style lang=""></style>
