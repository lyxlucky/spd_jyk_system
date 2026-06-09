import { utils, writeFile } from 'xlsx';
import { HOME_HP } from '@/config/setting';

export const bhInfoHpFlags = {
  isCg: HOME_HP === 'szlh'
};

export function unwrapData(res) {
  return res?.data !== undefined ? res.data : res;
}

export function isOkCode(code) {
  return code === 200 || code === '200';
}

export function formatSendState(state) {
  const map = {
    '0': '未发送(SPD)',
    '1': '已发送(SPD)',
    '2': '已查看(B2B)',
    '3': '处理中(B2B)',
    '4': '部分送货(B2B)',
    '5': '全部送货(B2B)',
    '6': '部分收货(SPD)',
    '7': '全部收货(SPD)',
    '8': '强制结束(SPD)'
  };
  if (state === '' || state == null) return '全部';
  return map[String(state)] || '未知';
}

export function formatApproveState(state) {
  if (String(state) === '0') return '未审批';
  if (String(state) === '1') return '已成功审批';
  return '拒绝审批';
}

export function formatIsCgBh(val) {
  if (String(val) === '0') return '否';
  if (String(val) === '1') return '是';
  return '未设置';
}

export function formatDateTime(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 19);
}

export function formatDate10(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 10);
}

export function centerStockQty(row) {
  return Number(row.DEF_NUM || 0) + Number(row.SH_NUM || 0);
}

export function stockPercent(qty, upper) {
  if (!Number(upper)) return '-';
  return `${((Number(qty) / Number(upper)) * 100).toFixed(2)}%`;
}

export function formatStorehouseLower(val) {
  if (val == null || Number(val) < 0) return 0;
  return val;
}

export function formatPrice(row, isCg = bhInfoHpFlags.isCg) {
  const price = isCg ? row.Purchase_Price : row.supply_price;
  if (price == null || price === '') return '';
  return parseFloat(price).toFixed(4);
}

export function isContractNearExpiry(dateStr) {
  if (!dateStr) return false;
  const date = new Date(String(dateStr).substr(0, 10)).getTime();
  if (Number.isNaN(date)) return false;
  return date < Date.now() + 86400000 * 90;
}

export function formatContractType(type) {
  return String(type) === '2' ? '临采' : '中标';
}

const EXPORT_HEADERS = [
  '是否常备',
  '品种编码',
  '品种名称',
  '规格型号',
  '生产厂家',
  '注册证号',
  '启用合同供应商',
  '合同结束日期同供应商',
  '近三个月用量',
  '月均用量',
  '周均用量',
  '中心库存量',
  '%',
  '二级库存量',
  '%',
  '库存上限',
  '库存下限',
  '中包装数',
  '中包装单位',
  '大包装数',
  '大包装单位',
  '未到货最后一次下计划数量',
  '未到货最后一次下计划时间',
  '发送状态',
  '备注'
];

export function exportBhInfoExcel(rows) {
  const data = [EXPORT_HEADERS];
  (rows || []).forEach((row) => {
    const centerQty = centerStockQty(row);
    data.push([
      formatIsCgBh(row.IS_CG_BH),
      row.VARIETIE_CODE_NEW,
      row.VARIETIE_NAME,
      row.SPECIFICATION_OR_TYPE,
      row.MANUFACTURING_ENT_NAME,
      row.APPROVAL_NUMBER,
      row.SUPPLIER_NAME,
      row.CONTRACT_END_TIME,
      row.USED_QTY,
      row.YUE_USED_QTY,
      row.ZHOU_USED_QTY,
      centerQty,
      stockPercent(centerQty, row.STOREHOUSE_UPPPER),
      row.DEPT_NUM,
      stockPercent(row.DEPT_NUM, row.STOREHOUSE_UPPPER),
      row.STOREHOUSE_UPPPER,
      formatStorehouseLower(row.STOREHOUSE_LOWER),
      row.MIDDLE_PACKAGE_COUNT,
      row.MIDDLE_PACKAGE_UNIT,
      row.BIG_BOX_COUNT,
      row.BIG_BOX_UNIT,
      row.STOCK_UP_PLAN_GOODS_QUANTITY,
      row.CREATE_TIME,
      formatSendState(row.SEND_STATE),
      row.BHFX_REMARKS
    ]);
  });
  const sheet = utils.aoa_to_sheet(data);
  writeFile({ SheetNames: ['品种备货分析'], Sheets: { 品种备货分析: sheet } }, '品种备份分析.xlsx');
}

