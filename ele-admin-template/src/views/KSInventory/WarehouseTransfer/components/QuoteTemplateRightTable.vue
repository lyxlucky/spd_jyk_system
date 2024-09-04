<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      @current-change="onCurrentChange"
      ref="table"
      height="48vh"
      :initLoad="false"
      :stripe="false"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="QuoteTemplateRightTableKey"
    >
      <template v-slot:toolbar>
        <el-form class="ele-form-search">
          <el-row :gutter="10">
            <el-col :lg="14" :md="4">
              <el-form-item label="">
                <el-input
                  v-model="where.SerachName"
                  size="mini"
                  placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4">
              <el-form-item label="">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="reload(where)"
                  >查询</el-button
                >
              </el-form-item>
            </el-col>

            <el-col :lg="2" :md="4">
              <el-form-item label="">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-circle-plus-outline"
                  :disabled="!isCreateEnable"
                  @click="importItem()"
                  >导入品种</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 操作列 -->
      <template v-slot:TempletQty="{ row }">
        <el-input-number
          style="width: 120px"
          v-model="row.TempletQty"
          :min="0"
          :max="999999999"
          :step="1"
          size="mini"
        />
      </template>
      <template v-slot:AUTH="{ row }">
        <el-input-number
          style="width: 120px"
          v-model="row.AUTH"
          :min="0"
          :max="999999999"
          :step="1"
          size="mini"
        />
      </template>
      <template v-slot:action="{ row }">
        <el-popconfirm
          class="ele-action"
          title="确定要删除此品种吗？"
          @confirm="remove(row)"
        >
          <template v-slot:reference>
            <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link>
          </template>
        </el-popconfirm>
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import { createDEPT_TK_VAR } from '@/api/KSInventory/WarehouseTransfer/index';
  import {
    SerachTempletDeta,
    DeleteTempletDeta
  } from '@/api/KSInventory/ApplyTemp';
  export default {
    name: 'QuoteTemplateRightTable',
    components: {},
    props: ['mainId'],
    data() {
      const defaultWhere = {
        ID: '',
        SerachName: ''
      };
      return {
        where: { ...defaultWhere },
        addItemVisible: false,
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            slot: 'TempletQty',
            label: '模板申领数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 160,
            fixed: 'left'
          },

          {
            columnKey: 'action',
            label: '操作',
            width: 80,
            align: 'center',
            resizable: false,
            slot: 'action',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'VarName',
            label: '品种全称',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'GG',
            label: '型号/规格',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'Unit',
            label: '单位',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Price',
            label: '结算价',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Manufacturing',
            label: '生产企业名称',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'StockQty',
            label: '散货库存',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },

          {
            prop: '月均用量',
            label: '平均使用数量',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'BigBoxCount',
            label: '大包装数量',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110,
            show: false
          },
          {
            prop: 'MinBoxCount',
            label: '中包装数量',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110,
            show: false
          },
          {
            prop: 'PAG_TYPE',
            label: '包装规格',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'ZB',
            label: '是否中标',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90,
            formatter: (row, column, cellValue) => {
              if (cellValue == 0) {
                return '否';
              } else if (cellValue == 1) {
                return '是';
              } else {
                return '未知';
              }
            }
          },
          {
            slot: 'AUTH',
            label: '排序',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 160
          },
          {
            prop: 'SUPPLIER_NAME',
            label: '供应商',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          }
        ],
        toolbar: false,
        pageSize: 10,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        leftTableCurrent: null,
        TK_MAIN_ID: ''
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        where.UserId = this.$store.state.user.info.ID;
        where.TempletMasteID = this.where.ID;
        let data = SerachTempletDeta({ page, limit, where, order })
          .then((res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          })
          .finally(() => {
            this.$refs.table.toggleAllSelection();
          });
        return data;
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      importItem() {
        // const isAllHaveCount = this.selection.every((item) => item.COUNT > 0);
        // if (!isAllHaveCount) return this.$message.error('请填写数量');
        const json = this.selection.map((item) => {
          return {
            VARIETIE_CODE: item.VarID,
            QTY: item.TempletQty
          };
        });
        const loading = this.$messageLoading('正在处理...');
        createDEPT_TK_VAR({ json: json, TK_MAIN_ID: this.mainId })
          .then((res) => {
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => {
            loading.close();
            this.$bus.$emit('QuoteTemplateAllDone');
          });
      },
      remove(row) {
        var data = {
          ID: row.ID
        };
        const loading = this.$messageLoading('删除中...');
        DeleteTempletDeta(data)
          .then((res) => {
            loading.close();
            this.$message(res.msg);
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message(err);
          });
      }
    },
    computed: {
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      isCreateEnable() {
        return this.leftTableCurrent;
      }
    },
    mounted() {
      this.$bus.$on('QuoteTemplateLeftTableChange', (data) => {
        this.leftTableCurrent = data;
        this.where.ID = data.ID;
        this.reload(this.where);
      });
    },
    beforeDestroy() {
      this.$bus.$off('QuoteTemplateLeftTableChange');
    }
  };
</script>
<style lang=""></style>
