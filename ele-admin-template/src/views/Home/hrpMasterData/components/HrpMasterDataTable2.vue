<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>主数据明细</span>
      </div>
      <ele-pro-table
        size="mini"
        ref="table"
        height="550"
        :columns="columns"
        highlight-current-row
        :datasource="datasource"
        :paging="false"
      ></ele-pro-table>
    </el-card>
  </div>
</template>

<script>
  import { getOAMainsLinesIface } from '@/api/Home/hrpMasterData';
  export default {
    name: 'HrpMasterDataTable2',
    data() {
      return {
        columns: [
          // {
          //   prop: 'LINE_IFACE_ID',
          //   label: '行接口ID',
          //   width: 120,
          //   align: 'center',
          //   search: true,
          //   fieldProps: {
          //     placeholder: '请输入行接口ID'
          //   }
          // },
          // {
          //   prop: 'HEADER_IFACE_ID',
          //   label: '头接口ID',
          //   width: 120,
          //   align: 'center',
          //   search: true,
          //   fieldProps: {
          //     placeholder: '请输入头接口ID'
          //   }
          // },
          {
            prop: 'ITEM_NUMBER',
            label: '物料编号',
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入物料编号'
            }
          },
          {
            prop: 'ITEM_DESCRIPTION',
            label: '物料描述',
            width: 180,
            align: 'center',
            showOverflowTooltip: true,
            search: true,
            fieldProps: {
              placeholder: '请输入物料描述'
            }
          },
          {
            prop: 'STAND_VALUE',
            label: '标准值',
            width: 100,
            align: 'center'
          },
          {
            prop: 'ITEM_SPEC',
            label: '物料规格',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'HC_NUMBER',
            label: '耗材编号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'UOM',
            label: '单位',
            width: 80,
            align: 'center'
          },
          {
            prop: 'UNIT_PRICE',
            label: '单价',
            width: 100,
            align: 'center',
            formatter: (row) => {
              return row.UNIT_PRICE ? row.UNIT_PRICE.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'PACK_MIN',
            label: '最小包装',
            width: 100,
            align: 'center'
          },
          {
            prop: 'APPLY_DEPT',
            label: '申请部门',
            width: 120,
            align: 'center'
          },
          {
            prop: 'PROCESS_STATUS',
            label: '处理状态',
            width: 100,
            align: 'center',
            search: true,
            enum: [
              { label: '未处理', value: 'N' },
              { label: '已处理', value: 'S' },
              { label: '处理失败', value: 'E' }
            ],
            formatter: (row) => {
              if (row.PROCESS_STATUS === 'N') return '未处理';
              if (row.PROCESS_STATUS === 'S') return '已处理';
              if (row.PROCESS_STATUS === 'E') return '处理失败';
              return row.PROCESS_STATUS || '';
            },
            fieldProps: {
              clearable: true
            }
          },
          {
            prop: 'ERROR_MSG',
            label: '错误消息',
            width: 180,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'LINE_NUMBER',
            label: '行号',
            width: 80,
            align: 'center'
          },
          {
            prop: 'DOC_TYPE',
            label: '单据类型',
            width: 100,
            align: 'center'
          },
          {
            prop: 'HIGHVALUE_NO',
            label: '高值耗材编号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'REGISTRATION_NAME',
            label: '注册名称',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'REGISTRATION_NO',
            label: '注册号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'ORGANIZATION_NAME',
            label: '组织名称',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'FULL_NAME',
            label: '全名',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'URGENCYLEVEL',
            label: '紧急程度',
            width: 100,
            align: 'center'
          },

          {
            prop: 'IS_SF',
            label: '是否收费',
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.IS_SF === 'Y') return '是';
              if (row.IS_SF === 'N') return '否';
              return row.IS_SF || '';
            }
          },
          {
            prop: 'SF_NUMBER',
            label: '收费编号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'CATEGORY',
            label: '类别',
            width: 100,
            align: 'center'
          },
          {
            prop: 'XK_NUMBER',
            label: '许可证编号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'XY_DATE',
            label: '效期日期',
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.XY_DATE ? row.XY_DATE : '';
            }
          },
          {
            prop: 'XK_JYNUMBER',
            label: '许可证经营编号',
            width: 150,
            align: 'center'
          },
          {
            prop: 'ZJ_DATE',
            label: '注册日期',
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.ZJ_DATE ? row.ZJ_DATE : '';
            }
          },
          {
            prop: 'ZCZ_NUMBER',
            label: '注册证编号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'ZCZ_DATE',
            label: '注册证日期',
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.ZCZ_DATE ? row.ZCZ_DATE : '';
            }
          },
          {
            prop: 'ZJ_NAME',
            label: '注册人名称',
            width: 120,
            align: 'center'
          },
          {
            prop: 'ZJ_DATE1',
            label: '注册日期1',
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.ZJ_DATE1 ? row.ZJ_DATE1 : '';
            }
          },
          {
            prop: 'BAND',
            label: '品牌',
            width: 100,
            align: 'center'
          },
          {
            prop: 'CD',
            label: '产地',
            width: 100,
            align: 'center'
          },
          {
            prop: 'SCS',
            label: '生产商',
            width: 120,
            align: 'center'
          },
          {
            prop: 'SUPPLY_NUMBER',
            label: '供应商编号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'SUPPLY_NAME',
            label: '供应商名称',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'IS_XX',
            label: '是否新型',
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.IS_XX === 'Y') return '是';
              if (row.IS_XX === 'N') return '否';
              return row.IS_XX || '';
            }
          },
          {
            prop: 'IS_CJ',
            label: '是否常见',
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.IS_CJ === 'Y') return '是';
              if (row.IS_CJ === 'N') return '否';
              return row.IS_CJ || '';
            }
          },
          {
            prop: 'JJJ_TYPE',
            label: '急救类型',
            width: 100,
            align: 'center'
          },
          {
            prop: 'IS_LS',
            label: '是否临时',
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.IS_LS === 'Y') return '是';
              if (row.IS_LS === 'N') return '否';
              return row.IS_LS || '';
            }
          },
          {
            prop: 'CONTRACT_NAME',
            label: '联系人姓名',
            width: 120,
            align: 'center'
          },
          {
            prop: 'CONTRACT_PHONE',
            label: '联系人电话',
            width: 120,
            align: 'center'
          },
          {
            prop: 'CONTRACT_EMAIL',
            label: '联系人邮箱',
            width: 150,
            align: 'center'
          },
          {
            prop: 'SJ_PRICE',
            label: '上架价格',
            width: 100,
            align: 'center',
            formatter: (row) => {
              return row.SJ_PRICE ? row.SJ_PRICE.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'SJ_CHECKNAME',
            label: '上架审核人',
            width: 120,
            align: 'center'
          },
          {
            prop: 'SJ_SFNAME',
            label: '上架收费名称',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SJ_SWNUMBER',
            label: '上架税务编号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'SJ_SWPRICE',
            label: '上架税务价格',
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.SJ_SWPRICE ? row.SJ_SWPRICE.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'MID_COUNT',
            label: '中包数量',
            width: 100,
            align: 'center',
            formatter: (row) => {
              return row.MID_COUNT ? row.MID_COUNT.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'MID_UOM',
            label: '中包单位',
            width: 100,
            align: 'center'
          },
          {
            prop: 'MAX_COUNT',
            label: '大包数量',
            width: 100,
            align: 'center',
            formatter: (row) => {
              return row.MAX_COUNT ? row.MAX_COUNT.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'MAX_UOM',
            label: '大包单位',
            width: 100,
            align: 'center'
          },
          {
            prop: 'ISGZ_DZ',
            label: '是否跟踪到组',
            width: 120,
            align: 'center',
            formatter: (row) => {
              if (row.ISGZ_DZ === 'Y') return '是';
              if (row.ISGZ_DZ === 'N') return '否';
              return row.ISGZ_DZ || '';
            }
          },
          {
            prop: 'GZ_XH',
            label: '跟踪型号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'ZD_HCNAME',
            label: '指定耗材名称',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'ISZR',
            label: '是否植入',
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.ISZR === 'Y') return '是';
              if (row.ISZR === 'N') return '否';
              return row.ISZR || '';
            }
          },
          {
            prop: 'ISJR',
            label: '是否介入',
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.ISJR === 'Y') return '是';
              if (row.ISJR === 'N') return '否';
              return row.ISJR || '';
            }
          },
          {
            prop: 'TYPE_NUMBER',
            label: '型号编码',
            width: 120,
            align: 'center'
          },
          {
            prop: 'JPS_NUMBER',
            label: '计价方式编号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'JPS_NAME',
            label: '计价方式名称',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'ZC_ENVIRONMENT',
            label: '注册环境',
            width: 120,
            align: 'center'
          },
          {
            prop: 'UDI_DI',
            label: 'UDI-DI',
            width: 120,
            align: 'center'
          },
          {
            prop: 'ISACTIVE',
            label: '是否激活',
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.ISACTIVE === 'Y') return '是';
              if (row.ISACTIVE === 'N') return '否';
              return row.ISACTIVE || '';
            }
          },
          {
            prop: 'SB_CODE',
            label: '设备编码',
            width: 120,
            align: 'center'
          },
          {
            prop: 'SB_XHNAME',
            label: '设备XH名称',
            width: 120,
            align: 'center'
          },
          {
            prop: 'ISJK',
            label: 'ISJK',
            width: 120,
            align: 'center'
          },
          {
            prop: 'GOODSID',
            label: 'GOODSID',
            width: 120,
            align: 'center'
          },
          {
            prop: 'SF_CODE',
            label: 'SF_CODE',
            width: 120,
            align: 'center'
          }
        ]
      };
    },
    methods: {
      reload({ where }) {
        this.$refs.table.reload({ page: 1, where: where });
        console.log(where);
      },
      datasource({ page, limit, sort, where }) {
        // 实现数据源方法
        return getOAMainsLinesIface({
          page,
          size: limit,
          where
        })
          .then((res) => {
            console.log(res);
            return {
              list: res.data,
              count: res.total
            };
          })
          .catch((err) => {
            return {
              list: [],
              count: 0
            };
          });
      }
    },
    created() {},
    mounted() {},
    watch: {}
  };
</script>

<style lang="scss" scoped></style>
