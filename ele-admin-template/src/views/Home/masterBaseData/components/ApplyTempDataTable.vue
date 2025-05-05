<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <!-- 自定义指令实现当pageSizes改变时触发 -->
    <!-- :pageSize="pageSize" :pageSizes="pageSizes" -->
    <ApplyTempDataSearch
      ref="Apply"
      @search="reload"
      @exportFileData="exportFileData"
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

      <template v-slot:action="{ row }">
        <el-button
          size="mini"
          icon="el-icon-edit"
          @click="handleEditCurrentRow(row)"
          type="primary"
          >编辑</el-button
        >
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

    <el-dialog
      title="请选择一个分类"
      :visible.sync="typeDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-select
        v-model="typeSelectedValue"
        placeholder="请选择分类"
        style="width: 100%"
      >
        <el-option label="甲类" value="甲类"></el-option>
        <el-option label="乙类" value="乙类"></el-option>
        <el-option label="自费" value="自费"></el-option>
      </el-select>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="typeDialogVisible = false"
          >取&nbsp;消</el-button
        >
        <el-button size="mini" type="primary" @click="handleConfirm"
          >确&nbsp;定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { PrintinFile } from '@/api/Home/masterBaseData';
  import ApplyTempDataSearch from './ApplyTempDataSearch.vue';
  import { utils, writeFile } from 'xlsx';
  import { exportToExcel } from '@/utils/excel-util';
  import { BACK_BASE_URL } from '@/config/setting';
  import {
    SerachTempletDeta,
    DeleteTempletDeta
  } from '@/api/KSInventory/ApplyTemp';
  import {
    GetSpdMainsjLinesIface,
    UpdateYbTypeById
  } from '@/api/Home/masterBaseData';
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
            prop: 'action',
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
            minWidth: 80
          },
          {
            prop: 'HIS_ISGZ_DZ',
            label: '高值耗材标志',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
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
            minWidth: 80
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
            prop: 'HIS_ZCZ_NUMBER',
            label: '注册证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'HIS_ITEM_DESCRIPTION',
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
            minWidth: 80
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
        data: [],
        typeDialogVisible: false,
        typeSelectedValue: ''
      };
    },
    methods: {
      // 文件导出
      exportFileData() {
        let data = this.selection.map((item) => {
          return {
            LINE_IFACE_ID: item.LINE_IFACE_ID,
            HEADER_IFACE_ID: item.HEADER_IFACE_ID
          };
        });
        PrintinFile(data)
          .then((res) => {
            console.log(res);
            window.open(BACK_BASE_URL + '/Excel/files/' + res.msg, '_blank');
          })
          .catch((err) => {
            console.error(err);
            this.$message.error(err?.msg);
          });
      },
      handleClose() {
        this.typeSelectedValue = '';
      },
      handleConfirm() {
        const loading = this.$messageLoading('正在修改...');
        UpdateYbTypeById({
          ID: this.current.LINE_IFACE_ID,
          PARENTID: this.current.HEADER_IFACE_ID,
          YbType: this.typeSelectedValue
        })
          .then((res) => {
            this.$message.success(res?.msg);
          })
          .catch((err) => {
            this.$message.error(err?.msg);
          })
          .finally(() => {
            loading.close();
            this.reload();
            this.typeDialogVisible = false;
          });
      },

      handleEditCurrentRow(row) {
        //二次确认
        //prompt
        this.typeSelectedValue = row.HIS_YBTYPE;
        this.typeDialogVisible = true;
        this.current = row;
        // this.$prompt('请输入医保分类', '提示', {
        //   type: 'warning',
        //   // 限制只能输入 甲类 乙类 自费,
        //   inputPattern: /^(甲类|乙类|自费)$/,
        //   inputErrorMessage: '请输入甲类 乙类 自费'
        // })
        //   .then(({ value }) => {
        //     UpdateYbTypeById({ ID: row.ID, YbType: value })
        //       .then((res) => {
        //         this.$message.success(res?.msg);
        //       })
        //       .catch((err) => {
        //         this.$message.error(err?.msg);
        //       });
        //   })
        //   .finally(() => {
        //     this.reload();
        //   });
      },

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
              const array = [
                [
                  '主表ID',
                  '明细ID',
                  '导入批次号',
                  '导入顺序号',
                  '编码类型',
                  '项目名称',
                  '物料编码',
                  '收费单位',
                  '价格描述',
                  '项目单价',
                  '单价生效开始日期',
                  '单价生效结束日期',
                  '项目分类',
                  '型号',
                  '规格',
                  '挂号费用标签',
                  '收费大项目标识',
                  '使用范围',
                  '启用标志',
                  '高值耗材标志',
                  '国家项目代码',
                  '内部码',
                  '材料标志',
                  '生产厂商',
                  '收费依据',
                  '注册证号',
                  '注册证名称',
                  '扩展属性',
                  '临床服务标志',
                  '临床服务分类',
                  '医保分类'
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
                  d.HEADER_IFACE_ID,
                  d.LINE_IFACE_ID,
                  d.HIS_HIGHVALUE_NO,
                  d.LINE_NUMBER,
                  d.HIS_CODE_TYPE,
                  d.HIS_ITEM_DESCRIPTION,
                  d.HIS_ITEM_NUMBER,
                  d.HIS_UOM,
                  d.HIS_PRICE_DES,
                  d.HIS_UNIT_PRICE,
                  this.$util.toDateString(d.HIS_PRICE_START, 'yyyy-MM-dd'),
                  this.$util.toDateString(d.HIS_PRICE_END, 'yyyy-MM-dd'),
                  d.HIS_XMFL,
                  d.HIS_ITEM_SPEC,
                  d.HIS_STAND_VALUE,
                  d.HIS_GHFY_BQ,
                  d.HIS_SF_DXM_BS,
                  d.HIS_SYFW,
                  d.HIS_ISACTIVE,
                  d.HIS_ISGZ_DZ == 1 ? '是' : '否',
                  d.HIS_HC_NUMBER,
                  d.HIS_NBM,
                  d.HIS_CLBS ?? '是',
                  d.HIS_SCS,
                  d.HIS_SFYJ,
                  d.HIS_ZCZ_NUMBER,
                  d.HIS_ITEM_DESCRIPTION,
                  d.HIS_EXTEND,
                  d.HIS_LCFW,
                  d.HIS_LCFW_TYPE,
                  d.HIS_YBTYPE
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
              // exportToExcel(res.result, this.columns, '医保审核单');
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
