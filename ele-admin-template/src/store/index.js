/**
 * vuex状态管理
 */
import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
// import createPersisstedState from "vuex-persistedstate";

// 动态加载 modules 目录下的所有 js 文件，自动注册为 vuex 模块
const modules = {};
const files = require.context('./modules', true, /\.js$/);
files.keys().forEach((filePath) => {
  // 提取文件名作为模块名，如 './user.js' -> 'user'
  const moduleName = filePath.replace(/^\.\/(.*)\.js$/, '$1');
  modules[moduleName] = files(filePath).default;
});
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules,
  getters
  // plugins: [createPersisstedState({
  //   storage: window.sessionStorage
  // })]
});
