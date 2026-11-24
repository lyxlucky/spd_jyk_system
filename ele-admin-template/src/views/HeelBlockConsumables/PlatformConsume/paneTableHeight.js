/** 按所在卡片的剩余高度计算表格高度，分页留在卡片内部 */
export function measureTableHeight(root) {
  if (!root || root.clientHeight < 80) {
    return null;
  }
  const style = window.getComputedStyle(root);
  const pro = root.querySelector('.ele-pro-table');
  if (!pro || pro.classList.contains('ele-pro-table-fullscreen')) {
    if (pro && pro.classList.contains('ele-pro-table-fullscreen')) {
      return null;
    }
    let plainUsed =
      (parseFloat(style.paddingTop) || 0) +
      (parseFloat(style.paddingBottom) || 0);
    let sawTable = false;
    Array.from(root.children).forEach((child) => {
      if (child.classList.contains('el-table')) {
        sawTable = true;
        return;
      }
      const childStyle = window.getComputedStyle(child);
      plainUsed +=
        child.offsetHeight +
        (parseFloat(childStyle.marginTop) || 0) +
        (parseFloat(childStyle.marginBottom) || 0);
    });
    if (!sawTable) {
      return null;
    }
    return Math.max(36, Math.floor(root.clientHeight - plainUsed - 2));
  }
  let used =
    (parseFloat(style.paddingTop) || 0) +
    (parseFloat(style.paddingBottom) || 0);
  Array.from(root.children).forEach((child) => {
    if (child.classList.contains('ele-pro-table')) {
      const tool = child.querySelector('.ele-table-tool');
      const pager = child.querySelector('.el-pagination');
      [tool, pager].forEach((node) => {
        if (!node) {
          return;
        }
        const nodeStyle = window.getComputedStyle(node);
        used +=
          node.offsetHeight +
          (parseFloat(nodeStyle.marginTop) || 0) +
          (parseFloat(nodeStyle.marginBottom) || 0);
      });
    } else {
      const childStyle = window.getComputedStyle(child);
      used +=
        child.offsetHeight +
        (parseFloat(childStyle.marginTop) || 0) +
        (parseFloat(childStyle.marginBottom) || 0);
    }
  });
  return Math.max(36, Math.floor(root.clientHeight - used - 2));
}

export default {
  data() {
    return {
      paneTableHeight: 120
    };
  },
  mounted() {
    this.schedulePaneTableHeight();
    if (typeof ResizeObserver !== 'undefined') {
      this._paneRo = new ResizeObserver(() => this.schedulePaneTableHeight());
      this._paneRo.observe(this.$el);
    }
    window.addEventListener('resize', this.schedulePaneTableHeight);
  },
  beforeDestroy() {
    if (this._paneRo) {
      this._paneRo.disconnect();
    }
    window.removeEventListener('resize', this.schedulePaneTableHeight);
    if (this._paneTimer) {
      cancelAnimationFrame(this._paneTimer);
    }
  },
  methods: {
    schedulePaneTableHeight() {
      if (this._paneTimer) {
        cancelAnimationFrame(this._paneTimer);
      }
      this._paneTimer = requestAnimationFrame(() => this.updatePaneTableHeight(false));
    },
    updatePaneTableHeight(followUp) {
      const next = measureTableHeight(this.$el);
      if (next == null) {
        return;
      }
      if (next !== this.paneTableHeight) {
        this.paneTableHeight = next;
        this.$nextTick(() => {
          const vm = this.$refs.table;
          if (vm && typeof vm.doLayout === 'function') {
            vm.doLayout();
          }
          if (!followUp) {
            this.updatePaneTableHeight(true);
          }
        });
      }
    }
  }
};
