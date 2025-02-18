<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form class="ele-form-search">
        <el-row type="flex" :gutter="2">
          <el-col :lg="2">
            <el-form-item>
              <el-select size="mini" clearable v-model="where.vdzh_sx" placeholder="请选择">
                <el-option label="全部筛选" value="0" />
                <el-option label="防控物资女" value="1" />
                <el-option label="阳光采购平台品种" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="高低值分类：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.HIGH_OR_LOW_CLASS" placeholder="请选择">
                <el-option label="全部" value="-1" />
                <el-option label="高值" value="1" />
                <el-option label="低值" value="0" />
                <el-option label="试剂" value="2" />
                <el-option label="消毒" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="2">
            <el-form-item label="">
              <el-select size="mini" clearable v-model="where.HIGH_OR_LOW_CLASS_TWO" placeholder="请选择">
                <el-option label="重点分类-全部" value="-1" />
                <el-option label="重点治理" value="1" />
                <el-option label="非重点治理" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="2">
            <el-form-item label="">
              <el-input size="mini" v-model="where.username" placeholder="高值序号" clearable />
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="设备科是否修改：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.IS_EQUIPMENT_CHANGE" placeholder="请选择">
                <el-option label="全部" value="-1" />
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="2">
            <el-form-item label="">
              <el-select size="mini" clearable v-model="where.SENDYB_STATE" placeholder="请选择">
                <el-option label="物价-全部" value="" />
                <el-option label="物价-已提交" value="1" />
                <el-option label="物价-未提交" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="启用状态：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.enable" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="启用" value="1" />
                <el-option label="停用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="计费编码：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.enableChargingCode" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="为空" value="1" />
                <el-option label="不为空" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="修改时间：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.updateTime" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="当天" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="5">
            <el-form-item label="审批时间：" label-width="40">
              <el-col :span="9">
                <el-date-picker size="mini" type="date" placeholder="选择日期" v-model="where.priceChangeTimeStart" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col :span="9">
                <el-date-picker size="mini" type="date" placeholder="选择日期" v-model="where.priceChangeTimeEnd" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="审批状态：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.APPROVAL_STATE" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="审批通过" value="1" />
                <el-option label="待审批" value="0" />
                <el-option label="未通过" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="北大回传标记：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.JF_BJ" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="未标记" value="0" />
                <el-option label="已标记" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="临时挂起：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.IS_HANG_UP" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="否" value="0" />
                <el-option label="是" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="2">
            <el-form-item>
              <el-checkbox v-model="checked">是否过滤非库宝品种</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-form-item label="SPD审批状态：" label-width="40" style="display: none;;">
            <el-select style="width:100px" size="mini" clearable v-model="where.VARSPD_STATE" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="设备科审批状态：" label-width="40" style="display: none;;">
            <el-select style="width:100px" size="mini" clearable v-model="where.VARSB_STATE" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="计费办审批状态：" label-width="40" style="display: none;;">
            <el-select style="width:100px" size="mini" clearable v-model="where.VARJF_STATE" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="医保办审批状态：" label-width="40" style="display: none;;">
            <el-select style="width:100px" size="mini" clearable v-model="where.VARYB_STATE" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="备注确认状态：" label-width="40" style="display: none;;">
            <el-select style="width:100px" size="mini" clearable v-model="where.VARBZ_STATE" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="未备注" value="0" />
              <el-option label="待处理" value="1" />
              <el-option label="已处理" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="品种状态：" label-width="40" style="display: none;;">
            <el-select style="width:100px" size="mini" clearable v-model="where.FSWY_STATE" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="未发送" value="0" />
              <el-option label="已发送" value="1" />
            </el-select>
          </el-form-item>

        </el-row>

        <el-row :gutter="10">
          <el-col :lg="2">
            <el-input size="mini" clearable v-model="where.varietieCode" placeholder="编码/名称" />
          </el-col>
          <el-col :lg="2">
            <el-input size="mini" clearable v-model="where.Specification_Or_Type" placeholder="规格型号" />
          </el-col>
          <el-col :lg="2">
            <el-input size="mini" clearable v-model="where.SCQY" placeholder="生产企业" />
          </el-col>
          <el-col :lg="2">
            <el-input size="mini" clearable v-model="where.ZCZ" placeholder="注册证" />
          </el-col>
          <el-col :lg="2">
            <el-input size="mini" clearable v-model="where.SUP" placeholder="供应商" />
          </el-col>
          <el-col :lg="2">
            <el-input size="mini" clearable v-model="where.Y_M_P_CODE" placeholder="阳光/医保/省平台编码" />
          </el-col>
          <el-col :lg="2">
            <el-input size="mini" clearable v-model="where.UDI_TOP" placeholder="UDI编码" />
          </el-col>
          <el-col :lg="2">
            <el-input size="mini" clearable v-model="where.BZ_TI" placeholder="备注" />
          </el-col>
          <el-col :lg="2">
            <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="reload">
              查询
            </el-button>
          </el-col>
        </el-row>

      </el-form>
      <!-- 表格 -->
    </el-card>
  </div>
