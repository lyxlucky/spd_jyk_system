<template>
  <el-dialog
    title="三级库汇总分组"
    :visible.sync="visibleSync"
    width="820px"
    :close-on-click-modal="false"
    append-to-body
    @open="onOpen"
  >
    <div class="toolbar">
      <el-input
        v-model="keyword"
        size="mini"
        clearable
        placeholder="搜索科室编码/名称"
        style="width: 220px"
      />
      <div class="toolbar-actions">
        <el-button type="primary" size="mini" :disabled="!selectedCodes.length" @click="createGroup">
          设为同一组
        </el-button>
        <el-button size="mini" :disabled="!selectedCodes.length || !groupOptions.length" @click="openJoin">
          加入已有组
        </el-button>
        <el-button size="mini" :disabled="!selectedCodes.length" @click="removeFromGroup">
          移出汇总组
        </el-button>
        <el-button type="danger" plain size="mini" :disabled="!selectedGroupId" @click="dissolveGroup">
          解散该组
        </el-button>
      </div>
    </div>

    <el-alert
      type="info"
      :closable="false"
      show-icon
      title="勾选科室后可成组；同一组的科室在「按汇总组合并」查询时会合并同品种库存"
      style="margin-bottom: 10px"
    />

    <div v-loading="loading" class="group-body">
      <div v-for="g in filteredGrouped" :key="g.mergeGroupId" class="group-block">
        <div class="group-head">
          <el-checkbox
            :indeterminate="isGroupIndeterminate(g)"
            :value="isGroupChecked(g)"
            @change="(val) => toggleGroup(g, val)"
          >
            组{{ g.groupName }}（{{ g.depts.length }} 个科室）
          </el-checkbox>
          <el-button type="text" size="mini" @click="selectOnlyGroup(g)">仅选本组</el-button>
        </div>
        <el-checkbox-group v-model="selectedCodes" class="dept-list">
          <el-checkbox
            v-for="d in g.depts"
            :key="d.DEPT_TWO_CODE"
            :label="d.DEPT_TWO_CODE"
            class="dept-item"
          >
            {{ d.DEPT_TWO_NAME }}（{{ d.DEPT_TWO_CODE }}）
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="group-block">
        <div class="group-head">
          <span class="ungrouped-title">未分组（{{ filteredUngrouped.length }}）</span>
        </div>
        <el-checkbox-group v-model="selectedCodes" class="dept-list">
          <el-checkbox
            v-for="d in filteredUngrouped"
            :key="d.DEPT_TWO_CODE"
            :label="d.DEPT_TWO_CODE"
            class="dept-item"
          >
            {{ d.DEPT_TWO_NAME }}（{{ d.DEPT_TWO_CODE }}）
          </el-checkbox>
        </el-checkbox-group>
        <div v-if="!filteredUngrouped.length" class="empty-tip">暂无未分组科室</div>
      </div>
    </div>

    <el-dialog
      title="加入已有汇总组"
      :visible.sync="joinVisible"
      width="480px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-radio-group v-model="joinTargetId" class="join-options">
        <el-radio v-for="g in groupOptions" :key="g.mergeGroupId" :label="g.mergeGroupId" class="join-item">
          {{ g.label }}
        </el-radio>
      </el-radio-group>
      <span slot="footer">
        <el-button size="mini" @click="joinVisible = false">取消</el-button>
        <el-button type="primary" size="mini" :loading="saving" @click="confirmJoin">确定</el-button>
      </span>
    </el-dialog>

    <span slot="footer">
      <el-button size="mini" @click="visibleSync = false">关闭</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="loadData">刷新</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {
    getThirdStockMergeDepts,
    createThirdStockMergeGroup,
    joinThirdStockMergeGroup,
    removeThirdStockMergeDept,
    dissolveThirdStockMergeGroup
  } from '@/api/Inventory/ThreeLevelDbBD';

  export default {
    name: 'MergeGroupDialog',
    props: {
      visible: Boolean
    },
    data() {
      return {
        loading: false,
        saving: false,
        keyword: '',
        list: [],
        selectedCodes: [],
        joinVisible: false,
        joinTargetId: ''
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
      grouped() {
        const map = {};
        (this.list || [])
          .filter((d) => d.MERGE_GROUP_ID)
          .forEach((d) => {
            if (!map[d.MERGE_GROUP_ID]) {
              map[d.MERGE_GROUP_ID] = {
                mergeGroupId: d.MERGE_GROUP_ID,
                depts: []
              };
            }
            map[d.MERGE_GROUP_ID].depts.push(d);
          });
        // 按 MERGE_GROUP_ID 排序
        return Object.values(map)
          .sort((a, b) =>
            String(a.mergeGroupId).localeCompare(String(b.mergeGroupId))
          )
          .map((g, index) => ({
            ...g,
            groupName: this.toGroupLetter(index)
          }));
      },
      ungrouped() {
        return (this.list || []).filter((d) => !d.MERGE_GROUP_ID);
      },
      filteredGrouped() {
        const kw = (this.keyword || '').trim().toLowerCase();
        if (!kw) return this.grouped;
        return this.grouped
          .map((g) => ({
            ...g,
            depts: g.depts.filter(
              (d) =>
                (d.DEPT_TWO_NAME || '').toLowerCase().includes(kw) ||
                (d.DEPT_TWO_CODE || '').toLowerCase().includes(kw)
            )
          }))
          .filter((g) => g.depts.length);
      },
      filteredUngrouped() {
        const kw = (this.keyword || '').trim().toLowerCase();
        if (!kw) return this.ungrouped;
        return this.ungrouped.filter(
          (d) =>
            (d.DEPT_TWO_NAME || '').toLowerCase().includes(kw) ||
            (d.DEPT_TWO_CODE || '').toLowerCase().includes(kw)
        );
      },
      groupOptions() {
        return this.grouped.map((g) => ({
          mergeGroupId: g.mergeGroupId,
          label:
            '组' +
            g.groupName +
            '：' +
            g.depts.map((d) => d.DEPT_TWO_NAME).join('、')
        }));
      },
      selectedGroupId() {
        const selected = new Set(this.selectedCodes);
        const hit = this.grouped.find((g) =>
          g.depts.some((d) => selected.has(d.DEPT_TWO_CODE))
        );
        return hit ? hit.mergeGroupId : '';
      }
    },
    methods: {
      /** 0→A, 1→B, … 25→Z, 26→AA */
      toGroupLetter(index) {
        let n = index;
        let s = '';
        do {
          s = String.fromCharCode(65 + (n % 26)) + s;
          n = Math.floor(n / 26) - 1;
        } while (n >= 0);
        return s;
      },
      onOpen() {
        this.keyword = '';
        this.selectedCodes = [];
        this.loadData();
      },
      async loadData() {
        this.loading = true;
        try {
          const res = await getThirdStockMergeDepts();
          this.list = res.data || [];
          if (res.canmanage === false || res.canManage === false) {
            this.$message.warning('当前账号无权维护汇总分组');
            this.visibleSync = false;
          }
        } catch (e) {
          this.list = [];
          this.$message.error(e || '加载分组失败');
        } finally {
          this.loading = false;
        }
      },
      isGroupChecked(g) {
        return g.depts.every((d) => this.selectedCodes.includes(d.DEPT_TWO_CODE));
      },
      isGroupIndeterminate(g) {
        const n = g.depts.filter((d) =>
          this.selectedCodes.includes(d.DEPT_TWO_CODE)
        ).length;
        return n > 0 && n < g.depts.length;
      },
      toggleGroup(g, checked) {
        const codes = g.depts.map((d) => d.DEPT_TWO_CODE);
        if (checked) {
          this.selectedCodes = Array.from(new Set([...this.selectedCodes, ...codes]));
        } else {
          const remove = new Set(codes);
          this.selectedCodes = this.selectedCodes.filter((c) => !remove.has(c));
        }
      },
      selectOnlyGroup(g) {
        this.selectedCodes = g.depts.map((d) => d.DEPT_TWO_CODE);
      },
      async createGroup() {
        if (this.selectedCodes.length < 1) return;
        try {
          await this.$confirm(
            `将选中的 ${this.selectedCodes.length} 个科室设为同一汇总组？`,
            '提示',
            { type: 'warning' }
          );
          this.saving = true;
          await createThirdStockMergeGroup(this.selectedCodes);
          this.$message.success('已设为同一组');
          this.selectedCodes = [];
          await this.loadData();
          this.$emit('changed');
        } catch (e) {
          if (e !== 'cancel') this.$message.error(e || '操作失败');
        } finally {
          this.saving = false;
        }
      },
      openJoin() {
        if (!this.groupOptions.length) {
          this.$message.warning('暂无已有汇总组，请先「设为同一组」');
          return;
        }
        this.joinTargetId = this.groupOptions[0].mergeGroupId;
        this.joinVisible = true;
      },
      async confirmJoin() {
        if (!this.joinTargetId) {
          this.$message.warning('请选择目标汇总组');
          return;
        }
        try {
          this.saving = true;
          await joinThirdStockMergeGroup(this.selectedCodes, this.joinTargetId);
          this.$message.success('已加入汇总组');
          this.joinVisible = false;
          this.selectedCodes = [];
          await this.loadData();
          this.$emit('changed');
        } catch (e) {
          this.$message.error(e || '操作失败');
        } finally {
          this.saving = false;
        }
      },
      async removeFromGroup() {
        try {
          await this.$confirm(
            `将选中的 ${this.selectedCodes.length} 个科室移出汇总组？`,
            '提示',
            { type: 'warning' }
          );
          this.saving = true;
          await removeThirdStockMergeDept(this.selectedCodes);
          this.$message.success('已移出汇总组');
          this.selectedCodes = [];
          await this.loadData();
          this.$emit('changed');
        } catch (e) {
          if (e !== 'cancel') this.$message.error(e || '操作失败');
        } finally {
          this.saving = false;
        }
      },
      async dissolveGroup() {
        const gid = this.selectedGroupId;
        if (!gid) {
          this.$message.warning('请先勾选某一汇总组内的科室');
          return;
        }
        try {
          await this.$confirm('确定解散该汇总组？组内所有科室将变为未分组。', '提示', {
            type: 'warning'
          });
          this.saving = true;
          await dissolveThirdStockMergeGroup(gid);
          this.$message.success('已解散');
          this.selectedCodes = [];
          await this.loadData();
          this.$emit('changed');
        } catch (e) {
          if (e !== 'cancel') this.$message.error(e || '操作失败');
        } finally {
          this.saving = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .toolbar-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .group-body {
    max-height: 52vh;
    overflow: auto;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 8px 12px;
  }

  .group-block {
    margin-bottom: 14px;
  }

  .group-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    font-weight: 600;
  }

  .ungrouped-title {
    color: #606266;
  }

  .dept-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 8px;
  }

  .dept-item {
    margin-left: 0 !important;
  }

  .empty-tip {
    color: #909399;
    font-size: 12px;
    padding: 4px 8px;
  }

  .join-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 40vh;
    overflow: auto;
  }

  .join-item {
    margin-left: 0 !important;
    white-space: normal;
    line-height: 1.4;
  }
</style>
