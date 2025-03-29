<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <!-- 自定义指令实现当pageSizes改变时触发 -->
    <!-- :pageSize="pageSize" :pageSizes="pageSizes" -->
    <ApplyTempDataSearch
      ref="Apply"
      @search="reload"
      @addTempVar="$emit('addTempVar')"
      :IntroduceUserDefinedTempSearch="IntroduceUserDefinedTempSearch"
      @exportData="exportData"
      :ApplyTempTableDataSearch="ApplyTempTableDataSearch"
      :selection="selection"
      @showEditReoad="showEditReoad"
    />
    <ele-pro-table
      ref="table"
      height="60vh"
      size="mini"
      highlight-current-row
      :stripe="true"
      :rowClickChecked="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      @selection-change="onSelectionChange"
      cache-key="ApplyTempDataTable"
    >
      <!-- 表头工具栏 -->
      <!-- 右表头 -->
      <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
      <!-- 左表头 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <!-- <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button> -->
      </template>

      <!-- 操作列 -->
      <template v-slot:TempletQty="{ row }">
        <el-input
          style="width: 120px"
          v-model="row.TempletQty"
          :min="0"
          :max="999999999"
          :step="1"
          size="mini"
        />
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
  import ApplyTempDataSearch from './ApplyTempDataSearch.vue';
  import { utils, writeFile } from 'xlsx';
  import { exportToExcel } from '@/utils/excel-util';

  import {
    SerachTempletDeta,
    DeleteTempletDeta
  } from '@/api/KSInventory/ApplyTemp';
  import { GetSpdMainsjLinesIface } from '@/api/Home/masterBaseData';
  import { GetSpdHisMainsjLinesIface } from '@/api/Home/BJRMPriceAudit';
  export default {
    name: 'ApplyTempDataTable',
    // props: ['ApplyTempTableData', 'IntroduceUserDefinedTempSearch'],
    props: {
      ApplyTempTableData: {
        type: Object,
        default: () => {
          return {};
        }
      },
      IntroduceUserDefinedTempSearch: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    components: {
      ApplyTempDataSearch: ApplyTempDataSearch
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
          // {
          //   columnKey: 'index',
          //   type: 'index',
          //   label: '序',
          //   width: 45,
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   fixed: 'left'
          // },
          // {
          //   prop: 'HEADER_IFACE_ID',
          //   label: '主表ID',
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   minWidth: 80
          // },
          // {
          //   prop: 'LINE_IFACE_ID',
          //   label: '明细ID',
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   minWidth: 80
          // },
          {
            slot: 'action',
            label: '操作',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'HIS_HIGHVALUE_NO',
            label: '导入批次号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'LINE_NUMBER',
            label: '导入顺序号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'HIS_CODE_TYPE',
            label: '编码类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'HIS_ITEM_DESCRIPTION',
            label: '项目名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'HIS_ITEM_NUMBER',
            label: '物料编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'HIS_UOM',
            label: '收费单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'HIS_PRICE_DES',
            label: '价格描述',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'HIS_UNIT_PRICE',
            label: '项目单价',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'HIS_PRICE_START',
            label: '单价生效开始日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130,
            formatter: (row, column, cellValue) => {
              return cellValue
                ? this.$moment(cellValue).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'HIS_PRICE_END',
            label: '单价生效结束日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130,
            formatter: (row, column, cellValue) => {
              return cellValue
                ? this.$moment(cellValue).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'HIS_XMFL',
            label: '项目分类',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'HIS_ITEM_SPEC',
            label: '型号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'HIS_STAND_VALUE',
            label: '规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'HIS_GHFY_BQ',
            label: '挂号费用标签',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'HIS_SF_DXM_BS',
            label: '收费大项目标识',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'HIS_SYFW',
            label: '使用范围',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'HIS_ISACTIVE',
            label: '启用标志',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1) {
                return '是';
              } else {
                return '否';
              }
            }
          },
          {
            prop: 'HIS_ISGZ_DZ',
            label: '高值耗材标志',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1) {
                return '是';
              } else {
                return '否';
              }
            }
          },
          {
            prop: 'HIS_HC_NUMBER',
            label: '国家项目代码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'HIS_NBM',
            label: '内部码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'HIS_CLBS',
            label: '材料标志',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1) {
                return '是';
              } else {
                return '否';
              }
            }
          },
          {
            prop: 'HIS_SCS',
            label: '生产厂商',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 160
          },
          {
            prop: 'HIS_SFYJ',
            label: '收费依据',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'HIS_REGISTRATION_NO',
            label: '注册证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'HIS_REGISTRATION_NAME',
            label: '注册证名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'HIS_EXTEND',
            label: '扩展属性',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'HIS_LCFW',
            label: '临床服务标志',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1) {
                return '是';
              } else {
                return '否';
              }
            }
          },
          {
            prop: 'HIS_LCFW_TYPE',
            label: '临床服务分类',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'HIS_YBTYPE',
            label: '医保分类',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          }
        ],
        toolbar: false,
        pageSize: 50,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        showEdit: false,
        // 是否显示导入弹窗
        showImport: false,
        // datasource: [],
        data: []
      };
    },
    methods: {
      showDialogTableVisible() {
        this.$refs.Apply.showDialogTableVisible();
      },
      showDialogTableVisible2() {
        this.$refs.Apply.showDialogTableVisible2();
      },
      saveApplyNum() {
        this.$refs.Apply.saveApplyNum();
      },
      exportChildData() {
        this.$refs.Apply.exportData();
      },
      removeBatch() {
        this.$refs.Apply.removeBatch();
      },
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        // where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        // where.UserId = this.$store.state.user.info.ID;
        where.HEADER_IFACE_ID = this.ApplyTempTableData?.HEADER_IFACE_ID;
        // let data = GetSpdMainsjLinesIface({ page, limit, where, order }).then(
        let data = GetSpdHisMainsjLinesIface({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      /* 刷新表格 */
      reload(where) {
        // console.log(this.ApplyTempTableData);
        // console.log(this.$store.state.user.info);
        this.$refs.table.reload({ page: 1, where: where });
      },
      remove(row) {
        var data = {
          ID: row.ID
        };

        const loading = this.$messageLoading('删除中...');
        DeleteTempletDeta(data)
          .then((res) => {
            loading.close();
            this.$message(res.msg);
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message(err);
          });
      },
      onSelectionChange(selection) {
        this.selection = selection;
        this.$emit('selectionData', selection);
      },
      showEditReoad(data) {
        if (data == false) {
          var where = {
            DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
            UserId: this.$store.state.user.info.ID,
            TempletMasteID: this.ApplyTempTableData?.ID
          };
          this.$refs.table.reload({ page: 1, where: where });
        }
      },
      exportData(data) {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(({ where, order }) => {
          where = data;
          where.HEADER_IFACE_ID = this.ApplyTempTableData?.HEADER_IFACE_ID;
          // GetSpdMainsjLinesIface({

          GetSpdHisMainsjLinesIface({
            page: 1,
            limit: 999999,
            where: where,
            order: order
          })
            .then((res) => {
              loading.close();
              // const array = [
              //   [
              //     '状态',
              //     // '错误消息',
              //     '行号',
              //     '申请单号',
              //     '耗材注册证名称',
              //     '注册证号',
              //     '科室名称',
              //     '供应商',
              //     '申请类型',
              //     '物料编码',
              //     '物料名称',
              //     '规格',
              //     '型号',
              //     '是否中标',
              //     '单位',
              //     '医保耗材编码',
              //     '采购价格',
              //     '最小包装数',
              //     '申请科室',
              //     '是否收费',
              //     '类别',
              //     'VJ1总代经营许可证号',
              //     '证件有效期',
              //     'VJ供应商经营许可证号',
              //     '注册证编号',
              //     '证件名称（授权书）',
              //     '品牌',
              //     '产地',
              //     '生产商',
              //     '供应商名称',
              //     '是否是中小微型企业',
              //     '是否集采带量产品',
              //     '京津冀类别',
              //     '是否是临时采购',
              //     '联系人',
              //     '电话',
              //     '联系人邮箱',
              //     '试剂价格',
              //     '试剂检查项目名称',
              //     '试剂收费项目名称',
              //     '试剂收费编码',
              //     '试剂收费价格',
              //     '中包数量',
              //     '中包装单位',
              //     '大包装数量',
              //     '大包装单位',
              //     '高低值',
              //     '高值重点治理序号',
              //     '重点治理耗材名称',
              //     '是否植入',
              //     '是否介入',
              //     '京津冀类别编号',
              //     '集配商编号',
              //     '集配商名称',
              //     '储存条件',
              //     'UDI_DI',
              //     '是否有效',
              //     '医学装备分类协会编码',
              //     '医学装备分类协会名称',
              //     '是否进口',
              //     'goodsID',
              //     '收费编码'
              //   ]
              // ];
              // res.result.forEach((d) => {
              //   if (d.ZB == 0) {
              //     d.ZB = '否';
              //   } else if (d.ZB == 1) {
              //     d.ZB = '是';
              //   } else {
              //     d.ZB = '未知';
              //   }
              //   array.push([
              //     d.PROCESS_STATUS,
              //     // d.ERROR_MSG,
              //     d.LINE_NUMBER,
              //     d.HIGHVALUE_NO,
              //     d.REGISTRATION_NAME,
              //     d.REGISTRATION_NO,
              //     d.ORGANIZATION_NAME,
              //     d.FULL_NAME,
              //     d.URGENCYLEVEL,
              //     d.ITEM_NUMBER,
              //     d.ITEM_DESCRIPTION,
              //     d.STAND_VALUE,
              //     d.ITEM_SPEC,
              //     d.ZB,
              //     d.UOM,
              //     d.HC_NUMBER,
              //     d.UNIT_PRICE,
              //     d.PACK_MIN,
              //     d.APPLY_DEPT,
              //     d.IS_SF,
              //     d.CATEGORY,
              //     d.XK_NUMBER,
              //     d.XY_DATE,
              //     d.XK_JYNUMBER,
              //     d.ZCZ_NUMBER,
              //     d.ZJ_NAME,
              //     d.BAND,
              //     d.CD,
              //     d.SCS,
              //     d.SUPPLY_NAME,
              //     d.IS_XX,
              //     d.IS_CJ,
              //     d.JJJ_TYPE,
              //     d.IS_LS,
              //     d.CONTRACT_NAME,
              //     d.CONTRACT_PHONE,
              //     d.CONTRACT_EMAIL,
              //     d.SJ_PRICE,
              //     d.SJ_CHECKNAME,
              //     d.SJ_SFNAME,
              //     d.SJ_SWNUMBER,
              //     d.SJ_SWPRICE,
              //     d.MID_COUNT,
              //     d.MID_UOM,
              //     d.MAX_COUNT,
              //     d.MAX_UOM,
              //     d.ISGZ_DZ,
              //     d.GZ_XH,
              //     d.ZD_HCNAME,
              //     d.ISZR,
              //     d.ISJR,
              //     d.TYPE_NUMBER,
              //     d.JPS_NUMBER,
              //     d.JPS_NAME,
              //     d.ZC_ENVIRONMENT,
              //     d.UDI_DI,
              //     d.ISACTIVE,
              //     d.SB_CODE,
              //     d.SB_XHNAME,
              //     d.ISJK,
              //     d.GOODSID,
              //     d.SF_CODE
              //     // this.$util.toDateString(d.createTime)
              //   ]);
              // });
              // writeFile(
              //   {
              //     SheetNames: ['Sheet1'],
              //     Sheets: {
              //       Sheet1: utils.aoa_to_sheet(array)
              //     }
              //   },
              //   '医保审核单.xlsx'
              // );
              exportToExcel(res.result, this.columns, '医保审核单');
              this.$message.success('导出成功');
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        });
      }
    },
    computed: {
      ApplyTempTableDataSearch() {
        return this.ApplyTempTableData;
      }
      // pageSize(){
      //   return localStorage.getItem('SerachTempletDetaPageSize')?localStorage.getItem('SerachTempletDetaPageSize'):10
      // }
    },
    watch: {
      ApplyTempTableDataSearch() {
        var where = {
          DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
          UserId: this.$store.state.user.info.ID,
          TempletMasteID: this.ApplyTempTableData?.ID
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    created() {
      // this.getdatasource();
    }
  };
</script>
