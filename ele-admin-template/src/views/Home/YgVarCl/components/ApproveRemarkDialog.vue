<template>
  <el-dialog
    title="审核意见"
    :visible="visible"
    width="620px"
    append-to-body
    @update:visible="updateVisible"
    @open="onOpen"
  >
    <p class="history-tip">历史审核意见（仅本人·本审核环节）</p>
    <el-select
      v-model="historyIndex"
      style="width: 100%; margin-bottom: 8px"
      placeholder="无历史意见"
      :disabled="!historyOptions.length"
      @change="onHistoryChange"
    >
      <el-option
        v-for="(item, index) in historyOptions"
        :key="index"
        :label="item.label"
        :value="index"
      />
    </el-select>
    <el-input v-model="value" type="textarea" :rows="12" />
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getMyYbSpMarkHistory } from '@/api/Home/YgVarCl';

export default {
  name: 'ApproveRemarkDialog',
  props: {
    visible: Boolean,
    loading: Boolean,
    approveType: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      value: '',
      historyIndex: '',
      historyOptions: [],
      historyFulltexts: []
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.value = '';
        this.historyIndex = '';
        this.historyOptions = [];
        this.historyFulltexts = [];
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    async onOpen() {
      this.value = '';
      this.historyIndex = '';
      this.historyOptions = [];
      this.historyFulltexts = [];
      try {
        const list = await getMyYbSpMarkHistory(this.approveType);
        const texts = (list || []).filter((t) => t != null && t !== '').map(String);
        this.historyFulltexts = texts;
        this.historyOptions = texts.map((text) => ({
          label: text.length > 80 ? `${text.substring(0, 80)}…` : text
        }));
        if (texts.length) {
          this.historyIndex = 0;
          this.value = texts[0];
        }
      } catch (e) {
        this.historyOptions = [];
        this.historyFulltexts = [];
      }
    },
    onHistoryChange(index) {
      if (index === '' || index == null) return;
      const text = this.historyFulltexts[index];
      if (text !== undefined) this.value = text;
    },
    confirm() {
      this.$emit('confirm', this.value ?? '');
    }
  }
};
</script>

<style scoped>
.history-tip {
  margin: 0 0 6px;
  color: #666;
  font-size: 12px;
}
</style>
