/** 与旧页 YGVARCL_SM.cshtml 中 WJ_AUTH / 按钮权限逻辑一致 */
export function buildSmWjAuth(authorities = []) {
  const has = (key) => authorities.includes(key);
  const list = new Set(['3', '-100']);
  const buttons = {
    reverse: false,
    screen: false,
    confirm: false,
    purchase: false,
    warehouse: false,
    access: false
  };

  if (has('物价-全部权限')) {
    buttons.reverse = true;
    buttons.screen = true;
    buttons.confirm = true;
    buttons.purchase = true;
    buttons.warehouse = true;
    buttons.access = true;
    ['1', '2', '3', '4', '5', '6', '10'].forEach((item) => list.add(item));
  }
  if (has('物价-提交') || has('萨米物价-初筛')) {
    buttons.screen = true;
    list.add('1');
  }
  if (has('物价-确认提交') || has('萨米物价-初筛确认')) {
    buttons.confirm = true;
    list.add('2');
  }
  if (has('物价-采购审核') || has('萨米物价-设备科审核')) {
    buttons.purchase = true;
    list.add('3');
  }
  if (has('物价-物价审核') || has('萨米物价-物价准入审核')) {
    buttons.access = true;
    ['10', '9', '6', '5', '4'].forEach((item) => list.add(item));
  }

  return {
    wjAuthJson: JSON.stringify([...list]),
    buttons
  };
}
