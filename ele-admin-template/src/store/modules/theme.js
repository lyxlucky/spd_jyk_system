/**
 * 主题状态管理
 */
import {
  changeColor,
  screenWidth,
  screenHeight,
  contentWidth,
  contentHeight,
  WEAK_CLASS,
  BODY_LIMIT_CLASS,
  DISABLES_CLASS
} from 'ele-admin';
import {
  TAB_KEEP_ALIVE,
  KEEP_ALIVE_EXCLUDES,
  THEME_STORE_NAME
} from '@/config/setting';

/**
 * SPD 界面风格预设对应的固定值（只管顶栏/侧栏这对视觉规范）
 * 顶栏取 dark（文字转白，背景由全局样式涂成中灰）
 * 侧栏取 light（白底，配合蓝色悬停/选中）
 * 导航布局不放进预设：布局是独立选项，换布局不应连带改变配色
 */
export const SPD_PRESET = Object.freeze({
  headStyle: 'dark',
  sideStyle: 'light'
});

/**
 * state 默认值
 */
const DEFAULT_STATE = Object.freeze({
  // 页签数据
  tabs: [],
  // 是否折叠侧栏
  collapse: false,
  // 是否折叠一级侧栏
  sideNavCollapse: false,
  // 内容区域是否全屏
  bodyFullscreen: false,
  // 是否开启页签栏
  showTabs: true,
  // 是否开启页脚
  showFooter: false,
  // 界面风格预设: spd(灰顶白侧+左侧菜单，默认锁定), custom(自由搭配下面的顶栏/侧栏/导航)
  // SPD 预设把项目视觉规范打包成一个档位，选它时自动锁定 headStyle/sideStyle/layoutStyle
  preset: 'spd',
  // 顶栏风格: light(亮色), dark(暗色), primary(主色)
  // 顶栏用灰色：dark 主题自动把文字转白，背景再由全局样式指定为中灰
  headStyle: SPD_PRESET.headStyle,
  // 侧栏风格: light(亮色), dark(暗色)
  // 目录树用亮色底，配合蓝色悬停/选中更清晰（对齐参考图）
  sideStyle: SPD_PRESET.sideStyle,
  // 布局风格: side(默认，左侧菜单树), top(顶栏导航), mix(混合导航：顶部一级 + 左侧子菜单)
  // 独立于界面预设：换布局不影响顶栏/侧栏配色
  layoutStyle: 'side',
  // 侧栏菜单风格: default(默认), mix(双排侧栏)
  sideMenuStyle: 'default',
  // 页签风格: default(默认), dot(圆点), card(卡片)
  tabStyle: 'default',
  // 路由切换动画
  transitionName: 'slide-right',
  // 是否固定顶栏
  fixedHeader: false,
  // 是否固定侧栏
  fixedSidebar: true,
  // 是否固定主体
  fixedBody: true,
  // 内容区域宽度铺满
  bodyFull: true,
  // logo 是否自适应宽度
  logoAutoSize: false,
  // 侧栏是否彩色图标
  colorfulIcon: false,
  // 侧栏是否只保持一个子菜单展开
  sideUniqueOpen: true,
  // 是否是色弱模式
  weakMode: false,
  // 是否是暗黑模式
  darkMode: false,
  // 主题色
  color: null,
  // 主页的组件名称
  homeComponents: [],
  // 刷新路由时的参数
  routeReload: null,
  // 屏幕宽度
  screenWidth: screenWidth(),
  // 屏幕高度
  screenHeight: screenHeight(),
  // 内容区域宽度
  contentWidth: contentWidth(),
  // 内容区域高度
  contentHeight: contentHeight(),
  // 是否开启响应式（默认关闭：窗口缩小不重排，靠滚动查看，对齐老系统）
  styleResponsive: false,
  // 字体大小
  fontSize: '16px',
  // 表格密度
  density: 'default'
});
// 延时操作定时器
let disableTransitionTimer, updateContentSizeTimer;

/** 一次性迁移：历史缓存里 styleResponsive=true 的用户统一切到关闭 */
const STYLE_RESPONSIVE_MIGRATE_KEY = 'spdStyleResponsiveFixedV1';

/** 一次性迁移：布局默认由 mix 改回 side，历史缓存的 preset/布局统一回到 SPD 预设 */
const PRESET_SIDE_MIGRATE_KEY = 'spdPresetSideV1';

/**
 * 读取缓存配置
 */