/** 构建生成备货弹窗的供应商/品种结构 */
export function buildStockUpSuppliers(monitorRows, creator) {
  const suppliers = [];
  (monitorRows || []).forEach((item) => {
    if (!canAddSupplier(suppliers, item.Supplier_Code, item.StorageID)) {
      return;
    }
    suppliers.push({
      Supplier_Name: item.Supplier_Name,
      Supplier_Code: item.Supplier_Code,
      StorageID: item.StorageID,
      Name: item.Name,
      Creator: creator,
      listVarietie: []
    });
  });
  suppliers.forEach((sup, supIndex) => {
    (monitorRows || []).forEach((item, itemIndex) => {
      if (
        sup.Supplier_Code !== item.Supplier_Code ||
        String(sup.StorageID) !== String(item.StorageID)
      ) {
        return;
      }
      const planNo =
        item.List?.length > 0
          ? String(item.List[0].PlanNmm).split('|')[0].split(',')[0]
          : '';
      sup.listVarietie.push({
        Stock_Up_Plan_No: planNo,
        List: item.List || [],
        Varietie_Code: item.Varietie_Code,
        Coefficient: item.Def_No_Pkg_Coefficient,
        Arg_Plan: item.Arg_Plan,
        Goods_Qty: item.Goods_Qty,
        Supplier_Name: item.Supplier_Name,
        Supplier_Code: item.Supplier_Code,
        Supply_Price: item.Supply_Price,
        Contract_Code: item.Contract_Code,
        varietie_Code_New: item.varietie_Code_New,
        Varietie_Name: item.Varietie_Name,
        Specification_Or_Type: item.Specification_Or_Type,
        Unit: item.Unit,
        Def_No_Pkg_Coefficient: item.Def_No_Pkg_Coefficient,
        EnableVarietie: item.EnableVarietie,
        EnableContract: item.EnableContract,
        Purchase_Price: item.Purchase_Price,
        Manufacturing_Ent_Name: item.Manufacturing_Ent_Name,
        ID: `${supIndex}-${itemIndex}`,
        CONTRACT_END_TIME: item.CONTRACT_END_TIME,
        DET_CONTRACT_END: item.DET_CONTRACT_END,
        CONTRACT_TYPE: item.CONTRACT_TYPE,
        LC_USE_NUM: item.LC_USE_NUM,
        LC_NUM: item.LC_NUM
      });
    });
  });
  return suppliers;
}

function canAddSupplier(list, supplierCode, storageId) {
  return !list.some(
    (s) => s.Supplier_Code === supplierCode && String(s.StorageID) === String(storageId)
  );
}

/** 构建 InsertNewInfo 提交体 */
export function buildInsertNewInfoPayload(checkedSuppliers, allSuppliers) {
  const postData = [];
  checkedSuppliers.forEach((checked) => {
    const source = allSuppliers.find(
      (s) =>
        s.Supplier_Code === checked.Supplier_Code &&
        String(s.StorageID) === String(checked.StorageID)
    );
    if (!source) return;
    const item = {
      Supplier_Name: source.Supplier_Name,
      Supplier_Code: source.Supplier_Code,
      StorageID: source.StorageID,
      Creator: source.Creator,
      listVarietie: (source.listVarietie || []).map((v) => ({
        Stock_Up_Plan_No: v.Stock_Up_Plan_No,
        Varietie_Code: v.Varietie_Code,
        Arg_Plan: v.Arg_Plan,
        Goods_Plan: v.Goods_Qty,
        Supplier_Name: v.Supplier_Name,
        Supplier_Code: v.Supplier_Code,
        Supply_Price: v.Supply_Price,
        Contract_Code: v.Contract_Code,
        Coefficient: v.Coefficient,
        Purchase_Price: v.Purchase_Price
      }))
    };
    postData.push(item);
  });
  return postData;
}

export function parsePlanNoOptions(listItem) {
  if (!listItem?.List?.length) return [];
  const planNmm = listItem.List[0].PlanNmm || '';
  return String(planNmm)
    .split('|')
    .filter(Boolean)
    .map((part) => part.split(',')[0]);
}
