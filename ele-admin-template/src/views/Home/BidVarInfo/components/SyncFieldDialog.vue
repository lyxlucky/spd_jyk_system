<template>
  <el-dialog
    title="同步字段"
    :visible="visible"
    width="520px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-checkbox-group v-model="checkedKeys">
      <div v-for="item in options" :key="item.key" class="sync-item">
        <el-checkbox :label="item.key">{{ item.label }}</el-checkbox>
      </div>
    </el-checkbox-group>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { SYNC_FIELD_OPTIONS, emptySyncFields } from '../utils';

export default {
  name: 'SyncFieldDialog',
  props: {
    visible: Boolean,
    loading: Boolean
  },
  data() {
    return {
      options: SYNC_FIELD_OPTIONS,
      checkedKeys: []
    };
  },
  watch: {
    visible(val) {
      if (val) this.checkedKeys = [];
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    confirm() {
      const fields = emptySyncFields();
      this.checkedKeys.forEach((key) => {
        fields[key] = true;
      });
      this.$emit('confirm', fields);
    }
  }
};
</script>

<style scoped>
.sync-item {
  margin-bottom: 10px;
}
</style>
