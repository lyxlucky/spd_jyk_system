export default {
  namespaced: true,
  state: {
    // 绑定设备
    bindMachine: '',
  },
  mutations: {
    // 设置登录用户的信息
    setBindMachine(state, payload) {
      state.bindMachine = payload;
    },
  },
  actions: {
  }
};
