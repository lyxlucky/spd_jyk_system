<template>
  <div>
    <el-card>
      <div slot="header">备货计划单品种明细</div>
      <div>
        <el-form :model="form" :inline="true" size="mini">
          <!-- 表单元素 -->
          <el-form-item>
            <el-input
              v-model="form.varietie_code"
              placeholder="品种编码/名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.stock_up_plan_no"
              placeholder="备货计划编号"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.supplier_name"
              placeholder="供应商名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.Manufacturing_Ent_Name"
              placeholder="生产企业"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.Specification_Or_Type"
              placeholder="规格型号"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.PLAN_DEPT_TWO_NAME"
              placeholder="计划科室"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="form.start_time"
              type="date"
              placeholder="开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="form.end_time"
              type="date"
              placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.remark" placeholder="订单状态">
              <el-option label="全部" value=""> </el-option>
              <el-option label="已备注" value="0"> </el-option>
              <el-option label="未备注" value="1"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchCheckPlanDel"
              >查询勾选计划</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exportCurrentOrder"
              >导出当前订单</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exportSelectedOrders"
              >导出勾选订单</el-button
            >
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="table"
          height="250px"
          :columns="columns"
          :datasource="datasource"
          highlight-current-row
          size="mini"
          @selection-change="handleSelectionChange"
          :paging="false"
          @row-click="handleRowClick"
        >
        </ele-pro-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { getStockUpVarInfo } from '@/api/Task/FollowingGoodsPlanHrp';
  import { utils, writeFile } from 'xlsx'; // 添加xlsx库的引入

  export default {
    name: 'StockPlanItemDetail',
    props: {
      currentTableRow: {
        type: Object,
        default: () => {
          return {};
        }
      },
      currentTableRow3: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },

    data() {
      return {
        //选中对象
        selection: [],
        // 数据对象

        form: {
          varietie_code: '', // 品种编码/名称
          stock_up_plan_no: '', // 备货计划编号
          supplier_name: '', // 供应商名称
          Manufacturing_Ent_Name: '', // 生产企业
          Specification_Or_Type: '', // 规格型号
          PLAN_DEPT_TWO_NAME: '', // 计划科室
          remark: '', // 订单状态
          // remark: '', // 备注
          start_time: '',
          end_time: '',
          order_pc: 'desc' // 排序方式
        },
        columns: [
          {
            type: 'selection',
            width: 45,
            fixed: 'left',
            align: 'center'
          },
          {
            label: '备货日期',
            prop: 'PLAN_TIME',
            align: 'center',
            width: 90,
            formatter: (row) => {
              if (row.PLAN_TIME != null) {
                return row.PLAN_TIME.substr(0, 10);
              } else {
                return row.PLAN_TIME;
              }
            }
          },
          // {
          //   label: '线上线下',
          //   prop: 'XSXX_JC',
          //   width: 90,
          //   sortable: true,
          //   formatter: (row) => {
          //     if (row.XSXX_JC == "1")
          //       return "线上";
          //     if (row.XSXX_JC == "2")
          //       return "线下";
          //     if (row.XSXX_JC == "3")
          //       return "集采";
          //     else
          //       return "无";
          //   }
          // },
          {
            label: '来源科室',
            prop: 'PLAN_DEPT_TWO_NAME',
            align: 'center',
            width: 120
          },
          {
            label: '品种编码',
            prop: 'Varietie_Code_New',
            align: 'center',
            width: 100
          },
          {
            label: '备注',
            prop: 'REMARKS',
            align: 'center',
            width: 90
          },
          {
            label: '省平台编码',
            prop: 'Province_Platform_Code',
            align: 'center',
            minWidth: 100
          },
          {
            label: '阳光产品码',
            prop: 'YG_CODE',
            align: 'center',
            minWidth: 100
          },
          {
            label: '品种名称',
            prop: 'Varietie_Name',
            align: 'center',
            minWidth: 200,
            showOverflowTooltip: true,
            className: 'no-wrap-cell'
          },
          {
            label: '型号/规格',
            prop: 'Specification_Or_Type',
            align: 'center',
            minWidth: 360,
            showOverflowTooltip: true,
            className: 'no-wrap-cell'
          },
          {
            label: '单位',
            prop: 'Unit',
            width: 50,
            align: 'center'
          },
          {
            label: '价格',
            width: 100,
            align: 'center',
            formatter: (row) => {
              return row.supply_price.toFixed(row.price_bl);
            }
          },
          {
            label: '供应商名称',
            prop: 'supplier_name',
            align: 'center',
            minWidth: 210
          },
          {
            label: '生产企业名称',
            prop: 'Manufacturing_Ent_Name',
            align: 'center',
            minWidth: 310
          },
          {
            label: '折算散货',
            prop: 'Stock_Up_Plan_Goods_Quantity',
            align: 'center',
            width: 80
          },
          {
            label: '系数',
            prop: 'Coefficient',
            align: 'center',
            width: 50
          },
          {
            label: '备货计划(包)',
            align: 'center',
            width: 80,
            prop: 'Stock_Up_Plan_Def_Quantity'
          },
          {
            label: '收货数量',
            prop: 'ReceiptQty',
            width: 80,
            align: 'center',
            formatter: (row) => {
              return row.ReceiptQty + row.SANME_VARCODE_NUM;
            }
          },
          {
            label: '上月用量',
            prop: 'USED_QTY',
            width: 80,
            align: 'center'
          },
          {
            label: '三月平均量',
            prop: 'AVG_USED_QTY',
            width: 80,
            align: 'center'
          },
          {
            label: '库存总量',
            prop: 'sumCount',
            width: 80,
            align: 'center',
            formatter: (row) => {
              return row.sumCount + row.DEPT_NUM;
            }
          },
          {
            label: '中心库库存',
            prop: 'centerStockCount',
            width: 80,
            align: 'center',
            formatter: (row) => {
              return row.sumCount;
            }
          },
          {
            label: '科室库存',
            prop: 'DEPT_NUM',
            width: 80,
            align: 'center'
          },
          {
            label: '合同到期',
            prop: 'CONTRACT_END_TIME',
            width: 240,
            align: 'center',
            valueType: 'html',
            sortable: true,
            // renderCell: (h, { row }) => {
            //   var bvp_date = row.CONTRACT_END_TIME.substr(0, 10);
            //   var this_date = new Date(bvp_date).getTime();
            //   var nowDate = new Date().getTime();

            //   if (this_date <= nowDate) {
            //     return h('span', { style: { color: 'red' } }, bvp_date);
            //   } else {
            //     return h('span', {}, `${bvp_date}|${parseInt(((this_date - nowDate) / (60 * 60 * 24 * 1000)).toFixed(0))}天`);
            //   }
            // }
            formatter: (row) => {
              var bvp_date = row.CONTRACT_END_TIME.substr(0, 10);
              var bvp_dateDET_CONTRACT_END = row.DET_CONTRACT_END.substr(0, 10);
              var this_date = new Date(bvp_date).getTime();
              var this_dateDET_CONTRACT_END = new Date(
                bvp_dateDET_CONTRACT_END
              ).getTime();
              var nowDate = new Date().getTime();
              if (this_date <= nowDate) {
                // return `<span style="color:red">${row.CONTRACT_END_TIME.substr(0, 10)}</span>`;
                return `${row.CONTRACT_END_TIME.substr(0, 10)}`;
              } else {
                return `${row.CONTRACT_END_TIME.substr(0, 10)}|${parseInt(
                  ((this_date - nowDate) / (60 * 60 * 24 * 1000)).toFixed(0)
                )}天`;
              }
            }
          },
          {
            label: '合同明细到期',
            prop: 'DET_CONTRACT_END', // 修改了属性名，避免重复
            width: 140,
            align: 'center',
            sortable: true,
            formatter: (row) => {
              var bvp_date = row.CONTRACT_END_TIME.substr(0, 10);
              var bvp_dateDET_CONTRACT_END = row.DET_CONTRACT_END.substr(0, 10);
              var this_date = new Date(bvp_date).getTime();
              var this_dateDET_CONTRACT_END = new Date(
                bvp_dateDET_CONTRACT_END
              ).getTime();
              var nowDate = new Date().getTime();

              if (this_dateDET_CONTRACT_END <= nowDate) {
                return `<span style="color:red">${row.DET_CONTRACT_END.substr(
                  0,
                  10
                )}</span>`;
              } else {
                return `${row.DET_CONTRACT_END.substr(0, 10)}|${parseInt(
                  (
                    (this_dateDET_CONTRACT_END - nowDate) /
                    (60 * 60 * 24 * 1000)
                  ).toFixed(0)
                )}天`;
              }
            }
          },
          {
            label: '合同名称',
            prop: 'CONTRACT_NAME',
            align: 'center',
            minWidth: 200
          },
          {
            label: '收货间期',
            prop: 'DELIVERY_TIME',
            align: 'center',
            minWidth: 100,
            formatter: (row) => {
              var bvp_date = row.DELIVERY_TIME.substr(0, 10);
              var PLAN_TIME = row.PLAN_TIME.substr(0, 10);
              if (bvp_date == '0001-01-01') {
                return '未收货';
              }
              var this_date = new Date(bvp_date).getTime();
              var plan_date = new Date(PLAN_TIME).getTime();
              return (
                parseInt(
                  ((this_date - plan_date) / (60 * 60 * 24 * 1000)).toFixed(0)
                ) + '天'
              );
            }
          },
          {
            label: '备货计划单号',
            prop: 'Stock_Up_Plan_No',
            align: 'center',
            width: 100
          },
          {
            label: '备货人',
            prop: 'CREATOR',
            align: 'center',
            width: 80
          },
          {
            label: '来源',
            prop: 'SOURCE_FROM',
            align: 'center',
            width: 120
          }
        ]
      };
    },
    methods: {
      handleSearch() {
        this.$refs.table.reload({ page: 1 });
      },
      searchCheckPlanDel() {
        this.$refs.table.reload({ page: 1 });
      },
      handleSelectionChange(selection) {
        this.selection = selection;
        // console.log(this.$refs.table)
      },
      handleRowClick(row) {
        // console.log('表2',row)
        this.$emit('onClickRow', row);
      },
      // 导出当前订单数据
      exportCurrentOrder() {
        // const loading = this.$loading({
        //   lock: true,
        //   text: '正在导出数据...',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // });
        const loading = this.$messageLoading('正在导出数据...');

        getStockUpVarInfo({
          page: 1,
          limit: this.$refs.table?.tableTotal || 99999,
          where: {
            ...this.form,
            order_state: this.currentTableRow?.ORDER_STATE || '',
            id: this.currentTableRow3?.ID || ''
          }
        })
          .then((res) => {
            loading.close();
            let data = res.data;
            if (data.code == '200' && data.result.length > 0) {
              this.exportToExcel(data.result, '备货计划单品种明细');
            } else {
              this.$message.warning('没有数据可导出');
            }
          })
          .catch(() => {
            loading.close();
            this.$message.error('导出失败');
          })
          .finally(() => {
            loading.close();
          });
      },
      // 导出选中的订单数据
      exportSelectedOrders() {
        if (this.selection.length === 0) {
          this.$message.warning('请先选择要导出的数据');
          return;
        }

        this.exportToExcel(this.selection, '备货计划单品种明细-已选择');
      },
      // 通用的Excel导出方法
      exportToExcel(data, fileName) {
        try {
          // 准备表头
          const headers = this.columns
            .filter((col) => col.type !== 'selection' && col.label)
            .map((col) => col.label);

          // 准备字段名
          const fields = this.columns
            .filter((col) => col.type !== 'selection' && col.prop)
            .map((col) => ({
              prop: col.prop,
              formatter: col.formatter
            }));

          // 准备数据
          const excelData = [];
          excelData.push(headers); // 添加表头

          // 添加数据行
          data.forEach((row) => {
            const rowData = [];
            fields.forEach((field) => {
              if (field.formatter) {
                // 如果有格式化函数，使用格式化后的值
                rowData.push(field.formatter(row));
              } else {
                // 否则直接使用原始值
                rowData.push(row[field.prop]);
              }
            });
            excelData.push(rowData);
          });

          // 创建工作簿和工作表
          const wb = {
            SheetNames: ['Sheet1'],
            Sheets: {
              Sheet1: utils.aoa_to_sheet(excelData)
            }
          };

          // 写入文件并下载
          writeFile(wb, `${fileName}.xlsx`);
          this.$message.success('导出成功');
        } catch (error) {
          console.error('导出Excel失败:', error);
          this.$message.error('导出失败');
        }
      },
      // 方法定义
      datasource({ page, limit, sort, where }) {
        return getStockUpVarInfo({
          page,
          limit,
          sort,
          where: {
            ...this.form,
            order_state: this.currentTableRow?.ORDER_STATE || '',
            id: this.currentTableRow3?.ID || ''
          }
        }).then((res) => {
          // console.log(res.data);
          let data = res.data;
          if (data.code == '200') {
            return {
              count: data.total,
              list: data.result
            };
          }
          return {
            count: 0,
            list: []
          };
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  :deep(.no-wrap-cell) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .red {
    color: red;
  }
</style>
