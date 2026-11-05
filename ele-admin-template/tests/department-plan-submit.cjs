// Run with NODE_PATH pointing to this application's installed node_modules.
// Mounts the page, real detail/search components and API serializer. HTTP is the boundary.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const jsdom = require('jsdom');
const dom = jsdom.JSDOM ? new jsdom.JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' })
  : { window: jsdom.jsdom('<!doctype html><html><body></body></html>', { url: 'http://localhost' }).defaultView };
dom.window.SVGElement = dom.window.SVGElement || function SVGElement() {};
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
const storage = { getItem: () => 'test-token', setItem() {} };
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
Object.assign(global, { window: dom.window, document: dom.window.document,
  Element: dom.window.Element, HTMLElement: dom.window.HTMLElement,
  sessionStorage: dom.window.sessionStorage || storage, localStorage: dom.window.localStorage || storage });
const Vue = require('vue');
const compiler = require('vue-template-compiler');
const babel = require('@babel/core');
Vue.use(require('element-ui'));
Vue.config.productionTip = false;
Vue.directive('permission', {});
Vue.prototype.$hasPermission = () => false;
Vue.prototype.$messageLoading = () => ({ close() {} });
Vue.prototype.$moment = require('moment');
Vue.prototype.$numeral = require('numeral');
let home = 'se2';
let rows, calls, invalid, commitInvalid;
const store = { state: { theme: {}, user: { info: { DeptNow: { Dept_Two_Code: 'LOGIN' }, userDept: [], permission_group: [] } } } };
Vue.prototype.$store = store;
const empty = { render(h) { return h('span'); } };
const mainTable = { mounted() { this.$emit('getCurrent', { PlanNum: 'TEST-PLAN', State: '0' }); },
  methods: { reload2() {} }, render(h) { return h('span'); } };
