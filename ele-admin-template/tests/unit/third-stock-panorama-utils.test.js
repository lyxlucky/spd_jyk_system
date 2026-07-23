const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');

const utilsPath = path.resolve(
  __dirname,
  '../../src/views/Inventory/ThirdStockPanorama/utils.js'
);

assert.ok(
  fs.existsSync(utilsPath),
  '三级库全景查询的工具模块应存在'
);

function loadUtils() {
  const source = fs.readFileSync(utilsPath, 'utf8');
  const compiled = transformSync(source, {
    filename: utilsPath,
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-modules-commonjs']
  }).code;
  const module = { exports: {} };
  const execute = new Function('module', 'exports', compiled);
  execute(module, module.exports);
  return module.exports;
}

const {
  buildRelationWhere,
  calcCurrentStock,
  buildFlowWhere,
  formatStorageType,
  isCurrentRequest
} = loadUtils();

assert.strictEqual(
  calcCurrentStock({ KS_QTY: '10', JF_QTY: '-2', JF_DEF_QTY: '-3' }),
  5,
  '当前库存应合并入库、散货计费与定数包计费数量'
);

assert.deepStrictEqual(
  buildFlowWhere(
    {
      DEPT_TWO_CODE: 'D001',
      VARIETIE_CODE_NEW: 'V001',
      CHARGE_CODE: 'C001'
    },
    { startTime: '2026-07-01', endTime: '2026-07-21' }
  ),
  {
    DeptCode: 'D001',
    varCode: 'V001',
    chargingCode: 'C001',
    startTime: '2026-07-01',
    endTime: '2026-07-21'
  },
  '流水查询应固定绑定当前科室、品种与计费编码'
);

assert.strictEqual(
  formatStorageType('-1'),
  '混合入库',
  '同一科室-品种存在多种入库类型时应明确标识为混合入库'
);

assert.deepStrictEqual(
  buildRelationWhere(
    'department',
    { CODE: 'D001' },
    { varName: '注射器', stockZero: '2' }
  ),
  { DeptCode: 'D001', varName: '注射器', stockZero: '2' },
  '按科室选择后应使用科室编码精确查询其品种'
);

assert.deepStrictEqual(
  buildRelationWhere(
    'material',
    { CHARGE_CODE: 'C001' },
    { DeptName: '手术室' }
  ),
  { chargingCode: 'C001', DeptName: '手术室' },
  '按品种选择后应使用计费编码精确查询所在科室'
);

assert.strictEqual(
  isCurrentRequest({
    requestId: 2,
    currentRequestId: 2,
    requestMode: 'department',
    currentMode: 'department',
    requestDimensionCode: 'D001',
    currentDimensionCode: 'D001'
  }),
  true,
  '当前请求可写入对应主维度的结果'
);

assert.strictEqual(
  isCurrentRequest({
    requestId: 1,
    currentRequestId: 2,
    requestMode: 'department',
    currentMode: 'material',
    requestDimensionCode: 'D001',
    currentDimensionCode: 'C001'
  }),
  false,
  '过期请求不能覆盖当前选择的数据'
);

console.log('third-stock-panorama-utils tests passed');
