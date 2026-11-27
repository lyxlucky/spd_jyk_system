<template>
  <el-drawer
    title="计费编码对齐检查"
    :visible.sync="visibleSync"
    size="72%"
    append-to-body
    destroy-on-close
    @open="onOpen"
  >
    <div class="align-drawer">
      <p class="align-tip">{{ alignTip }}</p>
      <el-form size="mini" :inline="true" @submit.native.prevent>
        <el-form-item label="关键字">
          <el-input
            v-model="keyword"
            clearable
            placeholder="流水编码/品种编码/计费编码/名称"
            style="width: 260px"
            @keyup.enter.native="reload"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="loading" @click="reload">
            查询
          </el-button>
        </el-form-item>
      </el-form>

      <vxe-table
        class="data-table"
        :data="rows"
        :loading="loading"
        border
        stripe
        size="mini"
        height="520"
        show-overflow
        empty-text="暂无需要对齐的记录"
      >
        <vxe-column type="seq" title="序号" width="60" align="center" />
        <vxe-column field="ISSUE_TYPE" title="问题类型" width="180" align="center" />
        <vxe-column
          field="LEDGER_CHARGE_CODE"
          title="三级库流水编码"
          width="150"
          align="left"
          show-overflow
        />
        <vxe-column
          field="VARIETIE_CODE_NEW"
          title="品种编码"
          width="132"
          align="left"
          show-overflow
        />
        <vxe-column
          field="MASTER_CHARGING_CODE"
          title="品种资料计费编码"
          width="150"
          align="left"
          show-overflow
        />
        <vxe-column
          field="VARIETIE_NAME"
          title="品种名称"
          min-width="192"
          align="left"
          show-overflow
        />
        <vxe-column
          field="SPECIFICATION_OR_TYPE"
          title="规格型号"
          min-width="160"
          align="left"
          show-overflow
        />
        <vxe-column field="STOCK_QTY" title="结存数量" width="100" align="right" />
        <vxe-column field="LEDGER_COUNT" title="流水条数" width="90" align="right" />
      </vxe-table>

      <el-pagination
        class="align-pager"
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="page"
        :page-size.sync="pageSize"
        :page-sizes="[20, 50, 100, 200]"
        :total="total"
        @current-change="loadData"
        @size-change="onSizeChange"
      />
    </div>
  </el-drawer>
</template>

<script>
  import { queryChargeCodeAlignIssues } from '@/api/Inventory/WarehouseAreaThreeInventory';
  import { HOME_HP } from '@/config/setting';

  export default {
    name: 'ChargeCodeAlignDrawer',
    props: {
      visible: { type: Boolean, default: false }
    },
    data() {
      return {
        loading: false,
        keyword: '',
        rows: [],
        page: 1,
        pageSize: 20,
        total: 0
      };
    },
    computed: {
      visibleSync: {
        get() {
          return this.visible;
        },
        set(v) {
          this.$emit('update:visible', v);
        }
      },
      alignTip() {
        if (HOME_HP === 'stzl') {
          return '肿瘤：流水结存键与品种编码/计费编码应一致。本清单展示未找到品种、计费编码未维护，或品种编码与计费编码不一致，请到品种资料维护。';
        }
        return '流水结存键应为品种资料计费编码。本清单展示未找到品种、计费编码未维护，或流水仍落在品种编码上；品种/计费双码并存属正常，不在本清单。';
      }
    },
    methods: {
      onOpen() {
        this.reload();
      },
      reload() {
        this.page = 1;
        this.loadData();
      },
      onSizeChange() {
        this.page = 1;
        this.loadData();
      },
      async loadData() {
        this.loading = true;
        try {
          const res = await queryChargeCodeAlignIssues(this.keyword, this.page, this.pageSize);
          this.rows = res.result || res.data || [];
          this.total = Number(res.total || res.count || 0);
        } catch (e) {
          this.rows = [];
          this.total = 0;
          // 接口失败时原先只剩空表，容易误以为「没有未维护」；错误信息必须可见
          this.$message.error((e && e.message) || e || '计费编码对齐检查查询失败');
        } finally {
          this.loading = false;
        }
      }
    }
  };
</script>

<style scoped>
  .align-drawer {
    padding: 0 16px 16px;
  }
  .align-tip {
    margin: 0 0 12px;
    color: #666;
    line-height: 1.5;
    font-size: 13px;
  }
  .align-pager {
    margin-top: 12px;
    text-align: right;
  }
</style>
