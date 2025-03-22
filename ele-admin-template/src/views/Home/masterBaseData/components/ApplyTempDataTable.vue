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
  import {
    SerachTempletDeta,
    DeleteTempletDeta
  } from '@/api/KSInventory/ApplyTemp';
  import {
    GetSpdMainsjLinesIface
  } from '@/api/Home/masterBaseData';
  export default {
    name: 'ApplyTempDataTable',
    props: ['ApplyTempTableData','IntroduceUserDefinedTempSearch'],
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
          {
            prop: 'PROCESS_STATUS',
            label: '状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if(cellValue ==1){
                return '是'
              }else if(cellValue ==0){
                return '否'
              }else{
                return cellValue
              }
            }
          },
          // {
          //   prop: 'ERROR_MSG',
          //   label: '错误消息',
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   minWidth: 120
          // },
          {
            prop: 'LINE_NUMBER',
            label: '行号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'HIGHVALUE_NO',
            label: '申请单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'REGISTRATION_NAME',
            label: '耗材注册证名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'REGISTRATION_NO',
            label: '注册证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'ORGANIZATION_NAME',
            label: '科室名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'FULL_NAME',
            label: '供应商',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'URGENCYLEVEL',
            label: '申请类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'ITEM_NUMBER',
            label: '物料编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
          },
          {
            prop: 'ITEM_DESCRIPTION',
            label: '物料名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110,
          },
          {
            prop: 'STAND_VALUE',
            label: '规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
          },
          {
            prop: 'ITEM_SPEC',
            label: '型号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'ZB',
            label: '是否中标',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90,
            formatter: (row, column, cellValue) => {
              if(cellValue ==1){
                return '是'
              }else if(cellValue ==0){
                return '否'
              }else{
                return cellValue
              }
            }
          },
          {
            prop: 'UOM',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 160
          },
          {
            prop: 'HC_NUMBER',
            label: '医保耗材编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 160
          },
          {
            prop: 'UNIT_PRICE',
            label: '采购价格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'PACK_MIN',
            label: '最小包装数',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 60
          },
          {
            prop: 'APPLY_DEPT',
            label: '申请科室',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'IS_SF',
            label: '是否收费',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 60,
            formatter: (row, column, cellValue) => {
              if(cellValue ==1){
                return '是'
              }else if(cellValue ==0){
                return '否'
              }else{
                return cellValue
              }
            }
          },
          {
            prop: 'CATEGORY',
            label: '类别',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'XK_NUMBER',
            label: 'VJ1总代经营许可证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'XY_DATE',
            label: '证件有效期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120 ,
            formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
          },
          {
            prop: 'XK_JYNUMBER',
            label: 'VJ供应商经营许可证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'ZCZ_NUMBER',
            label: '注册证编号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'ZJ_NAME',
            label: '证件名称（授权书）',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'BAND',
            label: '品牌',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'CD',
            label: '产地',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SCS',
            label: '生产商',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'SUPPLY_NAME',
            label: '供应商名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'IS_XX',
            label: '是否是中小微型企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 60,
            formatter: (row, column, cellValue) => {
              if(cellValue == 1){
                return '是'
              }else {
                return "否"
              }
            }
          },
          {
            prop: 'IS_CJ',
            label: '是否集采带量产品',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 60,
            formatter: (row, column, cellValue) => {
              if(cellValue == 1){
                return '是'
              }else {
                return "否"
              }
            }
          },
          {
            prop: 'JJJ_TYPE',
            label: '京津冀类别',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'IS_LS',
            label: '是否是临时采购',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 60,
            formatter: (row, column, cellValue) => {
              if(cellValue == 1){
                return '是'
              }else {
                return "否"
              }
            }
          },
          {
            prop: 'CONTRACT_NAME',
            label: '联系人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'CONTRACT_PHONE',
            label: '电话',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'CONTRACT_EMAIL',
            label: '联系人邮箱',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'SJ_PRICE',
            label: '试剂价格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'SJ_CHECKNAME',
            label: '试剂检查项目名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'SJ_SFNAME',
            label: '试剂收费项目名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'SJ_SWNUMBER',
            label: '试剂收费编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'SJ_SWPRICE',
            label: '试剂收费价格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'MID_COUNT',
            label: '中包数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'MID_UOM',
            label: '中包装单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'MAX_COUNT',
            label: '大包装数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'MAX_UOM',
            label: '大包装单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'ISGZ_DZ',
            label: '高低值',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'GZ_XH',
            label: '高值重点治理序号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 60
          },
          {
            prop: 'ZD_HCNAME',
            label: '重点治理耗材名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'ISZR',
            label: '是否植入',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if(cellValue == 1){
                return '是'
              }else {
                return "否"
              }
            }
          },
          {
            prop: 'ISJR',
            label: '是否介入',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if(cellValue == 1){
                return '是'
              }else {
                return "否"
              }
            }
          },
          {
            prop: 'TYPE_NUMBER',
            label: '京津冀类别编号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'JPS_NUMBER',
            label: '集配商编号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'JPS_NAME',
            label: '集配商名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'ZC_ENVIRONMENT',
            label: '储存条件',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'UDI_DI',
            label: 'UDI_DI',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'ISACTIVE',
            label: '是否有效',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if(cellValue == 1){
                return '是'
              }else {
                return "否"
              }
            }
          },
          {
            prop: 'SB_CODE',
            label: '医学装备分类协会编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'SB_XHNAME',
            label: '医学装备分类协会名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'ISJK',
            label: '是否进口',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if(cellValue == 1){
                return '是'
              }else {
                return "否"
              }
            }
          },
          {
            prop: 'goodsID',
            label: 'goodsID',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'SF_CODE',
            label: '收费编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          // {
          //   columnKey: 'action',
          //   label: '操作',
          //   width: 80,
          //   align: 'center',
          //   resizable: false,
          //   slot: 'action',
          //   showOverflowTooltip: true,
          //   fixed: 'left'
          // }
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
        where.HEADER_IFACE_ID = this.ApplyTempTableData.HEADER_IFACE_ID;
        let data = GetSpdMainsjLinesIface({ page, limit, where, order }).then(
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
            TempletMasteID: this.ApplyTempTableData.ID
          };
          this.$refs.table.reload({ page: 1, where: where });
        }
      },
      exportData(data) {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(({ where, order }) => {
          where = data;
          where.HEADER_IFACE_ID = this.ApplyTempTableData.HEADER_IFACE_ID;
          GetSpdMainsjLinesIface({
            page: 1,
            limit: 999999,
            where: where,
            order: order
          })
            .then((res) => {
              loading.close();
              const array = [
                [
                  '状态',
                  // '错误消息',
                  '行号',
                  '申请单号',
                  '耗材注册证名称',
                  '注册证号',
                  '科室名称',
                  '供应商',
                  '申请类型',
                  '物料编码',
                  '物料名称',
                  '规格',
                  '型号',
                  '是否中标',
                  '单位',
                  '医保耗材编码',
                  '采购价格',
                  '最小包装数',
                  '申请科室',
                  '是否收费',
                  '类别',
                  'VJ1总代经营许可证号',
                  '证件有效期',
                  'VJ供应商经营许可证号',
                  '注册证编号',
                  '证件名称（授权书）',
                  '品牌',
                  '产地',
                  '生产商',
                  '供应商名称',
                  '是否是中小微型企业',
                  '是否集采带量产品',
                  '京津冀类别',
                  '是否是临时采购',
                  '联系人',
                  '电话',
                  '联系人邮箱',
                  '试剂价格',
                  '试剂检查项目名称',
                  '试剂收费项目名称',
                  '试剂收费编码',
                  '试剂收费价格',
                  '中包数量',
                  '中包装单位',
                  '大包装数量',
                  '大包装单位',
                  '高低值',
                  '高值重点治理序号',
                  '重点治理耗材名称',
                  '是否植入',
                  '是否介入',
                  '京津冀类别编号',
                  '集配商编号',
                  '集配商名称',
                  '储存条件',
                  'UDI_DI',
                  '是否有效',
                  '医学装备分类协会编码',
                  '医学装备分类协会名称',
                  '是否进口',
                  'goodsID',
                  '收费编码',
                ]
              ];
              res.result.forEach((d) => {
                if (d.ZB == 0) {
                  d.ZB = '否';
                } else if (d.ZB == 1) {
                  d.ZB = '是';
                } else {
                  d.ZB = '未知';
                }
                array.push([
                  d.PROCESS_STATUS,
                  // d.ERROR_MSG,
                  d.LINE_NUMBER,
                  d.HIGHVALUE_NO,
                  d.REGISTRATION_NAME,
                  d.REGISTRATION_NO,
                  d.ORGANIZATION_NAME,
                  d.FULL_NAME,
                  d.URGENCYLEVEL,
                  d.ITEM_NUMBER,
                  d.ITEM_DESCRIPTION,
                  d.STAND_VALUE,
                  d.ITEM_SPEC,
                  d.ZB,
                  d.UOM,
                  d.HC_NUMBER,
                  d.UNIT_PRICE,
                  d.PACK_MIN,
                  d.APPLY_DEPT,
                  d.IS_SF,
                  d.CATEGORY,
                  d.XK_NUMBER,
                  d.XY_DATE,
                  d.XK_JYNUMBER,
                  d.ZCZ_NUMBER,
                  d.ZJ_NAME,
                  d.BAND,
                  d.CD,
                  d.SCS,
                  d.SUPPLY_NAME,
                  d.IS_XX,
                  d.IS_CJ,
                  d.JJJ_TYPE,
                  d.IS_LS,
                  d.CONTRACT_NAME,
                  d.CONTRACT_PHONE,
                  d.CONTRACT_EMAIL,
                  d.SJ_PRICE,
                  d.SJ_CHECKNAME,
                  d.SJ_SFNAME,
                  d.SJ_SWNUMBER,
                  d.SJ_SWPRICE,
                  d.MID_COUNT,
                  d.MID_UOM,
                  d.MAX_COUNT,
                  d.MAX_UOM,
                  d.ISGZ_DZ,
                  d.GZ_XH,
                  d.ZD_HCNAME,
                  d.ISZR,
                  d.ISJR,
                  d.TYPE_NUMBER,
                  d.JPS_NUMBER,
                  d.JPS_NAME,
                  d.ZC_ENVIRONMENT,
                  d.UDI_DI,
                  d.ISACTIVE,
                  d.SB_CODE,
                  d.SB_XHNAME,
                  d.ISJK,
                  d.GOODSID,
                  d.SF_CODE,
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
                '医保审核单.xlsx'
              );
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
          TempletMasteID: this.ApplyTempTableData.ID
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    created() {
      // this.getdatasource();
    }
  };
</script>
