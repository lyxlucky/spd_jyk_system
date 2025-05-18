<template lang="">
  <div>
    <ele-modal
      title="勾选添加"
      :destroy-on-close="true"
      width="90%"
      top="1vh"
      :visible="visible"
      :close-on-click-modal="true"
      @update:visible="updateVisible(false)"
    >
      <ele-pro-table
        size="mini"
        ref="table"
        highlight-current-row
        height="70vh"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        @selection-change="onSelectionChange"
        @current-change="onCurrentChange"
        cache-key="SelectionAddDialogTableCacheKey"
      >
        <template slot="toolbar">
          <el-button
            size="mini"
            icon="el-icon-close"
            @click="updateVisible(false)"
            >取 消</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-check"
            type="primary"
            @click="submitItem"
            >确 定</el-button
          >
          <el-button size="mini" type="success" @click="showNewUse"
            >新增使用</el-button
          >
        </template>
      </ele-pro-table>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          icon="el-icon-close"
          @click="updateVisible(false)"
          >取 消</el-button
        >
        <el-button
          size="mini"
          icon="el-icon-check"
          type="primary"
          @click="submitItem"
          >确 定</el-button
        >
      </span> -->
    </ele-modal>

    <el-dialog title="新增使用" :visible.sync="isShowNewUse" width="40%">
      <NewUse :selection="selection"></NewUse>
    </el-dialog>
  </div>
</template>
<script>
  import {
    GetBdszZqsjMainNoUseDel,
    addBdszZqsjMainPsDelUseV2
  } from '@/api/Task/SurgicalVerification';
  import NewUse from './NewUse.vue';
  export default {
    name: 'selectionAddDialog',
    components: {
      NewUse
    },
    props: ['visible'],
    data() {
      return {
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            minWidth: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'PRICE',
            label: '价格',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH',
            label: '批号',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },

          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },

          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效期',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },

          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          }
        ],
        pageSize: 50,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        AdvanceNumberTableCurrent: null,
        isShowNewUse: false
      };
    },
    methods: {
      async datasource({ page, limit, where, order }) {
        where = {
          ...where,
          SSBH: this.AdvanceNumberTableCurrent?.SSBH
        };

        const res = await GetBdszZqsjMainNoUseDel({
          page,
          limit,
          where,
          order
        }).then((res) => {
          if (res.code !== 200) {
            return {
              total: 0,
              data: []
            };
          }
          return {
            total: res.total,
            data: res.data
          };
        });
        return {
          count: res.total,
          list: res.data
        };
      },
      onCurrentChange(current) {
        this.current = current;
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      updateVisible(val) {
        this.$emit('update:visible', val);
      },
      submitItem() {
        if (this.selection.length === 0) {
          this.$message({
            message: '请至少选择一条数据',
            type: 'warning'
          });
          return;
        }
        const loading = this.$messageLoading('处理中...');
        const ids = this.selection.map((item) => {
          return {
            ID: item.ID
          };
        });
        addBdszZqsjMainPsDelUseV2({
          json: ids
        })
          .then((res) => {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          })
          .catch((err) => {
            this.$message({
              message: err.message,
              type: 'error'
            });
          })
          .finally(() => {
            this.updateVisible(false);
            this.$bus.$emit('SelectionAddDialogRefresh');
            loading.close();
          });
      },
      showNewUse() {
        this.isShowNewUse = true;
      }
    },
    mounted() {
      this.$bus.$on('AdvanceReceiptNumberTableCurrent', (data) => {
        this.AdvanceNumberTableCurrent = data;
      });
    },
    beforeDestroy() {
      this.$bus.$off('SelectionAddDialogRefresh');
    }
  };
</script>
<style lang=""></style>
