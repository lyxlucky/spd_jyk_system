<template lang="">
  <div>
    <ele-modal
      title="转单记录"
      :destroy-on-close="true"
      width="90%"
      height="80%"
      :visible="visible"
      :close-on-click-modal="true"
      @update:visible="updateVisible(false)"
    >
      <ele-pro-table
        size="mini"
        ref="table"
        height="12vh"
        highlight-current-row
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        @selection-change="onSelectionChange"
        @current-change="onCurrentChange"
        cache-key="TransferedLogTable"
      >
        <template v-slot:TYPE="{ row }">
          <div>
            <el-tag type="success" size="mini">
              {{ row.ZD_ORIGIN_SSBH == AdvanceNumberTableCurrent?.SSBH ? '转出' : '转入' }}
            </el-tag>
          </div>
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>
<script>
  import { getTransferedSSBH } from '@/api/Task/SurgicalVerification';
  export default {
    name: 'TransferedLog',
    props: ['visible'],
    data() {
      return {
        columns: [
          {
            prop: 'TYPE',
            slot: 'TYPE',
            label: '类型',
            align: 'center',
            minWidth: 80
          },
          {
            prop: 'ZD_ORIGIN_SSBH',
            label: '源手术编号',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'TG_SSBH',
            label: '转入手术编号',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'ZD_MAN',
            label: '转单人',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'ZD_TIME',
            label: '转单时间',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            minWidth: 100,
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            minWidth: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            minWidth: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH',
            label: '批号',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效期',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          }
        ],
        //耗材总数量
        pageSize: 50,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        AdvanceNumberTableCurrent: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        //获取当前日期
        where.SSBH = this.AdvanceNumberTableCurrent?.SSBH;
        return getTransferedSSBH({
          page,
          limit,
          where,
          order
        }).then((data) => {
          return { list: data.data, count: data.total };
        });
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      updateVisible(val) {
        this.$emit('update:visible', val);
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
