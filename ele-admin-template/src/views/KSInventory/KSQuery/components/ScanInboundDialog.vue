<template>
  <div>
    <el-dialog
      v-if="verifyVisible"
      title="验证用户"
      :visible.sync="verifyVisible"
      width="420px"
      append-to-body
      @closed="verifyForm = { user: '', password: '' }"
    >
      <el-form label-width="70px" size="small">
        <el-form-item label="账号" required>
          <el-input v-model="verifyForm.user" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="verifyForm.password" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="verifyVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="verifying" @click="doVerify">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="请输入收货单号"
      :visible.sync="scanVisible"
      width="760px"
      append-to-body
      @open="onScanOpen"
      @closed="onScanClosed"
    >
      <el-form size="small" inline @submit.native.prevent>
        <el-form-item label="收货单号">
          <el-input
            ref="orderInput"
            v-model="orderNo"
            style="width: 220px"
            clearable
            @input="onOrderInput"
          />
        </el-form-item>
      </el-form>
      <ele-pro-table
        ref="detailTable"
        size="mini"
        border
        :toolbar="false"
        height="360px"
        :columns="columns"
        :datasource="datasource"
        :page-size="10"
        :page-sizes="[10, 20, 50]"
      />
      <span slot="footer">
        <el-button size="small" @click="scanVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="confirming" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import {
  getDistributeDetail,
  deptReceivingScanOrder,
  verifyUserByKSQuery,
  pdaConfirmApply
} from '@/api/KSInventory/KSQuery';

export default {
  name: 'KSQueryScanInboundDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      verifyVisible: false,
      scanVisible: false,
      verifyForm: { user: '', password: '' },
      verifying: false,
      currentScanMan: '',
      orderNo: '',
      confirming: false,
      inputTimer: null,
      columns: [
        { prop: 'Varietie_Code', label: '品种材料编码', minWidth: 120 },
        { prop: 'Varietie_Name', label: '品种全称', sortable: true, minWidth: 140 },
        { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 120 },
        { prop: 'Unit', label: '单位', align: 'center', width: 70 },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 140 },
        { prop: 'Coefficient', label: '系数', width: 70 },
        { prop: 'replenish_quantity', label: '补货数量', width: 90 }
      ]
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.verifyVisible = false;
        this.scanVisible = false;
        return;
      }
      if (HOME_HP === 'fszxy') {
        this.verifyVisible = true;
      } else {
        this.openScan();
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    openScan() {
      this.scanVisible = true;
    },
    async doVerify() {
      if (!this.verifyForm.user || !this.verifyForm.password) {
        this.$message.warning('请输入账号和密码');
        return;
      }
      this.verifying = true;
      try {
        const res = await verifyUserByKSQuery(this.verifyForm.user, this.verifyForm.password);
        this.currentScanMan = res.msg || '';
        this.$message.success(`验证成功用户;${this.currentScanMan}`);
        this.verifyVisible = false;
        this.openScan();
      } catch (e) {
        this.$message.error(e.message || '验证失败');
      } finally {
        this.verifying = false;
      }
    },
    onScanOpen() {
      this.$nextTick(() => {
        this.$refs.orderInput?.focus();
        this.reloadDetail();
      });
    },
    onScanClosed() {
      this.orderNo = '';
      this.updateVisible(false);
    },
    onOrderInput() {
      if (this.inputTimer) clearTimeout(this.inputTimer);
      this.inputTimer = setTimeout(() => this.reloadDetail(), 300);
    },
    datasource({ page, limit }) {
      return getDistributeDetail(this.orderNo, page, limit).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reloadDetail() {
      this.$refs.detailTable?.reload({ page: 1 });
    },
    async confirm() {
      const no = (this.orderNo || '').trim();
      if (!no) {
        this.$message.warning('请输入收货单号');
        return;
      }
      this.confirming = true;
      try {
        if (no.length >= 2 && no.substring(0, 2) === 'SL') {
          const res = await pdaConfirmApply(no, this.currentScanMan);
          this.$message.success(res.msg || '收货成功');
        } else {
          const res = await deptReceivingScanOrder(no, this.currentScanMan);
          this.$message.success(res.msg || '操作成功');
        }
        this.scanVisible = false;
        this.updateVisible(false);
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.confirming = false;
      }
    }
  }
};
</script>
