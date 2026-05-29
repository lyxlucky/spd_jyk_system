/** AI 资质审核展示文案（Laboratory_web / picVarCode 共用，对齐遴选项目中文展示） */



export const PIC_TYPE_LABELS = {

  1: '品种注册证',

  2: '品种说明书',

  3: '品种包装',

  4: '品种授权书',

  5: '厂家营业执照',

  6: '厂家生产许可证',

  11: '经营许可证',

  12: '二类备案',

  13: '营业执照'

};



/** 字段键 → 中文（列表/详情兜底，中台 label 优先） */

export const FIELD_LABEL_ZH = {

  filing_number: '备案号',

  company_name: '企业名称',

  product_name: '产品名称',

  expire_date: '有效期至',
  establishment_date: '成立日期',
  has_business_term: '是否有营业期限',
  business_term_start: '营业期限起',
  business_term_end: '营业期限止',

  approval_number: '注册证编号',

  registrant: '注册人',

  credit_code: '统一社会信用代码',

  unified_social_credit_code: '统一社会信用代码',

  license_number: '许可证编号',

  license_or_cert_no: '证照编号',

  business_scope: '许可/经营范围',

  issue_date: '备案日期',

  approval_date: '批准日期',

  model_spec: '型号规格',

  specifications: '规格型号',

  manufacturer: '生产企业',

  authorizer: '授权方',

  authorizee: '被授权方',

  auth_scope: '授权范围',

  scope_of_application: '适用范围',

  legal_representative: '法定代表人',

  has_official_seal: '是否加盖公章',

  has_approval_seal: '注册专用章',

  document_integrity: '版式与可读性',

  varPicValidStart: '系统开始日期',
  varPicValidEnd: '系统到期日期',
  approvalNumber: '系统注册证编号',
  manufacturingEntName: '系统生产企业',
  varietieName: '系统品种名称',
  supplierName: '系统供应商名称',
  supplierSocialCreditCode: '系统统一社会信用代码',
  licenseTermTypeLabel: '营业期限类型'

};



export function picTypeLabel(type) {

  return PIC_TYPE_LABELS[type] || PIC_TYPE_LABELS[String(type)] || type || '—';

}



export function aiStatusLabel(s, textFromApi) {

  if (textFromApi) return textFromApi;

  const map = {

    none: '未发起',

    pending: '审核中',

    running: '处理中',

    processing: '处理中',

    ocr: '文档识别中',

    rule_check: '规则校验中',

    ai_review: 'AI 归纳中',

    done: '已完成',

    failed: '审核失败'

  };

  return map[s] || (s ? s : '未审核');

}



export function aiStatusTagType(s) {

  if (s === 'done') return 'success';

  if (s === 'pending' || s === 'running' || s === 'processing' || s === 'ocr' || s === 'rule_check' || s === 'ai_review') return 'warning';

  if (s === 'failed') return 'danger';

  return 'info';

}



export function autoOutcomeLabel(o, textFromApi) {

  if (textFromApi) return textFromApi;

  if (o === 'passed') return '建议通过';

  if (o === 'manual_review') return '建议人工复核';

  if (o === 'rejected') return '建议驳回';

  return o ? '待确认' : '—';

}



export function autoOutcomeTagType(o) {

  if (o === 'passed') return 'success';

  if (o === 'manual_review') return 'warning';

  if (o === 'rejected') return 'danger';

  return 'info';

}



export function autoOutcomeAlertType(o) {

  const t = autoOutcomeTagType(o);

  if (t === 'success') return 'success';

  if (t === 'danger') return 'error';

  if (t === 'warning') return 'warning';

  return 'info';

}



/** 品种资质列表：招采审批 STATE */
export function procureStateLabel(state) {
  const s = state == null || state === '' ? null : String(state);
  if (s === '0') return '新增';
  if (s === '1') return '已审批';
  if (s === '2') return '审批未通过';
  return state || '—';
}

/** 品种资质列表：SPD 审核 SPD_SP_STATE（空值未审，勿与 0 混显） */
export function spdSpStateLabel(spdState) {
  if (spdState == null || spdState === '') return '—';
  const s = String(spdState);
  if (s === '0') return '待审核';
  if (s === '1') return '已审核';
  if (s === '2') return '审核未通过';
  return s;
}