function getCacheSetting() {
  try {
    const value = localStorage.getItem(THEME_STORE_NAME);
    if (value) {
      const cache = JSON.parse(value);
      if (typeof cache === 'object' && cache !== null) {
        return cache;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return {};
}

/**
 * 缓存配置
 */
function cacheSetting(key, value) {
  const cache = getCacheSetting();
  if (cache[key] !== value) {
    cache[key] = value;
    localStorage.setItem(THEME_STORE_NAME, JSON.stringify(cache));
  }
}

/**
 * 开关响应式布局
 */
function changeStyleResponsive(styleResponsive) {
  if (styleResponsive) {
    document.body.classList.remove(BODY_LIMIT_CLASS);
  } else {
    document.body.classList.add(BODY_LIMIT_CLASS);
  }
}

/**
 * 切换色弱模式
 */
function changeWeakMode(weakMode) {
  if (weakMode) {
    document.body.classList.add(WEAK_CLASS);
  } else {
    document.body.classList.remove(WEAK_CLASS);
  }
}

/**
 * 切换主题
 */
function changeTheme(value, dark) {
  return new Promise((resolve, reject) => {
    try {
      changeColor(value, dark);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 切换布局时禁用过渡动画
 */
function disableTransition() {
  disableTransitionTimer && clearTimeout(disableTransitionTimer);
  document.body.classList.add(DISABLES_CLASS);
  disableTransitionTimer = setTimeout(() => {
    document.body.classList.remove(DISABLES_CLASS);
  }, 100);
}

export default {
  namespaced: true,
  state: (() => {
    const state = { ...DEFAULT_STATE };
    const cache = getCacheSetting();
    Object.keys(state).forEach((key) => {
      if (typeof cache[key] !== 'undefined') {
        state[key] = cache[key];
      }
    });
    // 历史默认开启响应式会挤扁布局；迁移一次为关闭，之后尊重用户在设置里的手动开关
    if (!cache[STYLE_RESPONSIVE_MIGRATE_KEY]) {
      state.styleResponsive = false;
      cacheSetting(STYLE_RESPONSIVE_MIGRATE_KEY, true);
      cacheSetting('styleResponsive', false);
    }
    // 一次性迁移：布局默认从 mix 改为 side；同时把此前因点布局选项而降级的预设拉回 SPD
    // （降级后顶栏会回落成 ele-admin 原生的深黑，表现为「灰顶变黑」）
    if (!cache[PRESET_SIDE_MIGRATE_KEY]) {
      state.preset = 'spd';
      state.layoutStyle = 'side';
      cacheSetting(PRESET_SIDE_MIGRATE_KEY, true);
      cacheSetting('preset', 'spd');
      cacheSetting('layoutStyle', 'side');
    }
    // SPD 预设只锁顶栏/侧栏这对配色，布局保持用户自己的选择
    if (state.preset === 'spd') {
      state.headStyle = SPD_PRESET.headStyle;
      state.sideStyle = SPD_PRESET.sideStyle;
    }
    return state;
  })(),
  getters: {
    // 需要 keep-alive 的组件
    keepAliveInclude(state) {
      if (!TAB_KEEP_ALIVE || !state.showTabs) {
        return [];
      }
      const components = new Set();
      const { reloadPath, reloadHome } = state.routeReload || {};
      state.tabs?.forEach((t) => {
        const isAlive = t.meta?.keepAlive !== false;
        const isExclude = KEEP_ALIVE_EXCLUDES.includes(t.path);
        const isReload = reloadPath && reloadPath === t.fullPath;
        if (isAlive && !isExclude && !isReload && t.components) {
          t.components.forEach((c) => {
            if (typeof c === 'string' && c) {
              components.add(c);
            }
          });
        }
      });
      if (!reloadHome) {
        state.homeComponents?.forEach((c) => {
          if (typeof c === 'string' && c) {
            components.add(c);
          }
        });
      }
      return Array.from(components);
    }
  },
  mutations: {
    SET(state, { key, value }) {
      state[key] = value;
    }
  },
  actions: {
    setTabs({ commit }, value) {
      commit('SET', { key: 'tabs', value });
      //cacheSetting('tabs', value);
    },
    setCollapse({ commit, dispatch }, value) {
      commit('SET', { key: 'collapse', value });
      dispatch('delayUpdateContentSize', 800);
    },
    setSideNavCollapse({ commit, dispatch }, value) {
      commit('SET', { key: 'sideNavCollapse', value });
      dispatch('delayUpdateContentSize', 800);
    },
    setBodyFullscreen({ commit, dispatch }, value) {
      disableTransition();
      commit('SET', { key: 'bodyFullscreen', value });
      dispatch('delayUpdateContentSize', 800);
    },
    setShowTabs({ commit, dispatch }, value) {
      commit('SET', { key: 'showTabs', value });
      cacheSetting('showTabs', value);
      dispatch('delayUpdateContentSize');
    },
    setShowFooter({ commit, dispatch }, value) {
      commit('SET', { key: 'showFooter', value });
      cacheSetting('showFooter', value);
      dispatch('delayUpdateContentSize');
    },
    setHeadStyle({ commit }, value) {
      commit('SET', { key: 'headStyle', value });
      cacheSetting('headStyle', value);
    },
    /**
     * 切换界面风格预设
     * spd: 灰顶 + 白侧（项目视觉规范，选中即锁定顶栏/侧栏）
     * custom: 放开顶栏/侧栏选项，自由搭配
     * 导航布局不参与预设，任何布局下配色都保持
     */
    setPreset({ commit, dispatch }, value) {
      commit('SET', { key: 'preset', value });
      cacheSetting('preset', value);
      if (value === 'spd') {
        dispatch('setHeadStyle', SPD_PRESET.headStyle);
        dispatch('setSideStyle', SPD_PRESET.sideStyle);
      }
    },
    setSideStyle({ commit }, value) {
      commit('SET', { key: 'sideStyle', value });
      cacheSetting('sideStyle', value);
    },
    setLayoutStyle({ commit, dispatch }, value) {
      disableTransition();
      commit('SET', { key: 'layoutStyle', value });
      cacheSetting('layoutStyle', value);
      dispatch('delayUpdateContentSize');
    },
    setSideMenuStyle({ commit, dispatch }, value) {
      disableTransition();
      commit('SET', { key: 'sideMenuStyle', value });
      cacheSetting('sideMenuStyle', value);
      dispatch('delayUpdateContentSize');
    },
    setTabStyle({ commit }, value) {
      commit('SET', { key: 'tabStyle', value });
      cacheSetting('tabStyle', value);
    },
    setTransitionName({ commit }, value) {
      commit('SET', { key: 'transitionName', value });
      cacheSetting('transitionName', value);
    },
    setFixedHeader({ commit }, value) {
      disableTransition();
      commit('SET', { key: 'fixedHeader', value });
      cacheSetting('fixedHeader', value);
    },
    setFixedSidebar({ commit }, value) {
      disableTransition();
      commit('SET', { key: 'fixedSidebar', value });
      cacheSetting('fixedSidebar', value);
    },
    setFixedBody({ commit }, value) {
      disableTransition();
      commit('SET', { key: 'fixedBody', value });
      cacheSetting('fixedBody', value);
    },
    setBodyFull({ commit, dispatch }, value) {
      commit('SET', { key: 'bodyFull', value });
      cacheSetting('bodyFull', value);
      dispatch('delayUpdateContentSize');
    },
    setLogoAutoSize({ commit }, value) {
      disableTransition();
      commit('SET', { key: 'logoAutoSize', value });
      cacheSetting('logoAutoSize', value);
    },
    setColorfulIcon({ commit }, value) {
      commit('SET', { key: 'colorfulIcon', value });
      cacheSetting('colorfulIcon', value);
    },
    setSideUniqueOpen({ commit }, value) {
      commit('SET', { key: 'sideUniqueOpen', value });
      cacheSetting('sideUniqueOpen', value);
    },
    setStyleResponsive({ commit }, value) {
      changeStyleResponsive(value);
      commit('SET', { key: 'styleResponsive', value });
      cacheSetting('styleResponsive', value);
    },
    /**
     * 切换色弱模式
     * @param value 是否是色弱模式
     */
    setWeakMode({ commit }, value) {
      return new Promise((resolve) => {
        changeWeakMode(value);
        commit('SET', { key: 'weakMode', value });
        cacheSetting('weakMode', value);
        resolve();
      });
    },
    /**
     * 切换暗黑模式
     * @param value 是否是暗黑模式
     */
    setDarkMode({ commit, state }, value) {
      return new Promise((resolve, reject) => {
        changeTheme(state.color, value)
          .then(() => {
            commit('SET', { key: 'darkMode', value });
            cacheSetting('darkMode', value);
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    /**
     * 切换主题色
     * @param value 主题色
     */
    setColor({ commit, state }, value) {
      return new Promise((resolve, reject) => {
        changeTheme(value, state.darkMode)
          .then(() => {
            commit('SET', { key: 'color', value });
            cacheSetting('color', value);
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    /**
     * 设置主页路由对应的组件名称
     * @param components 组件名称
     */
    setHomeComponents({ commit }, value) {
      commit('SET', { key: 'homeComponents', value });
    },
    /**
     * 设置刷新路由信息
     * @param option 路由刷新参数
     */
    setRouteReload({ commit }, value) {
      commit('SET', { key: 'routeReload', value });
    },
    /**
     * 更新屏幕尺寸
     */
    updateScreenSize({ commit, dispatch }) {
      commit('SET', { key: 'screenWidth', value: screenWidth() });
      commit('SET', { key: 'screenHeight', value: screenHeight() });
      dispatch('updateContentSize');
    },
    /**
     * 更新内容区域尺寸
     */
    updateContentSize({ commit }) {
      commit('SET', { key: 'contentWidth', value: contentWidth() });
      commit('SET', { key: 'contentHeight', value: contentHeight() });
    },
    /**
     * 延时更新内容区域尺寸
     * @param delay 延迟时间
     */
    delayUpdateContentSize({ dispatch }, delay) {
      updateContentSizeTimer && clearTimeout(updateContentSizeTimer);
      updateContentSizeTimer = setTimeout(() => {
        dispatch('updateContentSize');
      }, delay ?? 100);
    },
    /**
     * 重置设置
     */
    resetSetting({ commit, state }) {
      return new Promise((resolve, reject) => {
        disableTransition();
        [
          'showTabs',
          'showFooter',
          'preset',
          'headStyle',
          'sideStyle',
          'layoutStyle',
          'sideMenuStyle',
          'tabStyle',
          'transitionName',
          'fixedHeader',
          'fixedSidebar',
          'fixedBody',
          'bodyFull',
          'logoAutoSize',
          'colorfulIcon',
          'sideUniqueOpen',
          'styleResponsive',
          'weakMode',
          'darkMode',
          'color',
          'fontSize',
          'density'
        ].forEach((key) => {
          commit('SET', { key, value: DEFAULT_STATE[key] });
        });
        localStorage.removeItem(THEME_STORE_NAME);
        Promise.all([
          changeStyleResponsive(state.styleResponsive),
          changeWeakMode(state.weakMode),
          changeTheme(state.color, state.darkMode)
        ])
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    /**
     * 恢复主题
     */
    recoverTheme({ state }) {
      // 关闭响应式布局（对齐老系统：窗口变小靠滚动，不重排）
      changeStyleResponsive(!!state.styleResponsive);
      // 恢复色弱模式
      if (state.weakMode) {
        changeWeakMode(true);
      }
      // 恢复主题色
      if (state.color || state.darkMode) {
        changeTheme(state.color, state.darkMode).catch((e) => {
          console.error(e);
        });
      }
    },
    /**
     * 添加页签或更新相同 key 的页签数据
     * @param data 页签数据
     */
    tabAdd({ dispatch, state }, data) {
      if (Array.isArray(data)) {
        data.forEach((d) => {
          dispatch('tabAdd', d);
        });
        return;
      }
      const i = state.tabs.findIndex((d) => d.key === data.key);
      if (i === -1) {
        dispatch('setTabs', state.tabs.concat([data]));
        return;
      }
      const old = state.tabs[i];
      // 同 key 时也要补全 components：异步组件首次匹配常拿不到 name，导致 keep-alive 永久失效
      const oldComps = old.components || [];
      const newComps = data.components || [];
      const compsChanged =
        newComps.length > 0 &&
        (oldComps.length === 0 || oldComps.join('\0') !== newComps.join('\0'));
      if (data.fullPath !== old.fullPath || compsChanged || data.title !== old.title) {
        dispatch(
          'setTabs',
          state.tabs
            .slice(0, i)
            .concat([{ ...old, ...data, components: newComps.length ? newComps : oldComps }])
            .concat(state.tabs.slice(i + 1))
        );
      }
    },
    /**
     * 关闭页签
     * @param key 页签 key
     */
    async tabRemove({ dispatch, state }, { key, active }) {
      const i = state.tabs.findIndex(
        (t) => t.key === key || t.fullPath === key
      );
      if (i === -1) {
        return {};
      }
      const t = state.tabs[i];
      if (!t.closable) {
        return Promise.reject();
      }
      const path = state.tabs[i - 1]?.fullPath;
      dispatch(
        'setTabs',
        state.tabs.filter((_d, j) => j !== i)
      );
      return t.key === active ? { path, home: !path } : {};
    },
    /**
     * 关闭左侧页签
     */
    async tabRemoveLeft({ dispatch, state }, { key, active }) {
      let index = -1; // 选中页签的 index
      for (let i = 0; i < state.tabs.length; i++) {
        if (state.tabs[i].key === active) {
          index = i;
        }
        if (state.tabs[i].key === key) {
          if (i === 0) {
            break;
          }
          const temp = state.tabs.filter((d, j) => !d.closable && j < i);
          if (temp.length === i + 1) {
            break;
          }
          const path = index === -1 ? void 0 : state.tabs[i].fullPath;
          dispatch('setTabs', temp.concat(state.tabs.slice(i)));
          return { path };
        }
      }
      return Promise.reject();
    },
    /**
     * 关闭右侧页签
     */
    async tabRemoveRight({ dispatch, state }, { key, active }) {
      if (state.tabs.length) {
        let index = -1; // 选中页签的 index
        for (let i = 0; i < state.tabs.length; i++) {
          if (state.tabs[i].key === active) {
            index = i;
          }
          if (state.tabs[i].key === key) {
            if (i === state.tabs.length - 1) {
              return Promise.reject();
            }
            const temp = state.tabs.filter((d, j) => !d.closable && j > i);
            if (temp.length === state.tabs.length - i - 1) {
              return Promise.reject();
            }
            const path = index === -1 ? state.tabs[i].fullPath : void 0;
            dispatch(
              'setTabs',
              state.tabs
                .slice(0, i + 1)
                .concat(state.tabs.filter((d, j) => !d.closable && j > i))
            );
            return { path };
          }
        }
        // 主页时关闭全部
        const temp = state.tabs.filter((d) => !d.closable);
        if (temp.length !== state.tabs.length) {
          dispatch('setTabs', temp);
          return { home: index !== -1 };
        }
      }
      return Promise.reject();
    },
    /**
     * 关闭其它页签
     */
    async tabRemoveOther({ dispatch, state }, { key, active }) {
      let index = -1; // 选中页签的 index
      let path; // 关闭后跳转的 path
      const temp = state.tabs.filter((d, i) => {
        if (d.key === active) {
          index = i;
        }
        if (d.key === key) {
          path = d.fullPath;
        }
        return !d.closable || d.key === key;
      });
      if (temp.length === state.tabs.length) {
        return Promise.reject();
      }
      dispatch('setTabs', temp);
      if (index === -1) {
        return {};
      }
      return key === active ? {} : { path, home: !path };
    },
    /**
     * 关闭全部页签
     * @param active 选中页签的 key
     */
    async tabRemoveAll({ dispatch, state }, active) {
      const t = state.tabs.find((d) => d.key === active);
      const home = typeof t !== 'undefined' && t.closable === true; // 是否跳转主页
      const temp = state.tabs.filter((d) => !d.closable);
      if (temp.length === state.tabs.length) {
        return Promise.reject();
      }
      dispatch('setTabs', temp);
      return { home };
    },
    /**
     * 修改页签
     * @param data 页签数据
     */
    tabSetItem({ dispatch, state }, data) {
      let i = -1;
      if (data.key) {
        i = state.tabs.findIndex((d) => d.key === data.key);
      } else if (data.fullPath) {
        i = state.tabs.findIndex((d) => d.fullPath === data.fullPath);
      } else if (data.path) {
        i = state.tabs.findIndex((d) => d.path === data.path);
      }
      if (i !== -1) {
        const item = { ...state.tabs[i] };
        if (data.title) {
          item.title = data.title;
        }
        if (typeof data.closable === 'boolean') {
          item.closable = data.closable;
        }
        if (data.components) {
          item.components = data.components;
        }
        dispatch(
          'setTabs',
          state.tabs
            .slice(0, i)
            .concat([item])
            .concat(state.tabs.slice(i + 1))
        );
      }
    },
    setFontSize({ commit }, value) {
      console.log('Setting font size in store:', value);
      commit('SET', { key: 'fontSize', value });
      cacheSetting('fontSize', value);
      return Promise.resolve();
    },
    /**
     * 设置表格密度
     * @param value 密度
     */
    setDensity({ commit }, value) {
      commit('SET', { key: 'density', value });
      cacheSetting('density', value);
    }
  }
};
