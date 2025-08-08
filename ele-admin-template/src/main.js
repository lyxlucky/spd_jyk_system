import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import permission from './utils/permission';
import { MAP_KEY, LICENSE_CODE } from '@/config/setting';
import EleAdmin from 'ele-admin';
import VueClipboard from 'vue-clipboard2';
import i18n from './i18n';
import './styles/index.scss';
import '@/assets'; // icon
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import moment from 'moment';
import numeral from 'numeral';
import dateShortcuts from './directives/dateShortcuts';
import { HOME_HP } from '@/config/setting';



Vue.prototype.$HOME_HP = HOME_HP;
Vue.prototype.$numeral = numeral;
// 将 moment 挂载到 Vue 原型上
Vue.prototype.$moment = moment;
//事件总线
export const EventBus = new Vue();
//挂载事件总线
Vue.prototype.$bus = EventBus
Vue.config.productionTip = false;

Vue.use(VueViewer,{
  defaultOptions: {
    zIndex: 9999, // 设置图片预览组件的层级，确保能在其他组件之上
  },
})
Vue.use(EleAdmin, {
  response: {
    dataName: 'list'
  },
  mapKey: MAP_KEY,
  license: LICENSE_CODE,
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(permission);
Vue.use(VueClipboard);

// 注册全局指令
Vue.directive('date-shortcuts', dateShortcuts);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app');
