<template lang="">
  <div>
    <ele-modal
      width="40%"
      :visible="visible"
      :destroy-on-close="true"
      :append-to-body="true"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      title="收货详情"
      @update:visible="updateVisible"
    >
      <ele-pro-table
        highlight-current-row
        ref="table"
        height="40vh"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="QuanityDetailDialogTableCacheKey"
      >
      </ele-pro-table>

      <template v-slot:footer>
        <el-button size="mini" @click="updateVisible(false)">取消</el-button>
        <el-button size="mini" type="primary" @click="save"> 保存 </el-button>
      </template>
    </ele-modal>
  </div>
</template>
<script>
  import { GetOrderNumById } from '@/api/KSInventory/KSDepartmentalPlan';
  export default {
    name: 'QuanityDetailDialog',
    props: ['visible', 'quanityInlineCurrent'],
    data() {
      const defaultWhere = {};
      return {
        columns: [
          {
            prop: 'ORDER_NUM',
            label: '收货单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'QTY',
            label: '收货数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'ORDER_TIME',
            label: '收货时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          }
        ],
        where: { ...defaultWhere },
        pageSize: 50,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        where = {
          ...where,
          id: this.quanityInlineCurrent.ID
        };
        let data = GetOrderNumById({ page, limit, where, order }).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.data
            };
            return tData;
          }
        );
        return data;
      },
      updateVisible(val) {
        this.$emit('update:visible', val);
      },
      save() {
        // Save logic here
      }
    }
  };
</script>
<style lang=""></style>
