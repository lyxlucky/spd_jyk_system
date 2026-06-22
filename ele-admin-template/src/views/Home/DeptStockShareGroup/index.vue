<template>
  <div class="ele-body dept-stock-share-group-page">
    <el-card shadow="never" class="page-card">
      <div class="two-pane-layout">
        <section class="group-pane">
          <div class="pane-header">
            <div>
              <div class="pane-title">库存共享组</div>
              <div class="pane-subtitle">共 {{ groupOverview.length }} 组</div>
            </div>
            <el-button
              size="mini"
              icon="el-icon-refresh"
              :loading="overviewLoading"
              @click="reloadGroupOverview"
            >
              刷新
            </el-button>
          </div>

          <div class="quick-actions">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="openNewGroupDialog">
              新增分组
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-connection"
              :disabled="!canApplySelectedGroup"
              :loading="batchSaveLoading"
              @click="applySelectedGroupToRows"
            >
              加入已选组
            </el-button>
          </div>

          <el-table
            ref="groupTable"
            v-loading="overviewLoading"
            class="group-table"
            :data="groupRows"
            size="mini"
            border
            highlight-current-row
            height="calc(100vh - 330px)"
            :row-key="groupRowKey"
            :row-class-name="groupRowClassName"
            @row-click="selectGroup"
          >
            <el-table-column label="分组" min-width="180" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <div class="group-name-cell">
                  <el-tag size="mini" :type="groupTagType(row)" effect="plain">
                    {{ groupTypeText(row) }}
                  </el-tag>
                  <div class="group-main">
                    <div class="group-code">{{ row.code }}</div>
                    <div class="group-name">{{ row.name || '-' }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="科室数" width="70" align="center" />
          </el-table>

          <div class="group-footer">
            <div class="active-group">
              当前：<b>{{ activeGroupLabel }}</b>
            </div>
            <div class="group-manage-actions">
              <el-button
                size="mini"
                :disabled="!selectedNormalGroup"
                icon="el-icon-edit-outline"
                @click="openRenameGroupDialog"
              >
                重命名
              </el-button>
              <el-popconfirm title="确定清空该共享组下所有科室？" @confirm="clearSelectedGroup">
                <template v-slot:reference>
                  <el-button
                    size="mini"
                    type="warning"
                    plain
                    :disabled="!selectedNormalGroup"
                    :loading="batchSaveLoading"
                    icon="el-icon-delete"
                  >
                    清空分组
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </section>

        <section class="dept-pane">
          <div class="pane-header dept-pane-header">
            <div>
              <div class="pane-title">科室列表</div>
              <div class="pane-subtitle">已选择 {{ selectedRows.length }} 个科室</div>
            </div>
            <div class="dept-header-actions">
              <el-button size="mini" @click="showAllGroups">全部科室</el-button>
              <el-button size="mini" @click="showAssigned">只看已设置</el-button>
              <el-button size="mini" @click="showUnassigned">只看未分组</el-button>
            </div>
          </div>

          <el-form
            :inline="true"
            size="mini"
            class="dept-filter"
            @submit.native.prevent
            @keyup.enter.native="reload"
          >
            <el-form-item label="关键字">
              <el-input
                v-model="query.keyword"
                clearable
                placeholder="二级科室编码 / 名称"
                style="width: 190px"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="query.shareGroupStatus"
                style="width: 110px"
                :disabled="activeGroupType !== 'all'"
                @change="onStatusChange"
              >
                <el-option label="全部" value="all" />
                <el-option label="已设置" value="assigned" />
                <el-option label="未设置" value="unassigned" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <div class="dept-toolbar">
            <div class="toolbar-left">
              <el-tag size="mini" :type="selectedNormalGroup ? 'success' : 'info'" effect="plain">
                {{ activeGroupLabel }}
              </el-tag>
              <span class="muted-text">右侧勾选科室后可批量设置</span>
            </div>
            <div class="toolbar-actions">
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="openNewGroupDialog">
                新增分组
              </el-button>
              <el-button
                type="success"
                size="mini"
                icon="el-icon-connection"
                :disabled="!canApplySelectedGroup"
                :loading="batchSaveLoading"
                @click="applySelectedGroupToRows"
              >
                加入选中分组
              </el-button>
              <el-button
                size="mini"
                icon="el-icon-s-operation"
                :disabled="!selectedRows.length"
                @click="openBatchDialog"
              >
                批量设置
              </el-button>
              <el-popconfirm title="确定清空已选科室的库存共享组？" @confirm="batchClearGroups">
                <template v-slot:reference>
                  <el-button
                    type="warning"
                    plain
                    size="mini"
                    icon="el-icon-delete"
                    :disabled="!selectedRows.length"
                    :loading="batchSaveLoading"
                  >
                    批量清空
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>

          <ele-pro-table
            ref="table"
            :columns="columns"
            :datasource="datasource"
            :response="responseConfig"
            :need-page="true"
            :page-size="20"
            :page-sizes="[10, 20, 50, 100]"
            cache-key="deptStockShareGroupTable"
            :height="tableHeight"
            :toolkit="['reload', 'size', 'columns', 'fullscreen']"
            :row-key="rowKey"
            :selection.sync="selectedRows"
            @selection-change="onSelectionChange"
            @done="onTableDone"
          >
            <template v-slot:threeInventory="{ row }">
              <el-tag size="mini" :type="row.IS_THREE_INVENTORY_ENABLE === '1' ? 'success' : 'info'">
                {{ row.IS_THREE_INVENTORY_ENABLE === '1' ? '是' : '否' }}
              </el-tag>
            </template>
            <template v-slot:shareStatus="{ row }">
              <el-tag size="mini" :type="row.STOCK_SHARE_GROUP_CODE ? 'success' : 'info'">
                {{ row.STOCK_SHARE_GROUP_CODE ? '已设置' : '未设置' }}
              </el-tag>
            </template>
            <template v-slot:groupCode="{ row }">
              <el-tag v-if="row.STOCK_SHARE_GROUP_CODE" size="mini" type="success" effect="plain">
                {{ row.STOCK_SHARE_GROUP_CODE }}
              </el-tag>
              <span v-else class="muted-text">未设置</span>
            </template>
            <template v-slot:groupName="{ row }">
              <span v-if="row.STOCK_SHARE_GROUP_NAME">{{ row.STOCK_SHARE_GROUP_NAME }}</span>
              <span v-else class="muted-text">-</span>
            </template>
            <template v-slot:action="{ row }">
              <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">
                {{ row.STOCK_SHARE_GROUP_CODE ? '编辑' : '设置' }}
              </el-link>
              <el-popconfirm
                v-if="row.STOCK_SHARE_GROUP_CODE"
                class="ele-action"
                title="确定清空该科室的库存共享组？"
                @confirm="clearGroup(row)"
              >
                <template v-slot:reference>
                  <el-link type="danger" :underline="false" icon="el-icon-delete">清空</el-link>
                </template>
              </el-popconfirm>
            </template>
          </ele-pro-table>
        </section>
      </div>
    </el-card>

    <el-dialog
      title="维护库存共享组"
      :visible.sync="dialogVisible"
      width="540px"
      append-to-body
      destroy-on-close
      @closed="onDialogClosed"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" size="small">
        <el-form-item label="二级科室编码">
          <el-input :value="form.deptTwoCode" readonly />
        </el-form-item>
        <el-form-item label="二级科室名称">
          <el-input :value="form.deptTwoName" readonly />
        </el-form-item>
        <el-form-item label="套用已有组">
          <el-select
            v-model="editPresetCode"
            clearable
            filterable
            placeholder="选择后自动带出编码和名称"
            style="width: 100%"
            @change="onEditPresetChange"
          >
            <el-option
              v-for="group in groupOverview"
              :key="group.code"
              :label="groupLabel(group)"
              :value="group.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="共享组编码" prop="stockShareGroupCode">
          <el-input
            v-model="form.stockShareGroupCode"
            clearable
            maxlength="50"
            show-word-limit
            placeholder="相同编码表示共用同一组库存"
          >
            <el-button
              slot="append"
              icon="el-icon-magic-stick"
              :loading="generateLoading"
              @click="generateGroup(form, 'formRef')"
            >
              一键生成
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="共享组名称" prop="stockShareGroupName">
          <el-input
            v-model="form.stockShareGroupName"
            clearable
            maxlength="200"
            show-word-limit
            placeholder="用于展示共享组名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :loading="saveLoading" @click="submitClear">清空</el-button>
        <el-button type="primary" :loading="saveLoading" @click="submit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="新增库存共享组"
      :visible.sync="newGroupDialogVisible"
      width="540px"
      append-to-body
      destroy-on-close
      @closed="onNewGroupDialogClosed"
    >
      <el-alert
        class="batch-alert"
        :title="`已选择 ${selectedRows.length} 个二级科室`"
        type="info"
        show-icon
        :closable="false"
      />
      <el-form
        ref="newGroupFormRef"
        :model="newGroupForm"
        :rules="newGroupRules"
        label-width="120px"
        size="small"
      >
        <el-form-item label="共享组编码" prop="stockShareGroupCode">
          <el-input
            v-model="newGroupForm.stockShareGroupCode"
            clearable
            maxlength="50"
            show-word-limit
            placeholder="请输入新的共享组编码"
          >
            <el-button
              slot="append"
              icon="el-icon-magic-stick"
              :loading="generateLoading"
              @click="generateGroup(newGroupForm, 'newGroupFormRef')"
            >
              一键生成
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="共享组名称" prop="stockShareGroupName">
          <el-input
            v-model="newGroupForm.stockShareGroupName"
            clearable
            maxlength="200"
            show-word-limit
            placeholder="请输入共享组名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="newGroupDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="batchSaveLoading" @click="submitNewGroup">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="批量设置库存共享组"
      :visible.sync="batchDialogVisible"
      width="540px"
      append-to-body
      destroy-on-close
      @closed="onBatchDialogClosed"
    >
      <el-alert
        class="batch-alert"
        :title="`已选择 ${selectedRows.length} 个二级科室`"
        type="info"
        show-icon
        :closable="false"
      />
      <el-form ref="batchFormRef" :model="batchForm" :rules="batchFormRules" label-width="120px" size="small">
        <el-form-item label="套用已有组">
          <el-select
            v-model="batchPresetCode"
            clearable
            filterable
            placeholder="选择后自动带出编码和名称"
            style="width: 100%"
            @change="onBatchPresetChange"
          >
            <el-option
              v-for="group in groupOverview"
              :key="group.code"
              :label="groupLabel(group)"
              :value="group.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="共享组编码" prop="stockShareGroupCode">
          <el-input
            v-model="batchForm.stockShareGroupCode"
            clearable
            maxlength="50"
            show-word-limit
            placeholder="可输入新共享组编码"
          >
            <el-button
              slot="append"
              icon="el-icon-magic-stick"
              :loading="generateLoading"
              @click="generateGroup(batchForm, 'batchFormRef')"
            >
              一键生成
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="共享组名称" prop="stockShareGroupName">
          <el-input
            v-model="batchForm.stockShareGroupName"
            clearable
            maxlength="200"
            show-word-limit
            placeholder="可输入新共享组名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="batchSaveLoading" @click="submitBatch">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="重命名库存共享组"
      :visible.sync="renameDialogVisible"
      width="520px"
      append-to-body
      destroy-on-close
      @closed="onRenameDialogClosed"
    >
      <el-form ref="renameFormRef" :model="renameForm" :rules="renameRules" label-width="120px" size="small">
        <el-form-item label="共享组编码">
          <el-input :value="renameForm.stockShareGroupCode" readonly />
        </el-form-item>
        <el-form-item label="共享组名称" prop="stockShareGroupName">
          <el-input
            v-model="renameForm.stockShareGroupName"
            clearable
            maxlength="200"
            show-word-limit
            placeholder="请输入共享组名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="batchSaveLoading" @click="submitRenameGroup">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    deptStockShareGroupGenerate,
    deptStockShareGroupList,
    deptStockShareGroupSave
  } from '@/api/Home/DeptStockShareGroup';

  const GROUP_ALL_KEY = 'all';
  const GROUP_UNASSIGNED_KEY = 'unassigned';

  const emptyForm = () => ({
    deptTwoCode: '',
    deptTwoName: '',
    stockShareGroupCode: '',
    stockShareGroupName: ''
  });

  const emptyGroupForm = () => ({
    stockShareGroupCode: '',
    stockShareGroupName: ''
  });

  export default {
    name: 'DeptStockShareGroup',
    data() {
      const validateEditGroupName = (_rule, value, callback) => {
        const name = (value || '').trim();
        const code = (this.form.stockShareGroupCode || '').trim();
        if (name && !code) {
          callback(new Error('填写共享组名称时必须填写共享组编码'));
          return;
        }
        callback();
      };
      const validateBatchGroupName = (_rule, value, callback) => {
        const name = (value || '').trim();
        const code = (this.batchForm.stockShareGroupCode || '').trim();
        if (name && !code) {
          callback(new Error('填写共享组名称时必须填写共享组编码'));
          return;
        }
        callback();
      };

      return {
        responseConfig: {
          dataName: 'data',
          countName: 'total',
          statusCode: 200
        },
        query: {
          keyword: '',
          shareGroupStatus: 'all'
        },
        columns: [
          { type: 'selection', width: 45, align: 'center', fixed: 'left' },
          { columnKey: 'index', type: 'index', width: 48, align: 'center', label: '序号' },
          {
            prop: 'DEPT_TWO_CODE',
            label: '二级科室编码',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'DEPT_TWO_NAME',
            label: '二级科室名称',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'DEPT_ONE_CODE',
            label: '一级科室编码',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            columnKey: 'threeInventory',
            prop: 'IS_THREE_INVENTORY_ENABLE',
            label: '三级库',
            width: 80,
            align: 'center',
            slot: 'threeInventory'
          },
          {
            columnKey: 'shareStatus',
            label: '状态',
            width: 90,
            align: 'center',
            slot: 'shareStatus'
          },
          {
            columnKey: 'groupCode',
            prop: 'STOCK_SHARE_GROUP_CODE',
            label: '共享组编码',
            minWidth: 150,
            align: 'center',
            slot: 'groupCode',
            showOverflowTooltip: true
          },
          {
            columnKey: 'groupName',
            prop: 'STOCK_SHARE_GROUP_NAME',
            label: '共享组名称',
            minWidth: 180,
            align: 'center',
            slot: 'groupName',
            showOverflowTooltip: true
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 140,
            align: 'center',
            slot: 'action',
            fixed: 'right'
          }
        ],
        selectedRows: [],
        groupOverview: [],
        allDeptTotal: 0,
        unassignedTotal: 0,
        activeGroupKey: GROUP_ALL_KEY,
        overviewLoading: false,
        form: emptyForm(),
        editPresetCode: '',
        formRules: {
          stockShareGroupCode: [{ max: 50, message: '共享组编码不能超过 50 个字符', trigger: 'blur' }],
          stockShareGroupName: [
            { max: 200, message: '共享组名称不能超过 200 个字符', trigger: 'blur' },
            { validator: validateEditGroupName, trigger: 'blur' }
          ]
        },
        newGroupForm: emptyGroupForm(),
        newGroupRules: {
          stockShareGroupCode: [
            { required: true, message: '请填写共享组编码', trigger: 'blur' },
            { max: 50, message: '共享组编码不能超过 50 个字符', trigger: 'blur' }
          ],
          stockShareGroupName: [{ max: 200, message: '共享组名称不能超过 200 个字符', trigger: 'blur' }]
        },
        batchForm: emptyGroupForm(),
        batchPresetCode: '',
        batchFormRules: {
          stockShareGroupCode: [{ max: 50, message: '共享组编码不能超过 50 个字符', trigger: 'blur' }],
          stockShareGroupName: [
            { max: 200, message: '共享组名称不能超过 200 个字符', trigger: 'blur' },
            { validator: validateBatchGroupName, trigger: 'blur' }
          ]
        },
        renameForm: emptyGroupForm(),
        renameRules: {
          stockShareGroupName: [{ max: 200, message: '共享组名称不能超过 200 个字符', trigger: 'blur' }]
        },
        dialogVisible: false,
        newGroupDialogVisible: false,
        batchDialogVisible: false,
        renameDialogVisible: false,
        generateLoading: false,
        saveLoading: false,
        batchSaveLoading: false,
        tableHeight: 'calc(100vh - 335px)'
      };
    },
    computed: {
      groupRows() {
        return [
          {
            key: GROUP_ALL_KEY,
            type: 'all',
            code: '全部科室',
            name: '',
            count: this.allDeptTotal
          },
          {
            key: GROUP_UNASSIGNED_KEY,
            type: 'unassigned',
            code: '未分组',
            name: '',
            count: this.unassignedTotal
          },
          ...this.groupOverview.map((group) => ({
            key: `group:${group.code}`,
            type: 'group',
            code: group.code,
            name: group.name,
            count: group.count
          }))
        ];
      },
      activeGroupType() {
        if (this.activeGroupKey === GROUP_UNASSIGNED_KEY) return 'unassigned';
        if (this.activeGroupKey.indexOf('group:') === 0) return 'group';
        return 'all';
      },
      selectedNormalGroup() {
        if (this.activeGroupType !== 'group') return null;
        const code = this.activeGroupKey.replace('group:', '');
        return this.groupOverview.find((item) => item.code === code) || null;
      },
      assignedTotal() {
        return this.groupOverview.reduce((sum, group) => sum + Number(group.count || 0), 0);
      },
      activeGroupLabel() {
        if (this.activeGroupKey === GROUP_UNASSIGNED_KEY || this.query.shareGroupStatus === 'unassigned') {
          return `未分组（${this.unassignedTotal}）`;
        }
        if (this.query.shareGroupStatus === 'assigned' && !this.selectedNormalGroup) {
          return `已设置科室（${this.assignedTotal}）`;
        }
        if (!this.selectedNormalGroup) return `全部科室（${this.allDeptTotal}）`;
        return this.groupLabel(this.selectedNormalGroup);
      },
      canApplySelectedGroup() {
        return !!this.selectedNormalGroup && this.selectedRows.length > 0;
      }
    },
    mounted() {
      this.loadGroupOverview();
    },
    methods: {
      rowKey(row) {
        return row && row.DEPT_TWO_CODE != null ? String(row.DEPT_TWO_CODE) : '';
      },
      groupRowKey(row) {
        return row.key;
      },
      groupRowClassName({ row }) {
        return row.key === this.activeGroupKey ? 'current-group-row' : '';
      },
      groupTypeText(row) {
        if (row.type === 'all') return '全部';
        if (row.type === 'unassigned') return '未分组';
        return '共享组';
      },
      groupTagType(row) {
        if (row.type === 'group') return 'success';
        if (row.type === 'unassigned') return 'info';
        return '';
      },
      datasource({ page, limit }) {
        const params = {
          page,
          size: limit,
          keyword: this.query.keyword || undefined,
          shareGroupStatus: this.query.shareGroupStatus || 'all'
        };
        if (this.activeGroupType === 'group' && this.selectedNormalGroup) {
          params.stockShareGroupCode = this.selectedNormalGroup.code;
          params.shareGroupStatus = 'assigned';
        } else if (this.activeGroupType === 'unassigned') {
          params.shareGroupStatus = 'unassigned';
        }
        return deptStockShareGroupList(params);
      },
      reload() {
        this.$refs.table && this.$refs.table.reload({ page: 1 });
      },
      reloadGroupOverview() {
        this.loadGroupOverview();
        this.reload();
      },
      resetQuery() {
        this.query = {
          keyword: '',
          shareGroupStatus: 'all'
        };
        this.activeGroupKey = GROUP_ALL_KEY;
        this.reload();
      },
      onSelectionChange(selection) {
        this.selectedRows = selection || [];
      },
      onTableDone() {
        this.selectedRows = [];
      },
      loadGroupOverview() {
        this.overviewLoading = true;
        Promise.all([
          deptStockShareGroupList({
            page: 1,
            size: 999999,
            shareGroupStatus: 'assigned'
          }),
          deptStockShareGroupList({
            page: 1,
            size: 1,
            shareGroupStatus: 'unassigned'
          }),
          deptStockShareGroupList({
            page: 1,
            size: 1,
            shareGroupStatus: 'all'
          })
        ])
          .then(([assignedRes, unassignedRes, allRes]) => {
            const rows = assignedRes && assignedRes.data ? assignedRes.data : [];
            const groupMap = {};
            rows.forEach((row) => {
              const code = (row.STOCK_SHARE_GROUP_CODE || '').trim();
              if (!code) return;
              if (!groupMap[code]) {
                groupMap[code] = {
                  code,
                  name: row.STOCK_SHARE_GROUP_NAME || '',
                  count: 0
                };
              }
              if (!groupMap[code].name && row.STOCK_SHARE_GROUP_NAME) {
                groupMap[code].name = row.STOCK_SHARE_GROUP_NAME;
              }
              groupMap[code].count += 1;
            });
            this.groupOverview = Object.values(groupMap).sort((a, b) => a.code.localeCompare(b.code));
            this.unassignedTotal = Number((unassignedRes && unassignedRes.total) || 0);
            this.allDeptTotal = Number((allRes && allRes.total) || 0);
            if (this.activeGroupType === 'group' && !this.selectedNormalGroup) {
              this.activeGroupKey = GROUP_ALL_KEY;
            }
          })
          .catch((e) => {
            this.$message.error(e.message || '查询共享组失败');
          })
          .finally(() => {
            this.overviewLoading = false;
          });
      },
      groupLabel(group) {
        if (!group) return '';
        const name = group.name ? ` / ${group.name}` : '';
        return `${group.code}${name}（${group.count}）`;
      },
      selectGroup(row) {
        this.activeGroupKey = row.key;
        if (row.type === 'all') {
          this.query.shareGroupStatus = 'all';
        } else if (row.type === 'unassigned') {
          this.query.shareGroupStatus = 'unassigned';
        } else {
          this.query.shareGroupStatus = 'assigned';
        }
        this.reload();
      },
      showAllGroups() {
        this.activeGroupKey = GROUP_ALL_KEY;
        this.query.shareGroupStatus = 'all';
        this.reload();
      },
      showAssigned() {
        this.activeGroupKey = GROUP_ALL_KEY;
        this.query.shareGroupStatus = 'assigned';
        this.reload();
      },
      showUnassigned() {
        this.activeGroupKey = GROUP_UNASSIGNED_KEY;
        this.query.shareGroupStatus = 'unassigned';
        this.reload();
      },
      onStatusChange(status) {
        this.activeGroupKey = status === 'unassigned' ? GROUP_UNASSIGNED_KEY : GROUP_ALL_KEY;
        this.reload();
      },
      fillFormByGroup(target, code) {
        const group = this.groupOverview.find((item) => item.code === code);
        if (!group) return;
        target.stockShareGroupCode = group.code;
        target.stockShareGroupName = group.name || '';
      },
      onEditPresetChange(code) {
        if (!code) return;
        this.fillFormByGroup(this.form, code);
      },
      onBatchPresetChange(code) {
        if (!code) return;
        this.fillFormByGroup(this.batchForm, code);
      },
      openEdit(row) {
        this.form = {
          deptTwoCode: String(row.DEPT_TWO_CODE || ''),
          deptTwoName: row.DEPT_TWO_NAME || '',
          stockShareGroupCode: row.STOCK_SHARE_GROUP_CODE || '',
          stockShareGroupName: row.STOCK_SHARE_GROUP_NAME || ''
        };
        this.editPresetCode = '';
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.formRef && this.$refs.formRef.clearValidate();
        });
      },
      onDialogClosed() {
        this.form = emptyForm();
        this.editPresetCode = '';
      },
      openNewGroupDialog() {
        if (!this.selectedRows.length) {
          this.$message.warning('新增分组至少选择一个科室');
          return;
        }
        this.newGroupForm = emptyGroupForm();
        this.newGroupDialogVisible = true;
        this.$nextTick(() => {
          this.$refs.newGroupFormRef && this.$refs.newGroupFormRef.clearValidate();
        });
      },
      onNewGroupDialogClosed() {
        this.newGroupForm = emptyGroupForm();
      },
      generateGroup(targetForm, formRefName) {
        this.generateLoading = true;
        deptStockShareGroupGenerate()
          .then((res) => {
            const data = res && res.data ? res.data : {};
            targetForm.stockShareGroupCode = data.StockShareGroupCode || '';
            targetForm.stockShareGroupName = data.StockShareGroupName || '';
            this.$nextTick(() => {
              this.$refs[formRefName] && this.$refs[formRefName].clearValidate();
            });
          })
          .catch((e) => {
            this.$message.error(e.message || '生成库存共享组失败');
          })
          .finally(() => {
            this.generateLoading = false;
          });
      },
      submitNewGroup() {
        if (!this.selectedRows.length) {
          this.$message.warning('新增分组至少选择一个科室');
          return;
        }
        this.$refs.newGroupFormRef.validate((valid) => {
          if (!valid) return;
          const code = (this.newGroupForm.stockShareGroupCode || '').trim();
          const name = (this.newGroupForm.stockShareGroupName || '').trim();
          this.saveRows(this.selectedRows.slice(), code, name, '新增分组完成').then((ok) => {
            if (ok) this.newGroupDialogVisible = false;
          });
        });
      },
      openBatchDialog() {
        if (!this.selectedRows.length) {
          this.$message.warning('请先选择二级科室');
          return;
        }
        this.batchForm = emptyGroupForm();
        this.batchPresetCode = '';
        this.batchDialogVisible = true;
        this.$nextTick(() => {
          this.$refs.batchFormRef && this.$refs.batchFormRef.clearValidate();
        });
      },
      onBatchDialogClosed() {
        this.batchForm = emptyGroupForm();
        this.batchPresetCode = '';
      },
      openRenameGroupDialog() {
        if (!this.selectedNormalGroup) {
          this.$message.warning('请先选择一个共享组');
          return;
        }
        this.renameForm = {
          stockShareGroupCode: this.selectedNormalGroup.code,
          stockShareGroupName: this.selectedNormalGroup.name || ''
        };
        this.renameDialogVisible = true;
        this.$nextTick(() => {
          this.$refs.renameFormRef && this.$refs.renameFormRef.clearValidate();
        });
      },
      onRenameDialogClosed() {
        this.renameForm = emptyGroupForm();
      },
      submit() {
        this.$refs.formRef.validate((valid) => {
          if (!valid) return;
          this.saveForm(false);
        });
      },
      submitClear() {
        this.saveForm(true);
      },
      clearGroup(row) {
        this.saveLoading = true;
        deptStockShareGroupSave({
          deptTwoCode: String(row.DEPT_TWO_CODE || ''),
          stockShareGroupCode: '',
          stockShareGroupName: ''
        })
          .then(() => {
            this.$message.success('已清空');
            this.reload();
            this.loadGroupOverview();
          })
          .catch((e) => {
            this.$message.error(e.message || '清空失败');
          })
          .finally(() => {
            this.saveLoading = false;
          });
      },
      saveForm(clear) {
        this.saveLoading = true;
        deptStockShareGroupSave({
          deptTwoCode: this.form.deptTwoCode,
          stockShareGroupCode: clear ? '' : (this.form.stockShareGroupCode || '').trim(),
          stockShareGroupName: clear ? '' : (this.form.stockShareGroupName || '').trim()
        })
          .then(() => {
            this.$message.success(clear ? '已清空' : '保存成功');
            this.dialogVisible = false;
            this.reload();
            this.loadGroupOverview();
          })
          .catch((e) => {
            this.$message.error(e.message || (clear ? '清空失败' : '保存失败'));
          })
          .finally(() => {
            this.saveLoading = false;
          });
      },
      submitBatch() {
        if (!this.selectedRows.length) {
          this.$message.warning('请先选择二级科室');
          return;
        }
        this.$refs.batchFormRef.validate((valid) => {
          if (!valid) return;
          const code = (this.batchForm.stockShareGroupCode || '').trim();
          const name = (this.batchForm.stockShareGroupName || '').trim();
          if (!code) {
            this.$message.warning('请填写共享组编码');
            return;
          }
          this.saveRows(this.selectedRows.slice(), code, name, '批量设置完成').then((ok) => {
            if (ok) this.batchDialogVisible = false;
          });
        });
      },
      batchClearGroups() {
        if (!this.selectedRows.length) {
          this.$message.warning('请先选择二级科室');
          return;
        }
        this.saveRows(this.selectedRows.slice(), '', '', '批量清空完成');
      },
      applySelectedGroupToRows() {
        if (!this.selectedNormalGroup) {
          this.$message.warning('请先在左侧选择一个共享组');
          return;
        }
        if (!this.selectedRows.length) {
          this.$message.warning('请先选择二级科室');
          return;
        }
        this.saveRows(
          this.selectedRows.slice(),
          this.selectedNormalGroup.code,
          this.selectedNormalGroup.name || '',
          '已加入选中分组'
        );
      },
      submitRenameGroup() {
        if (!this.selectedNormalGroup) {
          this.$message.warning('请先选择一个共享组');
          return;
        }
        this.$refs.renameFormRef.validate((valid) => {
          if (!valid) return;
          const code = this.renameForm.stockShareGroupCode;
          const name = (this.renameForm.stockShareGroupName || '').trim();
          this.fetchGroupMembers(code).then((rows) => {
            if (!rows.length) {
              this.$message.warning('该共享组下暂无科室');
              return;
            }
            this.saveRows(rows, code, name, '重命名完成').then((ok) => {
              if (ok) this.renameDialogVisible = false;
            });
          });
        });
      },
      clearSelectedGroup() {
        if (!this.selectedNormalGroup) {
          this.$message.warning('请先选择一个共享组');
          return;
        }
        const code = this.selectedNormalGroup.code;
        this.fetchGroupMembers(code).then((rows) => {
          if (!rows.length) {
            this.$message.warning('该共享组下暂无科室');
            return;
          }
          this.saveRows(rows, '', '', '分组已清空');
        });
      },
      fetchGroupMembers(code) {
        this.batchSaveLoading = true;
        return deptStockShareGroupList({
          page: 1,
          size: 999999,
          stockShareGroupCode: code,
          shareGroupStatus: 'assigned'
        })
          .then((res) => res.data || [])
          .catch((e) => {
            this.$message.error(e.message || '查询分组科室失败');
            return [];
          })
          .finally(() => {
            this.batchSaveLoading = false;
          });
      },
      saveRows(rows, groupCode, groupName, successMessage) {
        if (!rows.length) return Promise.resolve(false);
        this.batchSaveLoading = true;
        const loading = this.$loading({
          lock: true,
          text: `正在保存 ${rows.length} 个科室`
        });
        const tasks = rows.map((row) =>
          deptStockShareGroupSave({
            deptTwoCode: String(row.DEPT_TWO_CODE || ''),
            stockShareGroupCode: groupCode,
            stockShareGroupName: groupName
          })
            .then(() => ({ ok: true, row }))
            .catch((e) => ({
              ok: false,
              row,
              msg: e.message || '保存失败'
            }))
        );
        return Promise.all(tasks)
          .then((results) => {
            const failed = results.filter((item) => !item.ok);
            if (failed.length) {
              const first = failed[0];
              this.$message.error(
                `保存失败 ${failed.length} 个，首个失败科室：${first.row.DEPT_TWO_NAME || first.row.DEPT_TWO_CODE}，${first.msg}`
              );
              return false;
            }
            this.$message.success(successMessage);
            this.reload();
            this.loadGroupOverview();
            return true;
          })
          .finally(() => {
            loading.close();
            this.batchSaveLoading = false;
          });
      }
    }
  };
