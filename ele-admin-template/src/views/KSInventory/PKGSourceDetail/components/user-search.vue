<template>
  <div class="pkg-source-search">
    <h5 class="page-title">医用耗材器械追溯查询</h5>
    <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
      <el-row :gutter="10" type="flex" align="middle">
        <el-col v-bind="col">
          <el-input
            v-model="where.condition"
            size="small"
            clearable
            placeholder="支持编码、品名、规格、RFID、UDI、定数码、供应商查询"
            style="width: 250px"
          />
        </el-col>
        <el-col v-bind="col">
          <el-input
            v-model="where.bhOrYs"
            size="small"
            clearable
            placeholder="病患号"
            style="width: 250px"
          />
        </el-col>
        <el-col v-bind="col">
          <span class="label-text">上架时间：</span>
          <el-date-picker
            v-model="where.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            placeholder="yyyy-mm-dd"
            style="width: 120px"
          />
          <span class="date-sep">-</span>
          <el-date-picker
            v-model="where.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            placeholder="yyyy-mm-dd"
            style="width: 120px"
          />
        </el-col>
        <el-col v-bind="col">
          <el-select v-model="where.Storage" size="small" style="width: 140px" placeholder="仓库">
            <el-option label="全部" value="" />
            <el-option v-for="s in storageList" :key="s.ID" :label="s.NAME" :value="String(s.ID)" />
          </el-select>
        </el-col>
        <el-col v-bind="col">
          <el-button size="small" type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getStorageList } from '@/api/KSInventory/PKGSourceDetail';

export default {
  data() {
    return {
      col: { span: 24 },
      storageList: [],
      where: {
        condition: '',
        bhOrYs: '',
        startTime: '',
        endTime: '',
        Storage: '',
        IsEnd: ''
      }
    };
  },
  created() {
    this.loadStorage();
  },
  methods: {
    async loadStorage() {
      try {
        const res = await getStorageList();
        this.storageList = res.result || [];
      } catch (e) {
        this.storageList = [];
      }
    },
    getWhere() {
      return { ...this.where };
    },
    search() {
      this.$emit('search', this.getWhere());
    }
  }
};
</script>

<style scoped>
.page-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
}
.label-text {
  font-size: 13px;
  margin-right: 4px;
}
.date-sep {
  margin: 0 4px;
}
.pkg-source-search {
  margin-bottom: 8px;
}
</style>
