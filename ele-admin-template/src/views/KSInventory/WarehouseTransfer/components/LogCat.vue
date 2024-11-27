<template lang="">
  <div class="">
    <ele-modal
      width="90%"
      :destroy-on-close="true"
      :visible="visible"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      title="调库记录"
      @update:visible="updateVisible"
    >
      <ele-pro-table
        height="65vh"
        highlight-current-row
        @current-change="onCurrentChange"
        ref="table"
        :rowClickChecked="true"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="logCatTableCacheKey"
      >
        <template v-slot:COUNT="{ row }">
          <el-input-number
            v-model="row.COUNT"
            size="mini"
            :min="0"
            class="ele-fluid"
          />
        </template>

        <template v-slot:toolbar>
          <div>
            <el-form :inline="true" class="ele-form-search">
              <!-- <el-row :gutter="10">
                <el-col
                  v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }"
                > -->
              <el-form-item>
                <el-input
                  style="width: 200px"
                  v-model="where.search"
                  size="mini"
                  placeholder="请输入调库订单"
                ></el-input>
              </el-form-item>
              <!-- </el-col>
                <el-col
                  v-bind="styleResponsive ? { lg: 5, md: 2 } : { span: 4 }"
                > -->
              <el-form-item style="width: 350px">
                <el-date-picker
                  v-model="where.date"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  size="mini"
                  range-separator="至"
                  start-placeholder="调库开始日期"
                  end-placeholder="调库结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <!-- </el-col>
                <el-col
                  v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }"
                > -->
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="searchItem()"
                  >搜索</el-button
                >

                <el-button
                  type="primary"
                  size="mini"
                  style="margin-left: 10px"
                  icon="el-icon-download"
                  @click="exportLog()"
                  >导出</el-button
                >
                <!-- </el-col> -->
                <!-- </el-row> -->
              </el-form-item>
            </el-form>
          </div>
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>
<script>
  import { utils, writeFile } from 'xlsx';
  import { getlogInfoTable } from '@/api/KSInventory/WarehouseTransfer/index';
  export default {
    name: 'LogCat',
    props: ['visible'],
    data() {
      const defaultWhere = {
        search: '',
        date: ''
      };
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
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'TK_MAN',
            label: '调库人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'TK_TIME',
            label: '调库时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
            sortable: true
          },
          {
            prop: 'TJ_MAN',
            label: '提交人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'TJ_TIME',
            label: '提交时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 230
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'COEFFICIENT',
            label: '系数',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 140
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 160
          }
        ],
        pageSize: 20,
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
        let data = getlogInfoTable({ page, limit, where, order }).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
        );
        return data;
      },
      searchItem() {
        this.reload(this.where);
      },
      exportLog() {
        const loading = this.$messageLoading('正在处理..');
        this.$refs.table.doRequest(({ where, order }) => {
          getlogInfoTable({
            page: 1,
            limit: 999999,
            where: where,
            order: order
          })
            .then((res) => {
              loading.close();
              const array = [
                [
                  '调库订单',
                  '调库人',
                  '调库时间',
                  '提交人',
                  '提交时间',
                  '品种编码',
                  '品种名称',
                  '规格',
                  '数量',
                  '单位',
                  '批准文号',
                  '生产企业',
                  '定数码'
                ]
              ];
              res.result.forEach((d) => {
                array.push([
                  d.TK_ORDER,
                  d.TK_MAN,
                  d.TK_TIME,
                  d.TJ_MAN,
                  d.TJ_TIME,
                  d.VARIETIE_CODE_NEW,
                  d.VARIETIE_NAME,
                  d.SPECIFICATION_OR_TYPE,
                  d.QTY,
                  d.UNIT,
                  d.APPROVAL_NUMBER,
                  d.MANUFACTURING_ENT_NAME,
                  d.DEF_NO_PKG_CODE
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(array)
                  }
                },
                '调库日志.xlsx'
              );
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        });
      },
      // 表格选中数据
      onCurrentChange(current) {
        this.current = current;
      },
      // 更新弹窗状态
      updateVisible(visible) {
        this.$emit('update:visible', visible);
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    computed: {
      isCreateEnable() {
        return this.selection.length > 0 && this.selection;
      },
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    }
  };
</script>
<style lang=""></style>
