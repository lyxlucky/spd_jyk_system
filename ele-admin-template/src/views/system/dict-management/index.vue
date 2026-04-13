<template>
  <div class="ele-body spd-dict-management">
    <el-card shadow="never" class="spd-dict-management-card">
      <ele-pro-table
        ref="typeTable"
        :columns="typeColumns"
        :datasource="typeDatasource"
        :response="responseConfig"
        :current.sync="currentType"
        :row-key="dictTypeRowKey"
        highlight-current-row
        height="calc(100vh - 246px)"
        :need-page="true"
        :toolkit="['reload', 'size', 'columns', 'fullscreen']"
        cache-key="spdDictTypeTable"
        class="spd-dict-type-table"
        tool-class="ele-toolbar-form"
        @done="onTypeTableDone"
      >
          <template v-slot:toolbar>
            <el-input
              v-model="typeQuery.DictTypeCode"
              clearable
              size="mini"
              placeholder="类型编码"
              style="width: 120px; margin-right: 8px"
              @keyup.enter.native="reloadType"
            />
            <el-input
              v-model="typeQuery.DictTypeName"
              clearable
              size="mini"
              placeholder="类型名称"
              style="width: 120px; margin-right: 8px"
              @keyup.enter.native="reloadType"
            />
            <el-select
              v-model="typeQuery.Status"
              clearable
              size="mini"
              placeholder="状态"
              style="width: 88px; margin-right: 8px"
            >
              <el-option label="正常" value="1" />
              <el-option label="停用" value="0" />
            </el-select>
            <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="reloadType">
              查询
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openTypeEdit()">
              添加
            </el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit"
              class="ele-btn-icon"
              :disabled="!currentType"
              @click="openTypeEdit(currentType)"
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="ele-btn-icon"
              :disabled="!currentType"
              @click="removeType"
            >
              删除
            </el-button>
          </template>
          <template v-slot:dictTypeCodeCol="{ row }">
            <el-link type="primary" :underline="false" @click.stop="openDictDataPanel(row)">
              {{ row.DictTypeCode || row.dictTypeCode }}
            </el-link>
          </template>
          <template v-slot:action="{ row }">
            <el-link type="primary" :underline="false" icon="el-icon-edit" @click.stop="openTypeEdit(row)">
              编辑
            </el-link>
            <el-popconfirm class="ele-action" title="将删除该类型下全部字典项，确定？" @confirm="deleteType(row)">
              <template v-slot:reference>
                <el-link type="danger" :underline="false" icon="el-icon-delete" @click.stop>删除</el-link>
              </template>
            </el-popconfirm>
          </template>
        </ele-pro-table>
    </el-card>

    <el-dialog
      :title="dataPanelTitle"
      :visible.sync="dataPanelVisible"
      width="90%"
      top="4vh"
      append-to-body
      destroy-on-close
      custom-class="spd-dict-data-dialog"
      @closed="onDataPanelClosed"
    >
      <spd-dict-data-panel
        v-if="dataPanelRow"
        :key="panelRowKey"
        :dict-type-id="dictTypeIdOf(dataPanelRow)"
        :dict-type-name="dictTypeNameOf(dataPanelRow)"
        empty-description="未选择字典类型"
        table-height="calc(72vh - 168px)"
        full-height="calc(72vh - 100px)"
      />
    </el-dialog>

    <spd-dict-type-edit :visible.sync="showTypeEdit" :data="typeEditData" @done="onTypeSaved" />
  </div>
</template>

