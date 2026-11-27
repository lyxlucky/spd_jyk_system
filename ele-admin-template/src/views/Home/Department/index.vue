<template>
  <div class="dept-maint">
    <div ref="onePane" class="dept-pane dept-pane--side">
      <div class="dept-tool">
        <span class="dept-title">一级科室目录</span>
        <div class="btn-row btn-row-two">
          <div class="btn-row-line">
            <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="openOneDialog(false)">添加科室</el-button>
            <el-button type="danger" size="mini" plain @click="onOneToggleEnable">启用/停用</el-button>
          </div>
          <div class="btn-row-line">
            <el-button type="primary" size="mini" plain icon="el-icon-edit" @click="openOneDialog(true)">编辑科室</el-button>
            <el-button size="mini" @click="onExportExcel">导出所有科室</el-button>
          </div>
        </div>
        <el-form size="mini" class="dept-search" @submit.native.prevent>
          <el-input v-model="oneSearchName" placeholder="请输入名称搜索" clearable @keyup.enter.native="loadOneList">
            <el-button slot="append" icon="el-icon-search" @click="loadOneList" />
          </el-input>
        </el-form>
      </div>
      <el-table
        ref="oneTable"
        v-loading="oneLoading"
        :data="oneRows"
        :fit="false"
        border
        stripe
        size="mini"
        highlight-current-row
        :height="oneTableHeight"
        @current-change="onOneCurrentChange"
      >
              <el-table-column prop="Dept_One_Name" label="科室名称" min-width="192" show-overflow-tooltip />
              <el-table-column label="启用状态" width="100" align="center">
                <template slot-scope="{ row }">{{ fmtEnable(row.Enable) }}</template>
              </el-table-column>
              <el-table-column prop="Herp_Dept_One_Code" label="HERP科室编码" min-width="100" show-overflow-tooltip />
            </el-table>
    </div>

    <div ref="twoPane" class="dept-pane dept-pane--side">
      <div class="dept-tool">
        <span class="dept-title">{{ middleMode === 'two' ? '二级科室目录' : 'HIS计费科室' }}</span>
        <template v-if="middleMode === 'two'">
          <div class="btn-row btn-row-two">
            <div class="btn-row-line">
              <el-button size="mini" icon="el-icon-sort" @click="toggleMiddle">切换</el-button>
              <el-button type="primary" size="mini" plain :disabled="!currentOne" @click="openTwoDialog(false)">添加科室</el-button>
            </div>
            <div class="btn-row-line">
              <el-button type="primary" size="mini" plain :disabled="!currentTwo" @click="openTwoDialog(true)">编辑科室</el-button>
              <el-button type="danger" size="mini" plain :disabled="!currentTwo" @click="onTwoToggleEnable">启用/停用</el-button>
              <el-button
                type="primary"
                size="mini"
                plain
                :disabled="!currentTwo"
                @click="onTwoThreeInventory"
              >{{ threeInvOpen ? '关闭三级库' : '开通三级库' }}</el-button>
            </div>
          </div>
          <el-form size="mini" class="dept-search" @submit.native.prevent>
            <el-input
              v-model="twoSearchName"
              :disabled="!currentOne"
              placeholder="请输入名称搜索"
              clearable
              @keyup.enter.native="loadTwoList"
            >
              <el-button slot="append" icon="el-icon-search" :disabled="!currentOne" @click="loadTwoList" />
            </el-input>
          </el-form>
        </template>
        <div v-else class="btn-row">
          <el-button size="mini" icon="el-icon-sort" @click="toggleMiddle">切换</el-button>
          <el-button type="primary" size="mini" plain :disabled="!currentOne" @click="openHisBind">添加科室</el-button>
          <el-button type="primary" size="mini" plain @click="onHisEditNotSupported">编辑科室</el-button>
        </div>
      </div>
      <el-table
        v-if="middleMode === 'two'"
        ref="twoTable"
        v-loading="twoLoading"
        :data="twoRows"
        :fit="false"
        border
        stripe
        size="mini"
        highlight-current-row
        :height="twoTableHeight"
        @current-change="onTwoCurrentChange"
      >
                <el-table-column prop="Dept_Two_Name" label="科室名称" min-width="192" show-overflow-tooltip />
                <el-table-column label="科室类型" width="100" align="center">
                  <template slot-scope="{ row }">{{ deptTypeLabel(row.DEPT_TYPE) }}</template>
                </el-table-column>
                <el-table-column prop="STORAGE_NAME" label="所属院区" min-width="100" show-overflow-tooltip />
                <el-table-column label="启用状态" width="100" align="center">
                  <template slot-scope="{ row }">{{ fmtEnable(row.Enable) }}</template>
                </el-table-column>
                <el-table-column label="计划审核审批" width="110">
                  <template slot-scope="{ row }">{{ row.IS_APPLY_PLAN_REVIEW == '1' ? '开启' : '关闭' }}</template>
                </el-table-column>
                <el-table-column prop="Herp_Dept_Two_Code" label="HERP二级科室编码" min-width="100" show-overflow-tooltip />
                <el-table-column label="编辑财务属性" width="150" fixed="right" align="left">
                  <template slot-scope="{ row }">
                    <el-button type="primary" size="mini" plain @click.stop="openFinanceCw(row)">编辑/详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
      <el-table
        v-else
        v-loading="hisLoading"
        :data="hisRows"
        :fit="false"
        border
        stripe
        size="mini"
        highlight-current-row
        :height="twoTableHeight"
        @current-change="(r) => (currentHis = r)"
      >
        <el-table-column prop="Charging_Dept_Name" label="科室名称" min-width="192" show-overflow-tooltip />
      </el-table>
    </div>

    <div class="dept-pane dept-pane--main">
      <el-tabs v-model="detailTab" @tab-click="onTabClick">
        <el-tab-pane label="一级科室详情" name="one">
          <one-bulk-auth-panel
            ref="bulkPanel"
            :dept-one-code="currentOne ? currentOne.Dept_One_Code : ''"
            :dept-one-name="currentOne ? currentOne.Dept_One_Name : ''"
            :one-detail="oneDetail"
          />
        </el-tab-pane>
        <el-tab-pane label="二级科室详情" name="two" :disabled="!currentTwo">
          <two-pkg-auth-panel
            ref="pkgPanel"
            :dept-one-code="currentOne ? currentOne.Dept_One_Code : ''"
            :dept-two-code="currentTwo ? currentTwo.Dept_Two_Code : ''"
            :dept-two-name="currentTwo ? currentTwo.Dept_Two_Name : ''"
            :two-detail="twoDetail"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 一级科室 弹窗（与 Frame/AddDepartmentyjks：先弹出再 ajax 填表） -->
    <el-dialog :title="oneDialogEdit ? '编辑一级科室' : '添加一级科室'" :visible.sync="oneDialog" width="520px" append-to-body @closed="onOneDialogClosed">
      <div v-loading="oneDialogLoading" class="dialog-form-wrap" element-loading-text="加载中...">
        <el-form ref="oneFormRef" :model="oneForm" label-width="150px" size="small">
          <el-form-item prop="HerpDeptOneCode" :rules="[{ required: true, message: '必填' }]">
            <template slot="label"><span class="req-star">*</span>HERP科室编码</template>
            <el-input v-model="oneForm.HerpDeptOneCode" />
          </el-form-item>
          <el-form-item prop="deptOneName" :rules="[{ required: true, message: '必填' }]">
            <template slot="label"><span class="req-star">*</span>科室名称</template>
            <el-input v-model="oneForm.deptOneName" />
          </el-form-item>
          <el-form-item label="科室地址">
            <el-input v-model="oneForm.deptOneAddress" placeholder="默认可填「无」" />
          </el-form-item>
          <el-form-item prop="herpId" :rules="[{ required: true, message: '必填' }]">
            <template slot="label"><span class="req-star">*</span>HERP_ID</template>
            <el-input v-model="oneForm.herpId" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="small" @click="oneDialog = false">取消</el-button>
        <el-button type="primary" size="small" :loading="oneSaveLoading" :disabled="oneDialogLoading" @click="submitOneForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 二级科室 弹窗（与 Frame/AddDepartmentrjks） -->
    <el-dialog :title="twoDialogEdit ? '编辑二级科室' : '添加二级科室'" :visible.sync="twoDialog" width="640px" append-to-body @closed="onTwoDialogClosed">
      <div v-loading="twoDialogLoading" class="dialog-form-wrap" element-loading-text="加载中...">
        <el-form ref="twoFormRef" :model="twoForm" label-width="200px" size="small">
          <el-form-item label="所属一级科室：">
            <span>{{ currentOne ? currentOne.Dept_One_Name : '—' }}</span>
          </el-form-item>
          <el-form-item prop="deptTwoName" :rules="[{ required: true, message: '必填' }]">
            <template slot="label"><span class="req-star">*</span>二级科室名称</template>
            <el-input v-model="twoForm.deptTwoName" />
          </el-form-item>
          <el-form-item label="HERP_ID">
            <el-input v-model="twoForm.herpId" />
          </el-form-item>
          <el-form-item label="HERP二级科室编码">
            <el-input v-model="twoForm.herpDeptTwoCode" />
          </el-form-item>
          <el-form-item label="是否接收B2B跟台预送货单">
            <el-select v-model="twoForm.receiveB2bPreEnable" style="width:100%">
              <el-option label="不接收（默认）" value="0" />
              <el-option label="接收" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="PDA定数码收货位置">
            <el-select v-model="twoForm.receivePlace" style="width:100%">
              <el-option label="Spd二级科室库存" value="0" />
              <el-option label="科室定数包暂借库" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式">
            <el-select v-model="twoForm.balanceType" style="width:100%">
              <el-option label="用后结算" value="0" />
              <el-option label="收货结算" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="科室计划审核审批" prop="IS_APPLY_PLAN_REVIEW" for="dept-plan-review-switch">
            <el-switch
              id="dept-plan-review-switch"
              v-model="twoForm.IS_APPLY_PLAN_REVIEW"
              active-value="1"
              inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              aria-label="科室计划审核审批"
            />
          </el-form-item>
          <el-form-item v-if="twoDialogEdit" label="审核审批开关操作时间">
            <span>{{ fmtDateTime(twoForm.APPLY_PLAN_REVIEW_TIME) }}</span>
          </el-form-item>
          <el-form-item label="月计划">
            <el-select v-model="twoForm.IS_MAKE_PLAN" style="width:100%">
              <el-option label="不需要" value="0" />
              <el-option label="需要" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item prop="VALIDITY_PERIOD" :rules="[{ required: true, message: '必填' }]">
            <template slot="label"><span class="req-star">*</span>近效期提醒</template>
            <el-input-number v-model="twoForm.VALIDITY_PERIOD" :min="0" :controls="false" style="width:100%" placeholder="天数" />
          </el-form-item>
          <el-form-item prop="AUTH_GET_HOUR" :rules="[{ required: true, message: '必填' }]">
            <template slot="label"><span class="req-star">*</span>超时几小时自动收货</template>
            <el-input-number v-model="twoForm.AUTH_GET_HOUR" :min="0" :controls="false" style="width:100%" placeholder="小时" />
          </el-form-item>
          <el-form-item prop="DEPT_TYPE" :rules="[{ required: true, message: '必选' }]">
            <template slot="label"><span class="req-star">*</span>科室类型</template>
            <el-select v-model="twoForm.DEPT_TYPE" style="width:100%">
              <el-option label="无" value="0" />
              <el-option label="住院" value="1" />
              <el-option label="门诊" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item prop="wareBaseId" :rules="[{ required: true, message: '必选' }]">
            <template slot="label"><span class="req-star">*</span>所属院区</template>
            <el-select v-model="twoForm.wareBaseId" filterable style="width:100%">
              <el-option v-for="w in wareList" :key="w.ID" :label="w.NAME" :value="String(w.ID)" />
            </el-select>
          </el-form-item>
          <el-form-item prop="LIMIT_REGION_USE" :rules="[{ required: true, message: '必选' }]">
            <template slot="label"><span class="req-star">*</span>是否限制库区使用</template>
            <el-select v-model="twoForm.LIMIT_REGION_USE" style="width:100%">
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="small" @click="twoDialog = false">取消</el-button>
        <el-button type="primary" size="small" :loading="twoSaveLoading" :disabled="twoDialogLoading" @click="submitTwoForm">确定</el-button>
      </div>
    </el-dialog>

    <finance-cw-dialog ref="cwDlg" @saved="loadTwoList" />
    <his-charging-bind-dialog ref="hisDlg" @saved="loadHisList" />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import * as api from '@/api/Home/Department';
