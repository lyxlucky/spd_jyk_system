<template>
  <el-dialog
    title="更新选定字段"
    :visible="visible"
    width="560px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form size="mini" label-width="130px">
      <el-form-item label="更新字段名：">
        <el-select v-model="updataField" filterable style="width: 100%">
          <el-option
            v-for="item in fieldOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择文件：">
        <input ref="fileInput" type="file" accept=".xls,.xlsx" @change="onFileChange" />
      </el-form-item>
      <el-form-item v-if="updataField === '5'" label="同步合同价格：">
        <el-select v-model="priceBox" style="width: 100%">
          <el-option label="否" value="0" />
          <el-option label="是" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <span class="tip">Excel格式：A列=品种编码，B列=更新值（第1行表头）</span>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import { ImpUpdataField } from '@/api/Home/VarietyDataLzhMain';

const BASE_FIELD_OPTIONS = [
  { value: '1', label: '品种全称' },
  { value: '2', label: '批准文号' },
  { value: '3', label: '型号规格' },
  { value: '4', label: '单位' },
  { value: '5', label: '中标价' },
  { value: '6', label: '是否收费' },
  { value: '7', label: '计费编码' },
  { value: '8', label: '中包装数量' },
  { value: '9', label: '大包装数量' },
  { value: '10', label: '包装规格' },
  { value: '11', label: '一次性灭菌包装' },
  { value: '12', label: '存储条件' },
  { value: '13', label: '是否植入' },
  { value: '14', label: '是否介入' },
  { value: '15', label: '是否一物一码' },
  { value: '16', label: '是否中标' },
  { value: '17', label: '是否专购' },
  { value: '18', label: '库存上限' },
  { value: '19', label: '库存下限' },
  { value: '20', label: '使用级别' },
  { value: '21', label: '主控库区' },
  { value: '22', label: '物资类型' },
  { value: '23', label: '默认货位' },
  { value: '24', label: '是否启用' },
  { value: '25', label: '专机专用' },
  { value: '26', label: '计费名称' },
  { value: '27', label: '器械识别码（DI）' },
  { value: '28', label: 'UDI' },
  { value: '29', label: '高低值分类' },
  { value: '30', label: '高低值分类下级属性' },
  { value: '31', label: '财务分类属性' },
  { value: '32', label: '医用类别分类' },
  { value: '33', label: '高值重点治理序号' },
  { value: '34', label: '重点治理耗材名称' },
  { value: '35', label: '病案分类' },
  { value: '36', label: '第一批重点耗材' },
  { value: '37', label: '省平台编码' },
  { value: '38', label: '原医院系统编码' },
  { value: '39', label: '服务费率%' },
  { value: '40', label: 'PTL货位编码' },
  { value: '41', label: 'PTL架层' },
  { value: '42', label: 'PTL位码' },
  { value: '43', label: '阳光产品码' },
  { value: '44', label: '阳光规格码' },
  { value: '45', label: '来源' },
  { value: '46', label: '是否集采' },
  { value: '47', label: '医保编码' },
  { value: '48', label: '医保编码27位' },
  { value: '49', label: '备注' },
  { value: '50', label: '搜索标记' },
  { value: '51', label: '阳光换算比' },
  { value: '52', label: '医保终止日期' },
  { value: '53', label: '一级目录' },
  { value: '54', label: '二级目录' },
  { value: '55', label: '三级目录' },
  { value: '56', label: '仪器名' },
  { value: '58', label: '医保通用名' },
  { value: '59', label: 'his结束时间' },
  { value: '60', label: '中包装单位' },
  { value: '61', label: '大包装单位' },
  { value: '62', label: '医用耗材级别' },
  { value: '63', label: '风险类别' },
  { value: '64', label: '用途' },
  { value: '65', label: '功能' },
  { value: '66', label: '收费分类' },
  { value: '67', label: '是否贯标' },
  { value: '68', label: '是否挂起' },
  { value: '69', label: '计划限量' },
  { value: '74', label: '是否常备' },
  { value: '75', label: '是否急强' },
  { value: '76', label: '产品ID' },
  { value: '77', label: '规格ID' },
  { value: '78', label: '材质' },
  { value: '79', label: '检验科住院去重' },
  { value: '80', label: '医保报销YB_BX(否0 是1)' },
  { value: '81', label: '门诊使用' },
  { value: '82', label: '住院使用' },
  { value: '83', label: '医技使用' },
  { value: '84', label: '供应商备注' },
  { value: '85', label: '是否发送阳光平台' },
  { value: '86', label: '发送阳光平台时间' },
  { value: '87', label: '适应症提示' },
  { value: '88', label: '阳采平台备注' },
  { value: '89', label: '医保分类YB_CLASS（甲类00乙类01自费03）' },
  { value: '90', label: '是否国疗' },
  { value: '91', label: '是否限价' },
  { value: '92', label: '是否捐赠' },
  { value: '93', label: '医保单件产品名称MEDICAL_DBJ_NAME' },
  { value: '94', label: '医保限制备注YB_BX_BZ' },
  { value: '95', label: '是否纳入广东省医疗保险医用耗材目录SYZ(否0 是1)' }
];

export default {
  name: 'ImpSelectedFieldDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      updataField: '1',
      priceBox: '0',
      file: null,
      loading: false
    };
  },
  computed: {
    fieldOptions() {
      const opts = [...BASE_FIELD_OPTIONS];
      if (HOME_HP === 'bdrm' || HOME_HP === 'chrmyy' || HOME_HP === 'stzl') {
        opts.push(
          { value: '70', label: '规格' },
          { value: '71', label: '型号' },
          { value: '73', label: '分类属性2' }
        );
      }
      if (HOME_HP === 'csyy') {
        opts.push({ value: '57', label: '潮州医保编码' });
      }
      return opts.sort((a, b) => Number(a.value) - Number(b.value));
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.file = null;
        this.updataField = '1';
        this.priceBox = '0';
        if (this.$refs.fileInput) this.$refs.fileInput.value = '';
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    onFileChange(e) {
      this.file = e.target.files?.[0] || null;
    },
    async onSubmit() {
      if (!this.file) {
        this.$message.warning('请选择文件');
        return;
      }
      const name = (this.file.name || '').toLowerCase();
      if (!(name.endsWith('.xls') || name.endsWith('.xlsx'))) {
        this.$message.error('文件格式错误，请上传 .xls 或 .xlsx');
        return;
      }
      try {
        await this.$confirm('确定更新吗?', '提示', { type: 'warning' });
      } catch (e) {
        return;
      }
      this.loading = true;
      try {
        const res = await ImpUpdataField(this.file, this.updataField, this.priceBox);
        if (res?.code == 200 || res?.code === '200') {
          this.$alert(String(res.msg || '更新成功').replace(/\n/g, '<br/>'), '更新选定字段', {
            dangerouslyUseHTMLString: true,
            type: 'success'
          });
          this.updateVisible(false);
          this.$emit('success');
        } else {
          this.$alert(String(res?.msg || '更新失败').replace(/\n/g, '<br/>'), '更新选定字段', {
            dangerouslyUseHTMLString: true,
            type: 'error'
          });
        }
      } catch (e) {
        this.$message.error(e.message || '更新失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.tip {
  color: #999;
  font-size: 12px;
  line-height: 1.4;
}
</style>
