<template>
  <div class="ele-body dsb-container">
    <div class="dsb-panels">
      <!-- 左侧：定数包品种列表 -->
      <div class="dsb-left-panel dsb-card">
        <div class="panel-header">
          <div class="panel-title">
            <span class="title-bar" />
            <h5>定数包品种列表</h5>
            <el-tag size="mini" type="info" effect="plain" class="count-tag">共 {{ pkgTotal }} 条</el-tag>
          </div>
        </div>
        <div class="panel-toolbar">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入品种编码 / 名称关键字"
            size="small"
            clearable
            prefix-icon="el-icon-search"
            style="width: 240px"
            @keyup.enter.native="searchPkg"
            @clear="searchPkg"
          />
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchPkg">查询</el-button>
          <span class="toolbar-spacer" />
          <el-button
            v-if="showImportBtn"
            size="small"
            icon="el-icon-upload2"
            @click="handleImportClick"
          >导入</el-button>
          <el-button
            v-if="showDownloadBtn"
            size="small"
            icon="el-icon-download"
            @click="downloadTemplate"
          >模板下载</el-button>
          <el-button
            v-if="showCreateBtn"
            type="primary"
            plain
            size="small"
            icon="el-icon-plus"
            @click="openCreateDialog"
          >创建定数包系数</el-button>
        </div>
        <el-table
          ref="leftTable"
          :data="pkgList"
          height="320"
          size="small"
          border
          stripe
          highlight-current-row
          row-key="ID"
          :header-cell-style="tableHeaderStyle"
          empty-text="暂无定数包品种数据"
          @current-change="onLeftRowSelect"
          v-loading="leftLoading"
          class="dsb-table"
        >
          <el-table-column prop="STORAGE_ID" label="主控库区" width="96" align="center">
            <template slot-scope="{ row }">
              <el-tag
                size="mini"
                effect="plain"
                :type="row.STORAGE_ID == 1 ? '' : (row.STORAGE_ID == 2 ? 'warning' : 'info')"
              >
                {{ row.STORAGE_ID == 1 ? '院内库房' : row.STORAGE_ID == 2 ? '院外库房' : '未知' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="STORAGE_TWO_ID" label="仓库" width="86" align="center" v-if="!isBDHost">
            <template slot-scope="{ row }">
              <el-tag
                size="mini"
                effect="plain"
                :type="row.STORAGE_TWO_ID == '0' ? 'success' : (row.STORAGE_TWO_ID == '1' ? 'info' : 'info')"
              >
                {{ row.STORAGE_TWO_ID == '1' ? '老仓库' : row.STORAGE_TWO_ID == '0' ? '新仓库' : '未知' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Varietie_Code_New" label="品种编码" min-width="120" sortable="custom" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="mono">{{ row.Varietie_Code_New }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="varietie_name" label="品种全称" min-width="170" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="specification_or_type" label="型号/规格" width="120" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="Unit" label="单位" width="70" align="center" sortable="custom" />
          <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" min-width="150" sortable="custom" show-overflow-tooltip />
        </el-table>
        <div class="panel-footer">
          <el-pagination
            small
            background
            layout="total, sizes, prev, pager, next"
            :total="pkgTotal"
            :page-size="pkgPageSize"
            :page-sizes="[5, 10, 20, 50, 100, 200]"
            :current-page.sync="pkgPage"
            @current-change="onPkgPageChange"
            @size-change="onPkgSizeChange"
          />
        </div>
      </div>

      <!-- 中间分隔 -->
      <div class="dsb-divider" />

      <!-- 右侧：定数包系数方案详情 -->
      <div class="dsb-right-panel dsb-card">
        <div class="panel-header">
          <div class="panel-title">
            <span class="title-bar title-bar--accent" />
            <h5>定数包系数方案详情</h5>
            <el-tag size="mini" type="info" effect="plain" class="count-tag">共 {{ detailList.length }} 条</el-tag>
          </div>
          <div class="panel-subtitle" v-if="selectedPkg">
            当前品种：
            <span class="mono">{{ selectedPkg.Varietie_Code_New }}</span>
            <span class="dot-sep">·</span>
            <span>{{ selectedPkg.varietie_name }}</span>
          </div>
          <div class="panel-subtitle panel-subtitle--muted" v-else>
            请在左侧选择一条定数包品种，查看其系数方案
          </div>
        </div>
        <el-table
          ref="rightTable"
          :data="detailList"
          height="362"
          size="small"
          border
          stripe
          highlight-current-row
          :header-cell-style="tableHeaderStyle"
          empty-text="暂无系数方案"
          @current-change="onRightRowSelect"
          v-loading="rightLoading"
          @row-dblclick="editDetail"
          class="dsb-table"
        >
          <el-table-column prop="Def_No_pkg_Coefficient" label="定数包系数" align="right" sortable="custom" min-width="110">
            <template slot-scope="{ row }">
              <span class="num-strong">{{ row.Def_No_pkg_Coefficient }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="middle_package_count" label="中包装数量" align="right" min-width="110">
            <template slot-scope="{ row }">
              <span class="num">{{ row.middle_package_count }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="big_box_count" label="整箱数量" align="right" min-width="100">
            <template slot-scope="{ row }">
              <span class="num">{{ row.big_box_count }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Create_Time" label="创建时间" align="center" min-width="110" :formatter="formatDate" />
          <el-table-column prop="Last_Update_Time" label="最近更新时间" align="center" min-width="120" :formatter="formatDate" />
          <el-table-column prop="Enable" label="启用状态" align="center" width="92">
            <template slot-scope="{ row }">
              <el-tag
                size="mini"
                effect="light"
                :type="row.Enable == 1 ? 'success' : 'danger'"
              >
                <i :class="row.Enable == 1 ? 'el-icon-check' : 'el-icon-close'" />
                {{ row.Enable == 1 ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="editDetail(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" class="ele-text-danger" icon="el-icon-delete" @click="deleteDetail(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 创建/编辑定数包系数弹窗 -->
    <el-dialog
      :title="isEdit ? '修改定数包品种' : '创建定数包品种'"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="130px" label-position="right">
        <el-form-item label="品种（材料）编码：">
          <span>{{ form.varietieCodeNew }}</span>
        </el-form-item>
        <el-form-item label="品种（材料）全称：">
          <span>{{ form.varietieName }}</span>
        </el-form-item>
        <el-form-item label="型号/规格：">
          <span>{{ form.specification }}</span>
        </el-form-item>
        <el-form-item label="单位：">
          <span>{{ form.unit }}</span>
        </el-form-item>
        <el-form-item label="生产企业名称：">
          <span>{{ form.manufacturer }}</span>
        </el-form-item>
        <el-form-item label="批准文号：">
          <span>{{ form.approvalNumber }}</span>
        </el-form-item>
        <el-form-item label="中包装数量：">
          <span>{{ form.middlePkgCount }}</span>
        </el-form-item>
        <el-form-item label="整箱数量：">
          <span>{{ form.bigBoxCount }}</span>
        </el-form-item>
        <el-divider />
        <el-form-item v-if="isEdit" label="启用状态：">
          <el-select v-model="form.enable" style="width: 120px">
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="定数包系数："
          prop="coefficient"
          :rules="[{ required: true, message: '请输入定数包系数' }, { pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
        >
          <el-input v-model="form.coefficient" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <span style="color:red;">*建议数量为中包装的整数倍,且系数不得超过整箱数量</span>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 导入隐藏file -->
    <input
      ref="importFile"
      type="file"
      accept=".xls,.xlsx"
      style="display:none"
      @change="handleFileChange"
    />
  </div>
</template>

<script>
import {
  GetDefinitePkgList,
  GetDefinitePkgDetail,
  InsertDefinite,
  UpdateDefinite,
  DeleteDefinite as DeleteDefiniteApi,
  CheckVarietieBasic,
  IsCoefficientSame,
  GetVarietyDetailsInfo,
  ImportDefinitePackages
} from '@/api/Home/VarietyDataLzhMain';

export default {
  name: 'VarietyDataLzhDsb',
  props: {
    selectedVarietyCode: { type: String, default: '' },
    selectedVarietyName: { type: String, default: '' }
  },
  data() {
    return {
      // 左侧表格
      pkgList: [],
      pkgTotal: 0,
      pkgPage: 1,
      pkgPageSize: 5,
      leftLoading: false,
      searchKeyword: '',
      selectedPkg: null, // 当前选中的品种

      // 右侧表格
      detailList: [],
      rightLoading: false,
      selectedDetail: null, // 当前选中的系数方案

      // 弹窗
      dialogVisible: false,
      isEdit: false,
      submitLoading: false,
      form: {
        varietieCode: '',
        varietieCodeNew: '',
        varietieName: '',
        specification: '',
        unit: '',
        manufacturer: '',
        approvalNumber: '',
        middlePkgCount: '',
        bigBoxCount: '',
        coefficient: '',
        enable: 1
      },

      // 权限控制
      showCreateBtn: true,
      showImportBtn: true,
      showDownloadBtn: true,
      isBDHost: false,

      // 表头统一样式（提升信息层级与可读性，对齐 8dp 节奏）
      tableHeaderStyle: {
        background: '#F5F7FA',
        color: '#303133',
        fontWeight: '600',
        fontSize: '12px',
        height: '38px',
        padding: '6px 0'
      }
    };
  },
  created() {
    this.loadPkgList();
  },
  methods: {
    /* 加载定数包品种列表 */
    async loadPkgList() {
      this.leftLoading = true;
      try {
        const res = await GetDefinitePkgList({
          VARIETIE_CODE: this.searchKeyword,
          VARIETIE_NAME: this.searchKeyword,
          wheres: 1,
          page: this.pkgPage,
          size: this.pkgPageSize
        });
        this.pkgList = res.result || [];
        this.pkgTotal = Number(res.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.leftLoading = false;
      }
    },

    /* 供父组件调用：根据品种编码同时加载左侧列表和右侧详情（对齐老系统 R_rowSelect） */
    async loadByVarietyCode(code, name) {
      if (!code) return;
      // 对齐老系统：搜索框显示品种全称，VARIETIE_CODE 传编码，VARIETIE_NAME 传名称
      this.searchKeyword = name || code;
      this.pkgPage = 1;
      this.selectedDetail = null;
      // 并行加载：左侧定数包品种列表 + 右侧定数包系数方案详情
      this.leftLoading = true;
      this.rightLoading = true;
      try {
        const [pkgRes, detailRes] = await Promise.all([
          GetDefinitePkgList({
            VARIETIE_CODE: code,
            VARIETIE_NAME: name || code,
            wheres: 1,
            page: 1,
            size: this.pkgPageSize
          }),
          GetDefinitePkgDetail({ varietieCode: code })
        ]);
        this.pkgList = pkgRes.result || [];
        this.pkgTotal = Number(pkgRes.total) || 0;
        this.detailList = detailRes.result || [];
        if (this.pkgList.length > 0) {
          this.$nextTick(() => {
            this.$refs.leftTable.setCurrentRow(this.pkgList[0]);
            this.selectedPkg = this.pkgList[0];
          });
        }
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.leftLoading = false;
        this.rightLoading = false;
      }
    },

    /* 搜索 */
    searchPkg() {
      this.pkgPage = 1;
      this.loadPkgList();
    },

    /* 左侧分页 */
    onPkgPageChange(page) {
      this.pkgPage = page;
      this.loadPkgList();
    },
    onPkgSizeChange(size) {
      this.pkgPageSize = size;
      this.pkgPage = 1;
      this.loadPkgList();
    },

    /* 左侧行选中 → 加载右侧详情 */
    onLeftRowSelect(row) {
      if (!row) return;
      this.selectedPkg = row;
      this.selectedDetail = null;
      this.loadDetailList(row.Varietie_Code);
    },

    /* 加载定数包系数方案详情 */
    async loadDetailList(varietieCode) {
      this.rightLoading = true;
      try {
        const res = await GetDefinitePkgDetail({ varietieCode });
        this.detailList = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载详情失败');
      } finally {
        this.rightLoading = false;
      }
    },

    /* 右侧行选中 */
    onRightRowSelect(row) {
      this.selectedDetail = row;
    },

    /* 打开创建弹窗 */
    async openCreateDialog() {
      if (!this.selectedPkg) {
        this.$message.warning('请先在左侧选择一个品种');
        return;
      }
      this.isEdit = false;
      this.submitLoading = false;
      await this.loadVarietyDetails();
      this.form.coefficient = '';
      this.dialogVisible = true;
    },

    /* 编辑 */
    async editDetail(row) {
      this.isEdit = true;
      this.submitLoading = false;
      this.selectedDetail = row;
      await this.loadVarietyDetails();
      this.form.coefficient = row.Def_No_pkg_Coefficient || '';
      this.form.enable = row.Enable == 1 ? 1 : 0;
      this.dialogVisible = true;
    },

    /* 加载品种详情填充表单 */
    async loadVarietyDetails() {
      const varietieCode = this.selectedPkg ? this.selectedPkg.Varietie_Code : '';
      if (!varietieCode) return;
      try {
        const data = await GetVarietyDetailsInfo(varietieCode);
        if (data && data !== '301') {
          const json = JSON.parse(data);
          if (json && json.length > 0) {
            const item = json[0];
            this.form.varietieCode = item.Varietie_Code || '';
            this.form.varietieCodeNew = item.Varietie_Code_New || '';
            this.form.varietieName = item.Varietie_Name || '';
            this.form.specification = item.Specification_Or_Type || '';
            this.form.unit = item.Unit || '';
            this.form.manufacturer = item.manufacturing_ent_name || '';
            this.form.approvalNumber = item.Approval_Number || '';
            this.form.middlePkgCount = item.Middle_Package_Count || '';
            this.form.bigBoxCount = item.Big_Box_Count || '';
          }
        }
      } catch (e) {
        // 忽略加载详情错误
      }
    },

    /* 提交表单 */
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;

        const varietieCode = this.selectedPkg ? this.selectedPkg.Varietie_Code : '';
        const coefficient = this.form.coefficient;

        // 检查重复
        try {
          const dupCount = await IsCoefficientSame({ varietieCode, coefficient });
          if (this.isEdit) {
            if (parseInt(dupCount) > 1) {
              this.$message.warning('已经存在相同的定数包系数或未作出修改');
              return;
            }
          } else {
            if (parseInt(dupCount) > 0) {
              this.$message.warning('已经存在相同的定数包系数');
              return;
            }
          }
        } catch (e) {
          // 检查失败允许继续
        }

        this.submitLoading = true;
        try {
          if (this.isEdit) {
            const pkgCode = this.selectedDetail ? this.selectedDetail.Def_No_Pkg_Code : '';
            const res = await UpdateDefinite({
              pkgCode,
              coefficient,
              enable: this.form.enable
            });
            if (res === 'True' || res === true) {
              this.$message.success('修改成功');
              this.dialogVisible = false;
              this.loadDetailList(varietieCode);
            } else {
              this.$message.error('修改失败');
            }
          } else {
            const res = await InsertDefinite({ coefficient, varietieCode });
            if (res === 'True' || res === true) {
              this.$message.success('添加成功');
              this.dialogVisible = false;
              this.loadDetailList(varietieCode);
            } else {
              this.$message.error('添加失败');
            }
          }
        } catch (e) {
          this.$message.error(e.message || '操作失败');
        } finally {
          this.submitLoading = false;
        }
      });
    },

    /* 删除 */
    async deleteDetail(row) {
      if (!this.selectedPkg) return;
      const varietieCode = this.selectedPkg.Varietie_Code;
      try {
        const check = await CheckVarietieBasic({ varietieCode: "'" + varietieCode + "'", nickname: '' });
        if (check == 301 || check === '301') {
          this.$message.error('登录失效，请重新登录');
          return;
        }
        if (parseInt(check) == 400) {
          this.$message.warning('此定数包品种已应用于作业流程,拒绝删除');
          return;
        }
      } catch (e) {
        // 检查失败允许继续
      }

      try {
        await this.$confirm('确定要删除此定数包系数吗?', '提示', { type: 'warning' });
      } catch {
        return;
      }

      const loading = this.$loading({ lock: true });
      try {
        await DeleteDefiniteApi({ pkgCode: row.Def_No_Pkg_Code });
        this.$message.success('成功删除');
        this.loadDetailList(varietieCode);
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      } finally {
        loading.close();
      }
    },

    /* 格式化日期 */
    formatDate(row, column, cellValue) {
      if (!cellValue) return '';
      return cellValue.substring(0, 10);
    },

    /* 导入 */
    handleImportClick() {
      this.$refs.importFile.click();
    },

    /* 文件选择 */
    handleFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const name = (file.name || '').toLowerCase();
      if (!name.endsWith('.xls') && !name.endsWith('.xlsx')) {
        this.$message.error('文件格式错误，请上传 .xls 或 .xlsx 定数包系数导入模板。');
        this.$refs.importFile.value = '';
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const loading = this.$loading({ lock: true });
      ImportDefinitePackages(formData)
        .then((res) => {
          loading.close();
          const code = res.code != null ? res.code : res.Code;
          const msg = (res.msg || res.Msg || '导入完成').toString();
          if (code == 301 || code === '301') {
            this.$message.error(msg || '登录失效，请重新登录');
            return;
          }
          if (code == 200 || code === '200') {
            this.$alert(msg.replace(/\n/g, '<br/>'), '导入成功', {
              dangerouslyUseHTMLString: true,
              type: 'success'
            });
            if (this.selectedPkg) {
              this.loadDetailList(this.selectedPkg.Varietie_Code);
            }
          } else {
            this.$alert(msg.replace(/\n/g, '<br/>'), '导入失败', {
              dangerouslyUseHTMLString: true,
              type: 'error'
            });
          }
        })
        .catch((e) => {
          loading.close();
          this.$message.error('导入失败：' + (e.message || '网络错误'));
        })
        .finally(() => {
          this.$refs.importFile.value = '';
        });
    },

    /* 下载导入模板 */
    downloadTemplate() {
      // 使用 xlsx 导出模板
      import('xlsx').then(({ utils, writeFile }) => {
        const data = [
          ['品种编码', '系数', '停用/启用'],
          ['示例：100001', '1', '启用']
        ];
        const ws = utils.aoa_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');
        writeFile(wb, '定数包系数导入模板.xlsx');
      }).catch(() => {
        this.$message.error('模板导出组件未加载');
      });
    }
  }
};
</script>

<style scoped>
.dsb-container {
  padding: 12px;
  background: #F2F3F5;
  min-height: 100%;
}
.dsb-panels {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

/* 卡片化面板：浅阴影 + 内边距，建立视觉层级 */
.dsb-card {
  background: #FFFFFF;
  border: 1px solid #EBEEF5;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s ease;
}
.dsb-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dsb-left-panel {
  width: 52%;
  min-width: 0;
}
.dsb-divider {
  width: 4px;
}
.dsb-right-panel {
  width: 48%;
  min-width: 0;
}

/* Panel 头部：色条 + 标题 + 数量徽章 */
.panel-header {
  margin-bottom: 10px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.title-bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: #409EFF;
  display: inline-block;
}
.title-bar--accent {
  background: #67C23A;
}
.panel-title h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}
.count-tag {
  margin-left: 4px;
}
.panel-subtitle {
  margin-top: 6px;
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.panel-subtitle--muted {
  color: #909399;
  font-style: normal;
}
.dot-sep {
  color: #C0C4CC;
  margin: 0 2px;
}

/* 工具栏 */
.panel-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.toolbar-spacer {
  flex: 1;
}

/* 表格优化 */
.dsb-table {
  font-size: 12px;
}
.dsb-table >>> .el-table__header th {
  border-bottom: 1px solid #E4E7ED;
}
.dsb-table >>> .el-table__row {
  transition: background-color 0.15s ease;
}
.dsb-table >>> .el-table__row:hover > td {
  background: #ECF5FF !important;
}
.dsb-table >>> .el-table__row.current-row > td {
  background: #DCEBFB !important;
}
.dsb-table >>> .cell {
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsb-table >>> .el-table__header .cell {
  white-space: nowrap;
}

/* 数字 / 编码使用等宽，防止跳动；对齐 number-tabular */
.mono,
.num,
.num-strong {
  font-variant-numeric: tabular-nums;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}
.num-strong {
  font-weight: 600;
  color: #303133;
}
.num {
  color: #606266;
}

/* 分页器右对齐 */
.panel-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

/* 操作列按钮：保证 hover 反馈 */
.dsb-table >>> .el-button--text {
  padding: 4px 6px;
}
.dsb-table >>> .el-button--text + .el-button--text {
  margin-left: 4px;
}
.ele-text-danger {
  color: #F56C6C;
}
.ele-text-danger:hover {
  color: #f78989;
}

/* 启用/停用 tag 内的图标 */
.dsb-table >>> .el-tag .el-icon-check,
.dsb-table >>> .el-tag .el-icon-close {
  margin-right: 2px;
}

/* 空状态文字稍淡 */
.dsb-table >>> .el-table__empty-text {
  color: #909399;
  font-size: 12px;
}

/* 响应式：窄屏时上下堆叠 */
@media (max-width: 1100px) {
  .dsb-panels {
    flex-direction: column;
  }
  .dsb-left-panel,
  .dsb-right-panel {
    width: 100%;
  }
  .dsb-divider {
    display: none;
  }
}
</style>
