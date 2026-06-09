<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="360px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-form label-width="100px" size="small">
      <el-form-item label="科室库区">
        <el-select v-model="regionCode" style="width: 100%">
          <el-option
            v-for="item in regionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { DEPT_REGION_OPTIONS } from '../utils';

export default {
  name: 'DeptRegionDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '选择科室库区' }
  },
  data() {
    return {
      regionCode: DEPT_REGION_OPTIONS[0]?.value || '',
      regionOptions: DEPT_REGION_OPTIONS
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.regionCode = DEPT_REGION_OPTIONS[0]?.value || '';
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    handleConfirm() {
      this.$emit('confirm', this.regionCode);
      this.updateVisible(false);
    }
  }
};
</script>