import { fmtEnable, fmtDateTime, openExcelFile } from './utils';
import OneBulkAuthPanel from './components/OneBulkAuthPanel.vue';
import TwoPkgAuthPanel from './components/TwoPkgAuthPanel.vue';
import FinanceCwDialog from './components/FinanceCwDialog.vue';
import HisChargingBindDialog from './components/HisChargingBindDialog.vue';
import { measureTableHeight } from '@/views/HeelBlockConsumables/PlatformConsume/paneTableHeight';

export default {
  name: 'HomeDepartment',
  components: { OneBulkAuthPanel, TwoPkgAuthPanel, FinanceCwDialog, HisChargingBindDialog },
  data() {
    return {
      detailTab: 'one',
      oneTableHeight: 160,
      twoTableHeight: 160,
      middleMode: 'two',
      oneSearchName: '',
      oneRows: [],
      oneLoading: false,
      currentOne: null,
      oneDetail: null,
      twoSearchName: '',
      twoRows: [],
      twoLoading: false,
      currentTwo: null,
      twoDetail: null,
      threeInvOpen: false,
      hisRows: [],
      hisLoading: false,
      currentHis: null,
      oneDialog: false,
      oneDialogEdit: false,
      oneDialogLoading: false,
      oneSaveLoading: false,
      oneForm: { deptOneCode: '', deptOneName: '', deptOneAddress: '无', HerpDeptOneCode: '', herpId: '' },
      twoDialog: false,
      twoDialogEdit: false,
      twoDialogLoading: false,
      twoSaveLoading: false,
      wareList: [],
      twoForm: {
        deptTwoCode: '',
        deptTwoName: '',
        herpId: '',
        herpDeptTwoCode: '',
        receiveB2bPreEnable: '0',
        receivePlace: '0',
        balanceType: '0',
        IS_APPLY_PLAN_REVIEW: '0',
        APPLY_PLAN_REVIEW_TIME: null,
        IS_MAKE_PLAN: '0',
        VALIDITY_PERIOD: 0,
        wareBaseId: '',
        DEPT_TYPE: '0',
        AUTH_GET_HOUR: 0,
        LIMIT_REGION_USE: '0'
      }
    };
  },
  mounted() {
    this.loadOneList();
    this.schedulePaneHeight();
    if (typeof ResizeObserver !== 'undefined') {
      this._paneRo = new ResizeObserver(() => this.schedulePaneHeight());
      if (this.$refs.onePane) this._paneRo.observe(this.$refs.onePane);
      if (this.$refs.twoPane) this._paneRo.observe(this.$refs.twoPane);
    }
    window.addEventListener('resize', this.schedulePaneHeight);
  },
  beforeDestroy() {
    if (this._paneRo) this._paneRo.disconnect();
    window.removeEventListener('resize', this.schedulePaneHeight);
    if (this._paneTimer) cancelAnimationFrame(this._paneTimer);
  },
  methods: {
    schedulePaneHeight() {
      if (this._paneTimer) cancelAnimationFrame(this._paneTimer);
      this._paneTimer = requestAnimationFrame(() => this.updatePaneHeights(false));
    },
    updatePaneHeights(followUp) {
      const one = measureTableHeight(this.$refs.onePane);
      const two = measureTableHeight(this.$refs.twoPane);
      const changed =
        (one != null && one !== this.oneTableHeight) ||
        (two != null && two !== this.twoTableHeight);
      if (one != null) this.oneTableHeight = one;
      if (two != null) this.twoTableHeight = two;
      if (!changed) return;
      this.$nextTick(() => {
        ['oneTable', 'twoTable'].forEach((name) => {
          const vm = this.$refs[name];
          if (vm && typeof vm.doLayout === 'function') vm.doLayout();
        });
        if (!followUp) this.updatePaneHeights(true);
      });
    },
    fmtEnable,
    fmtDateTime,
    deptTypeLabel(v) {
      if (v === 1 || v === '1') return '住院';
      if (v === 2 || v === '2') return '门诊';
      return '未设置';
    },
    toggleMiddle() {
      this.middleMode = this.middleMode === 'two' ? 'his' : 'two';
      if (this.middleMode === 'his') this.loadHisList();
      else if (this.currentOne) this.loadTwoList();
      this.$nextTick(() => this.schedulePaneHeight());
    },
    onTabClick() {
      /* tab 切换由 v-model 处理 */
    },
    async loadOneList() {
      this.oneLoading = true;
      try {
        this.oneRows = await api.searchDeptOne(this.oneSearchName);
        this.$nextTick(() => {
          if (this.oneRows.length) {
            const code = this.currentOne?.Dept_One_Code;
            const row = code ? this.oneRows.find((r) => r.Dept_One_Code === code) : this.oneRows[0];
            this.$refs.oneTable?.setCurrentRow(row || this.oneRows[0]);
          } else {
            this.currentOne = null;
            this.oneDetail = null;
            this.twoRows = [];
            this.currentTwo = null;
            this.twoDetail = null;
          }
        });
      } catch (e) {
        Message.error(e.message || '加载一级科室失败');
      } finally {
        this.oneLoading = false;
      }
    },
    async onOneCurrentChange(row) {
      this.currentOne = row;
      this.currentTwo = null;
      this.twoDetail = null;
      this.currentHis = null;
      this.detailTab = 'one';
      this.$refs.twoTable?.setCurrentRow(null);
      if (!row) {
        this.oneDetail = null;
        this.twoRows = [];
        this.hisRows = [];
        return;
      }
      try {
        this.oneDetail = await api.getDeptOne(row.Dept_One_Code);
      } catch (e) {
        this.oneDetail = null;
        Message.error(e.message || '加载一级详情失败');
      }
      if (this.middleMode === 'two') await this.loadTwoList();
      else await this.loadHisList();
    },
    async loadTwoList() {
      if (!this.currentOne) return;
      this.twoLoading = true;
      try {
        this.twoRows = await api.searchDeptTwo(this.currentOne.Dept_One_Code, this.twoSearchName);
        this.$nextTick(() => {
          if (this.twoRows.length) {
            const code = this.currentTwo?.Dept_Two_Code;
            const row = code ? this.twoRows.find((r) => r.Dept_Two_Code === code) : null;
            this.$refs.twoTable?.setCurrentRow(row || null);
          } else {
            this.currentTwo = null;
            this.twoDetail = null;
            this.threeInvOpen = false;
          }
        });
      } catch (e) {
        Message.error(e.message || '加载二级科室失败');
      } finally {
        this.twoLoading = false;
      }
    },
    async loadHisList() {
      if (!this.currentOne) {
        this.hisRows = [];
        return;
      }
      this.hisLoading = true;
      try {
        this.hisRows = await api.loadDeptOneChargingDepts(this.currentOne.Dept_One_Code);
      } catch (e) {
        Message.error(e.message || '加载计费科室失败');
      } finally {
        this.hisLoading = false;
      }
    },
    async onTwoCurrentChange(row) {
      this.currentTwo = row;
      this.detailTab = 'two';
      if (!row) {
        this.twoDetail = null;
        this.threeInvOpen = false;
        return;
      }
      try {
        this.twoDetail = await api.getDeptTwoDetail(row.Dept_Two_Code);
        this.threeInvOpen = this.twoDetail.Is_Three_Inventory_Enable === '1';
      } catch (e) {
        this.twoDetail = null;
        this.threeInvOpen = false;
        Message.error(e.message || '加载二级详情失败');
      }
    },
    openFinanceCw(row) {
      this.$refs.cwDlg.open(row);
    },
    openHisBind() {
      if (!this.currentOne) return;
      this.$refs.hisDlg.open(this.currentOne.Dept_One_Code, this.currentOne.Dept_One_Name);
    },
    onHisEditNotSupported() {
      Message.warning('暂不支持修改计费科室');
    },
    async openOneDialog(isEdit) {
      if (isEdit && !this.currentOne) {
        Message.warning('请先选中一级科室');
        return;
      }
      this.oneDialogEdit = isEdit;
      this.resetOneForm();
      this.oneDialog = true;
      if (!isEdit) return;
      this.oneDialogLoading = true;
      try {
        const d = await api.getDeptOne(this.currentOne.Dept_One_Code);
        this.oneForm = {
          deptOneCode: d.Dept_One_Code,
          deptOneName: d.Dept_One_Name || '',
          deptOneAddress: d.Dept_One_Address || '无',
          HerpDeptOneCode: d.Herp_Dept_One_Code || '',
          herpId: d.Herp_Id || ''
        };
      } catch (e) {
        Message.error(e.message);
        this.oneDialog = false;
      } finally {
        this.oneDialogLoading = false;
      }
    },
    onOneDialogClosed() {
      this.oneDialogLoading = false;
      this.resetOneForm();
    },
    resetOneForm() {
      this.oneForm = { deptOneCode: '', deptOneName: '', deptOneAddress: '无', HerpDeptOneCode: '', herpId: '' };
      this.$nextTick(() => this.$refs.oneFormRef?.clearValidate());
    },
    submitOneForm() {
      this.$refs.oneFormRef.validate(async (ok) => {
        if (!ok) return;
        this.oneSaveLoading = true;
        try {
          if (this.oneDialogEdit) {
            await api.updateDeptOne({
              deptOneCode: this.oneForm.deptOneCode,
              deptOneName: this.oneForm.deptOneName,
              deptAddress: this.oneForm.deptOneAddress,
              herpDeptOneCode: this.oneForm.HerpDeptOneCode,
              herpId: this.oneForm.herpId
            });
          } else {
            await api.insertDeptOne({
              deptOneName: this.oneForm.deptOneName,
              deptOneAddress: this.oneForm.deptOneAddress,
              HerpDeptOneCode: this.oneForm.HerpDeptOneCode,
              herpId: this.oneForm.herpId
            });
          }
          Message.success(this.oneDialogEdit ? '编辑成功' : '添加成功');
          this.oneDialog = false;
          await this.loadOneList();
        } catch (e) {
          Message.error(e.message);
        } finally {
          this.oneSaveLoading = false;
        }
      });
    },
    async onOneToggleEnable() {
      if (!this.currentOne) return;
      const next = this.currentOne.Enable === '1' ? '0' : '1';
      const act = next === '1' ? '启用' : '停用';
      try {
        await MessageBox.confirm(`确定${act}该一级科室？`, '提示', { type: 'warning' });
        if (await api.enableDeptOne(this.currentOne.Dept_One_Code, next)) {
          Message.success(`${act}成功`);
          this.loadOneList();
        }
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message);
      }
    },
    async onExportExcel() {
      try {
        openExcelFile(await api.excelDeptOne());
      } catch (e) {
        Message.error(e.message);
      }
    },
    async openTwoDialog(isEdit) {
      if (!this.currentOne) {
        Message.warning('请先选中一级科室');
        return;
      }
      if (isEdit && !this.currentTwo) {
        Message.warning('请先选中二级科室');
        return;
      }
      this.twoDialogEdit = isEdit;
      this.resetTwoForm();
      this.twoDialog = true;
      this.twoDialogLoading = true;
      try {
        this.wareList = await api.getWareBaseList();
        if (isEdit) {
          const d = await api.getDeptTwoDetail(this.currentTwo.Dept_Two_Code);
          this.twoForm = {
            deptTwoCode: d.Dept_Two_Code,
            deptTwoName: d.Dept_Two_Name || '',
            herpId: d.Herp_Id || '',
            herpDeptTwoCode: d.Herp_Dept_Two_Code || '',
            receiveB2bPreEnable: String(d.Receive_B2b_Pre_Enable ?? '0'),
            receivePlace: String(d.Receive_Place ?? '0'),
            balanceType: String(d.Balance_Type ?? '0'),
            IS_APPLY_PLAN_REVIEW: String(d.IS_APPLY_PLAN_REVIEW ?? '0'),
            APPLY_PLAN_REVIEW_TIME: d.APPLY_PLAN_REVIEW_TIME || null,
            IS_MAKE_PLAN: String(d.IS_MAKE_PLAN ?? '0'),
            VALIDITY_PERIOD: Number(d.VALIDITY_PERIOD) || 0,
            wareBaseId: String(d.STORAGE_ID ?? ''),
            DEPT_TYPE: String(d.DEPT_TYPE ?? '0'),
            AUTH_GET_HOUR: Number(d.AUTH_GET_HOUR) || 0,
            LIMIT_REGION_USE: String(d.LIMIT_REGION_USE ?? '0')
          };
        }
      } catch (e) {
        Message.error(e.message);
        this.twoDialog = false;
      } finally {
        this.twoDialogLoading = false;
      }
    },
    onTwoDialogClosed() {
      this.twoDialogLoading = false;
      this.resetTwoForm();
    },
    resetTwoForm() {
      this.twoForm = {
        deptTwoCode: '',
        deptTwoName: '',
        herpId: '',
        herpDeptTwoCode: '',
        receiveB2bPreEnable: '0',
        receivePlace: '0',
        balanceType: '0',
        IS_APPLY_PLAN_REVIEW: '0',
        APPLY_PLAN_REVIEW_TIME: null,
        IS_MAKE_PLAN: '0',
        VALIDITY_PERIOD: 0,
        wareBaseId: '',
        DEPT_TYPE: '0',
        AUTH_GET_HOUR: 0,
        LIMIT_REGION_USE: '0'
      };
      this.$nextTick(() => this.$refs.twoFormRef?.clearValidate());
    },
    submitTwoForm() {
      this.$refs.twoFormRef.validate(async (ok) => {
        if (!ok) return;
        this.twoSaveLoading = true;
        try {
          if (this.twoDialogEdit) {
            await api.updateDeptTwo({
              ...this.twoForm,
              VALIDITY_PERIOD: String(this.twoForm.VALIDITY_PERIOD),
              AUTH_GET_HOUR: String(this.twoForm.AUTH_GET_HOUR)
            });
          } else {
            await api.insertDeptTwo({
              ...this.twoForm,
              deptOneCode: this.currentOne.Dept_One_Code,
              VALIDITY_PERIOD: String(this.twoForm.VALIDITY_PERIOD),
              AUTH_GET_HOUR: String(this.twoForm.AUTH_GET_HOUR)
            });
          }
          const saved = this.twoDialogEdit ? this.twoForm.deptTwoCode : null;
          Message.success(this.twoDialogEdit ? '编辑成功' : '添加成功');
          this.twoDialog = false;
          await this.loadTwoList();
          if (saved) {
            const row = this.twoRows.find((r) => r.Dept_Two_Code === saved);
            if (row) {
              this.$refs.twoTable?.setCurrentRow(row);
              await this.onTwoCurrentChange(row);
            }
          }
        } catch (e) {
          Message.error(e.message);
        } finally {
          this.twoSaveLoading = false;
        }
      });
    },
    async onTwoToggleEnable() {
      if (!this.currentTwo) return;
      const next = this.currentTwo.Enable === '1' ? '0' : '1';
      const act = next === '1' ? '启用' : '停用';
      try {
        await MessageBox.confirm(`确定${act}该二级科室？`, '提示', { type: 'warning' });
        if (await api.enableDeptTwo(this.currentTwo.Dept_Two_Code, next)) {
          Message.success(`${act}成功`);
          this.loadTwoList();
        }
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message);
      }
    },
    async onTwoThreeInventory() {
      if (!this.currentTwo) return;
      const open = !this.threeInvOpen;
      const act = open ? '开通' : '关闭';
      try {
        await MessageBox.confirm(`确定${act}三级库？`, '提示', { type: 'warning' });
        if (await api.enableThreeInventory(this.currentTwo.Dept_Two_Code, open ? '1' : '0')) {
          Message.success(`${act}成功`);
          this.threeInvOpen = open;
          const code = this.currentTwo.Dept_Two_Code;
          await this.loadTwoList();
          const row = this.twoRows.find((r) => r.Dept_Two_Code === code);
          if (row) {
            this.$refs.twoTable?.setCurrentRow(row);
            await this.onTwoCurrentChange(row);
          }
        }
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message);
      }
    },
  }
};
</script>

