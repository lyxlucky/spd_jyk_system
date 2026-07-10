<template>
  <div class="ele-body warehouse-area-manage">
    <div class="warehouse-main">
      <el-card shadow="never" class="manage-panel area-panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">库房库区管理</div>
            <div class="panel-subtitle">点击左侧库房/库区，查看关联科室。</div>
          </div>
          <el-button type="success" size="mini" icon="el-icon-plus" @click="openAreaDialog()">新增</el-button>
        </div>

        <el-form :inline="true" :model="areaQuery" size="mini" class="query-form area-query-form">
          <el-form-item label="编码">
            <el-input v-model="areaQuery.AREA_CODE" clearable placeholder="库房/库区编码" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="areaQuery.AREA_NAME" clearable placeholder="库房/库区名称" />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="areaQuery.AREA_TYPE" clearable placeholder="全部" class="query-select">
              <el-option label="库房" value="WAREHOUSE" />
              <el-option label="库区" value="AREA" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="areaQuery.ENABLED_FLAG" clearable placeholder="全部" class="query-select">
              <el-option label="启用" value="1" />
              <el-option label="停用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="loadAreas">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetAreaQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <vxe-table
          ref="areaTable"
          v-loading="areaLoading"
          :data="areaRows"
          border
          round
          size="mini"
          height="620"
          show-overflow
          highlight-current-row
          :row-config="{ isHover: true, isCurrent: true }"
          :column-config="{ resizable: true }"
          empty-text="暂无库房/库区数据"
          @cell-click="handleAreaCellClick"
        >
          <vxe-column type="seq" title="序号" width="55" align="center" />
          <vxe-column field="AREA_CODE" title="编码" min-width="120" />
          <vxe-column field="AREA_NAME" title="名称" min-width="150" />
          <vxe-column title="类型" width="85" align="center">
            <template #default="{ row }">
              <el-tag size="mini" :type="row.AREA_TYPE === 'WAREHOUSE' ? 'primary' : 'success'">
                {{ row.AREA_TYPE === 'WAREHOUSE' ? '库房' : '库区' }}
              </el-tag>
            </template>
          </vxe-column>
          <vxe-column field="PARENT_NAME" title="所属库房" min-width="130" />
          <vxe-column title="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag size="mini" :type="row.ENABLED_FLAG === '1' ? 'success' : 'info'">
                {{ row.ENABLED_FLAG === '1' ? '启用' : '停用' }}
              </el-tag>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="160" align="center" fixed="right">
            <template #default="{ row }">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click.stop="openAreaDialog(row)">编辑</el-button>
              <el-button
                size="mini"
                :type="row.ENABLED_FLAG === '1' ? 'danger' : 'success'"
                @click.stop="toggleArea(row)"
              >
                {{ row.ENABLED_FLAG === '1' ? '停用' : '启用' }}
              </el-button>
            </template>
          </vxe-column>
        </vxe-table>

        <el-pagination
          class="table-page"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="pageSizes"
          :current-page.sync="areaPage.page"
          :page-size.sync="areaPage.size"
          :total="areaPage.total"
          @size-change="handleAreaSizeChange"
          @current-change="handleAreaCurrentChange"
        />
      </el-card>

      <div class="relation-column">
        <el-card shadow="never" class="manage-panel relation-panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">SPD科室关系</div>
              <div class="panel-subtitle">{{ selectedAreaSubtitle }}</div>
            </div>
            <el-button type="success" size="mini" icon="el-icon-plus" :disabled="!selectedAreaCode" @click="openSpdDialog()">新增关系</el-button>
          </div>

          <el-form :inline="true" :model="spdQuery" size="mini" class="query-form">
            <el-form-item label="SPD编码">
              <el-input v-model="spdQuery.DEPT_TWO_CODE" clearable placeholder="SPD科室编码" />
            </el-form-item>
            <el-form-item label="SPD名称">
              <el-input v-model="spdQuery.DEPT_TWO_NAME" clearable placeholder="SPD科室名称" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="spdQuery.ENABLED_FLAG" clearable placeholder="全部" class="query-select">
                <el-option label="启用" value="1" />
                <el-option label="停用" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" :disabled="!selectedAreaCode" @click="loadSpdRels">查询</el-button>
              <el-button icon="el-icon-refresh" :disabled="!selectedAreaCode" @click="resetSpdQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <vxe-table
            v-loading="spdLoading"
            :data="spdRows"
            border
            round
            size="mini"
            height="225"
            show-overflow
            :row-config="{ isHover: true }"
            :column-config="{ resizable: true }"
            :empty-text="selectedAreaCode ? '暂无SPD绑定关系' : '请先选择库房/库区'"
          >
            <vxe-column type="seq" title="序号" width="55" align="center" />
            <vxe-column field="DEPT_TWO_CODE" title="SPD科室编码" width="130" />
            <vxe-column field="DEPT_TWO_NAME" title="SPD科室名称" min-width="160" />
            <vxe-column title="默认" width="70" align="center">
              <template #default="{ row }">
                <el-tag size="mini" :type="row.DEFAULT_FLAG === '1' ? 'warning' : 'info'">
                  {{ row.DEFAULT_FLAG === '1' ? '是' : '否' }}
                </el-tag>
              </template>
            </vxe-column>
            <vxe-column title="状态" width="70" align="center">
              <template #default="{ row }">
                <el-tag size="mini" :type="row.ENABLED_FLAG === '1' ? 'success' : 'info'">
                  {{ row.ENABLED_FLAG === '1' ? '启用' : '停用' }}
                </el-tag>
              </template>
            </vxe-column>
            <vxe-column field="REMARK" title="备注" min-width="120" />
            <vxe-column title="操作" width="130" align="center" fixed="right">
              <template #default="{ row }">
                <el-button size="mini" type="primary" @click="openSpdDialog(row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteSpdRelRow(row)">删除</el-button>
              </template>
            </vxe-column>
          </vxe-table>

          <el-pagination
            class="table-page"
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="relPageSizes"
            :current-page.sync="spdPage.page"
            :page-size.sync="spdPage.size"
            :total="spdPage.total"
            @size-change="handleSpdSizeChange"
            @current-change="handleSpdCurrentChange"
          />
        </el-card>

        <el-card shadow="never" class="manage-panel relation-panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">HIS科室关系</div>
              <div class="panel-subtitle">{{ selectedAreaSubtitle }}</div>
            </div>
            <el-button type="success" size="mini" icon="el-icon-plus" :disabled="!selectedAreaCode" @click="openHisDialog()">新增关系</el-button>
          </div>

          <el-form :inline="true" :model="hisQuery" size="mini" class="query-form">
            <el-form-item label="HIS编码">
              <el-input v-model="hisQuery.DEPT_CODE" clearable placeholder="HIS科室编码" />
            </el-form-item>
            <el-form-item label="HIS名称">
              <el-input v-model="hisQuery.DEPT_NAME" clearable placeholder="HIS科室名称" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="hisQuery.ENABLED_FLAG" clearable placeholder="全部" class="query-select">
                <el-option label="启用" value="1" />
                <el-option label="停用" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" :disabled="!selectedAreaCode" @click="loadHisRels">查询</el-button>
              <el-button icon="el-icon-refresh" :disabled="!selectedAreaCode" @click="resetHisQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <vxe-table
            v-loading="hisLoading"
            :data="hisRows"
            border
            round
            size="mini"
            height="225"
            show-overflow
            :row-config="{ isHover: true }"
            :column-config="{ resizable: true }"
            :empty-text="selectedAreaCode ? '暂无HIS绑定关系' : '请先选择库房/库区'"
          >
            <vxe-column type="seq" title="序号" width="55" align="center" />
            <vxe-column field="DEPT_CODE" title="HIS科室编码" width="130" />
            <vxe-column field="DEPT_NAME" title="HIS科室名称" min-width="160" />
            <vxe-column title="默认" width="70" align="center">
              <template #default="{ row }">
                <el-tag size="mini" :type="row.DEFAULT_FLAG === '1' ? 'warning' : 'info'">
                  {{ row.DEFAULT_FLAG === '1' ? '是' : '否' }}
                </el-tag>
              </template>
            </vxe-column>
            <vxe-column title="状态" width="70" align="center">
              <template #default="{ row }">
                <el-tag size="mini" :type="row.ENABLED_FLAG === '1' ? 'success' : 'info'">
                  {{ row.ENABLED_FLAG === '1' ? '启用' : '停用' }}
                </el-tag>
              </template>
            </vxe-column>
            <vxe-column field="REMARK" title="备注" min-width="120" />
            <vxe-column title="操作" width="130" align="center" fixed="right">
              <template #default="{ row }">
                <el-button size="mini" type="primary" @click="openHisDialog(row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteHisRelRow(row)">删除</el-button>
              </template>
            </vxe-column>
          </vxe-table>

          <el-pagination
            class="table-page"
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="relPageSizes"
            :current-page.sync="hisPage.page"
            :page-size.sync="hisPage.size"
            :total="hisPage.total"
            @size-change="handleHisSizeChange"
            @current-change="handleHisCurrentChange"
          />
        </el-card>
      </div>
    </div>

    <el-dialog :title="areaForm.ID ? '编辑库房/库区' : '新增库房/库区'" :visible.sync="areaDialogVisible" width="560px" @closed="resetAreaForm">
      <el-form ref="areaForm" :model="areaForm" :rules="areaRules" label-width="100px" size="mini">
        <el-form-item label="编码" prop="AREA_CODE">
          <el-input v-model="areaForm.AREA_CODE" maxlength="50" clearable :suffix-icon="areaCodeLoading ? 'el-icon-loading' : ''">
            <el-button slot="append" icon="el-icon-refresh" :loading="areaCodeLoading" @click="loadWarehouseAreaCode" />
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="AREA_NAME">
          <el-input v-model="areaForm.AREA_NAME" maxlength="100" clearable />
        </el-form-item>
        <el-form-item label="类型" prop="AREA_TYPE">
          <el-radio-group v-model="areaForm.AREA_TYPE" @change="handleAreaTypeChange">
            <el-radio-button label="WAREHOUSE">库房</el-radio-button>
            <el-radio-button label="AREA">库区</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="areaForm.AREA_TYPE === 'AREA'" label="所属库房" prop="PARENT_ID">
          <el-select
            v-model="areaForm.PARENT_ID"
            filterable
            remote
            clearable
            placeholder="请选择所属库房"
            :remote-method="loadAreaOptions"
            :loading="optionLoading"
            class="full-width"
          >
            <el-option
              v-for="item in warehouseOptions"
              :key="item.ID"
              :label="item.LABEL"
              :value="Number(item.ID)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="ENABLED_FLAG">
          <el-radio-group v-model="areaForm.ENABLED_FLAG">
            <el-radio-button label="1">启用</el-radio-button>
            <el-radio-button label="0">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="areaForm.SORT_NO" :min="0" :max="999999" class="full-width" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="areaForm.REMARK" type="textarea" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="areaDialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" :loading="submitLoading" @click="submitArea">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="relDialogTitle" :visible.sync="relDialogVisible" width="560px" @closed="resetRelForm">
      <el-form ref="relForm" :model="relForm" :rules="relRules" label-width="108px" size="mini">
        <el-form-item :label="relFormType === 'his' ? 'HIS科室' : 'SPD科室'" prop="DEPT_VALUE">
          <el-select
            v-model="relForm.DEPT_VALUE"
            multiple
            collapse-tags
            :multiple-limit="relForm.ID ? 1 : 0"
            filterable
            remote
            clearable
            :placeholder="relFormType === 'his' ? '请选择HIS科室' : '请选择SPD科室'"
            :remote-method="loadDeptOptions"
            :loading="optionLoading"
            class="full-width"
          >
            <el-option
              v-for="item in deptOptions"
              :key="item.VALUE"
              :label="item.LABEL"
              :value="item.VALUE"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库房/库区" prop="AREA_CODE">
          <el-select
            v-model="relForm.AREA_CODE"
            filterable
            remote
            clearable
            placeholder="请选择库房/库区"
            :remote-method="loadAreaOptions"
            :loading="optionLoading"
            class="full-width"
            @change="handleRelAreaChange"
          >
            <el-option
              v-for="item in areaOptions"
              :key="item.VALUE"
              :label="item.LABEL"
              :value="String(item.VALUE)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="默认库区">
          <el-switch v-model="relForm.DEFAULT_FLAG" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="relForm.ENABLED_FLAG">
            <el-radio-button label="1">启用</el-radio-button>
            <el-radio-button label="0">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="relForm.REMARK" type="textarea" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="relDialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" :loading="submitLoading" @click="submitRel">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryWarehouseArea,
  getWarehouseAreaCode,
  saveWarehouseArea,
  enableWarehouseArea,
  queryHisDeptRel,
  saveHisDeptRel,
  deleteHisDeptRel,
  querySpdDeptRel,
  saveSpdDeptRel,
  deleteSpdDeptRel,
  queryHisDeptOptions,
  querySpdDeptOptions,
  queryWarehouseAreaOptions
} from '@/api/Home/WarehouseAreaManage';

