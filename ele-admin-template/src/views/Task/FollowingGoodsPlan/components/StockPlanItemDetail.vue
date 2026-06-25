<template>
  <div>
    <el-card>
      <div slot="header">
        备货计划单品种明细
        <span class="plan-tip">
          注意：如果备货数量修改成0，则系统将在执行保存后自动在订单中剔除该品种的备货计划
        </span>
      </div>
      <div>
        <el-form :model="form" :inline="true" size="mini">
          <el-form-item>
            <el-input
              v-model="form.varietie_code"
              placeholder="品种编码/名称"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.stock_up_plan_no"
              placeholder="备货计划编号"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.supplier_name"
              placeholder="供应商名称"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.Manufacturing_Ent_Name"
              placeholder="生产企业"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.Specification_Or_Type"
              placeholder="规格型号"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.PLAN_DEPT_TWO_NAME"
              placeholder="计划科室"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="form.start_time"
              type="date"
              placeholder="开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="form.end_time"
              type="date"
              placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.state"
              placeholder="通知状态"
              clearable
              style="width: 100px"
              @change="handleSearch"
            >
              <el-option label="全部" value="" />
              <el-option label="已通知" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.remark"
              placeholder="备注状态"
              clearable
              style="width: 100px"
              @change="handleSearch"
            >
              <el-option label="全部" value="" />
              <el-option label="已备注" value="0" />
              <el-option label="未备注" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.varType"
              placeholder="品种类型"
              clearable
              style="width: 100px"
              @change="handleSearch"
            >
              <el-option label="全部" value="" />
              <el-option label="高值" value="1" />
              <el-option label="低值" value="0" />
              <el-option label="试剂" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="handleSearchAll">返回查看所有</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="!canSave" @click="handleSave">
              保存修改
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleBatchRemark">批量备注</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="notToDeptVisible = true">未到货品种</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handleNotifyDept(0)">取消通知</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleNotifyDept(1)">通知科室</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openMonitoring">监控详情</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              v-permission="'export-FollowingGoodsPlan-bhjhddc'"
              type="primary"
              @click="exportCurrentOrder"
            >
              导出
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" :disabled="!canDelete" @click="handleDelete">
              剔除品种
            </el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="table"
          height="250px"
          :columns="columns"
          :datasource="datasource"
          highlight-current-row
          size="mini"
          :paging="false"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <template v-slot:defQty="{ row }">
            <el-input-number
              :value="getDefQty(row)"
              :min="0"
              :controls="false"
              size="mini"
              style="width: 70px"
              :disabled="!canSave"
              @change="(val) => setDefQty(row, val)"
            />
          </template>
        </ele-pro-table>
      </div>
    </el-card>

    <el-dialog
      title="批量添加备注"
      :visible.sync="batchRemarkVisible"
      width="500px"
    >
      <el-form label-width="60px" size="mini">
        <el-form-item label="科室">
          <el-select
            v-model="batchRemarkDept"
            filterable
            placeholder="请选择科室"
            style="width: 100%"
          >
            <el-option
              v-for="item in deptList"
              :key="item.Dept_Two_Code"
              :label="item.Dept_Two_Name"
              :value="item.Dept_Two_Code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="batchRemarkText"
            type="textarea"
            rows="4"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="batchRemarkVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="submitBatchRemark">确定</el-button>
      </span>
    </el-dialog>

    <NotToDeptDialog :visible.sync="notToDeptVisible" />
    <MonitoringDialog :visible.sync="monitoringVisible" :varietie-codes="monitoringCodes" />
  </div>
</template>

<script>
import {
  getStockUpVarInfo,
  upStockUpDefNum,
  upStockUpVarInfoState,
  batchUpDelRemarks,
  getDeptTwoBasicInfoAll,
  closeStokOrderDel,
  upStockUpVars
} from '@/api/Task/FollowingGoodsPlan';
import { utils, writeFile } from 'xlsx';
import NotToDeptDialog from './NotToDeptDialog.vue';
import MonitoringDialog from './MonitoringDialog.vue';
import {
  getB2bHospitalCode,
  isSaveAddDisabledByHrp,
  canDeleteVariety
} from '../utils';

