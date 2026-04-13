<template>
  <div class="spd-dict-data-panel">
    <template v-if="!dictTypeId">
      <el-empty :description="emptyDescription" />
    </template>
    <template v-else>
      <div v-if="dictTypeName" class="dict-data-title">
        <span>字典项</span>
        <el-tag size="small" type="info" effect="plain">{{ dictTypeName }}</el-tag>
      </div>
      <ele-pro-table
        ref="table"
        :columns="columns"
        :datasource="datasource"
        :response="responseConfig"
        :selection.sync="selection"
        row-key="DictDataId"
        :height="tableHeight"
        :full-height="fullHeight"
        cache-key="spdDictDataTable"
        tool-class="ele-toolbar-form"
      >
        <template v-slot:toolbar>
          <el-input
            v-model="keywordValue"
            clearable
            size="mini"
            placeholder="字典值"
            style="width: 130px; margin-right: 8px"
            @keyup.enter.native="reload"
          />
          <el-input
            v-model="keywordLabel"
            clearable
            size="mini"
            placeholder="标签"
            style="width: 130px; margin-right: 8px"
            @keyup.enter.native="reload"
          />
          <el-select
            v-model="filterStatus"
            clearable
            size="mini"
            placeholder="状态"
            style="width: 100px; margin-right: 8px"
          >
            <el-option label="正常" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="reload">
            查询
          </el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openEdit()">
            添加
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removeBatch">
            删除
          </el-button>
        </template>
        <template v-slot:labelCol="{ row }">
          <dict-data-tag :item="row" />
        </template>
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">修改</el-link>
          <el-popconfirm class="ele-action" title="确定删除该字典项？" @confirm="remove(row)">
            <template v-slot:reference>
              <el-link type="danger" :underline="false" icon="el-icon-delete">删除</el-link>
            </template>
          </el-popconfirm>
        </template>
      </ele-pro-table>
      <spd-dict-data-edit
        :visible.sync="showEdit"
        :data="current"
        :dict-type-id="dictTypeId"
        @done="reload"
      />
    </template>
  </div>
</template>

<script>
  import DictDataTag from '@/components/DictDataTag/index.vue';
  import SpdDictDataEdit from './spd-dict-data-edit.vue';
  import { dictDataList, dictDataDelete } from '@/api/system/dict-management';

  export default {
    components: { DictDataTag, SpdDictDataEdit },
    props: {
      dictTypeId: [Number, String],
      dictTypeName: String,
      /** 无类型时的空状态文案 */
      emptyDescription: {
        type: String,
        default: '请选择字典类型'
      },
      tableHeight: {
        type: String,
        default: 'calc(100vh - 290px)'
      },
      fullHeight: {
        type: String,
        default: 'calc(100vh - 140px)'
      }
    },
    data() {
      return {
        responseConfig: {
          dataName: 'data',
          countName: 'total',
          statusCode: 200
        },
        keywordValue: '',
        keywordLabel: '',
        filterStatus: '',
        selection: [],
        current: null,
        showEdit: false,
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 42,
            align: 'center'
          },
          {
            columnKey: 'index',
            type: 'index',
            width: 48,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'DictValue',
            label: '字典值',
            minWidth: 100,
            showOverflowTooltip: true
          },
          {
            columnKey: 'labelCol',
            prop: 'DictLabel',
            label: '标签',
            minWidth: 120,
            slot: 'labelCol',
            showOverflowTooltip: true
          },
          {
            prop: 'TagColor',
            label: '标签色',
            width: 100,
            showOverflowTooltip: true
          },
          {
            prop: 'TagEffect',
            label: '效果',
            width: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'Status',
            label: '状态',
            width: 80,
            formatter: (_row, _column, cellValue) =>
              cellValue === '1' || cellValue === 1 ? '正常' : '停用'
          },
          {
            prop: 'SortNum',
            label: '排序',
            width: 72,
            align: 'center'
          },
          {
            prop: 'CreateTime',
            label: '创建时间',
            minWidth: 160,
            formatter: (_row, _column, cellValue) =>
              cellValue ? this.$util.toDateString(cellValue) : ''
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 130,
            align: 'center',
            slot: 'action',
            resizable: false
          }
        ]
      };
    },
    watch: {
      dictTypeId() {
        this.keywordValue = '';
        this.keywordLabel = '';
        this.filterStatus = '';
        this.$nextTick(() => {
          if (this.$refs.table && this.dictTypeId) {
            this.reload();
          }
        });
      }
    },
    methods: {
      datasource({ page, limit }) {
        return dictDataList({
          page,
          size: limit,
          dictTypeId: this.dictTypeId,
          dictValue: this.keywordValue || undefined,
          dictLabel: this.keywordLabel || undefined,
          status: this.filterStatus || undefined
        });
      },
      reload() {
        if (this.$refs.table && this.dictTypeId) {
          this.$refs.table.reload({ page: 1 });
        }
      },
      openEdit(row) {
        this.current = row || null;
        this.showEdit = true;
      },
      remove(row) {
        const loading = this.$loading({ lock: true });
        dictDataDelete(row.DictDataId)
          .then(() => {
            loading.close();
            this.$message.success('删除成功');
            this.reload();
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message || '删除失败');
          });
      },
      removeBatch() {
        if (!this.selection.length) {
          this.$message.error('请至少选择一条数据');
          return;
        }
        this.$confirm('确定删除选中的字典项吗？', '提示', { type: 'warning' })
          .then(() => {
            const loading = this.$loading({ lock: true });
            const ids = this.selection.map((d) => d.DictDataId);
            Promise.all(ids.map((id) => dictDataDelete(id)))
              .then(() => {
                loading.close();
                this.$message.success('删除成功');
                this.reload();
              })
              .catch((e) => {
                loading.close();
                this.$message.error(e.message || '删除失败');
              });
          })
          .catch(() => {});
      }
    }
  };
</script>

<style lang="scss" scoped>
  .spd-dict-data-panel {
    min-height: 200px;
  }

  .dict-data-title {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;

    .el-tag {
      margin-left: 8px;
      font-weight: normal;
    }
  }
</style>