</template>

<script>
import { getDeptAuthVarNew } from '@/api/KSInventory/KSInventoryBasicData';

export default {
  name: 'DemoTest',
  data() {
    return {
      // 表格数据
      data: [],
      // 搜索表单数据
      where: {
        varietieCode: '',
        varietieName: '',
        field: '',
        order: '',
        state: '',
        IS_CHARGE: '-1',
        IS_BIDDING: '-1',
        SPECIAL_PURCHASE: '',
        ONEOFF_STERILIZATION_PACKAGING: '-1',
        STORAGE_TYPE: '-1',
        IS_EMBEDDED: '-1',
        IS_SERIAL_NUMBER: '-1',
        IS_INTERVENED: '-1',
        IS_PROTECT: '-1',
        HIGH_OR_LOW_CLASS: '-1',
        HIGH_OR_LOW_CLASS_TWO: '-1',
        IS_EQUIPMENT_CHANGE: '-1',
        SENDYB_STATE: '',
        HIGH_CLASS_XH_SEARCH: '',
        enable: '',
        enableChargingCode: '',
        updateTime: '',
        priceChangeTimeStart: '',
        priceChangeTimeEnd: '',
        APPROVAL_STATE: '',
        vdzh_sx: '0',
        SCQY: '',
        SUP: '',
        Specification_Or_Type: '',
        ZCZ: '',
        VARYB_STATE: '',
        VARSB_STATE: '',
        VARJF_STATE: '',
        VARSPD_STATE: '',
        VARBZ_STATE: '',
        VAROES_STATE: '',
        FSWY_STATE: '',
        Y_M_P_CODE: '',
        UDI_TOP: '',
        BZ_TI: '',
        JF_BJ: '',
        IS_HANG_UP: ''
      },
      // 表格的loading
      loading: true
    };
  },
  created() {},
  methods: {
    /* 搜索 */
    reload() {
      this.$emit('search', { ...this.where });
    },
    /*  重置搜索 */
    reset() {
      this.where = {
        username: '',
        sex: undefined
      };
      this.reload();
    },
    /* 排序改变 */
    onSortChange({ prop, order }) {
      if (!order) {
        this.orders = {};
      } else {
        this.orders = {
          sort: prop,
          order: order === 'descending' ? 'desc' : 'asc'
        };
      }
      this.query();
    },
    /* 表格选择项改变 */
    onSelectionChange(selection) {
      this.selection = selection;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      // removeUser(row.userId)
      //   .then((msg) => {
      //     loading.close();
      //     this.$message.success(msg);
      //     this.reload();
      //   })
      //   .catch((e) => {
      //     loading.close();
      //     this.$message.error(e.message);
      //   });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
    }
  }
};
</script>

<style scoped>
.ele-form-search .el-form-item {
  margin-bottom: 0;
}
</style>
