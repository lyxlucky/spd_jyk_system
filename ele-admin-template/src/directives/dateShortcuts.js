export const DATE_SHORTCUTS = [
  {
    text: '今天',
    onClick(picker) {
      const today = new Date();
      picker.$emit('pick', [today, today]);
    }
  },
  {
    text: '最近三天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
      picker.$emit('pick', [start, end]);
    }
  },
  {
    text: '最近一周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      picker.$emit('pick', [start, end]);
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
      picker.$emit('pick', [start, end]);
    }
  }
];

export default {
  inserted(el, binding, vnode) {
    const datePicker = el.__vue__;
    if (datePicker) {
      // 设置日期选择器的所有配置
      Object.assign(datePicker, {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'yyyy-MM-dd',
        pickerOptions: {
          shortcuts: DATE_SHORTCUTS
        }
      });
    }
  }
}; 