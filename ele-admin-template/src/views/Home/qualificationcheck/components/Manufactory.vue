<template lang="">
  <div class="container">
    <ele-modal
      width="60%"
      :title="
        factoryModalType == '0'
          ? '选择医疗器械注册人或备案人'
          : '选择受托医疗器械生产企业名称'
      "
      :visible="visible"
      @update:visible="updateVisible"
      position="center"
      :resizable="true"
      :maxable="true"
      :destroy-on-close="true"
      append-to-body
    >
      <ele-pro-table
        highlight-current-row
        highlight-selection-row
        ref="table"
        @current-change="onCurrentChange"
        height="40vh"
        :rowClickChecked="true"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="ManufactoryTable"
      >
        <template v-slot:toolbar>
          <div>
            <el-form :inline="true" label-width="0px" class="ele-form-search">
              <el-form-item>
                <el-input
                  v-model="where.MANUFACTURING_ENT_NAME"
                  placeholder="请输入生产企业名称"
                  clearable
                  size="mini"
                ></el-input>
              </el-form-item>

              <el-form-item style="width: 350px">
                <el-date-picker
                  v-model="where.date"
                  type="daterange"
                  size="mini"
                  clearable
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  @click="reload(where)"
                  icon="el-icon-search"
                  >搜索</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </template>
      </ele-pro-table>
      <!-- template -->
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
          @click="chooseFacotory"
          >确 定</el-button
        >
      </span>
    </ele-modal>
  </div>
</template>
<script>
  import { getFactory } from '@/api/Home/Qualificationcheck/index';
  export default {
    name: 'Manufactory',
    props: ['visible', 'factoryModalType'],
    data() {
      const defaultWhere = {
        MANUFACTURING_ENT_NAME: '',
        date: ''
      };
      return {
        where: { ...defaultWhere },
        columns: [
          {
            type: 'index',
            columnKey: 'index',
            minWidth: 60,
            align: 'center'
          },
          {
            label: '生产企业名称',
            prop: 'MANUFACTURING_ENT_NAME',
            minWidth: 200,
            showOverflowTooltip: true
          },
          {
            label: '生产许可证号',
            prop: 'MANUFACTURING_LICENSE',
            minWidth: 200,
            showOverflowTooltip: true
          },
          {
            label: '许可证有效期',
            prop: 'MANUFACTURING_LICENSE_TIME',
            minWidth: 200,
            showOverflowTooltip: true,
            formatter: (row, column, cellValue) => {
              return row.MANUFACTURING_LICENSE_TIME.replace('T', ' ');
            }
          },
          {
            label: '创建人',
            prop: 'CREATE_MAN',
            minWidth: 200,
            showOverflowTooltip: true
          },
          {
            label: '更新时间',
            prop: 'UPDATE_TIME',
            minWidth: 150,
            showOverflowTooltip: true,
            formatter: (row, column, cellValue) => {
              return row.UPDATE_TIME.replace('T', ' ');
            }
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
        let data = getFactory({ page, limit, where, order }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      // 表格行点击事件
      onCurrentChange(row) {
        this.current = row;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      /* 更新visible */
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      chooseFacotory() {
        this.$emit('chooseFacotory', {
          current: this.current,
          type: this.factoryModalType
        });
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    }
  };
</script>
<style scoped></style>