export function riskLevelLabel(l, textFromApi) {

  if (textFromApi) return textFromApi;

  const map = { low: '低', medium: '中', high: '高' };

  return map[l] || l || '—';

}



export function severityLabel(s, textFromApi) {

  if (textFromApi) return textFromApi;

  const map = {

    error: '错误',

    warn: '警告',

    warning: '警告',

    info: '提示',

    high: '高',

    medium: '中',

    low: '低'

  };

  return map[(s || '').toLowerCase()] || s || '—';

}



export function severityTagType(severity) {

  const s = (severity || '').toLowerCase();

  if (s === 'error' || s === 'high' || s === 'critical') return 'danger';

  if (s === 'warning' || s === 'warn' || s === 'medium') return 'warning';

  return 'info';

}



export function fieldLabel(field, labelFromApi) {

  if (labelFromApi) return labelFromApi;

  return FIELD_LABEL_ZH[field] || field || '—';

}



export function stepStatusLabel(s, textFromApi) {

  if (textFromApi) return textFromApi;

  const map = {

    running: '执行中',

    success: '成功',

    failed: '失败',

    done: '完成',

    pending: '待执行'

  };

  return map[s] || s || '—';

}



export function stepStatusTagType(s) {

  const x = (s || '').toLowerCase();

  if (x === 'success' || x === 'done') return 'success';

  if (x === 'failed' || x === 'error') return 'danger';

  if (x === 'running' || x === 'pending') return 'warning';

  return 'info';

}



export function normalizeRemote(detail) {

  if (!detail) return {};

  const r = detail.remote;

  if (r && typeof r === 'object') return r;

  return detail;

}



export function pickIssues(detail) {

  const remote = normalizeRemote(detail);

  const list = remote.issues;

  return Array.isArray(list) ? list : [];

}



export function pickFields(detail) {

  const remote = normalizeRemote(detail);

  const list = remote.fields;

  return Array.isArray(list) ? list : [];

}



export function pickSteps(detail) {

  const remote = normalizeRemote(detail);

  const list = remote.steps;

  return Array.isArray(list) ? list : [];

}

/** 中台 resultJson.ai_summary_sections（结构化摘要，供前端展示） */
export function pickAiSummarySections(detail) {
  const remote = normalizeRemote(detail);
  if (remote.ai_summary_sections && typeof remote.ai_summary_sections === 'object') {
    return remote.ai_summary_sections;
  }
  let rj = remote.resultJson;
  if (!rj) return null;
  if (typeof rj === 'string') {
    try {
      rj = JSON.parse(rj);
    } catch (e) {
      return null;
    }
  }
  return rj && rj.ai_summary_sections ? rj.ai_summary_sections : null;
}

export function riskScore(remote, detail) {

  if (remote.riskScore != null && remote.riskScore !== '') {

    return Number(remote.riskScore);

  }

  return null;

}



/** 列表摘要：优先 AI 意见，失败时显示错误 */

export function aiReviewListSummary(row) {
  if (!row) return '—';
  if (row.AI_SUMMARY) return formatAiSummaryBrief(row.AI_SUMMARY, 36);
  if (row.AI_STATUS === 'failed') return '审核失败，请打开详情查看原因';
  if (row.AI_STATUS === 'pending') return '审核处理中…';
  return '—';
}



/** 人审 SPD 状态 vs AI 结论是否不一致 */

export function isAiHumanMismatch(row) {

  if (!row || row.AI_STATUS !== 'done') return false;

  const human = row.SPD_SP_STATE;

  const ai = row.AI_OUTCOME;

  if (human === '1' && ai === 'manual_review') return true;

  if (human === '2' && ai === 'passed') return true;

  return false;

}



export function truncateText(text, max = 36) {

  if (!text) return '';

  const s = String(text);

  return s.length > max ? s.slice(0, max) + '…' : s;

}

