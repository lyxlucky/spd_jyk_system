<template>
  <div class="ele-body spd-page financial-send">
    <el-card shadow="never">
      <el-form
        size="mini"
        inline
        class="filter-form"
        @submit.native.prevent="reload"
      >
        <el-form-item label="搜索">
          <el-input
            v-model="where.search"
            clearable
            placeholder="搜索内容......"
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="月结开始">
          <el-date-picker
            v-model="where.startTime"
            type="month"
            value-format="yyyy-MM"
            placeholder="yyyy-MM"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="月结结束">
          <el-date-picker
            v-model="where.endTime"
            type="month"
            value-format="yyyy-MM"
            placeholder="yyyy-MM"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="发送状态">
          <el-select
            v-model="where.Is_send"
            style="width: 100px"
            @change="reload"
          >
            <el-option label="全部" value="" />
            <el-option label="已发送" value="1" />
            <el-option label="未发送" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" native-type="submit">
            查询
          </el-button>
          <el-button type="primary" :loading="sending" @click="onSend">
            发送发票
          </el-button>
          <el-button type="warning" :loading="approving" @click="onApprove">
            审批
          </el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        :page-size="50"
        :page-sizes="[10, 50, 100, 150, 200, 300, 99999]"
        cache-key="KSFinancialSendTable_v3"
      />
    </el-card>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { getSendColumns } from './columns';
import {
  checkFpIndo,
  sendOesFpGx,
  approveSzhnFp
} from '@/api/KSInventory/FinancialSend';
import { setPageTab, getRouteTabKey } from '@/utils/page-tab-util';

export default {
  name: 'KSFinancialSend',
  data() {
    return {
      columns: getSendColumns(),
      tableHeight: 'calc(100vh - 260px)',
      selection: [],
      sending: false,
      approving: false,
      where: {
        search: '',
        startTime: '',
        endTime: '',
        Is_send: ''
      }
    };
  },
  mounted() {
    const name = this.$options.name;
    if (name) {
      setPageTab({ key: getRouteTabKey(), components: [name] });
    }
  },
  methods: {
    async datasource({ page, limit, where }) {
      const w = where || this.where;
      try {
        const res = await checkFpIndo(w, page, limit);
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload() {
      this.$refs.table?.reload({ page: 1, where: { ...this.where } });
    },
    async onSend() {
      if (!this.selection.length) {
        Message.warning('请勾选数据');
        return;
      }
      try {
        await MessageBox.confirm('确认发送发票吗？（不会自动审批）', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        });
      } catch {
        return;
      }
      this.sending = true;
      try {
        const res = await sendOesFpGx(this.selection);
        Message.success(res.msg || '发送成功');
        this.reload();
      } catch (e) {
        if (e?.code === 'ECONNABORTED' || /timeout/i.test(e?.message || '')) {
          Message.error('请求超时，请检查网络');
        } else {
          Message.error(e.message || '发送失败');
        }
      } finally {
        this.sending = false;
      }
    },
    async onApprove() {
      if (!this.selection.length) {
        Message.warning('请勾选数据');
        return;
      }
      try {
        await MessageBox.confirm('确认审批选中数据吗？', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        });
      } catch {
        return;
      }
      this.approving = true;
      try {
        const res = await approveSzhnFp(this.selection);
        Message.success(res.msg || '审批成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '审批失败');
      } finally {
        this.approving = false;
      }
    }
  }
};
</script>

<style scoped>
.financial-send .filter-form {
  margin-bottom: 8px;
}
.financial-send ::v-deep .el-table-column--selection .cell,
.financial-send ::v-deep .spd-checkbox-col .cell {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.financial-send ::v-deep .el-table-column--selection .el-checkbox,
.financial-send ::v-deep .spd-checkbox-col .el-checkbox {
  display: inline-flex;
  margin: 0;
}
</style>
