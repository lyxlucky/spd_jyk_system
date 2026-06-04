import { dictDataByTypeCode } from '@/api/system/dict-management';

/**
 * @param {Record<string, any>|null|undefined} obj
 * @param {...string} keys
 */
function pick(obj, ...keys) {
  if (!obj) {
    return undefined;
  }
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (obj[k] !== undefined && obj[k] !== null) {
      return obj[k];
    }
  }
  return undefined;
}

/** 与 Supervise 等页一致的列表解析（ApiResponse 主数据在 data / result） */
function apiListPayload(res) {
  if (!res) {
    return [];
  }
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (Array.isArray(res.result)) {
    return res.result;
  }
  return [];
}

function apiRulesPayload(res) {
  if (!res) {
    return [];
  }
  if (Array.isArray(res.rules)) {
    return res.rules;
  }
  if (Array.isArray(res.Rules)) {
    return res.Rules;
  }
  return [];
}

function getDictTypeRow(merged) {
  if (!merged) {
    return null;
  }
  if (merged.dictType != null) {
    return merged.dictType;
  }
  if (merged.dicttype != null) {
    return merged.dicttype;
  }
  return null;
}

/**
 * @param {Record<string, any>} raw
 */
function normalizeDictItem(raw) {
  const dictValue = String(pick(raw, 'DictValue', 'dictValue') ?? '');
  return {
    dictDataId: pick(raw, 'DictDataId', 'dictDataId'),
    dictTypeId: pick(raw, 'DictTypeId', 'dictTypeId'),
    dictValue,
    dictLabel: pick(raw, 'DictLabel', 'dictLabel') ?? dictValue,
    tagColor: pick(raw, 'TagColor', 'tagColor') ?? '',
    tagEffect: pick(raw, 'TagEffect', 'tagEffect') ?? '',
    listCssClass: pick(raw, 'ListCssClass', 'listCssClass') ?? '',
    extJson: pick(raw, 'ExtJson', 'extJson') ?? '',
    sortNum: Number(pick(raw, 'SortNum', 'sortNum')) || 0,
    status: pick(raw, 'Status', 'status')
  };
}

/** @param {Array<Record<string, any>>} items */
function sortDictItems(items) {
  return [...items].sort((a, b) => {
    if (a.sortNum !== b.sortNum) {
      return a.sortNum - b.sortNum;
    }
    const ida = Number(a.dictDataId) || 0;
    const idb = Number(b.dictDataId) || 0;
    return ida - idb;
  });
}

/**
 * 按类型编码一次拉取多类字典，返回统一 JSON 结构（适合落盘、缓存或组件 props）。
 *
 * @param {string|string[]} typeCodes 字典类型编码，如 `['VARIETY_DOC_TYPE','SUPPLIER_DOC_TYPE']`
 * @param {{
 *   status?: string,
 *   size?: number,
 *   mgmtCatByCode?: Record<string, number>
 * }} [options] mgmtCatByCode：按编码附带管理类别时可返回对应 rules
 * @returns {Promise<{
 *   types: Record<string, {
 *     dictType: {
 *       dictTypeId: any,
 *       dictTypeCode: string,
 *       dictTypeName: string,
 *       remark: any,
 *       status: any,
 *       sortNum: number
 *     }|null,
 *     items: Array<Record<string, any>>,
 *     total: number,
 *     labelByValue: Record<string, string>,
 *     rules?: any[]
 *   }>,
 *   missingTypeCodes: string[]
 * }>}
 */
export async function loadDictTypesBundle(typeCodes, options = {}) {
  const codes = (Array.isArray(typeCodes) ? typeCodes : [typeCodes])
    .map((c) => String(c || '').trim())
    .filter(Boolean);
  const unique = [...new Set(codes)];
  const status = options.status != null ? options.status : '1';
  const size = options.size != null ? options.size : 500;
  const mgmtCatByCode = options.mgmtCatByCode || {};

  const settled = await Promise.allSettled(
    unique.map((code) =>
      dictDataByTypeCode({
        dictTypeCode: code,
        status,
        size,
        mgmtCatCode: mgmtCatByCode[code]
      }).then((merged) => ({ code, merged }))
    )
  );

  /** @type {Record<string, any>} */
  const types = {};
  const missingTypeCodes = [];

  for (let i = 0; i < settled.length; i++) {
    const code = unique[i];
    const s = settled[i];
    if (s.status === 'rejected') {
      types[code] = {
        dictType: null,
        items: [],
        total: 0,
        labelByValue: {},
        error: s.reason && s.reason.message ? String(s.reason.message) : '加载失败'
      };
      missingTypeCodes.push(code);
      continue;
    }

    const { merged } = s.value;
    const dictTypeRow = getDictTypeRow(merged);
    const dictTypeId = dictTypeRow && pick(dictTypeRow, 'DictTypeId', 'dictTypeId');
    const rawList = apiListPayload(merged);
    const items = sortDictItems(rawList.map(normalizeDictItem));

    /** @type {Record<string, string>} */
    const labelByValue = {};
    items.forEach((it) => {
      if (it.dictValue) {
        labelByValue[it.dictValue] = it.dictLabel;
      }
    });

    const rules = apiRulesPayload(merged);
    const totalRaw = pick(merged, 'total', 'Total');
    const total = totalRaw != null && totalRaw !== '' ? Number(totalRaw) : rawList.length;

    const entry = {
      dictType: dictTypeRow
        ? {
            dictTypeId: pick(dictTypeRow, 'DictTypeId', 'dictTypeId'),
            dictTypeCode: pick(dictTypeRow, 'DictTypeCode', 'dictTypeCode') ?? code,
            dictTypeName: pick(dictTypeRow, 'DictTypeName', 'dictTypeName') ?? '',
            remark: pick(dictTypeRow, 'Remark', 'remark'),
            status: pick(dictTypeRow, 'Status', 'status'),
            sortNum: Number(pick(dictTypeRow, 'SortNum', 'sortNum')) || 0
          }
        : null,
      items,
      total,
      labelByValue
    };

    if (rules.length) {
      entry.rules = rules;
    }

    types[code] = entry;

    if (dictTypeId == null || dictTypeId === '') {
      missingTypeCodes.push(code);
    }
  }

  return { types, missingTypeCodes };
}

/**
 * 将 bundle 格式化为 JSON 字符串（默认缩进 2，便于复制/落盘）。
 * @param {Awaited<ReturnType<typeof loadDictTypesBundle>>} bundle
 * @param {number} [space]
 */
export function dictBundleToJson(bundle, space = 2) {
  return JSON.stringify(bundle, null, space);
}

/**
 * @param {Array<Record<string, any>>} items
 * @returns {{ value: string, label: string }[]}
 */
export function dictItemsToSelectOptions(items) {
  return (items || []).map((it) => ({ value: it.dictValue, label: it.dictLabel }));
}

/**
 * @param {Awaited<ReturnType<typeof loadDictTypesBundle>>['types']} typesMap
 * @param {string} typeCode
 * @param {string|number} value
 * @param {string} [fallback]
 */
export function dictLabelByTypeAndValue(typesMap, typeCode, value, fallback = '') {
  const t = typesMap && typesMap[typeCode];
  if (!t || !t.labelByValue) {
    return fallback;
  }
  const key = String(value);
  return t.labelByValue[key] != null ? t.labelByValue[key] : fallback;
}