/** 移除文末供程序解析的 ```json``` 块 */
export function stripAiSummaryMachineBlock(raw) {
  if (!raw) return '';
  return String(raw)
    .replace(/```(?:json)?\s*[\s\S]*?```/gi, '')
    .replace(/^##?\s*机器可读结论.*$/gm, '')
    .trim();
}

const CONCLUSION_ZH = {
  acceptable: '可接受',
  need_materials: '需补充材料',
  unacceptable: '不可接受',
};

const RISK_ZH = { low: '低', medium: '中', high: '高' };

function conclusionLabelZh(text) {
  if (!text) return '';
  const s = String(text).trim();
  const lower = s.toLowerCase();
  if (s.includes('需补充') || lower === 'need_materials') return CONCLUSION_ZH.need_materials;
  if (s.includes('不可接受') || lower === 'unacceptable') return CONCLUSION_ZH.unacceptable;
  if (s.includes('可接受') || lower === 'acceptable') return CONCLUSION_ZH.acceptable;
  return s.replace(/\*+/g, '');
}

function riskLevelLabelZh(level) {
  if (!level) return '';
  const k = String(level).trim().toLowerCase();
  return RISK_ZH[k] || String(level).replace(/\*+/g, '');
}

/** 是否为开发向「涉及字段」行（业务界面不展示） */
export function isDeveloperOnlyLine(line) {
  const t = (line || '').trim();
  if (!t) return false;
  return /涉及字段\s*[：:]?/.test(t) || /^[-*•]\s*\*{0,2}\s*涉及字段/.test(t);
}

/** 移除面向用户的文本中的「涉及字段」行及行内字段键引用 */
export function stripDeveloperOnlyLines(text) {
  if (!text) return '';
  return String(text)
    .split('\n')
    .filter((line) => !isDeveloperOnlyLine(line))
    .join('\n')
    .replace(/[（(]?\s*涉及字段[^）)\n。]*[）)]?/g, '')
    .replace(/^\s*[-*•]\s*涉及字段[^\n]*/gm, '')
    .trim();
}

/** 单段文案最终清理（描述/建议等） */
export function sanitizeUserFacingText(text) {
  if (!text) return '';
  let s = stripDeveloperOnlyLines(text);
  // 去掉独立成行或括号内的反引号字段键
  s = s.replace(/`[a-zA-Z][a-zA-Z0-9_]*`/g, '');
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s;
}

/** 列表/横幅用简短摘要（无涉及字段、无 JSON） */
export function formatAiSummaryBrief(raw, maxLen = 80) {
  const display = stripAiSummaryMachineBlock(raw || '');
  const parsed = parseAiSummaryForDisplay(display);
  const line = aiSummaryBannerLine(parsed);
  if (line) return line.length > maxLen ? `${line.slice(0, maxLen)}…` : line;
  const plain = sanitizeUserFacingText(display)
    .replace(/^#+\s*/gm, '')
    .replace(/\n+/g, ' ');
  if (!plain) return '';
  return plain.length > maxLen ? `${plain.slice(0, maxLen)}…` : plain;
}

function extractLabeledValue(line) {
  const idx = line.indexOf('：') >= 0 ? line.indexOf('：') : line.indexOf(':');
  if (idx < 0) return line.trim();
  return line.slice(idx + 1).trim();
}

function normalizeSeverity(raw) {
  if (!raw) return '';
  const s = String(raw).trim().toLowerCase();
  if (s === 'error' || s === '错误' || s === '严重') return 'error';
  if (s === 'warn' || s === 'warning' || s === '警告') return 'warn';
  if (s === 'info' || s === '信息') return 'info';
  if (s.includes('error') || s.includes('错误')) return 'error';
  if (s.includes('warn') || s.includes('警告')) return 'warn';
  if (s.includes('info')) return 'info';
  return '';
}

/** 主体均不匹配等问题升格为 error（避免模型标 info 或标题含「提示」误导） */
export function elevateSeverityByContent(severity, title, description) {
  const current = normalizeSeverity(severity);
  if (current === 'error') return 'error';
  const combined = `${title || ''} ${description || ''}`;
  if (!isCriticalSubjectMismatch(combined)) return current;
  return 'error';
}

function isCriticalSubjectMismatch(text) {
  if (!text) return false;
  if (/均不匹配|均不一致|完全不符|完全不一致/.test(text)) return true;
  if (text.includes('既非') && text.includes('也非')) return true;
  if (text.includes('既不是') && text.includes('也不是')) return true;
  if (text.includes('上传的证照主体') && /非|不一致|不匹配/.test(text)) return true;
  if (text.includes('证照主体') && text.includes('供应商') && text.includes('生产企业')
    && /不一致|不匹配|均不/.test(text)) return true;
  return text.includes('主体') && text.includes('严重不一致');
}

function isFindingTitleLine(t) {
  if (!t) return false;
  if (isDeveloperOnlyLine(t)) return false;
  if (/^(问题描述|严重程度|建议处理方式)/.test(t)) return false;
  if (/^[-*•]\s*(问题描述|严重程度|建议处理方式)/.test(t)) return false;
  if (t.startsWith('###')) return false;
  return true;
}

/** 解析单条主要发现 */
export function parseFindingBlock(block) {
  if (!block) return null;
  const text = stripDeveloperOnlyLines(block);
  let title = '';
  let description = '';
  let severity = '';
  let suggestion = '';
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || isDeveloperOnlyLine(t)) continue;
    if (/^问题描述/.test(t) || /^[-*•]\s*问题描述/.test(t)) {
      const part = extractLabeledValue(t);
      description = description ? `${description}\n${part}` : part;
    } else if (/^严重程度/.test(t) || /^[-*•]\s*严重程度/.test(t)) {
      severity = normalizeSeverity(extractLabeledValue(t));
    } else if (/^建议处理方式/.test(t) || /^[-*•]\s*建议处理方式/.test(t)) {
      const part = extractLabeledValue(t);
      suggestion = suggestion ? `${suggestion}\n${part}` : part;
    } else if (!title) {
      title = t.replace(/^\d+\.\s*/, '').replace(/\*+/g, '').trim();
    } else if (!description && !/^严重程度|^建议处理方式/.test(t)) {
      description = t.replace(/\*+/g, '').trim();
    } else if (description && !/^严重程度|^建议处理方式/.test(t)) {
      description += `\n${t.replace(/\*+/g, '').trim()}`;
    }
  }
  title = sanitizeUserFacingText(title);
  description = sanitizeUserFacingText(description);
  suggestion = sanitizeUserFacingText(suggestion);
  if (!title && description) {
    title = description.length > 48 ? `${description.slice(0, 48)}…` : description;
  }
  title = sanitizeUserFacingText(title);
  description = sanitizeUserFacingText(description);
  suggestion = sanitizeUserFacingText(suggestion);
  severity = elevateSeverityByContent(severity, title, description);
  if (!title && !description && !suggestion) return null;
  return {
    title,
    description,
    severity,
    severityLabel: findingSeverityLabelZh(summarySeverityForDisplay(severity)),
    suggestion,
  };
}