export default {
  name: 'StockPlanItemDetail',
  components: { NotToDeptDialog, MonitoringDialog },
  props: {
    currentTableRow: {
      type: Object,
      default: () => ({})
    },
    currentTableRow3: {
      type: Object,
      default: () => ({})
    },
    storageId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selection: [],
      editQtyMap: {},
      batchRemarkVisible: false,
      notToDeptVisible: false,
      monitoringVisible: false,
      monitoringCodes: '',
      batchRemarkDept: '',
      batchRemarkText: '',
      deptList: [],
      form: {
        varietie_code: '',
        stock_up_plan_no: '',
        supplier_name: '',
        Manufacturing_Ent_Name: '',
        Specification_Or_Type: '',
        PLAN_DEPT_TWO_NAME: '',
        remark: '',
        state: '',
        varType: '',
        start_time: '',
        end_time: '',
        order_pc: 'desc'
      },
      columns: [
        { type: 'selection', width: 45, fixed: 'left', align: 'center' },
        {
          label: '备货日期',
          prop: 'PLAN_TIME',
          align: 'center',
          width: 120,
          formatter: (row) =>
            row.PLAN_TIME != null ? row.PLAN_TIME.substr(0, 10) : row.PLAN_TIME
        },
        { label: '来源科室', prop: 'PLAN_DEPT_TWO_NAME', align: 'center', width: 120 },
        { label: '品种编码', prop: 'Varietie_Code_New', align: 'center', width: 120 },
        { label: '备注', prop: 'REMARKS', align: 'center', width: 90 },
        { label: '省平台编码', prop: 'Province_Platform_Code', align: 'center', minWidth: 120 },
        { label: '阳光产品码', prop: 'YG_CODE', align: 'center', minWidth: 120 },
        {
          label: '品种名称',
          prop: 'Varietie_Name',
          align: 'center',
          minWidth: 200,
          showOverflowTooltip: true
        },
        {
          label: '型号/规格',
          prop: 'Specification_Or_Type',
          align: 'center',
          minWidth: 360,
          showOverflowTooltip: true
        },
        { label: '单位', prop: 'Unit', width: 50, align: 'center' },
        {
          label: '价格',
          width: 100,
          align: 'center',
          formatter: (row) => row.supply_price.toFixed(row.price_bl)
        },
        { label: '供应商名称', prop: 'supplier_name', align: 'center', minWidth: 210 },
        {
          label: '生产企业名称',
          prop: 'Manufacturing_Ent_Name',
          align: 'center',
          minWidth: 310
        },
        { label: '折算散货', prop: 'Stock_Up_Plan_Goods_Quantity', align: 'center', width: 120 },
        { label: '系数', prop: 'Coefficient', align: 'center', width: 80 },
        {
          label: '备货计划(包)',
          align: 'center',
          width: 130,
          slot: 'defQty'
        },
        {
          label: '收货数量',
          prop: 'ReceiptQty',
          width: 120,
          align: 'center',
          formatter: (row) => row.ReceiptQty + row.SANME_VARCODE_NUM
        },
        { label: '上月用量', prop: 'USED_QTY', width: 120, align: 'center' },
        { label: '三月平均量', prop: 'AVG_USED_QTY', width: 120, align: 'center' },
        {
          label: '库存总量',
          prop: 'sumCount',
          width: 120,
          align: 'center',
          formatter: (row) => row.sumCount + row.DEPT_NUM
        },
        {
          label: '中心库库存',
          prop: 'centerStockCount',
          width: 140,
          align: 'center',
          formatter: (row) => row.sumCount
        },
        { label: '科室库存', prop: 'DEPT_NUM', width: 120, align: 'center' },
        { label: '备货计划单号', prop: 'Stock_Up_Plan_No', align: 'center', width: 140 },
        { label: '备货人', prop: 'CREATOR', align: 'center', width: 100 },
        { label: '来源', prop: 'SOURCE_FROM', align: 'center', width: 120 }
      ]
    };
  },
  computed: {
    canSave() {
      const row3 = this.currentTableRow3;
      if (!row3 || String(row3.APPROVE_STATE) !== '0') {
        return false;
      }
      return !isSaveAddDisabledByHrp(row3.SENDHRP);
    },
    canDelete() {
      const row3 = this.currentTableRow3;
      if (!row3) return false;
      return canDeleteVariety(row3.SEND_STATE);
    }
  },
  methods: {
    getDefQty(row) {
      const key = row.ID;
      if (this.editQtyMap[key] !== undefined) {
        return this.editQtyMap[key];
      }
      return row.Stock_Up_Plan_Def_Quantity;
    },
    setDefQty(row, val) {
      this.$set(this.editQtyMap, row.ID, Number(val));
    },
    buildWhere(extra = {}) {
      return {
        ...this.form,
        order_state: this.currentTableRow?.ORDER_STATE || '',
        id: this.currentTableRow3?.ID || '',
        STORAGE_ID: this.storageId,
        ...extra
      };
    },
    handleSearch() {
      this.$refs.table.reload({ page: 1 });
    },
    handleSearchAll() {
      this.form = {
        varietie_code: '',
        stock_up_plan_no: '',
        supplier_name: '',
        Manufacturing_Ent_Name: '',
        Specification_Or_Type: '',
        PLAN_DEPT_TWO_NAME: '',
        remark: '',
        state: '',
        varType: '',
        start_time: '',
        end_time: '',
        order_pc: 'desc'
      };
      this.handleSearch();
    },
    handleSelectionChange(selection) {
      this.selection = selection;
    },
    handleRowClick(row) {
      this.$emit('onClickRow', row);
    },
    handleSave() {
      if (this.selection.length === 0) {
        this.$message.warning('请至少勾选一行数据');
        return;
      }
      const arrList = [];
      for (const obj of this.selection) {
        const qty = this.getDefQty(obj);
        if (qty <= 0) {
          this.$message.warning(
            `保存失败，品种${obj.Varietie_Code_New}${obj.Varietie_Name}的备货数量不能为0`
          );
          return;
        }
        arrList.push({
          Varietie_Code_New: obj.Varietie_Code_New,
          ID: obj.ID,
          Stock_Up_Plan_Def_Quantity: qty,
          Coefficient: obj.Coefficient
        });
      }
      const loading = this.$messageLoading('保存中...');
      upStockUpDefNum(JSON.stringify(arrList))
        .then((res) => {
          const data = res.data;
          if (data.code == 200) {
            this.$message.success('已成功保存');
            this.editQtyMap = {};
            this.handleSearch();
          } else {
            this.$message.warning(data.msg);
          }
        })
        .catch(() => this.$message.error('保存失败'))
        .finally(() => loading.close());
    },
    handleNotifyDept(state) {
      if (this.selection.length === 0) {
        this.$message.warning('请选择发送条目');
        return;
      }
      this.$confirm('是否确认吗？', '提示', { type: 'warning' })
        .then(() => {
          const loading = this.$messageLoading('处理中...');
          upStockUpVarInfoState(JSON.stringify(this.selection), state)
            .then((res) => {
              const data = res.data;
              if (data.code == 200) {
                this.$message.success('成功');
                this.handleSearch();
              } else {
                this.$message.warning('失败');
              }
            })
            .catch(() => this.$message.error('操作失败'))
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    handleBatchRemark() {
      if (this.selection.length === 0) {
        this.$message.warning('请至少选择一行数据');
        return;
      }
      const loadDepts = () => {
        getDeptTwoBasicInfoAll()
          .then((res) => {
            try {
              const parsed =
                typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
              let list = Array.isArray(parsed) ? parsed : parsed.result || [];
              if (this.storageId) {
                list = list.filter(
                  (item) => String(item.STORAGE_ID) === String(this.storageId)
                );
              }
              this.deptList = list;
            } catch (e) {
              this.deptList = [];
            }
            this.batchRemarkVisible = true;
          })
          .catch(() => this.$message.error('加载科室失败'));
      };
      if (this.deptList.length === 0) {
        loadDepts();
      } else {
        this.batchRemarkVisible = true;
      }
    },
    submitBatchRemark() {
      if (!this.batchRemarkDept) {
        this.$message.warning('请选择科室');
        return;
      }
      if (!this.batchRemarkText) {
        this.$message.warning('请输入备注');
        return;
      }
      const dept = this.deptList.find((d) => d.Dept_Two_Code === this.batchRemarkDept);
      const loading = this.$messageLoading('处理中...');
      batchUpDelRemarks({
        IDS: this.selection.map((r) => r.ID).join(','),
        REMARKS: this.batchRemarkText,
        DEPT_TWO_CODE: this.batchRemarkDept,
        DEPT_TWO_NAME: dept?.Dept_Two_Name || ''
      })
        .then((res) => {
          const data = res.data;
          if (data.code == 200) {
            this.$message.success(data.msg || '操作成功');
            this.batchRemarkVisible = false;
            this.handleSearch();
          } else {
            this.$message.warning(data.msg);
          }
        })
        .catch(() => this.$message.error('操作失败'))
        .finally(() => loading.close());
    },
    openMonitoring() {
      if (this.selection.length === 0) {
        this.$message.warning('请至少勾选一行数据');
        return;
      }
      this.monitoringCodes = this.selection.map((r) => r.Varietie_Code).join(',');
      this.monitoringVisible = true;
    },
    handleDelete() {
      if (this.selection.length === 0) {
        this.$message.warning('请至少勾选一行数据');
        return;
      }
      if (!this.currentTableRow3?.STOCK_UP_PLAN_NO) {
        this.$message.warning('请先在下方选择备货计划单号');
        return;
      }
      const hospitalCode = getB2bHospitalCode();
      if (!hospitalCode) {
        this.$message.error('非法请求：未配置院区编码');
        return;
      }
      this.$confirm('确定剔除品种吗?', '提示', { type: 'warning' })
        .then(() => {
          const arrList = this.selection.map((obj) => ({
            ID: obj.ID,
            Varietie_Code_New: obj.Varietie_Code_New
          }));
          const spdids = this.selection.map((obj) => obj.Varietie_Code).join(',');
          const loading = this.$messageLoading('处理中...');
          closeStokOrderDel(
            this.currentTableRow3.STOCK_UP_PLAN_NO,
            hospitalCode,
            spdids
          )
            .then((b2bRes) => {
              if (b2bRes.code != 200) {
                this.$message.warning('品种剔除失败');
                return;
              }
              return upStockUpVars(JSON.stringify(arrList), hospitalCode);
            })
            .then((res) => {
              if (!res) return;
              const data = res.data;
              if (data.code == 200) {
                this.$message.success('已成功删除');
                this.handleSearch();
                this.$emit('refresh-order-list');
              } else {
                this.$message.warning('品种剔除失败');
              }
            })
            .catch(() => this.$message.error('操作失败'))
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    exportCurrentOrder() {
      const loading = this.$messageLoading('正在导出数据...');
      getStockUpVarInfo({
        page: 1,
        limit: this.$refs.table?.tableTotal || 99999,
        where: this.buildWhere()
      })
        .then((res) => {
          const data = res.data;
          if (data.code == '200' && data.result.length > 0) {
            this.exportToExcel(data.result, '备货计划单品种明细');
          } else {
            this.$message.warning('没有数据可导出');
          }
        })
        .catch(() => this.$message.error('导出失败'))
        .finally(() => loading.close());
    },
    exportToExcel(data, fileName) {
      try {
        const exportCols = this.columns.filter(
          (col) => col.type !== 'selection' && col.label && col.prop
        );
        const headers = exportCols.map((col) => col.label);
        const excelData = [headers];
        data.forEach((row) => {
          excelData.push(
            exportCols.map((col) =>
              col.formatter ? col.formatter(row) : row[col.prop]
            )
          );
        });
        writeFile(
          {
            SheetNames: ['Sheet1'],
            Sheets: { Sheet1: utils.aoa_to_sheet(excelData) }
          },
          `${fileName}.xlsx`
        );
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error('导出失败');
      }
    },
    datasource({ page, limit, sort }) {
      return getStockUpVarInfo({
        page,
        limit,
        sort,
        where: this.buildWhere()
      }).then((res) => {
        const data = res.data;
        if (data.code == '200') {
          return { count: data.total, list: data.result };
        }
        return { count: 0, list: [] };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.plan-tip {
  margin-left: 10px;
  color: red;
  font-size: 12px;
  font-weight: normal;
}
</style>
