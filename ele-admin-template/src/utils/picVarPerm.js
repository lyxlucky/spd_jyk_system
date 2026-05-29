/**
 * 品种资质 picVarCode 按钮权限（对齐老系统 Home.cshtml：Permission_Url === '品种资质审核' / '品种资质审批'）
 */

function permFields(p) {
  if (!p) return [];
  return [
    p.title,
    p.component,
    p.path,
    p.Permission_Url,
    p.permission_name,
    p.PERMISSION_NAME,
    p.Permission_Name
  ].filter((v) => v != null && String(v).trim() !== '');
}

/** 是否在 permission_group / authorities 中命中任一标识 */
export function hasPicVarPermKey(store, key) {
  if (!key || !store) return false;
  const k = String(key).trim();
  const list = store.state?.user?.info?.permission_group || [];
  const authorities = store.state?.user?.authorities || [];
  if (authorities.includes(k)) return true;
  return list.some((p) => permFields(p).some((v) => v === k));
}

/** SPD 审核通过/不通过（老系统 getVarPic_sh） */
export function hasPicVarSpdApprove(store) {
  return hasPicVarPermKey(store, '品种资质审核');
}

/** 招采/品种资质审批通过/不通过（老系统 getVarPic_sp） */
export function hasPicVarProcureApprove(store) {
  return hasPicVarPermKey(store, '品种资质审批');
}