export function summarySeverityForDisplay(severity) {
  return normalizeSeverity(severity);
}

function findingSeverityLabelZh(sev) {
  if (sev === 'error') return '严重';
  if (sev === 'warn') return '警告';
  if (sev === 'info') return '提示';
  return '';
}

function splitFindingBlocks(body) {
  if (!body) return [];
  const blocks = [];
  let cur = '';
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (!t) {
      if (cur) {
        blocks.push(cur.trim());
        cur = '';
      }
      continue;
    }
    if (isFindingTitleLine(t) && cur) {
      blocks.push(cur.trim());
      cur = t;
    } else {
      cur = cur ? `${cur}\n${line.trim()}` : line.trim();
    }
  }
  if (cur) blocks.push(cur.trim());
  return blocks;
}

function parseStructuredFindings(body) {
  if (!body) return [];
  return splitFindingBlocks(body)
    .map((b) => parseFindingBlock(b))
    .filter(Boolean);
}

function parseStructuredSuggestions(body) {
  if (!body) return [];
  const items = [];
  let label = '';
  let text = '';
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const colonIdx = t.indexOf('：') >= 0 ? t.indexOf('：') : t.indexOf(':');
    const labeled = colonIdx > 0 && colonIdx < 18 && !/^问题描述/.test(t);
    if (labeled) {
      if (text || label) {
        items.push({ label, text: text.trim() });
        text = '';
      }
      label = t.slice(0, colonIdx).replace(/^[-*]\s*/, '').trim();
      text = t.slice(colonIdx + 1).trim();
    } else if (text) {
      text += `\n${t}`;
    } else {
      label = '';
      text = t.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '');
    }
  }
  if (text) items.push({ label, text: text.trim() });
  return items;
}

