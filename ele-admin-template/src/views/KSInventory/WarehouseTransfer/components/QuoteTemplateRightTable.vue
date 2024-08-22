<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      @current-change="onCurrentChange"
      ref="table"
      height="48vh"
      :initLoad="false"
      :rowClickChecked="true"
      :stripe="false"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="QuoteTemplateRightTableKey"
    >
      <template v-slot:toolbar>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus-outline"
          :disabled="!isCreateEnable"
          @click="addItemVisible = true"
          >引入品种</el-button
        >

        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus-outline"
          :disabled="!isCreateEnable"
          @click="importItem()"
          >导入品种</el-button
        >
      </template>

      <template v-slot:APPLY_QTY="{ row }">
        <el-input-number
          v-model="row.APPLY_QTY"
          size="mini"
          :min="0"
          class="ele-fluid"
        />
      </template>
    </ele-pro-table>

    <AddVarietieTable
      :leftTableCurrent="leftTableCurrent"
      :visible.sync="addItemVisible"
    />
  </div>
</template>
<script>
  import AddVarietieTable from './AddVarietieTable';
  import {
    chooseDefPkgTableList,
    templateVarietieList,
    createDEPT_TK_VAR
  } from '@/api/KSInventory/WarehouseTransfer/index';
  export default {
    name: 'QuoteTemplateRightTable',
    components: {
      AddVarietieTable
    },
    data() {
      const defaultWhere = {
        id: ''
      };
      return {
        where: { ...defaultWhere },
        addItemVisible: false,
        columns: [
          {
            slot: 'APPLY_QTY',
            label: '数量',
            minWidth: 120,
            align: 'center'
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            minWidth: 110,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            minWidth: 110,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '包装规格',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            minWidth: 60,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
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
        datasourceList: [],
        TK_MAIN_ID: ''
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = templateVarietieList({ page, limit, where, order }).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            this.datasourceList = res.result;
            return tData;
          }
        );
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
        const json = this.datasourceList.map((item) => {
          return {
            VARIETIE_CODE: item.VARIETIE_CODE,
            QTY: item.COUNT
          };
        });
        const loading = this.$messageLoading('正在处理...');
        createDEPT_TK_VAR({ json: json, TK_MAIN_ID: this.TK_MAIN_ID })
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
      this.$bus.$on(`${this.$route.path}/LeftTableChange`, (row) =>{
        this.TK_MAIN_ID = row.ID;
      });
      this.$bus.$on('QuoteTemplateLeftTableChange', (data) => {
        this.leftTableCurrent = data;
        this.where.id = data.ID;
        this.reload(this.where);
      });
    },
    beforeDestroy() {
      this.$bus.$off('QuoteTemplateLeftTableChange');
    }
  };
</script>
<style lang=""></style>
