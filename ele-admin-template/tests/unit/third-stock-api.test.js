const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');

const apiPath = path.resolve(
  __dirname,
  '../../src/api/Inventory/ThreeLevelDbBD/index.js'
);

function loadApi() {
  const source = fs.readFileSync(apiPath, 'utf8');
  const compiled = transformSync(source, {
    filename: apiPath,
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-modules-commonjs']
  }).code;
  const module = { exports: {} };
  const execute = new Function('require', 'module', 'exports', compiled);
  execute(
    (name) => {
      if (name === '@/utils/request') return {};
      if (name === '@/config/setting') return { TOKEN_STORE_NAME: 'token' };
      throw new Error(`Unexpected module: ${name}`);
    },
    module,
    module.exports
  );
  return module.exports;
}

const { buildThirdStockInfoRequest } = loadApi();
const requestData = buildThirdStockInfoRequest(
  {
    page: 2,
    limit: 50,
    queryMode: 'department',
    where: {
      DeptCode: 'D001',
      DeptName: '手术室',
      varName: '注射器'
    }
  },
  'test-token'
);

assert.strictEqual(
  requestData.DeptCode,
  'D001',
  '科室主从查询必须把选中科室编码提交给后端'
);

assert.strictEqual(requestData.Token, 'test-token');
assert.strictEqual(requestData.page, 2);
assert.strictEqual(requestData.size, 50);

console.log('third-stock-api tests passed');