/** 兼容字符串或结构化 finding */
export function normalizeFindingItems(findings) {
  if (!findings || !findings.length) return [];
  if (typeof findings[0] === 'object' && findings[0] !== null) {
    return findings.map((f) => {
      const title = sanitizeUserFacingText(f.title || '');
      const description = sanitizeUserFacingText(f.description || '');
      let severity = summarySeverityForDisplay(f.severity);
      severity = elevateSeverityByContent(severity, title, description);
      return {
        title,
        description,
        severity,
        severityLabel: f.severityLabel || findingSeverityLabelZh(severity),
        suggestion: sanitizeUserFacingText(f.suggestion || ''),
      };
    });
  }
  return findings.flatMap((raw) => {
    const parsed = parseFindingBlock(String(raw));
    return parsed ? [parsed] : [];
  });
}

export function normalizeSuggestionItems(suggestions) {
  if (!suggestions || !suggestions.length) return [];
  if (typeof suggestions[0] === 'object' && suggestions[0] !== null && ('text' in suggestions[0] || 'label' in suggestions[0])) {
    return suggestions.map((s) => ({
      label: s.label || '',
      text: s.text || '',
    }));
  }
  return suggestions.map((t) => ({ label: '', text: String(t) }));
}

function parseMarkdownSections(display) {
  const bodies = {};
  if (!display) return bodies;
  const chunks = display.split(/^###\s+/m);
  for (const chunk of chunks) {
    if (!chunk.trim()) continue;
    const nl = chunk.indexOf('\n');
    const title = (nl >= 0 ? chunk.slice(0, nl) : chunk).trim().replace(/^\d+\.\s*/, '');
    const body = nl >= 0 ? chunk.slice(nl + 1).trim() : '';
    if (title) bodies[title] = body;
  }
  return bodies;
}

/**
 * 将 AI 摘要解析为前端友好结构（兼容历史未剥离 JSON 的数据）。
 * @param {string} raw
 * @param {object} [sectionsFromApi] resultJson.ai_summary_sections
 */
export function parseAiSummaryForDisplay(raw, sectionsFromApi) {
  if (sectionsFromApi && (sectionsFromApi.conclusion || sectionsFromApi.findings)) {
    const findingItems = normalizeFindingItems(sectionsFromApi.findings || []);
    const suggestionItems = normalizeSuggestionItems(sectionsFromApi.suggestions || []);
    return {
      conclusion: sectionsFromApi.conclusion || '',
      riskLevel: sectionsFromApi.riskLevel || '',
      findingItems,
      suggestionItems,
      hasStructured: !!(sectionsFromApi.conclusion || findingItems.length || suggestionItems.length),
    };
  }

  const display = stripAiSummaryMachineBlock(raw);
  const bodies = parseMarkdownSections(display);

  const conclusion = conclusionLabelZh(
    (bodies['审核结论'] || '').replace(/\*+/g, '') || extractConclusionFromText(display),
  );
  const riskLevel = riskLevelLabelZh(
    (bodies['风险等级'] || '').replace(/\*+/g, '') || extractRiskFromText(display),
  );
  const findingsBody = bodies['主要发现'] || bodies['2. 主要发现'] || '';
  const suggestionsBody = bodies['建议'] || bodies['建议后续动作'] || bodies['3. 建议后续动作'] || '';
  const findingItems = parseStructuredFindings(findingsBody);
  const suggestionItems = parseStructuredSuggestions(suggestionsBody);

  return {
    conclusion,
    riskLevel,
    findingItems,
    suggestionItems,
    hasStructured: !!(conclusion || riskLevel || findingItems.length || suggestionItems.length),
  };
}

function extractConclusionFromText(text) {
  if (!text) return '';
  const m = text.match(/(?:审核结论|整体评价)[：:\s]*\*{0,2}\s*(可接受|需补充材料|不可接受)/i);
  if (m) return m[1];
  if (text.includes('需补充材料')) return '需补充材料';
  if (text.includes('不可接受')) return '不可接受';
  if (text.includes('可接受')) return '可接受';
  return '';
}

function extractRiskFromText(text) {
  if (!text) return '';
  const m = text.match(/风险等级[：:\s]*\*{0,2}\s*(low|medium|high|低|中|高)/i);
  return m ? m[1] : '';
}

/** 横幅一句话摘要 */
export function aiSummaryBannerLine(parsed) {
  if (!parsed) return '';
  const parts = [];
  if (parsed.conclusion) parts.push(parsed.conclusion);
  const items = parsed.findingItems || [];
  if (items.length && items[0].title) {
    parts.push(items[0].title);
  }
  return parts.join('：') || '';
}

