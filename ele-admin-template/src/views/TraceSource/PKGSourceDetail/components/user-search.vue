<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input size="mini" clearable v-model="where.ks_gs1_search_inp" placeholder="支持编码、品名、规格、RFID、UDI、定数码、供应商查询" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input size="mini" clearable v-model="where.ks_gs1_search_bhOrYs" placeholder="病患号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <label>
          上架时间:
          <el-date-picker
            v-model="where.ks_UseTimeStart"
            type="date"
            value-format="yyyy-MM-dd"
            size="mini"
            placeholder="开始"
            style="width: 140px"
          />
          <el-date-picker
            v-model="where.ks_UseTimeEnd"
            type="date"
            value-format="yyyy-MM-dd"
            size="mini"
            placeholder="结束"
            style="width: 140px; margin-left: 8px"
          />
        </label>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <label>
          使用时间:
          <el-date-picker
            v-model="where.consumeStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            size="mini"
            placeholder="开始"
            style="width: 140px"
          />
          <el-date-picker
            v-model="where.consumeEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            size="mini"
            placeholder="结束"
            style="width: 140px; margin-left: 8px"
          />
        </label>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-select size="mini" clearable v-model="where.procurementType" placeholder="全部" style="width: 100px">
          <el-option label="全部" value="" />
          <el-option label="集采" value="集采" />
          <el-option label="临购" value="临购" />
        </el-select>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      defaultWhere: {
        ks_gs1_search_inp: '',
        ks_gs1_search_bhOrYs: '',
        ks_UseTimeStart: '',
        ks_UseTimeEnd: '',
        consumeStartTime: '',
        consumeEndTime: '',
        procurementType: ''
      },
      where: {}
    };
  },
  computed: {
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  created() {
    this.where = { ...this.defaultWhere };
  },
  methods: {
    search() {
      this.$emit('search', this.where);
    }
  }
};
</script>