</script>

<style scoped>
  .page-card :deep(.el-card__body) {
    height: calc(100vh - 128px);
    box-sizing: border-box;
    padding: 12px;
  }
  .two-pane-layout {
    display: grid;
    grid-template-columns: 360px minmax(0, 1fr);
    gap: 12px;
    height: 100%;
    min-height: 520px;
  }
  .group-pane,
  .dept-pane {
    min-width: 0;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: #fff;
  }
  .group-pane {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .dept-pane {
    display: flex;
    flex-direction: column;
    padding: 0 10px 10px;
    overflow: hidden;
  }
  .pane-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 54px;
    padding: 8px 10px;
    border-bottom: 1px solid #ebeef5;
  }
  .dept-pane-header {
    padding-right: 0;
    padding-left: 0;
  }
  .pane-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }
  .pane-subtitle,
  .muted-text,
  .active-group {
    font-size: 12px;
    color: #909399;
  }
  .quick-actions {
    display: flex;
    gap: 8px;
    padding: 8px 10px;
    border-bottom: 1px solid #ebeef5;
  }
  .group-table {
    flex: 1;
  }
  .group-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .group-main {
    min-width: 0;
  }
  .group-code {
    overflow: hidden;
    font-weight: 600;
    color: #303133;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .group-name {
    overflow: hidden;
    margin-top: 2px;
    font-size: 12px;
    color: #909399;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .group-footer {
    padding: 8px 10px;
    border-top: 1px solid #ebeef5;
  }
  .group-manage-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  .dept-header-actions,
  .toolbar-actions,
  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dept-filter {
    flex-shrink: 0;
    padding-top: 10px;
  }
  .dept-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    gap: 8px;
    padding: 0 0 8px;
  }
  .batch-alert {
    margin-bottom: 12px;
  }
  .dept-stock-share-group-page :deep(.current-group-row > td) {
    background-color: #ecf5ff !important;
  }
  @media (max-width: 1200px) {
    .two-pane-layout {
      grid-template-columns: 320px minmax(0, 1fr);
    }
    .dept-toolbar {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
