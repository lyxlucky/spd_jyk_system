<template lang="">
  <div>
    <NewDeptPlannedDeliveryTopTableSearch />
    <ele-pro-table
      :reserve-selection="true"
      highlight-current-row
      @current-change="onCurrentChange"
      ref="table"
      height="20vh"
      :needPage="false"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="financialTableCacheKey"
      key="financialTableKey"
    >
    </ele-pro-table>
  </div>
</template>
<script>
import { SearchDeptPlanMsg } from '@/api/Task/NewDeptPlannedDelivery';
  import NewDeptPlannedDeliveryTopTableSearch from './NewDeptPlannedDeliveryTopTableSearch';
  export default {
    name: 'NewDeptPlannedDeliveryTopTable',
    components: {
      NewDeptPlannedDeliveryTopTableSearch
    },
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        columns: [
          {
            columnKey: 'index',
            type: 'index',
            label:"序",
            width: 45,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            prop: 'Plan_Number',
            label: '计划单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'SPDBZ',
            label: 'SPD备注',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'BZ',
            label: '备注',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (_row, _column, cellValue) => {
              let bz = '';
              if (_row.SQREMARK != null) {
                bz = bz + _row.SQREMARK;
              } else if (_row.Note_Description != null) {
                bz = bz + _row.Note_Description;
              }
              return bz;
            }
          },
          {
            prop: 'REMARK',
            label: '科室备注',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'Priority',
            label: '订单优先级',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (_row, _column, cellValue) => {
              if (_row.Priority == '0') return '普通';
              else if (_row.Priority == '1') return '紧急';
              else if (_row.Priority == '2') return '非常紧急';
            }
          },
          {
            prop: 'Plan_Time',
            label: '计划时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Apply_State',
            label: '计划单状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90,
            formatter: (_row, _column, cellValue) => {
              if (_row.Apply_State == '10' || _row.Apply_State == 10)
                return '强制结束';
              else if (
                _row.Left_Apply_Qty == _row.Apply_Qty &&
                _row.Apply_State != '10'
              )
                return '新增';
              else if (
                _row.Left_Apply_Qty > 0 &&
                _row.Left_Apply_Qty != _row.Apply_Qty &&
                _row.Apply_State != '10'
              )
                return '未收全';
              else if (_row.Left_Apply_Qty == 0 && _row.Apply_State != '10')
                return '已收全';
              else return '-';
            }
          },
          {
            prop: 'Dept_Two_Name',
            label: '二级科室名称/审核科室',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'DEPT_AUTH_CODE',
            label: '二级科室授权',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Varietie_Code_New',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'CHARGING_CODE',
            label: '计费编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'CHARGING_CODE',
            label: '计费编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'YG_CODE',
            label: '阳光产品码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Varietie_Name',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Specification_Or_Type',
            label: '规格型号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
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
            label: '中标价',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'SUPPLIER_NAME',
            label: '供应商',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'CONTRACT_TYPE',
            label: '合同类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (_row, _column, cellValue) => {
              if (_row.CONTRACT_TYPE == '0') return '-';
              else if (_row.CONTRACT_TYPE == '1') return '中标';
              else if (_row.CONTRACT_TYPE == '2') return '临采';
              else return '';
            }
          },
          {
            prop: 'Manufacturing_Ent_Name',
            label: '生产企业名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'Apply_Qty',
            label: '申请数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'Left_Apply_Qty',
            label: '剩余申请数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'Center_Inside_Goods_Qty',
            label: '院内散货数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'Center_Outside_Goods_Qty',
            label: '院外散货数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'Center_Inside_Def_Qty',
            label: '院内定数包',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'Center_Outside_Def_Qty',
            label: '院外定数包',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'BH_NUM',
            label: '备货数（散）',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'USE_GOODS_QTY',
            label: '近30天用量（对应科室）',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'STOREHOUSE_UPPPER',
            label: '中心库上限',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'STOREHOUSE_LOWER',
            label: '中心库下限',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'MIDDLE_PACKAGE_COUNT',
            label: '中包装数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'BIG_BOX_COUNT',
            label: '大包装数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'PAG_TYPE',
            label: '包装规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'PLAN_SUBMITTER',
            label: '申领人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          }
        ],
        pageSize: 10,
        pageSizes: [10, 20, 40, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = SearchDeptPlanMsg({ page, limit, where, order }).then(
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
      onCurrentChange(row) {}
    }
  };
</script>
<style lang=""></style>
