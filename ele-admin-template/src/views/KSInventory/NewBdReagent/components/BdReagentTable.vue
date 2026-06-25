<template>
  <div class="new-bd-reagent-table">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body">
        <el-form
          size="mini"
          :inline="true"
          class="ele-form-search"
          @keyup.enter.native="search"
          @submit.native.prevent
        >
          <el-form-item label="日期" class="date-range-item">
            <el-date-picker
              v-model="where.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 240px"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="耗材编码">
            <el-input
              v-model="where.drugsCode"
              clearable
              style="width: 140px"
              placeholder="耗材编码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-download" @click="exportData">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head">试剂柜领用列表</div>
      <div class="spd-table-panel__wrap">
        <ele-pro-table
          highlight-current-row
          highlight-selection-row
          ref="table"
          class="data-table"
          size="mini"
          border
          stripe
          :toolbar="false"
          :header-overflow-hidden="false"
          :height="tableHeight"
          :rowClickChecked="true"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="NewBdReagentTable"
          @current-change="onCurrentChange"
        >
          <!-- <template v-slot:toolbar>
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
      </template> -->
        </ele-pro-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import { queryPickAllDetail } from '@/api/KSInventory/NewBdReagent/index';
  import moment from 'moment';

  const getDefaultDateRange = () => [
    moment().startOf('month').format('YYYY-MM-DD'),
    moment().endOf('month').format('YYYY-MM-DD')
  ];

  const defaultWhere = () => ({
    drugsCode: '',
    date: getDefaultDateRange()
  });

  export default {
    name: 'BdReagentTable',
    data() {
      return {
        where: defaultWhere(),
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
            minWidth: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'qty',
            label: '领出数量',
            minWidth: 90,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'pick_time',
            label: '领出时间',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          }
        ],
        tableHeight: 'calc(100vh - 330px)',
        pageSize: 10,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    methods: {
      getQueryWhere(where = {}) {
        return {
          ...this.where,
          ...where
        };
      },
      datasource({ page, limit, where, order }) {
        return queryPickAllDetail({
          page,
          limit,
          where: this.getQueryWhere(where),
          order
        }).then((res) => {
          return {
            count: res.total,
            list: res.list
          };
        });
      },
      onCurrentChange(row) {
        this.current = row;
      },
      search() {
        this.reload(this.where);
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: this.getQueryWhere(where) });
      },
      exportData() {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(({ where, order }) => {
          queryPickAllDetail({
            page: 1,
            limit: 999999,
            where: this.getQueryWhere(where),
            order
          })
            .then((res) => {
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
              this.$message.error(e.message);
            })
            .finally(() => {
              loading.close();
            });
        });
      }
    },
    created() {
      localStorage.setItem('NewBdReagentTableSize', JSON.stringify('mini'));
    }
  };
</script>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-bottom: 0;
}

/* ele-form-search 默认限制 content 最大 200px，daterange 会溢出盖住下一项 label */
.date-range-item :deep(.el-form-item__content) {
  max-width: none !important;
}
</style>
