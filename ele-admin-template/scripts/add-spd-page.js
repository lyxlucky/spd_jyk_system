const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../src/views');
const pages = [
  'Inventory/NewTemporaryRepositoryQuery',
  'Home/HerpJfDept',
  'Home/Department',
  'Home/BatchOutage',
  'Home/AUpDownKsQuery',
  'Home/ManufacturingMaintain',
  'Inventory/ReviseManagement',
  'Settle/MensualBills',
  'Settle/NissinBills',
  'Settle/PrintUseDeptTwo',
  'Settle/HishedgingData',
  'KSInventory/KSConsumeQueryTemp',
  'KSInventory/FinancialAudit',
  'Inventory/CentreBankTakeGoods',
  'Task/AuthOrder',
  'Task/FollowingGoodsPlan',
  'Inventory/PickingMnagement',
  'Inventory/CentralinventoryMonitoring',
  'KSInventory/DeptPlannedDeliveryNew',
  'Task/BuyBack',
  'Task/SectionRejected',
  'Task/CentralinventoryPackage',
  'Task/BhInfo',
  'UserManage/UMUsers',
  'UserManage/UMPDA',
  'UserManage/UMGroups',
  'UserManage/UMPermissions',
  'Home/VarPriceRecode',
  'TraceSource/VarPriceRecode',
  'KSInventory/PKGSourceDetail',
  'TraceSource/PKGSourceDetail',
  'Statistics/EffectiveTip',
  'Statistics/EffectiveTipWinShow',
  'Inventory/VwHptx',
  'Inventory/TertiaryInventory',
  'Inventory/ThirdInventoryQuery',
  'Inventory/picVarCode',
  'KSInventory/NoMoveSell',
  'KSInventory/Stockmaintenance',
  'Inventory/Snapshot',
  'Statistics/VarUseStatistics',
  'Home/PrchaseDataV2',
  'Statistics/DeptUseCountStatistics',
  'Statistics/DeptAnalysisStatistical',
  'Statistics/MaterialStatistics',
  'Statistics/RegistrationLimitPlan',
  'Home/YgVarInfo',
  'Home/YgPlatView',
  'Home/YgPlatReceivGoods',
  'Statistics/YGCGPlatform',
  'Home/BidVarInfo',
  'Home/VarietieVarJC',
  'Home/VarietyDataLzhAudit',
  'Home/YGPT',
  'Home/Supplier',
  'Home/Contract',
  'Home/StockTransfer',
  'Home/HealthInsuranceDirectory',
  'Home/YgVarClSm',
  'Home/YgVarClLookSm',
  'KSInventory/GyClmlSpd',
  'KSInventory/HighValueConsumables'
];

let count = 0;
for (const p of pages) {
  const file = path.join(root, ...p.split('/'), 'index.vue');
  if (!fs.existsSync(file)) {
    console.log('skip missing', p);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('spd-page')) continue;
  if (!/class="ele-body/.test(content)) continue;
  content = content.replace(/class="ele-body([^"]*)"/, (match, rest) => {
    if (rest.includes('spd-page')) return match;
    return `class="ele-body spd-page${rest}"`;
  });
  fs.writeFileSync(file, content);
  count += 1;
  console.log('updated', p);
}
console.log('total updated:', count);