const defaultAreaQuery = () => ({
  AREA_CODE: '',
  AREA_NAME: '',
  AREA_TYPE: '',
  ENABLED_FLAG: ''
});

const defaultRelQuery = () => ({
  DEPT_CODE: '',
  DEPT_NAME: '',
  DEPT_TWO_CODE: '',
  DEPT_TWO_NAME: '',
  AREA_CODE: '',
  ENABLED_FLAG: ''
});

const defaultAreaForm = () => ({
  ID: '',
  AREA_CODE: '',
  AREA_NAME: '',
  AREA_TYPE: 'WAREHOUSE',
  PARENT_ID: '',
  ENABLED_FLAG: '1',
  SORT_NO: 0,
  REMARK: ''
});

const defaultRelForm = () => ({
  ID: '',
  DEPT_VALUE: [],
  AREA_CODE: '',
  DEFAULT_FLAG: '0',
  ENABLED_FLAG: '1',
  REMARK: ''
});

export default {
  name: 'WarehouseAreaManage',
  data() {
    return {
      pageSizes: [15, 30, 50, 100],
      relPageSizes: [10, 20, 50, 100],
      areaQuery: defaultAreaQuery(),
      hisQuery: defaultRelQuery(),
      spdQuery: defaultRelQuery(),
      areaPage: { page: 1, size: 15, total: 0 },
      hisPage: { page: 1, size: 10, total: 0 },
      spdPage: { page: 1, size: 10, total: 0 },
      areaRows: [],
      hisRows: [],
      spdRows: [],
      selectedArea: null,
      areaLoading: false,
      hisLoading: false,
      spdLoading: false,
      areaCodeLoading: false,
      submitLoading: false,
      optionLoading: false,
      areaDialogVisible: false,
      relDialogVisible: false,
      areaForm: defaultAreaForm(),
      relForm: defaultRelForm(),
      relFormType: 'his',
      warehouseOptions: [],
      areaOptions: [],
      deptOptions: [],
      areaRules: {
        AREA_CODE: [{ required: true, message: '请输入库房/库区编码', trigger: 'blur' }],
        AREA_NAME: [{ required: true, message: '请输入库房/库区名称', trigger: 'blur' }],
        AREA_TYPE: [{ required: true, message: '请选择类型', trigger: 'change' }],
        PARENT_ID: [{ required: true, message: '请选择所属库房', trigger: 'change' }],
        ENABLED_FLAG: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      relRules: {
        DEPT_VALUE: [{ type: 'array', required: true, message: '请选择科室', trigger: 'change' }],
        AREA_CODE: [{ required: true, message: '请选择库房/库区', trigger: 'change' }]
      }
    };
  },
  computed: {
    relDialogTitle() {
      const prefix = this.relFormType === 'his' ? 'HIS科室关系' : 'SPD科室关系';
      return this.relForm.ID ? `编辑${prefix}` : `新增${prefix}`;
    },
    selectedAreaId() {
      return this.selectedArea && this.selectedArea.ID ? this.selectedArea.ID : '';
    },
    selectedAreaCode() {
      return this.selectedArea && this.selectedArea.AREA_CODE ? this.selectedArea.AREA_CODE : '';
    },
    selectedAreaSubtitle() {
      if (!this.selectedAreaCode) {
        return '请先在左侧选择库房/库区';
      }
      return `当前库房/库区：${this.selectedArea.AREA_CODE || ''} ${this.selectedArea.AREA_NAME || ''}`;
    }
  },
  created() {
    this.loadAreas();
    this.loadAreaOptions('');
  },
  methods: {
    requestList(api, query, page, loadingKey, rowsKey, pageKey) {
      this[loadingKey] = true;
      return api({ ...query, page: page.page, size: page.size })
        .then((res) => {
          this[rowsKey] = res.result || [];
          this[pageKey].total = Number(res.count || res.total || 0);
        })
        .catch((err) => this.$message.error(err.message))
        .finally(() => {
          this[loadingKey] = false;
        });
    },
    loadAreas() {
      return this.requestList(queryWarehouseArea, this.areaQuery, this.areaPage, 'areaLoading', 'areaRows', 'areaPage')
        .then(() => {
          if (!this.areaRows.length) {
            this.clearSelectedArea();
            return;
          }
          const current = this.selectedAreaId
            ? this.areaRows.find((row) => String(row.ID) === String(this.selectedAreaId))
            : null;
          this.selectArea(current || this.areaRows[0], true);
        });
    },
    handleAreaSizeChange(size) {
      this.areaPage.size = size;
      this.areaPage.page = 1;
      this.loadAreas();
    },
    handleAreaCurrentChange(page) {
      this.areaPage.page = page;
      this.loadAreas();
    },
    loadHisRels() {
      if (!this.hisQuery.AREA_CODE) {
        this.hisRows = [];
        this.hisPage.total = 0;
        return Promise.resolve();
      }
      return this.requestList(queryHisDeptRel, this.hisQuery, this.hisPage, 'hisLoading', 'hisRows', 'hisPage');
    },
    loadSpdRels() {
      if (!this.spdQuery.AREA_CODE) {
        this.spdRows = [];
        this.spdPage.total = 0;
        return Promise.resolve();
      }
      return this.requestList(querySpdDeptRel, this.spdQuery, this.spdPage, 'spdLoading', 'spdRows', 'spdPage');
    },
    handleSpdSizeChange(size) {
      this.spdPage.size = size;
      this.spdPage.page = 1;
      this.loadSpdRels();
    },
    handleSpdCurrentChange(page) {
      this.spdPage.page = page;
      this.loadSpdRels();
    },
    handleHisSizeChange(size) {
      this.hisPage.size = size;
      this.hisPage.page = 1;
      this.loadHisRels();
    },
    handleHisCurrentChange(page) {
      this.hisPage.page = page;
      this.loadHisRels();
    },
    handleAreaCellClick({ row }) {
      this.selectArea(row, true);
    },
    selectArea(row, reload) {
      if (!row || !row.ID) {
        this.clearSelectedArea();
        return;
      }
      this.selectedArea = row;
      this.hisQuery = { ...this.hisQuery, AREA_CODE: row.AREA_CODE };
      this.spdQuery = { ...this.spdQuery, AREA_CODE: row.AREA_CODE };
      this.hisPage.page = 1;
      this.spdPage.page = 1;
      this.$nextTick(() => {
        if (this.$refs.areaTable) {
          this.$refs.areaTable.setCurrentRow(row);
        }
      });
      if (reload) {
        this.loadSpdRels();
        this.loadHisRels();
      }
    },
    clearSelectedArea() {
      this.selectedArea = null;
      this.hisQuery = { ...this.hisQuery, AREA_CODE: '' };
      this.spdQuery = { ...this.spdQuery, AREA_CODE: '' };
      this.hisRows = [];
      this.spdRows = [];
      this.hisPage.total = 0;
      this.spdPage.total = 0;
    },
    resetAreaQuery() {
      this.areaQuery = defaultAreaQuery();
      this.areaPage.page = 1;
      this.loadAreas();
    },
    resetHisQuery() {
      this.hisQuery = { ...defaultRelQuery(), AREA_CODE: this.selectedAreaCode };
      this.hisPage.page = 1;
      this.loadHisRels();
    },
    resetSpdQuery() {
      this.spdQuery = { ...defaultRelQuery(), AREA_CODE: this.selectedAreaCode };
      this.spdPage.page = 1;
      this.loadSpdRels();
    },
    openAreaDialog(row) {
      this.areaForm = row ? { ...defaultAreaForm(), ...row } : defaultAreaForm();
      if (this.areaForm.PARENT_ID) {
        this.areaForm.PARENT_ID = Number(this.areaForm.PARENT_ID);
      }
      this.areaDialogVisible = true;
      this.loadAreaOptions('');
      if (!row) {
        this.loadWarehouseAreaCode();
      }
    },
    handleAreaTypeChange() {
      if (this.areaForm.AREA_TYPE === 'WAREHOUSE') {
        this.areaForm.PARENT_ID = '';
      }
      if (!this.areaForm.ID) {
        this.loadWarehouseAreaCode();
      }
    },
    loadWarehouseAreaCode() {
      const areaType = this.areaForm.AREA_TYPE;
      this.areaCodeLoading = true;
      return getWarehouseAreaCode(areaType)
        .then((res) => {
          if (!this.areaForm.ID && this.areaForm.AREA_TYPE === areaType) {
            this.areaForm.AREA_CODE = res.result || '';
          }
        })
        .catch((err) => this.$message.error(err.message))
        .finally(() => {
          if (this.areaForm.AREA_TYPE === areaType) {
            this.areaCodeLoading = false;
          }
        });
    },
    resetAreaForm() {
      this.areaForm = defaultAreaForm();
      this.areaCodeLoading = false;
      if (this.$refs.areaForm) {
        this.$refs.areaForm.clearValidate();
      }
    },
    submitArea() {
      this.$refs.areaForm.validate((valid) => {
        if (!valid) return;
        this.submitLoading = true;
        const data = { ...this.areaForm };
        if (data.AREA_TYPE === 'WAREHOUSE') {
          data.PARENT_ID = '';
        }
        saveWarehouseArea(data)
          .then((res) => {
            this.$message.success(res.msg || '保存成功');
            this.areaDialogVisible = false;
            this.loadAreas();
            this.loadAreaOptions('');
          })
          .catch((err) => this.$message.error(err.message))
          .finally(() => {
            this.submitLoading = false;
          });
      });
    },
    toggleArea(row) {
      const next = row.ENABLED_FLAG === '1' ? '0' : '1';
      const action = next === '1' ? '启用' : '停用';
      this.$confirm(`确定${action}该库房/库区吗？`, '提示', { type: 'warning' })
        .then(() => enableWarehouseArea({ ID: row.ID, ENABLED_FLAG: next }))
        .then((res) => {
          this.$message.success(res.msg || '操作成功');
          this.loadAreas();
          if (String(row.ID) === String(this.selectedAreaId)) {
            this.selectedArea = { ...this.selectedArea, ENABLED_FLAG: next };
          }
          this.loadAreaOptions('');
        })
        .catch((err) => {
          if (err && err !== 'cancel' && err !== 'close') {
            this.$message.error(err.message || err);
          }
        });
    },
    openHisDialog(row) {
      this.openRelDialog('his', row);
    },
    openSpdDialog(row) {
      this.openRelDialog('spd', row);
    },
    openRelDialog(type, row) {
      if (!row && !this.selectedAreaCode) {
        this.$message.warning('请先在左侧选择库房/库区');
        return;
      }
      this.relFormType = type;
      this.relForm = { ...defaultRelForm(), AREA_CODE: this.selectedAreaCode };
      if (row) {
        this.relForm = {
          ID: row.ID,
          DEPT_VALUE: [type === 'his' ? row.DEPT_CODE : row.DEPT_TWO_CODE],
          AREA_CODE: row.AREA_CODE,
          DEFAULT_FLAG: row.DEFAULT_FLAG || '0',
          ENABLED_FLAG: row.ENABLED_FLAG || '1',
          REMARK: row.REMARK || ''
        };
        this.deptOptions = [{
          VALUE: type === 'his' ? row.DEPT_CODE : row.DEPT_TWO_CODE,
          LABEL: type === 'his'
            ? `${row.DEPT_CODE || ''} ${row.DEPT_NAME || ''}`
            : `${row.DEPT_TWO_CODE || ''} ${row.DEPT_TWO_NAME || ''}`
        }];
      } else {
        this.deptOptions = [];
      }
      this.loadAreaOptions('');
      this.relDialogVisible = true;
    },
    resetRelForm() {
      this.relForm = defaultRelForm();
      this.deptOptions = [];
      if (this.$refs.relForm) {
        this.$refs.relForm.clearValidate();
      }
    },
    submitRel() {
      this.$refs.relForm.validate((valid) => {
        if (!valid) return;
        const api = this.relFormType === 'his' ? saveHisDeptRel : saveSpdDeptRel;
        const deptValues = (Array.isArray(this.relForm.DEPT_VALUE) ? this.relForm.DEPT_VALUE : [this.relForm.DEPT_VALUE])
          .filter((value) => value);
        if (!deptValues.length) {
          this.$message.warning('请选择科室');
          return;
        }
        this.submitLoading = true;
        const data = {
          ID: this.relForm.ID,
          DEPT_VALUES: deptValues,
          AREA_CODE: this.relForm.AREA_CODE,
          DEFAULT_FLAG: this.relForm.DEFAULT_FLAG,
          ENABLED_FLAG: this.relForm.ENABLED_FLAG,
          REMARK: this.relForm.REMARK
        };
        api(data)
          .then((res) => {
            this.$message.success(res.msg || '保存成功');
            this.relDialogVisible = false;
            if (this.relFormType === 'his') {
              this.loadHisRels();
            } else {
              this.loadSpdRels();
            }
          })
          .catch((err) => this.$message.error(err.message))
          .finally(() => {
            this.submitLoading = false;
          });
      });
    },
    deleteHisRelRow(row) {
      this.deleteRel(row, deleteHisDeptRel, this.loadHisRels);
    },
    deleteSpdRelRow(row) {
      this.deleteRel(row, deleteSpdDeptRel, this.loadSpdRels);
    },
    deleteRel(row, api, reload) {
      this.$confirm('确定删除该绑定关系吗？', '提示', { type: 'warning' })
        .then(() => api({ ID: row.ID }))
        .then((res) => {
          this.$message.success(res.msg || '删除成功');
          reload();
        })
        .catch((err) => {
          if (err && err !== 'cancel' && err !== 'close') {
            this.$message.error(err.message || err);
          }
        });
    },
    loadAreaOptions(keyword) {
      this.optionLoading = true;
      queryWarehouseAreaOptions(keyword || '')
        .then((res) => {
          const options = (res.result || []).map((item) => ({ ...item, ID: item.ID || item.VALUE }));
          this.areaOptions = options;
          this.warehouseOptions = options.filter((item) => item.TYPE === 'WAREHOUSE');
        })
        .catch((err) => this.$message.error(err.message))
        .finally(() => {
          this.optionLoading = false;
        });
    },
    handleRelAreaChange() {},
    loadDeptOptions(keyword) {
      this.optionLoading = true;
      const api = this.relFormType === 'his' ? queryHisDeptOptions : querySpdDeptOptions;
      api(keyword || '')
        .then((res) => {
          this.deptOptions = res.result || [];
        })
        .catch((err) => this.$message.error(err.message))
        .finally(() => {
          this.optionLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.warehouse-area-manage {
  min-height: calc(100vh - 128px);
}

.warehouse-main {
  display: grid;
  grid-template-columns: minmax(500px, 46%) minmax(520px, 1fr);
  gap: 12px;
  align-items: stretch;
}

.manage-panel {
  min-width: 0;
  border-radius: 6px;
}

.relation-column {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  min-width: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}

.panel-title {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.panel-subtitle {
  color: #909399;
  font-size: 12px;
  line-height: 20px;
}

.query-form {
  padding: 10px 12px 0;
  margin-bottom: 12px;
  background: #f7f9fc;
  border: 1px solid #ebeef5;
  border-radius: 6px;
}

.query-select {
  width: 110px;
}

.area-query-form >>> .el-input,
.area-query-form >>> .el-select {
  width: 138px;
}

.full-width {
  width: 100%;
}

.table-page {
  margin-top: 10px;
  text-align: right;
}

::v-deep .vxe-table {
  font-size: 12px;
}

::v-deep .vxe-table .vxe-header--column {
  background: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

::v-deep .vxe-table .vxe-cell {
  padding-left: 8px;
  padding-right: 8px;
}

::v-deep .vxe-body--row.row--current {
  background-color: #ecf5ff;
}

@media (max-width: 1280px) {
  .warehouse-main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .panel-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
