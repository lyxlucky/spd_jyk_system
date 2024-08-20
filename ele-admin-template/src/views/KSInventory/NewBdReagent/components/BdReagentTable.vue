<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      highlight-selection-row
      ref="table"
      @current-change="onCurrentChange"
      height="70vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="BdReagentTable"
    >
      <template v-slot:toolbar>
        <div>
          <el-form class="ele-form-search">
            <el-row :gutter="10">
              <el-col v-bind="styleResponsive ? { lg: 6, md: 2 } : { span: 4 }">
                <el-date-picker
                  v-model="where.date"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  size="mini"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-col>
              <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }">
                <el-input
                  v-model="where.drugsCode"
                  size="mini"
                  placeholder="请输入耗材编码"
                ></el-input>
              </el-col>

              <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="reload(where)">查询</el-button>
                <el-button type="success" size="mini" icon="el-icon-download" @click="exportData()">导出</el-button>
              </el-col>

            </el-row>
          </el-form>
        </div>
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import { utils, writeFile } from 'xlsx';
  import { queryPickAllDetail } from '@/api/KSInventory/NewBdReagent/index';
  export default {
    name: 'BdReagentTable',
    components: {},
    data() {
      const defaultWhere = {
        drugsCode: '',
        date: []
      };
      return {
        where: { ...defaultWhere },
        columns: [
          {
            prop: 'dept_no',
            label: '科室名称',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'dept_name',
            label: '用户名',
            minWidth: 130,
            align: 'center',
            showOverflowTooltip: true

          },
          {
            prop: 'drugs_code',
            label: '品种编码',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true

          },
          {
            prop: 'drugs_name',
            label: '品种名称',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true

          },
          {
            prop: 'drugs_spec',
            label: '规格',
            minWidth: 60,
            align: 'center',
            showOverflowTooltip: true

          },
          {
            prop: 'qty',
            label: '领出数量',
            minWidth: 60,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'pick_time',
            label: '领出时间',
            minWidth: 60,
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
        let data = queryPickAllDetail({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.list
          };
          return tData;
        });
        return data;
      },
      onCurrentChange(row) {
        this.current = row;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      exportData() {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(({ where, order }) => {
          queryPickAllDetail({
            page: 1,
            limit: 999999,
            where: where,
            order: order
          })
            .then((res) => {
              loading.close();
              const array = [
                [
                  '科室名称',
                  '用户名',
                  '品种编码',
                  '品种名称',
                  '规格',
                  '领出数量',
                  '领出时间',
                ]
              ];
              res.list.forEach((d) => {
                array.push([
                  d.dept_no,
                  d.dept_name,
                  d.drugs_code,
                  d.drugs_name,
                  d.drugs_spec,
                  d.qty,
                  d.pick_time,
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(array)
                  }
                },
                '试剂柜.xlsx'
              );
              this.$message.success('导出成功');
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        });
      },
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    }
  };
</script>
<style lang=""></style>