<script>
  import SpdDictDataPanel from './components/spd-dict-data-panel.vue';
  import SpdDictTypeEdit from './components/spd-dict-type-edit.vue';
  import { dictTypeList, dictTypeDelete } from '@/api/system/dict-management';

  export default {
    name: 'SystemDictManagement',
    components: { SpdDictDataPanel, SpdDictTypeEdit },
    data() {
      return {
        responseConfig: {
          dataName: 'data',
          countName: 'total',
          statusCode: 200
        },
        typeQuery: {
          DictTypeCode: '',
          DictTypeName: '',
          Status: ''
        },
        currentType: null,
        typeEditData: null,
        showTypeEdit: false,
        dataPanelVisible: false,
        dataPanelRow: null,
        typeColumns: [
          {
            columnKey: 'index',
            type: 'index',
            width: 48,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            columnKey: 'dictTypeCodeCol',
            prop: 'DictTypeCode',
            label: '类型编码',
            minWidth: 110,
            align: 'center',
            slot: 'dictTypeCodeCol',
            showOverflowTooltip: true
          },
          {
            prop: 'DictTypeName',
            label: '类型名称',
            align: 'center',
            minWidth: 110,
            showOverflowTooltip: true
          },
          {
            prop: 'Status',
            label: '状态',
            align: 'center',
            width: 72,
            formatter: (_row, _column, cellValue) =>
              cellValue === '1' || cellValue === 1 ? '正常' : '停用'
          },
          {
            prop: 'SortNum',
            label: '排序',
            align: 'center',
            width: 64,
          },
          {
            prop: 'Remark',
            label: '备注',
            align: 'center',
            minWidth: 90,
            showOverflowTooltip: true
          },
          {
            prop: 'CreateTime',
            label: '创建时间',
            align: 'center',
            minWidth: 150,
            formatter: (_row, _column, cellValue) =>
              cellValue ? this.$util.toDateString(cellValue) : ''
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 240,
            align: 'center',
            slot: 'action',
            resizable: false
          }
        ]
      };
    },
    computed: {
      dataPanelTitle() {
        if (!this.dataPanelRow) {
          return '字典数据';
        }
        const code = this.dataPanelRow.DictTypeCode || this.dataPanelRow.dictTypeCode || '';
        const name = this.dataPanelRow.DictTypeName || this.dataPanelRow.dictTypeName || '';
        return code ? `字典数据 - ${code}${name ? '（' + name + '）' : ''}` : '字典数据';
      },
      panelRowKey() {
        const id = this.dataPanelRow && (this.dataPanelRow.DictTypeId ?? this.dataPanelRow.dictTypeId);
        return id != null ? String(id) : '0';
      }
    },
    methods: {
      dictTypeRowKey(row) {
        const id = row && (row.DictTypeId != null ? row.DictTypeId : row.dictTypeId);
        return id != null ? String(id) : '';
      },
      dictTypeIdOf(row) {
        return row && (row.DictTypeId != null ? row.DictTypeId : row.dictTypeId);
      },
      dictTypeNameOf(row) {
        return row && (row.DictTypeName != null ? row.DictTypeName : row.dictTypeName);
      },
      openDictDataPanel(row) {
        this.dataPanelRow = row;
        this.dataPanelVisible = true;
      },
      onDataPanelClosed() {
        this.dataPanelRow = null;
      },
      typeDatasource({ page, limit }) {
        return dictTypeList({
          page,
          size: limit,
          dictTypeCode: this.typeQuery.DictTypeCode || undefined,
          dictTypeName: this.typeQuery.DictTypeName || undefined,
          status: this.typeQuery.Status || undefined
        });
      },
      reloadType() {
        this.$refs.typeTable.reload({ page: 1 });
      },
      onTypeTableDone(res) {
        const list = res.data;
        if (list && list.length && this.$refs.typeTable) {
          const first = list[0];
          this.$nextTick(() => {
            this.$refs.typeTable.setCurrentRow(first);
            this.currentType = first;
          });
        } else {
          this.currentType = null;
        }
      },
      onTypeSaved() {
        this.reloadType();
      },
      openTypeEdit(row) {
        this.typeEditData = row || null;
        this.showTypeEdit = true;
      },
      removeType() {
        if (!this.currentType) {
          return;
        }
        this.$confirm('删除后将移除该类型下全部字典项，是否继续？', '提示', { type: 'warning' })
          .then(() => {
            this.deleteType(this.currentType);
          })
          .catch(() => {});
      },
      deleteType(row) {
        const id = row && (row.DictTypeId != null ? row.DictTypeId : row.dictTypeId);
        if (!id) {
          return;
        }
        const loading = this.$loading({ lock: true });
        dictTypeDelete(id)
          .then(() => {
            loading.close();
            this.$message.success('删除成功');
            this.reloadType();
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message || '删除失败');
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .spd-dict-management-card {
    :deep(.el-card__body) {
      padding: 12px;
    }
  }

  .spd-dict-type-table {
    :deep(.el-table__row) {
      cursor: pointer;
    }
  }
</style>

<style lang="scss">
  .spd-dict-data-dialog {
    max-width: 1200px;
  }
</style>
