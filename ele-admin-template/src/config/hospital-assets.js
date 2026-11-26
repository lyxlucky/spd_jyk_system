/**
 * 医院 logo / 院徽 / 登录背景文件名映射。
 * 会被业务代码引用，禁止 require Node 内置模块；绝对路径在 vue.config.js 拼接。
 */

const ENV_HP_MAP = {
  local: 'bdrm',
  test: 'bdrm',
  bjww: 'bdrm',
  bjwwnew: 'bdrm',
  bjnw: 'bdrm',
  bjnwhttps: 'bdrm',
  bdww: 'bd',
  bdnw: 'bd',
  lhfyww: 'szlhfy',
  lhfynw: 'szlhfy',
  hnww: 'szhn',
  hnnw: 'szhn',
  smww: 'szsmyl',
  smnw: 'szsmyl',
  stzlww: 'stzl',
  stzlnw: 'stzl',
  chrmyyww: 'chrmyy',
  chrmyynw: 'chrmyy',
  zxww: 'stzx',
  zxnw: 'stzx',
  lgww: 'lg',
  lgnw: 'lg',
  lglsww: 'lgls',
  lglsnw: 'lgls',
  lglssk: 'lgls',
  sebb: 'se2',
  sebbww: 'se2',
  sedp: 'se2',
  sedpww: 'se2',
  selh: 'se2',
  selhww: 'se2',
  xhww: 'xh',
  xhnw: 'xh',
  stse: 'stse',
  stseww: 'stse',
  gzbjww: 'gzbj',
  gzbjnw: 'gzbj',
  fszxy: 'fszxy',
  szssww: 'szss',
  szssnw: 'szss',
  yzrmnw: 'yzrm'
};

const LOGO_BY_HP = {
  bd: 'logoBD.jpg',
  fy: 'logoFY.jpg',
  szsmyl: 'logoSM.jpg',
  stzl: 'logoZL.jpg',
  szhn: 'logoHN.jpg',
  lg: 'logoLG.png',
  lgls: 'logoLS.png',
  stzx: 'logoSTZX.jpg',
  stse: 'logoSTSE.png',
  gzbj: 'logoGZBJ.jpg',
  szlhfy: 'logoFY.jpg',
  bdrm: 'logoBJ.jpg',
  se2: 'szse.png',
  xh: 'xh.png',
  chrmyy: 'stch_logo.png'
};

const SEAL_BY_HP = {
  bd: 'sealBD.png'
};

const LOGIN_BG_BY_HP = {
  szhn: 'bg-login-szhn.jpg',
  chrmyy: 'bg-login.jpg'
};

function resolveHomeHp(env) {
  return ENV_HP_MAP[env] || 'bd';
}

/** 只返回文件名，供 vue.config 拼绝对路径 */
function resolveHospitalAssetFiles(env) {
  const homeHp = resolveHomeHp(env);
  return {
    homeHp,
    logoFile: LOGO_BY_HP[homeHp] || 'logo.png',
    sealFile: SEAL_BY_HP[homeHp] || null,
    loginBgFile: LOGIN_BG_BY_HP[homeHp] || null
  };
}

module.exports = {
  resolveHomeHp,
  resolveHospitalAssetFiles,
  LOGO_BY_HP,
  SEAL_BY_HP,
  LOGIN_BG_BY_HP
};
