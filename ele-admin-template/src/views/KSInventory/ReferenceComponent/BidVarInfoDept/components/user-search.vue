<!-- 搜索表单：字段对齐老页 BidVarInfoDept / 本院中标目录 -->
<template>
  <el-form
    class="ele-form-search"
    inline
    size="mini"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-form-item>
      <el-input
        style="width: 140px"
        clearable
        v-model="where.VARIETIE_CODE_NEW"
        placeholder="品种编码"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        style="width: 140px"
        clearable
        v-model="where.PROD_REGISTRATION_NAME"
        placeholder="品种名称"
      />
    </el-form-item>
    <el-form-item>
      <el-input style="width: 140px" clearable v-model="where.GG" placeholder="规格型号" />
    </el-form-item>
    <el-form-item>
      <el-input
        style="width: 140px"
        clearable
        v-model="where.APPROVAL_NUMBER"
        placeholder="注册证号"
      />
    </el-form-item>
    <el-form-item>
      <el-input style="width: 140px" clearable v-model="where.SUP_NAME" placeholder="供应商" />
    </el-form-item>
    <el-form-item>
      <el-input
        style="width: 140px"
        clearable
        v-model="where.MANUFACTURING_ENT_NAME"
        placeholder="生产企业"
      />
    </el-form-item>
    <el-form-item>
      <el-input style="width: 140px" clearable v-model="where.USE_DEPT" placeholder="使用科室" />
    </el-form-item>
    <el-form-item label="导入时间">
      <el-date-picker
        v-model="where.CREATE_BATCH"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="开始"
        style="width: 130px"
      />
    </el-form-item>
    <el-form-item label="-">
      <el-date-picker
        v-model="where.CREATE_BATCH2"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="结束"
        style="width: 130px"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        style="width: 140px"
        clearable
        v-model="where.CONTRACT_CODE"
        placeholder="合同编码"
      />
    </el-form-item>
    <el-form-item label="合同开始">
      <el-date-picker
        v-model="where.start_time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="合同开始"
        style="width: 130px"
      />
    </el-form-item>
    <el-form-item label="合同结束">
      <el-date-picker
        v-model="where.end_time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="合同结束"
        style="width: 130px"
      />
    </el-form-item>
    <el-form-item>
      <el-select
        style="width: 120px"
        v-model="where.IS_HAVE"
        clearable
        placeholder="在用状态"
        @change="search"
      >
        <el-option label="全部" value="" />
        <el-option label="启用" value="1" />
        <el-option label="已申请" value="2" />
        <el-option label="未使用" value="0" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
        查询
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button class="ele-btn-icon" icon="el-icon-refresh" @click="reset">重置</el-button>
    </el-form-item>
    <el-form-item v-permission="'zhongbiao-export'">
      <el-button
        type="primary"
        icon="el-icon-download"
        class="ele-btn-icon"
        @click="exportData"
      >
        导出
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="ele-btn-icon"
        icon="el-icon-upload2"
        @click="ApplyToVarietyDataLzhLook()"
      >
        申请至在用目录
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        type="danger"
        class="ele-btn-icon"
        icon="el-icon-download"
        @click="CalApplyToVarietyDataLzhLook()"
      >
        取消申请至在用目录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { CreateTempletDeta } from '@/api/KSInventory/BidVarInfoDept';

function createDefaultWhere() {
  return {
    VARIETIE_CODE_NEW: '',
    PROD_REGISTRATION_NAME: '',
    GG: '',
    APPROVAL_NUMBER: '',
    SUP_NAME: '',
    MANUFACTURING_ENT_NAME: '',
    USE_DEPT: '',
    IS_ENABLE: '',
    IS_HAVE: '',
    IS_USE: '1',
    IS_IN_COUNTRY_IMPORT: '',
    CONTRACT_CODE: '',
    // 导入时间（对齐老页 CREATE_BATCH / CREATE_BATCH2）
    CREATE_BATCH: '',
    CREATE_BATCH2: '',
    // 合同起止（对齐老页 start_time / end_time）
    start_time: '',
    end_time: '',
    HIGH_OR_LOW_CLASS: '',
    HIGH_CLASS_XH: '',
    IS_PRICE: '',
    KC: ''
  };
}

export default {
  props: ['selection'],
  data() {
    const defaultWhere = createDefaultWhere();
    return {
      defaultWhere,
      where: { ...defaultWhere }
    };
  },
  methods: {
    search() {
      this.$emit('search', { ...this.where });
    },
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    exportData() {
      this.$emit('exportData', { ...this.where });
    },
    ApplyToVarietyDataLzhLook() {
      if (this.selection.length == 0) {
        this.$message.warning('请选择数据');
        return;
      }
      const loading = this.$messageLoading('保存中。。。');
      var data = this.selection;
      data.dept_two_code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      data.state = 3;
      CreateTempletDeta(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    CalApplyToVarietyDataLzhLook() {
      if (this.selection.length == 0) {
        this.$message.warning('请选择数据');
        return;
      }
      const loading = this.$messageLoading('保存中。。。');
      var data = this.selection;
      data.dept_two_code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      data.state = 0;
      CreateTempletDeta(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    }
  }
};
</script>
