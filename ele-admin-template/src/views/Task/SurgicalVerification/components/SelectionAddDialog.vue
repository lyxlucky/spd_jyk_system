<template lang="">
  <div>
    <ele-modal
      title="勾选添加"
      :destroy-on-close="true"
      width="1000px"
      :visible="visible"
      :close-on-click-modal="true"
      @update:visible="updateVisible(false)"
    >
      <ele-pro-table
        size="mini"
        ref="table"
        highlight-current-row
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
      </ele-pro-table>

      <span slot="footer" class="dialog-footer">
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
      </span>
    </ele-modal>
  </div>
</template>
<script>
  import { GetBdszZqsjMainNoUseDel } from '@/api/Task/SurgicalVerification';
  export default {
    name: 'selectionAddDialog',
    props: ['visible'],
    data() {
      return {
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            align: 'center',
            width: 130
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            width: 130
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            width: 130
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            width: 130
          },
          {
            prop: '单位',
            label: 'UNIT',
            align: 'center',
            width: 130
          },
          {
            prop: 'PRICE',
            label: '价格',
            align: 'center',
            width: 130
          },
          {
            prop: 'BATCH',
            label: '批号',
            align: 'center',
            width: 130
          },

          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            align: 'center',
            width: 130
          },

          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效期',
            align: 'center',
            width: 130
          },

          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            width: 130
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            width: 130
          }
        ],
        pageSize: 50,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        AdvanceNumberTableCurrent: null
      };
    },
    methods: {
      async datasource({ page, limit, where, order }) {
        // where = {
        //   ...where,
        //   SSBH: this.AdvanceNumberTableCurrent?.SSBH
        // };
        const res = await GetBdszZqsjMainNoUseDel({
          page,
          limit,
          where,
          order
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
        this.$emit('submitItem');
      }
    },
    mounted() {
      this.$bus.$on('AdvanceReceiptNumberTableCurrent', (data) => {
        this.AdvanceNumberTableCurrent = data;
      });
    }
  };
</script>
<style lang=""></style>
