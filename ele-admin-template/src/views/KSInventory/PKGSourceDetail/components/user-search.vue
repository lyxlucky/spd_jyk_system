<template>
  <div class="pkg-source-search">
    <span class="page-title">医用耗材器械追溯查询</span>
    <el-form
      inline
      size="mini"
      label-width="auto"
      class="pkg-source-search-form"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="查询条件" class="field-condition-item">
        <el-input
          v-model="where.condition"
          clearable
          placeholder="编码/品名/规格/RFID/UDI/定数码/供应商"
          style="width: 360px"
        />
      </el-form-item>
      <el-form-item label="病患号" class="field-bh-item">
        <el-input
          v-model="where.bhOrYs"
          clearable
          placeholder="请输入病患号"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="上架时间" class="field-date-item">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="仓库" class="field-storage-item">
        <el-select v-model="where.Storage" placeholder="全部" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option v-for="s in storageList" :key="s.ID" :label="s.NAME" :value="String(s.ID)" />
        </el-select>
      </el-form-item>
      <el-form-item class="search-form-actions">
        <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
          查询
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getStorageList } from '@/api/KSInventory/PKGSourceDetail';

export default {
  data() {
    return {
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
  computed: {
    dateRange: {
      get() {
        const { startTime, endTime } = this.where;
        return startTime && endTime ? [startTime, endTime] : null;
      },
      set(val) {
        if (val && val.length === 2) {
          this.where.startTime = val[0];
          this.where.endTime = val[1];
        } else {
          this.where.startTime = '';
          this.where.endTime = '';
        }
      }
    }
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

<style lang="scss" scoped>
.pkg-source-search {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  margin-bottom: 8px;
  overflow-x: auto;
}

.page-title {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.pkg-source-search-form {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.pkg-source-search-form :deep(.el-form-item) {
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 0;
  flex-shrink: 0;
}

.pkg-source-search-form :deep(.el-form-item__label) {
  white-space: nowrap;
  padding-right: 6px;
  float: none;
}

.pkg-source-search-form :deep(.el-form-item__content) {
  display: inline-flex;
  align-items: center;
  line-height: 28px;
  max-width: none;
  flex-shrink: 0;
}

.pkg-source-search-form :deep(.el-input),
.pkg-source-search-form :deep(.el-date-editor),
.pkg-source-search-form :deep(.el-select) {
  flex-shrink: 0;
}
</style>
