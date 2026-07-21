<template>
  <div class="ele-body spd-page check-receive-varieties">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body">
        <el-form size="mini" inline @submit.native.prevent>
          <el-form-item label="关键字">
            <el-input
              v-model="keyword"
              clearable
              placeholder="编码/名称/规格/生产企业/单位"
              style="width: 240px"
              @keyup.enter.native="reload"
            />
          </el-form-item>
          <el-form-item label="接收状态">
            <el-select v-model="receiveState" style="width: 180px" @change="reload">
              <el-option label="拦截目录" :value="2" />
              <el-option label="已接收至品种目录" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
            <el-button
              type="success"
              plain
              :disabled="receiveState === 3 || !selection.length"
              :loading="allowing"
              @click="onAllowEnter"
            >
              允许进入系统
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head spd-panel__head--split">
        <span>拦截品种列表</span>
        <span v-if="selection.length" class="spd-panel__head-meta">已选 {{ selection.length }} 条</span>
      </div>
      <div class="spd-panel__body">
        <ele-pro-table
          ref="table"
          highlight-current-row
          height="65vh"
          size="mini"
          :stripe="true"
          :page-size="100"
          :page-sizes="[100, 200, 500, 1000, 2000, 3000]"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="checkReceiveVarietiesV1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { QueryReceiveZQ, UpVarsReceiveState } from '@/api/Home/CheckReceiveVarieties';

export default {
  name: 'CheckReceiveVarieties',
  data() {
    return {
      keyword: '',
      receiveState: 2,
      selection: [],
      allowing: false,
      columns: [
        { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
        { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          minWidth: 130,
          showOverflowTooltip: true
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          minWidth: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'manufacturing_ent_name',
          label: '生产企业名称',
          minWidth: 160,
          showOverflowTooltip: true
        },
        { prop: 'Unit', label: '单位', width: 70, align: 'center' },
        { prop: 'Price', label: '中标价', width: 90, align: 'right' },
        {
          prop: 'Enable',
          label: '启用状态',
          width: 90,
          align: 'center',
          formatter: (_r, _c, v) => {
            if (v == '1' || v === 1) return '启用';
            if (v == '0' || v === 0) return '冻结';
            return v == null || v === '' ? '' : String(v);
          }
        },
        {
          prop: 'Approval_Number',
          label: '批准文号',
          minWidth: 140,
          showOverflowTooltip: true
        }
      ]
    };
  },
  methods: {
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    async datasource({ page, limit, where }) {
      const kw = this.keyword || '';
      const res = await QueryReceiveZQ({
        varietieCode: kw,
        varietieName: kw,
        page,
        size: limit,
        field: where?.field || '',
        order: where?.order || '',
        ReceiveState: this.receiveState
      });
      return {
        count: Number(res.total) || 0,
        list: res.result || []
      };
    },
    async onAllowEnter() {
      if (this.receiveState === 3) {
        this.$message.warning('当前为已接收目录，无需再次放行');
        return;
      }
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const codes = this.selection.map((r) => r.Varietie_Code).filter(Boolean);
      if (!codes.length) {
        this.$message.warning('选中行缺少品种编码');
        return;
      }
      try {
        await this.$confirm(
          `确定将选中的 ${codes.length} 条品种允许进入系统吗？放行后请在品种资料维护查看。`,
          '提示',
          { type: 'warning' }
        );
      } catch {
        return;
      }
      this.allowing = true;
      try {
        const res = await UpVarsReceiveState(codes);
        this.$message.success(res.msg || '操作成功');
        this.reload();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.allowing = false;
      }
    }
  }
};
</script>

<style scoped>
.check-receive-varieties {
  padding-bottom: 12px;
}
.spd-panel__head--split {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.spd-panel__head-meta {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}
</style>