<style scoped lang="scss">
.dept-maint {
  display: flex;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background: #fff;
}

.dept-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.dept-pane--side {
  flex: 0 0 22%;
  width: 22%;
  max-width: 22%;
}

.dept-pane--side + .dept-pane--side,
.dept-pane--main {
  border-left: 1px solid #ebeef5;
}

.dept-pane--main {
  flex: 1 1 0;
}

.dept-tool {
  flex: none;
  max-width: 100%;
  padding: 2px 6px 0;
  box-sizing: border-box;
}

.dept-title {
  display: block;
  font-size: 13px;
  font-weight: 600;
  line-height: 22px;
  color: #303133;
}

.dept-search {
  margin: 0 0 2px;
}

.btn-row {
  margin: 0 0 2px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.btn-row-two {
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}

.btn-row-line {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  justify-content: flex-start;
}

.btn-row-line > .el-button {
  flex: 1 1 0;
  min-width: 0;
  padding-left: 4px;
  padding-right: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-row-line > .el-button + .el-button {
  margin-left: 0;
}

:deep(.el-table th.el-table__cell),
:deep(.el-table td.el-table__cell) {
  padding: 1px 0;
}

:deep(.el-table .cell) {
  line-height: 18px;
  padding-left: 6px;
  padding-right: 6px;
}

:deep(.el-tabs) {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

:deep(.el-tabs__header) {
  flex: none;
  margin: 0;
}

:deep(.el-tabs__content) {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}

:deep(.el-tabs__content > .el-tab-pane) {
  height: 100%;
  overflow: hidden;
}

:deep(.el-tabs__item) {
  height: 28px;
  line-height: 28px;
  font-size: 13px;
}

:deep(.auth-panel) {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.req-star {
  color: #f56c6c;
  margin-right: 2px;
}

.dialog-form-wrap {
  min-height: 100px;
}
</style>
