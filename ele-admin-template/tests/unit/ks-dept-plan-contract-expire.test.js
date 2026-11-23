const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');
const moment = require('moment');

function loadUtils() {
  const filename = path.resolve(
    __dirname,
    '../../src/views/KSInventory/KSDepartmentalPlan/utils.js'
  );
  const compiled = transformSync(fs.readFileSync(filename, 'utf8'), {
    filename,
    cwd: path.resolve(__dirname, '../..'),
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-modules-commonjs']
  }).code;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(
    (name) => {
      if (name === 'moment') return moment;
      if (name === '@/store') return {};
      if (name === '@/config/setting') return { BACK_BASE_URL: '', HOME_HP: 'test' };
      throw new Error(`Unexpected module: ${name}`);
    },
    module,
    module.exports
  );
  return module.exports;
}

const {
  CONTRACT_EXPIRE_DAYS_CONFIG_KEY,
  parseContractExpireDays,
  collectContractExpireWarnLines
} = loadUtils();

assert.strictEqual(
  CONTRACT_EXPIRE_DAYS_CONFIG_KEY,
  'APPLY_PLAN_CONTRACT_EXPIRE_DAYS'
);

// 1. parseContractExpireDays: 0 / 空 / 负数 / 非法值均返回 0（不判断）
assert.strictEqual(parseContractExpireDays('0'), 0);
assert.strictEqual(parseContractExpireDays(0), 0);
assert.strictEqual(parseContractExpireDays(''), 0);
assert.strictEqual(parseContractExpireDays(null), 0);
assert.strictEqual(parseContractExpireDays(undefined), 0);
assert.strictEqual(parseContractExpireDays('-5'), 0);
assert.strictEqual(parseContractExpireDays('abc'), 0);
assert.strictEqual(parseContractExpireDays(' 30 '), 30);
assert.strictEqual(parseContractExpireDays('60.9'), 60);

const now = '2026-11-23';
const sampleRows = [
  {
    VarName: '已过期品种',
    VarCode: 'V001',
    GG: '10ml',
    Manufacturing: '厂家A',
    PlanQty: '2',
    DTL_IS_DELETE: '1',
    DET_CONTRACT_END: '2026-11-20'
  },
  {
    VarName: '今日到期品种',
    VarCode: 'V002',
    GG: '20ml',
    Manufacturing: '厂家B',
    PlanQty: 1,
    DTL_IS_DELETE: 1,
    DET_CONTRACT_END: '2026-11-23'
  },
  {
    VarName: '30天内到期品种',
    VarCode: 'V003',
    GG: '30ml',
    Manufacturing: '厂家C',
    PlanQty: 5,
    DTL_IS_DELETE: '1',
    DET_CONTRACT_END: '2026-12-23'
  },
  {
    VarName: '31天到期品种',
    VarCode: 'V004',
    GG: '40ml',
    Manufacturing: '厂家D',
    PlanQty: 3,
    DTL_IS_DELETE: '1',
    DET_CONTRACT_END: '2026-12-24'
  },
  {
    VarName: '已剔除品种',
    VarCode: 'V005',
    GG: '50ml',
    Manufacturing: '厂家E',
    PlanQty: 2,
    DTL_IS_DELETE: '0',
    DET_CONTRACT_END: '2026-11-01'
  },
  {
    VarName: '数量为0品种',
    VarCode: 'V006',
    GG: '60ml',
    Manufacturing: '厂家F',
    PlanQty: 0,
    DTL_IS_DELETE: '1',
    DET_CONTRACT_END: '2026-11-01'
  },
  {
    VarName: '仅主合同到期品种',
    VarCode: 'V007',
    GG: '70ml',
    Manufacturing: '厂家G',
    PlanQty: 1,
    DTL_IS_DELETE: '1',
    DET_CONTRACT_END: '',
    CONTRACT_END_TIME: '2026-12-03'
  }
];

// 2. 配置为 0 时不判断，返回空数组
assert.deepStrictEqual(collectContractExpireWarnLines(sampleRows, 0, now), []);
assert.deepStrictEqual(collectContractExpireWarnLines(sampleRows, '0', now), []);

// 3. 配置为 30 天时命中已过期、今日到期、30天内及主合同兜底，排除 31天/已剔除/数量0
const result30 = collectContractExpireWarnLines(sampleRows, 30, now);
assert.deepStrictEqual(
  result30.map((r) => ({
    VarID: r.VarID,
    expired: r.expired,
    remainText: r.remainText
  })),
  [
    { VarID: 'V001', expired: true, remainText: '已过期' },
    { VarID: 'V002', expired: false, remainText: '今日到期' },
    { VarID: 'V003', expired: false, remainText: '快到期(剩30天)' },
    { VarID: 'V007', expired: false, remainText: '快到期(剩10天)' }
  ]
);

// 4. 配置为 45 天时包含 31 天到期的品种
const result45 = collectContractExpireWarnLines(sampleRows, '45', now);
assert.strictEqual(result45.length, 5);
assert.strictEqual(result45[3].VarID, 'V004');
assert.strictEqual(result45[3].remainText, '快到期(剩31天)');

console.log('ks-dept-plan-contract-expire.test.js passed');