const request = {
  async get(url, options) {
    calls.push({ url, data: options.params });
    if (url.endsWith('/SerachPlanListDeta')) {
      const p = options.params;
      const result = p.size > 100 ? rows : rows.slice((p.page - 1), p.page);
      return { data: { code: 200, result: JSON.parse(JSON.stringify(result)), total: rows.length, sumNumber: 3, sumAount: 3 } };
    }
    return { data: { code: 200, result: [] } };
  },
  async post(url, body) {
    const data = Object.fromEntries(body.entries());
    calls.push({ url, data });
    if (url.endsWith('/PutInListDeta') && data.submitSource === 'KSDepartmentalPlan') {
      if (invalid || (data.phase === 'commit' && commitInvalid)) return { data: { code: '400', msg: '存在二级科室目录外物料', catalogErrors: invalid || commitInvalid, result: '', total: 0 } };
      return { data: { code: '200', msg: '成功', hasZero: JSON.parse(data.json).some(x => Number(x.APPLY_QTY) === 0) } };
    }
    return { data: { code: url.endsWith('/isHaveZeroDel') ? '400' : '200', msg: '成功' } };
  }
};
Vue.component('ele-pro-table', {
  props: ['datasource'], data: () => ({ list: [], page: 1, where: {} }),
  methods: {
    async reload(options = {}) { this.where = options.where || this.where; this.page = options.page || this.page;
      const result = await this.datasource({ page: this.page, limit: 1, where: this.where, order: {} }); this.list = result.list; },
    doRequest(fn) { return fn({ where: this.where, order: {} }); }
  },
  render(h) { return h('div', [h('button', { attrs: { 'data-next': '' }, on: { click: () => this.reload({ page: 2 }) } }, '下一页'),
    ...this.list.map(row => h('div', { attrs: { 'data-row': row.ID } }, this.$scopedSlots.PlanQty({ row }))) ]); }
});
const sourceRoot = path.resolve(__dirname, '../src');
function loader() {
  const cache = new Map();
  function load(filename) {
    if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.js');
    filename = filename.endsWith('.vue') || filename.endsWith('.js') ? filename : fs.existsSync(filename + '.js') ? filename + '.js' : filename + '.vue';
    if (cache.has(filename)) return cache.get(filename);
    const source = fs.readFileSync(filename, 'utf8');
    const sfc = filename.endsWith('.vue') ? compiler.parseComponent(source) : null;
    const code = babel.transformSync(sfc ? sfc.script.content : source, { babelrc: false, configFile: false,
      plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')] }).code;
    const module = { exports: {} };
    function localRequire(id) {
      if (id === '@/config/setting') return { HOME_HP: home, TOKEN_STORE_NAME: 'token' };
      if (id === '@/utils/request') return request;
      if (id === '@/store') return store;
      if (id.includes('KSDepartmentalPlan-table1')) return mainTable;
      const actual = ['KSDepartmentalPlanDetails-table2', 'KSDepartmentalPlanDetails-search', '@/api/KSInventory/KSDepartmentalPlan', '@/utils/formdataify', '../utils'];
      if (actual.some(x => id.includes(x))) return load(id.startsWith('@/') ? path.join(sourceRoot, id.slice(2)) : path.resolve(path.dirname(filename), id));
      if (id.startsWith('.') || id.startsWith('@/')) return new Proxy(empty, { get: (target, key) => key in target ? target[key] : () => {} });
      return require(id);
    }
    vm.runInThisContext('(function(require,module,exports){' + code + '\n})', { filename })(localRequire, module, module.exports);
    if (sfc) Object.assign(module.exports.default, compiler.compileToFunctions(sfc.template.content));
    cache.set(filename, module.exports);
    return module.exports;
  }
  return load;
}
const settle = async () => { for (let i = 0; i < 12; i++) { await new Promise(r => setImmediate(r)); await Vue.nextTick(); } };
function button(text) { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === text); assert.ok(b, 'button ' + text); return b; }
async function mount(count = 2) {
  calls = []; rows = Array.from({ length: count }, (_, index) => index + 1).map(n => ({ ID: String(n), PlanNum: 'TEST-PLAN', VarID: 'V' + n, VarCode: 'C' + n,
    VarName: '物料' + n, GG: '规格' + n, PlanQty: '1', DTL_IS_DELETE: '1' }));
  const component = loader()(path.join(sourceRoot, 'views/KSInventory/KSDepartmentalPlan/index.vue')).default;
  const instance = new Vue(component).$mount(); document.body.appendChild(instance.$el); await settle(); return instance;
}
async function edit(id, quantity) {
  const input = document.querySelector(`[data-row="${id}"] input`); assert.ok(input, 'quantity editor');
  input.value = quantity; input.dispatchEvent(new window.Event('input', { bubbles: true }));
  input.dispatchEvent(new window.Event('change', { bubbles: true })); await settle();
}
(async () => {
  invalid = [{ VarCode: 'C1', VarName: '物料1', GG: '规格1' }, { VarCode: 'C2', VarName: '物料2', GG: '规格2' }];
  let page = await mount();
  await edit('1', '8');
  assert.equal(calls.filter(c => c.url.endsWith('/upPlanListDelCount')).length, 0, 'editing a draft remains local until Save or Save and Submit');
  document.querySelector('[data-next]').click(); await settle(); await edit('2', '9');
  button('保存并提交').click(); await settle();
  const dialog = [...document.querySelectorAll('[role="dialog"]')].find(x => x.textContent.includes('二级科室目录'));
  assert.ok(dialog, 'blocking catalog dialog');
  for (const text of ['C1', 'C2', '物料1', '物料2', '规格1', '规格2']) assert.ok(dialog.textContent.includes(text), text);
  assert.equal(calls.filter(c => c.url.endsWith('/KeeptListDeta') || c.url.endsWith('/deleteZeroDel')).length, 0, 'catalog failure does not write');
  assert.equal(document.querySelector('[data-row="2"] input').value, '9', 'failed submission retains edits');
  const sent = calls.find(c => c.data.submitSource === 'KSDepartmentalPlan');
  assert.deepEqual(JSON.parse(sent.data.json).map(x => x.APPLY_QTY), ['8', '9'], 'all pages use current edits');
  page.$destroy(); document.body.innerHTML = '';
  console.log('PASS: mounted page preserves cross-page edits and blocks without save on complete catalog error');

  invalid = null;
  page = await mount();
  await edit('1', '6');
  button('保存并提交').click(); button('保存并提交').click(); await settle();
  let commits = calls.filter(c => c.data.phase === 'commit');
  assert.equal(commits.length, 1, 'repeat clicks submit once');
  assert.deepEqual(JSON.parse(commits[0].data.json).map(x => x.APPLY_QTY), ['6', '1']);
  assert.equal(calls.filter(c => c.url.endsWith('/KeeptListDeta')).length, 0, 'save and submit uses atomic operation');
  page.$destroy(); document.body.innerHTML = '';
  console.log('PASS: legal full-page submission saves edits through one atomic commit');

  page = await mount();
  await edit('1', '0');
  button('保存并提交').click(); await settle();
  assert.equal(calls.filter(c => c.data.phase === 'commit').length, 0, 'zero quantity waits for confirmation');
  assert.ok(document.body.textContent.includes('存在申领数量为0的明细'));
  commitInvalid = [{ VarCode: 'C2', VarName: '物料2', GG: '规格2' }];
  button('剔除并提交').click(); await settle();
  commits = calls.filter(c => c.data.phase === 'commit');
  assert.equal(commits.length, 1);
  assert.equal(commits[0].data.removeZero, 'true');
  assert.equal(calls.filter(c => c.url.endsWith('/deleteZeroDel')).length, 0, 'zero deletion is never a separate write');
  assert.equal(document.querySelector('[data-row="1"] input').value, '0', 'final catalog rejection retains edited zero');
  assert.ok(document.body.textContent.includes('二级科室目录校验未通过'));
  page.$destroy(); document.body.innerHTML = '';
  commitInvalid = null;
  console.log('PASS: zero confirmation and final catalog rejection retain edits without separate deletion');

  invalid = [{ VarCode: 'C1', VarName: '物料1', GG: '规格1' }];
  page = await mount(); await edit('1', '7');
  document.querySelector('[data-next]').click(); await settle(); await edit('2', '8');
  button('暂存申领单').click(); await settle();
  const saved = calls.find(c => c.url.endsWith('/KeeptListDeta'));
  assert.ok(saved, 'standalone draft save remains available outside catalog');
  assert.deepEqual(JSON.parse(saved.data.json).map(x => x.APPLY_QTY), ['7', '8']);
  assert.equal(calls.filter(c => c.data.submitSource).length, 0);
  page.$destroy(); document.body.innerHTML = '';
  console.log('PASS: standalone draft saves cross-page edits without directory restriction');

  invalid = null;
  page = await mount(901); await edit('1', '4');
  button('保存并提交').click(); await settle();
  const largeCommit = calls.find(c => c.data.phase === 'commit');
  assert.ok(largeCommit, 'large whole-order submit reaches atomic public request');
  const largeDetails = JSON.parse(largeCommit.data.json);
  assert.equal(largeDetails.length, 901, 'all 901 details included across server batch boundary');
  assert.equal(largeDetails[0].APPLY_QTY, '4', 'large order retains local edit');
  assert.equal(largeDetails[900].VARIETIE_CODE, 'V901', 'last detail is retained');
  assert.equal(largeDetails[900].APPLY_QTY, '1');
  page.$destroy(); document.body.innerHTML = '';
  console.log('PASS: 901-detail page submits every row across the server validation batch boundary');

  home = 'other-hospital';
  page = await mount(); await edit('1', '5');
  assert.equal(calls.filter(c => c.url.endsWith('/upPlanListDelCount')).length, 1, 'other hospital retains immediate quantity update');
  button('保存并提交').click(); await settle();
  assert.ok(calls.some(c => c.url.endsWith('/KeeptListDeta')));
  assert.equal(calls.filter(c => c.data.submitSource).length, 0, 'other hospital retains legacy submit contract');
  page.$destroy(); document.body.innerHTML = '';
  console.log('PASS: other hospital keeps legacy quantity and submission behavior');
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => setTimeout(() => process.exit(process.exitCode || 0), 30));
