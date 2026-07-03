/** 与旧 YGVARCL.cshtml + Home.cshtml 物价权限逻辑一致 */
export function buildWjAuth(authorities = []) {
  const has = (key) => authorities.includes(key);
  const list = new Set(['-100']);
  const buttons = {
    reverse: false,
    screen: false,
    confirm: false,
    purchase: false,
    leader: false,
    director: false,
    priceFirst: false,
    priceAccess: false,
    syncHisCode: false
  };

  if (has('物价-全部权限')) {
    buttons.reverse = true;
    buttons.screen = true;
    buttons.confirm = true;
    buttons.purchase = true;
    buttons.leader = true;
    buttons.director = true;
    buttons.priceFirst = true;
    buttons.priceAccess = true;
    buttons.syncHisCode = true;
    ['1', '2', '3', '4', '5', '6', '7', '10'].forEach((item) => list.add(item));
  }
  if (has('物价-提交')) {
    buttons.screen = true;
    list.add('1');
  }
  if (has('物价-确认提交')) {
    buttons.confirm = true;
    list.add('2');
  }
  if (has('物价-采购审核')) {
    buttons.purchase = true;
    list.add('3');
  }
  if (has('物价-采购复核')) {
    buttons.leader = true;
    list.add('4');
  }
  if (has('物价-部门负责人审核')) {
    buttons.director = true;
    list.add('5');
  }
  if (has('物价-物价初审')) {
    buttons.priceFirst = true;
    list.add('6');
  }
  if (has('物价-物价审核')) {
    buttons.priceAccess = true;
    list.add('7');
  }

  return {
    wjAuthJson: JSON.stringify([...list]),
    buttons
  };
}
