<template>
  <div class="ele-body">
    <div class="ele-page-header">
      <div class="ele-page-desc">说明:如果填写了环期时间系统只会显示环期有使用的品种,因为如果环期没有使用,金额为0是无法计算增幅的,排序增幅排序只有填写了环期时间才生效</div>
    </div>
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource"
        :selection.sync="selection" cache-key="KSInventoryBasicDataTable">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
          <user-search @search="reload" @exportData="exportData" />
        </template>


        <template v-slot:HQ_PRICE="{ row }">
          <el-form-item label="">
            <el-input v-model="row.HQ_PRICE"></el-input>
          </el-form-item>
        </template>


        <!-- 操作列 -->
        <!-- <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">
            修改
          </el-link> -->
        <!-- <el-button type="primary" size="mini" @click="openEdit(row)">编辑</el-button> -->
        <!-- <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
            <template v-slot:reference>
              <el-link type="danger" :underline="false" icon="el-icon-delete">
                删除
              </el-link>
            </template>
          </el-popconfirm> -->
        <!-- </template> -->
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
    <!-- 导入弹窗 -->
    <!-- <user-import :visible.sync="showImport" @done="reload" /> -->
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import UserEdit from './components/user-edit.vue';
import {
  getMaterialStatics,
} from '@/api/KSInventory/MaterialStatics';
export default {
  name: 'MaterialStatics',
  components: {
    UserSearch,
    UserEdit
    // UserImport
  },
  computed: {
  },
  data() {
    return {
      // 表格列配置
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
        // {
        //   columnKey: 'action',
        //   label: '操作',
        //   width: 120,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true,
        //   fixed: 'left'
        // },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        {
          prop: 'MAIN_QTY',
          label: '消耗数量',
          sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'MAIN_PRICE',
          label: '消耗金额/元',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'HQ_QTY',
          label: '环期消耗数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'HQ_PRICE',
          label: '环期消耗金额/元',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'HQ_PRICE',
          label: '增幅金额',
          align: 'center',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 100,
          formatter(row, column, cellValue, index) {
            return (row.MAIN_PRICE - row.HQ_PRICE).toFixed(2);
          }
        },
        {
          prop: 'HB_ZZ',
          label: '环比增幅（%）',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            return row.HB_ZZ + "%";
          }
        },
        {
          prop: '',
          label: '使用科室1',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            return row.DeptList[0].DEPT_TWO_NAME
          }
        },
        {
          prop: '',
          label: '占比%',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            if (row.DeptList[0].DEPT_PRICE == 0) {
              return "0";
            }
            return (row.DeptList[0].DEPT_PRICE / row.MAIN_PRICE * 100).toFixed(2) + "%";
          }
        },
        {
          prop: '',
          label: '使用科室2',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            if (row.DeptList.length < 2) {
              return "无";
            }
            return row.DeptList[1].DEPT_TWO_NAME
          }
        },

        {
          prop: '',
          label: '占比%',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            if (row.DeptList.length < 2) {
              return "0";
            }
            if (row.DeptList[1].DEPT_PRICE == 0) {
              return "0";
            }
            return (row.DeptList[1].DEPT_PRICE / row.MAIN_PRICE * 100).toFixed(2) + "%";
          }
        },

        {
          prop: '',
          label: '使用科室3',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            if (row.DeptList.length < 3) {
              return "无";
            }
            return row.DeptList[2].DEPT_TWO_NAME
          }
        },

        {
          prop: '',
          label: '占比%',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            if (row.DeptList.length < 3) {
              return "0";
            }
            if (row.DeptList[2].DEPT_PRICE == 0) {
              return "0";
            }
            return (row.DeptList[2].DEPT_PRICE / row.MAIN_PRICE * 100).toFixed(2) + "%";
          }
        },

        {
          prop: '',
          label: '使用科室4',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            if (row.DeptList.length < 4) {
              return "无";
            }
            return row.DeptList[3].DEPT_TWO_NAME
          }
        },

        {
          prop: 'LIS_COUNT9',
          label: '占比%',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            if (row.DeptList.length < 4) {
              return "0";
            }
            if (row.DeptList[3].DEPT_PRICE == 0) {
              return "0";
            }
            return (row.DeptList[3].DEPT_PRICE / row.MAIN_PRICE * 100).toFixed(2) + "%";
          }
        },

        {
          prop: '',
          label: '使用科室5',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            if (row.DeptList.length < 5) {
              return "无";
            }
            return row.DeptList[4].DEPT_TWO_NAME
          }
        },

        {
          prop: '',
          label: '占比%',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            if (row.DeptList.length < 5) {
              return "0";
            }
            if (row.DeptList[4].DEPT_PRICE == 0) {
              return "0";
            }
            return (row.DeptList[4].DEPT_PRICE / row.MAIN_PRICE * 100).toFixed(2) + "%";
          }
        },

      ],
      toolbar: false,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      pagerCount: 5,
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: [],
      // 增幅金额
      increaseAmount: "",
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = getMaterialStatics({ page, limit, where, order }).then(
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
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 打开导入弹窗 */
    openImport() {
      this.showImport = true;
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.Dept_One_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        getMaterialStatics({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '品种编码',
                '品种id',
                '品种名称',
                '规格/型号',
                '生产企业名称',
                '注册证号',
                '单位',
                '中标价',
                '品种类别',
                '换算比(试剂)',
                '仪器备注',
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.Varietie_Code_New,
                d.Varietie_Code,
                d.Varietie_Name,
                d.Specification_Or_Type,
                d.Manufacturing_Ent_Name,
                d.APPROVAL_NUMBER,
                d.UNIT,
                d.Price,
                d.CLASS_NUM,
                d.CONVERSION_RATIO,
                d.DEVICE_REMARK,
                // this.$util.toDateString(d.createTime)
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '科室入库品种.xlsx'
            );
            this.$message.success("导出成功");
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    }
  },
  created() {
    // this.getdatasource();
    // console.log(this.$store.state.user.info)
  }
};
</script>
