<template>
  <div class="ele-body">
    <registrationTableSearch
      @registrationExport="handleRegistrationExport"
      @search="reload"
      @itemDelete="handleItemDelete"
    />
    <ele-pro-table
      highlight-current-row
      ref="table"
      @current-change="onCurrentChange"
      height="40vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="registrationTableCacheKey"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="handleBatchDistinct"
          >批量去重保留</el-button
        >
      </template>

      <template v-slot:REGISTRATION_VALID_DATE="{ row }">
        <el-tag size="mini" type="danger" v-if='isDateBeforeToday(row.REGISTRATION_VALID_DATE)'>{{
          row.REGISTRATION_VALID_DATE.substring(0, 10)
        }}</el-tag>
        <el-tag size="mini" type="success" v-else>{{
          row.REGISTRATION_VALID_DATE.substring(0, 10)
        }}</el-tag>
      </template>

      <template v-slot:DOC_PIC_PROGRESS_HEADER>
        <span class="doc-pic-progress-header">
          证件数（已填/<el-link
            type="primary"
            :underline="false"
            class="doc-pic-progress-header-link"
            @click.stop="openVarietyDocRuleSetup"
            >必填</el-link
          >）
        </span>
      </template>

      <!-- v-for 单元素：每行只算一次 docPicProgress；:key 须使用 v-for 变量（eslint vue/valid-v-for） -->
      <template v-slot:DOC_PIC_PROGRESS="{ row }">
        <div
          v-for="(p, idx) in [docPicProgress(row)]"
          :key="idx"
        >
          <div v-if="p.max === 0" class="doc-pic-progress-empty">—</div>
          <el-progress
            v-else
            :stroke-width="12"
            :percentage="p.percentage"
            :color="docPicProgressBarColor(p.percentage)"
            :format="() => `${p.matched}/${p.max}`"
          />
        </div>
      </template>

      <template v-slot:IS_ENABLE="{ row }">
        <el-tag
          size="mini"
          :type="row.ENABLE === '0' || row.ENABLE === 0 ? 'info' : 'success'"
        >
          {{ row.ENABLE === '0' || row.ENABLE === 0 ? '停用' : '启用' }}
        </el-tag>
      </template>

      <template v-slot:ACTION="{ row }">
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handlePurchase(row)"
            >带量采购</el-button
          >
          <el-button
            type="info"
            size="mini"
            icon="el-icon-more-outline"
            @click="handleCatDetail(row)"
            >详情</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDistinct(row)"
            >去重保留</el-button
          >
        </div>
      </template>
    </ele-pro-table>
    <RegistrationDetail
      :visible.sync="registrationUpdatevisible"
      :tableCurrent="tableCurrent"
    />
  </div>
