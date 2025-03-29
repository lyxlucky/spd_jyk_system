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
  import { formatDate } from '@/utils/formdataify';
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
            label: '物料编码', // 更新
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入物料编号'
            }
          },
          {
            prop: 'ITEM_DESCRIPTION',
            label: '物料名称（产品注册证名称）', // 更新
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
            width: 140,
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
            label: '医保耗材编码', // 更新
            width: 240,
            align: 'center'
          },
          {
            prop: 'UOM',
            label: '单位', // 保持不变
            width: 80,
            align: 'center'
          },
          {
            prop: 'UNIT_PRICE',
            label: '采购价格', // 更新
            width: 100,
            align: 'center',
            formatter: (row) => {
              return row.UNIT_PRICE ? row.UNIT_PRICE.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'PACK_MIN',
            label: '最小包装数', // 更新
            width: 100,
            align: 'center'
          },
          {
            prop: 'APPLY_DEPT',
            label: '申请科室', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'PROCESS_STATUS',
            label: '状态', // 更新
            width: 100,
            align: 'center'
          },
          {
            prop: 'ERROR_MSG',
            label: '错误消息', // 保持不变
            width: 180,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'LINE_NUMBER',
            label: '行号', // 保持不变
            width: 80,
            align: 'center'
          },
          {
            prop: 'DOC_TYPE',
            label: '单据类型', // 保持不变
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.DOC_TYPE === 'GZ') return '高值';
              if (row.DOC_TYPE === 'DZ') return '低值';
            }
          },
          {
            prop: 'HIGHVALUE_NO',
            label: '申请单号', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'REGISTRATION_NAME',
            label: '耗材注册证名称', // 更新
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'REGISTRATION_NO',
            label: '注册证号', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'ORGANIZATION_NAME',
            label: '科室名称', // 更新
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'FULL_NAME',
            label: '申领人', // 更新
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'URGENCYLEVEL',
            label: '申请类型', // 更新
            width: 100,
            align: 'center'
          },

          {
            prop: 'IS_SF',
            label: '是否收费', // 保持不变
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
            label: '收费编码', // 保持不变
            width: 120,
            align: 'center'
          },
          {
            prop: 'CATEGORY',
            label: '类别', // 保持不变
            width: 140,
            align: 'center'
          },
          {
            prop: 'XK_NUMBER',
            label: 'VJ1总代经营许可证号（国产产品填写生产许可证）', // 更新
            width: 240,
            align: 'center'
          },
          {
            prop: 'XY_DATE',
            label: '证件有效期（YYYY-MM-DD)', // 更新
            width: 120,
            align: 'center',
            formatter: (row) => {
              return this.$moment(row.XK_DATE).format('YYYY-MM-DD');
            }
          },
          {
            prop: 'XK_JYNUMBER',
            label: 'VJ供应商经营许可证号', // 更新
            width: 240,
            align: 'center'
          },
          {
            prop: 'ZJ_DATE',
            label: '证件有效期', // 更新
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.ZJ_DATE ? formatDate(row.ZJ_DATE, 'yyyy-MM-dd') : '';
            }
          },
          {
            prop: 'ZCZ_NUMBER',
            label: '注册证编号', // 保持不变
            width: 160,
            align: 'center'
          },
          {
            prop: 'ZCZ_DATE',
            label: '证件有效期', // 更新
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.ZCZ_DATE
                ? this.$moment(row.ZCZ_DATE).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'ZJ_NAME',
            label: '证件名称（授权书）', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'ZJ_DATE1',
            label: '证件有效期', // 更新
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.ZJ_DATE1
                ? this.$moment(row.ZJ_DATE1).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'BAND',
            label: '品牌', // 保持不变
            width: 100,
            align: 'center'
          },
          {
            prop: 'CD',
            label: '产地', // 保持不变
            width: 100,
            align: 'center'
          },
          {
            prop: 'SCS',
            label: '生产商', // 保持不变
            width: 200,
            align: 'center'
          },
          {
            prop: 'SUPPLY_NUMBER',
            label: '供应商编号（原科园供应商没有供应商编号，需要SPD编码）', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'SUPPLY_NAME',
            label: '供应商名称', // 保持不变
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'IS_XX',
            label: '是否是中小微型企业', // 更新
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
            label: '是否集采带量产品', // 更新
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
            label: '京津冀类别', // 更新
            width: 100,
            align: 'center'
          },
          {
            prop: 'IS_LS',
            label: '是否是临时采购', // 更新
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
            label: '联系人', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'CONTRACT_PHONE',
            label: '电话', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'CONTRACT_EMAIL',
            label: '联系人邮箱', // 保持不变
            width: 150,
            align: 'center'
          },
          {
            prop: 'SJ_PRICE',
            label: '试剂价格（每人份）', // 更新
            width: 100,
            align: 'center',
            formatter: (row) => {
              return row.SJ_PRICE ? row.SJ_PRICE.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'SJ_CHECKNAME',
            label: '试剂检查项目名称', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'SJ_SFNAME',
            label: '试剂收费项目名称', // 更新
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SJ_SWNUMBER',
            label: '试剂收费编码', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'SJ_SWPRICE',
            label: '试剂收费价格', // 更新
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.SJ_SWPRICE ? row.SJ_SWPRICE.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'MID_COUNT',
            label: '中包数量', // 保持不变
            width: 100,
            align: 'center',
            formatter: (row) => {
              return row.MID_COUNT ? row.MID_COUNT.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'MID_UOM',
            label: '中包单位', // 更新
            width: 100,
            align: 'center'
          },
          {
            prop: 'MAX_COUNT',
            label: '大包数量', // 更新
            width: 100,
            align: 'center',
            formatter: (row) => {
              return row.MAX_COUNT ? row.MAX_COUNT.toFixed(2) : '0.00';
            }
          },
          {
            prop: 'MAX_UOM',
            label: '大包单位', // 更新
            width: 100,
            align: 'center'
          },
          {
            prop: 'ISGZ_DZ',
            label: '高低值', // 更新
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
            label: '高值重点治理序号', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'ZD_HCNAME',
            label: '重点治理耗材名称', // 更新
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'ISZR',
            label: '是否植入', // 保持不变
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
            label: '是否介入', // 保持不变
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
            label: '京津冀类别编号', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'JPS_NUMBER',
            label: '集配商编号', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'JPS_NAME',
            label: '集配商名称', // 更新
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'ZC_ENVIRONMENT',
            label: '储存条件', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'UDI_DI',
            label: 'UDI-DI', // 保持不变
            width: 120,
            align: 'center'
          },
          {
            prop: 'ISACTIVE',
            label: '是否有效', // 更新
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
            label: '医学装备分类协会编码', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'SB_XHNAME',
            label: '医学装备分类协会名称', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'ISJK',
            label: '是否进口', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'GOODSID',
            label: 'goodsID', // 保持不变
            width: 120,
            align: 'center'
          },
          {
            prop: 'SF_CODE',
            label: '收费编码', // 更新
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
