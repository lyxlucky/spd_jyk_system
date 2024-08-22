<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      @current-change="onCurrentChange"
      ref="table"
      height="48vh"
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
          @click="addItem()"
          >添加品种</el-button>
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  export default {
    name: 'QuoteTemplateRightTable',
    components: {},
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        columns: [],
        toolbar: false,
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
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
      }
    },
    computed: {
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    }
  };
</script>
<style lang=""></style>