</template>
<script>
  import registrationTableSearch from './RegistrationTableSearch';
  import RegistrationDetail from './RegistrationDetail';
  import {
    SearchProdInfo,
    disAppro,
    disApproBatch,
    DeleteProd
  } from '@/api/Home/registration/index';
  import { utils, writeFile } from 'xlsx';
  export default {
    name: 'RegistrationTable',
    components: {
      registrationTableSearch,
      RegistrationDetail
    },
    data() {
      return {
        columns: [
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center',
            fixed: 'left'
          },
          {
            slot: 'ACTION',
            prop: 'ACTION',
            label: '操作',
            minWidth: 320,
            align: 'center'
          },
          {
            slot: 'DOC_PIC_PROGRESS',
            headerSlot: 'DOC_PIC_PROGRESS_HEADER',
            prop: 'DOC_PIC_PROGRESS',
            label: '证件数（已填/必填）',
            minWidth: 180,
            align: 'center'
          },
          {
            prop: 'QXBZ',
            label: '缺项备注',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'PROD_REGISTRATION_NAME',
            label: '注册证名称',
            minWidth: 220,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'REGISTRATION_ISSUING_DATE',
            label: '发证日期',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
            }
          },
          {
            slot: 'REGISTRATION_VALID_DATE',
            prop: 'REGISTRATION_VALID_DATE',
            label: '有效到期',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'OLD_PROD_REGISTRATION_CODE',
            label: '原注册证',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '医疗器械注册人或备案人',
            minWidth: 220,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'ST_MANUFACTURING_ENT_NAME',
            label: '受托医疗器械生产企业名称',
            minWidth: 220,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_LICENSE',
            label: '生产许可证号',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          
          {
            prop: 'PROD_BIG_CLASS_NAME',
            label: '产品类别',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MGMT_CAT_NAME',
            label: '管理类别',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'REGULATORY_CAT_NAME',
            label: '监管类别',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            slot: 'IS_ENABLE',
            prop: 'IS_ENABLE',
            label: '启用状态',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'PRODUCTION_SITE',
            label: '生产企业地址',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          
        ],
        toolbar: false,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        registrationUpdatevisible: false,
        tableCurrent: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = SearchProdInfo({ page, limit, where, order }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onCurrentChange(row) {
        this.current = row;
        this.$bus.$emit(`${this.$route.path}/handleCurrent`, row);
      },
      isDateBeforeToday(dateString) {
        if (!dateString) {
          // 增加对 dateString 为空的判断，避免空值传入 moment 报错
          return false; // 或者根据你的需求返回其他默认值，比如 false 表示不早于今天
        }
        const dateToCheck = this.$moment(dateString, true); // 使用 strict mode 严格解析日期
        if (!dateToCheck.isValid()) {
          return false; // 如果日期无效，返回 false
        }
        const today = this.$moment().startOf('day');
        return dateToCheck.isBefore(today); // 返回 true 如果 dateToCheck 早于今天
      },
      /** 接口可能返回 PascalCase 或 camelCase，统一成 string[] */
      normalizeStrList(val) {
        if (val == null) return [];
        if (Array.isArray(val)) return val.map((x) => String(x).trim()).filter(Boolean);
        if (typeof val === 'string') {
          return val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [];
      },
      /**
       * 必填 DOC_RULE_DICT_VALUES 为分母；统计 VAR_PIC_TYPES 中已覆盖的必填项数量，算百分比
       */
      docPicProgress(row) {
        const required = this.normalizeStrList(
          row.DOC_RULE_DICT_VALUES ?? row.docRuleDictValues
        );
        const picTypes = this.normalizeStrList(
          row.VAR_PIC_TYPES ?? row.varPicTypes
        );
        const max = required.length;
        if (max === 0) {
          return { percentage: 0, matched: 0, max: 0 };
        }
        const picSet = new Set(picTypes.map(String));
        const matched = required.filter((r) => picSet.has(String(r))).length;
        const percentage = Math.round((matched / max) * 100);
        return { percentage, matched, max };
      },
      /** 0% 红，(0,100)% 黄，100% 绿 */
      docPicProgressBarColor(percentage) {
        if (percentage <= 0) return '#f56c6c';
        if (percentage >= 100) return '#67c23a';
        return '#e6a23c';
      },
      handleItemDelete(data) {
        if (!this.selection.length) {
          this.$message.error('请选择要删除的数据');
          return;
        }
        const ids = this.selection
          .map((item) => {
            return item.PROD_REGISTRATION_CODE;
          })
          .join(',');
        this.$confirm('是否删除此产品注册证', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DeleteProd({
            code: ids
          })
            .then((res) => {
              if (res?.code != 200) return this.$message.error(res.msg);
              this.$message.success(res.msg);
            })
            .finally(() => {
              this.reload(null);
            });
        });
      },
      handleRegistrationExport(data) {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(() => {
          SearchProdInfo({
            page: 1,
            limit: 999999,
            where: data
          })
            .then((res) => {
              const headers = [
                '证照数',
                '缺项备注',
                '注册证名称',
                '批准文号',
                '发证日期',
                '有效到期',
                '原批准文号',
                '医疗器械注册人或备案人',
                '受委托医疗器械生产企业名称',
                '生产许可证号',
                '产品类别',
                '管理类别',
                '监管类别',
                '储存条件',
                '创建日期',
                '生产企业地址',
                '是否启用',
                '结构及组成',
                '适用范围'
              ];
              const array = [headers];
              const date10 = (v) =>
                v == null || v === '' ? '' : String(v).substring(0, 10);
              res.result.forEach((d) => {
                const p = this.docPicProgress(d);
                const licenseCount =
                  p.max === 0 ? '—' : `${p.matched}/${p.max}`;
                const createDate =
                  d.CREATE_TIME == null || d.CREATE_TIME === ''
                    ? ''
                    : this.$util.toDateString(d.CREATE_TIME, 'yyyy-MM-dd');
                array.push([
                  licenseCount,
                  d.QXBZ,
                  d.PROD_REGISTRATION_NAME,
                  d.APPROVAL_NUMBER,
                  date10(d.REGISTRATION_ISSUING_DATE),
                  date10(d.REGISTRATION_VALID_DATE),
                  d.OLD_PROD_REGISTRATION_CODE,
                  d.MANUFACTURING_ENT_NAME,
                  d.ST_MANUFACTURING_ENT_NAME,
                  d.MANUFACTURING_LICENSE,
                  d.PROD_BIG_CLASS_NAME,
                  d.MGMT_CAT_NAME,
                  d.REGULATORY_CAT_NAME,
                  d.STORAGE_CONDITION,
                  createDate,
                  d.PRODUCTION_SITE,
                  d.ENABLE === '0' || d.ENABLE === 0 ? '否' : '是',
                  d.STRUCTURE_COMPOSITION,
                  d.SCOPE_APPLICATION
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(array)
                  }
                },
                '注册证详情.xlsx'
              );
              this.$message.success('导出成功');
            })
            .finally(() => {
              loading.close();
            });
        });
      },
      handlePurchase(data) {},
      buildDisApproBatchResultText(successes, failures, summary) {
        const lines = [String(summary || ''), ''];
        lines.push('【成功】共 ' + successes.length + ' 条');
        if (successes.length) {
          successes.forEach((row) => {
            const a = row.ApproStr || row.approStr || '';
            const id = row.ID || row.id || '';
            lines.push('  · ' + a + ' — 保留注册证：' + id);
          });
        } else {
          lines.push('  （无）');
        }
        lines.push('');
        lines.push('【失败】共 ' + failures.length + ' 条');
        if (failures.length) {
          failures.forEach((row) => {
            const a = row.ApproStr || row.approStr || '';
            const m = row.Msg || row.msg || '';
            lines.push('  · ' + a + ' — ' + m);
          });
        } else {
          lines.push('  （无）');
        }
        return lines.join('\n');
      },
      handleBatchDistinct() {
        if (!this.selection.length) {
          this.$message.error('请选择要处理的数据');
          return;
        }
        this.$confirm(
          '将对选中行执行去重保留（同一批准文号仅处理第一条选中记录），是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          const loading = this.$messageLoading('请求中..');
          disApproBatch(this.selection)
            .then((res) => {
              const successes = res.successes || res.Successes || [];
              const failures = res.failures || res.Failures || [];
              const summary = res.msg || res.Msg || '';
              const text = this.buildDisApproBatchResultText(
                successes,
                failures,
                summary
              );
              this.$alert(text, '批量去重保留结果', {
                confirmButtonText: '确定',
                customClass: 'disappro-batch-result-msg'
              });
            })
            .finally(() => {
              loading.close();
              this.reload(null);
            });
        });
      },
      handleDistinct(data) {
        const loading = this.$messageLoading('请求中..');
        disAppro({
          id: data.PROD_REGISTRATION_CODE,
          ApproStr: data.APPROVAL_NUMBER
        })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          })
          .finally(() => {
            loading.close();
            this.reload(null);
          });
      },
      handleCatDetail(data) {
        this.tableCurrent = data;
        this.registrationUpdatevisible = true;
      },
      /** 从菜单树解析「三大类别管理」页面 path（组件 Home/Supervise） */
      findSupervisePagePath() {
        const menus = this.$store.state.user.menus;
        const needle = 'Home/Supervise';
        const walk = (nodes) => {
          if (!nodes || !nodes.length) return null;
          for (const n of nodes) {
            const comp = n.component || '';
            if (comp && String(comp).indexOf(needle) !== -1) {
              return n.path || (n.meta && n.meta.fullPath) || n.fullPath || '';
            }
            const sub = walk(n.children);
            if (sub) return sub;
          }
          return null;
        };
        return walk(menus) || null;
      },
      /** 表头「必填」：跳转三大类别管理并打开当前选中行对应产品/管理类别的品种证件必填配置 */
      openVarietyDocRuleSetup() {
        const row = this.current;
        if (!row) {
          this.$message.warning('请先点击选中一行注册证');
          return;
        }
        const prodCode = row.PROD_BIG_CLASS_CODE ?? row.Prod_Big_Class_Code;
        const mgmtCode = row.MGMT_CAT_CODE ?? row.Mgmt_Cat_Code;
        if (prodCode == null || prodCode === '' || mgmtCode == null || mgmtCode === '') {
          this.$message.warning('当前行缺少产品类别或管理类别编码，无法打开证件必填配置');
          return;
        }
        try {
          sessionStorage.setItem(
            'ele_open_variety_doc_rule',
            JSON.stringify({
              prodBigClassCode: String(prodCode),
              mgmtCatCode: String(mgmtCode)
            })
          );
        } catch (e) {
          this.$message.error('无法写入跳转参数');
          return;
        }
        const path = this.findSupervisePagePath();
        if (!path) {
          this.$message.error('未找到「三大类别管理」菜单路由，请联系管理员配置菜单');
          return;
        }
        if (this.$route.path === path) {
          this.$bus.$emit('ele-open-variety-doc-rule');
          return;
        }
        this.$router.push({ path });
      }
    },
    created() {}
  };
</script>
<style scoped>
.ele-body {
  padding: 0px ; 
}
.disappro-batch-result-msg .el-message-box__message {
  white-space: pre-wrap;
  text-align: left;
  max-height: 420px;
  overflow-y: auto;
}

.doc-pic-progress-empty {
  color: #909399;
  font-size: 12px;
}

.doc-pic-progress-header {
  font-size: 12px;
  line-height: 1.4;
  white-space: normal;
}

.doc-pic-progress-header-link {
  font-size: 12px;
  vertical-align: baseline;
}
</style>
