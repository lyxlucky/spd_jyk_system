<template>
  <ele-pro-layout
    ref="proLayout"
    :menus="menus"
    :tabs="theme.tabs"
    :collapse="theme.collapse"
    :side-nav-collapse="theme.sideNavCollapse"
    :body-fullscreen="theme.bodyFullscreen"
    :show-tabs="theme.showTabs"
    :show-footer="theme.showFooter"
    :head-style="theme.headStyle"
    :side-style="theme.sideStyle"
    :layout-style="theme.layoutStyle"
    :side-menu-style="theme.sideMenuStyle"
    :tab-style="theme.tabStyle"
    :fixed-header="theme.fixedHeader"
    :fixed-sidebar="theme.fixedSidebar"
    :fixed-body="theme.fixedBody"
    :body-full="theme.bodyFull"
    :logo-auto-size="theme.logoAutoSize"
    :colorful-icon="theme.colorfulIcon"
    :side-unique-open="theme.sideUniqueOpen"
    :style-responsive="theme.styleResponsive"
    :project-name="''"
    :hide-footers="HIDE_FOOTERS"
    :hide-sidebars="HIDE_SIDEBARS"
    :repeatable-tabs="REPEATABLE_TABS"
    :home-title="HOME_TITLE || $t('layout.home')"
    :home-path="HOME_PATH"
    :layout-path="LAYOUT_PATH"
    :redirect-path="REDIRECT_PATH"
    :tab-sortable="true"
    :locale="locale"
    :i18n="i18n"
    @update:collapse="updateCollapse"
    @update:side-nav-collapse="updateSideNavCollapse"
    @update:body-fullscreen="updateBodyFullscreen"
    @tab-add="addPageTab"
    @tab-remove="removePageTab"
    @tab-remove-all="removeAllPageTab"
    @tab-remove-left="removeLeftPageTab"
    @tab-remove-right="removeRightPageTab"
    @tab-remove-other="removeOtherPageTab"
    @tabSortChange="setPageTabs"
    @reload-page="reloadPageTab"
    @logo-click="onLogoClick"
    @screen-size-change="screenSizeChange"
    @set-home-components="setHomeComponents"
    @tab-context-menu="onTabContextMenu"
  >
    <!-- 路由出口 -->
    <router-layout />
    <!-- 登录后效期/近效期提醒弹窗（按 permission_group） -->
    <login-tip-dialogs />
    <!-- 菜单图标：el-icon-* 走字体图标，本地 svg 名走雪碧图 -->
    <template v-slot:icon="{ icon }">
      <svg-icon
        v-if="isSvgIcon(icon)"
        :icon-class="icon"
        class-name="menu-svg-icon"
      />
      <i v-else :class="icon"></i>
    </template>
    <!-- logo 图标 -->
    <template v-slot:logo>
      <!-- 用背景图而非 <img>，避免替换元素在 flex / width:auto 容器里被压缩 -->
      <div
        class="spd-hospital-logo"
        role="img"
        aria-label="医院院徽"
        :style="{ backgroundImage: 'url(' + hospitalLogo + ')' }"
      ></div>
    </template>
    <!-- 顶栏右侧区域 -->
    <template v-slot:right>
      <!-- <p>版本号：V11.2.04</p>  -->
      <header-tools :fullscreen="fullscreen" @fullscreen="onFullscreen" />
    </template>
    <!-- 全局页脚 -->
    <template v-slot:footer>
      <page-footer />
    </template>
    <!-- 自定义菜单标题增加徽章、小红点 -->
    <template v-slot:title="{ title, item }">
      <span>{{ title }} </span>
      <div v-if="item.meta && item.meta.badge" class="ele-menu-badge">
        <el-badge :value="item.meta.badge" :type="item.meta.badgeColor" />
      </div>
    </template>
    <template v-slot:top-title="{ title, item }">
      <span>{{ title }} </span>
      <div v-if="item.meta && item.meta.badge" class="ele-menu-badge">
        <el-badge :value="item.meta.badge" :type="item.meta.badgeColor" />
      </div>
    </template>
    <template v-slot:nav-title="{ title, item }">
      <span>{{ title }} </span>
      <div v-if="item.meta && item.meta.badge" class="ele-menu-badge">
        <el-badge :value="item.meta.badge" :type="item.meta.badgeColor" />
      </div>
    </template>
  </ele-pro-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { toggleFullscreen, isFullscreen } from 'ele-admin';
  import RouterLayout from '@/components/RouterLayout/index.vue';
  import HeaderTools from './components/header-tools.vue';
  import PageFooter from './components/page-footer.vue';
  import LoginTipDialogs from './components/login-tip-dialogs.vue';
  import {
    HIDE_SIDEBARS,
    HIDE_FOOTERS,
    REPEATABLE_TABS,
    HOME_TITLE,
    HOME_PATH,
    LAYOUT_PATH,
    REDIRECT_PATH,
    I18N_ENABLE,
    getHospitalLogo
  } from '@/config/setting';
  import {
    addPageTab,
    removePageTab,
    removeAllPageTab,
    removeLeftPageTab,
    removeRightPageTab,
    removeOtherPageTab,
    reloadPageTab,
    setHomeComponents,
    setPageTabs
  } from '@/utils/page-tab-util';
  import {
    getRecentMenus,
    pushRecentMenu,
    buildRecentMenuGroup,
    RECENT_MENU_GO_PREFIX,
    RECENT_MENUS_CHANGED
  } from '@/utils/recent-menu-util';
  import { isSvgIcon } from '@/utils/menu-icon';

  export default {
    name: 'EleLayout',
    components: {
      RouterLayout,
      HeaderTools,
      PageFooter,
      LoginTipDialogs
    },
    data() {
      return {
        HIDE_SIDEBARS,
        HIDE_FOOTERS,
        REPEATABLE_TABS,
        HOME_PATH,
        HOME_TITLE,
        LAYOUT_PATH,
        REDIRECT_PATH,
        // 是否全屏
        fullscreen: false,
        recentMenus: []
      };
    },
    computed: {
      // 左上角院徽：与登录页同源，按 HOME_HP 对应到具体医院
      hospitalLogo() {
        return getHospitalLogo();
      },
      // 当前语言
      locale() {
        return this.$i18n.locale;
      },
      // 菜单数据：「最近使用」放最后。
      // ele-admin 按菜单树从前到后匹配路由，插在最前会导致打开业务页时
      // 顶栏/侧栏跳到「最近使用」；放最后则优先命中真实业务目录
      menus() {
        const base = this.stripHomeShortcut(this.$store.state.user.menus || []);
        const group = buildRecentMenuGroup(this.recentMenus);
        return group ? [...base, group] : base;
      },
      isHomePage() {
        return this.$route.path === HOME_PATH;
      },
      // 主题状态
      ...mapGetters(['theme'])
    },
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          this.recordRecentMenu(to);
          // 从「最近使用」点进页面时保持停在该目录，方便连续操作
          this.keepRecentMenuGroupIfNeeded(to, from);
        }
      },
      // 联动监听只对 mix 布局成立；切到 side/top 布局必须解绑，
      // 否则 capture 阶段的 preventDefault 会让人点不动真实菜单
      'theme.layoutStyle': {
        immediate: true,
        handler(value) {
          this.applyLayoutModeClass(value);
          this.rebindNavLinkage(value);
        }
      },
      // 界面风格预设：SPD 预设的样式覆盖统一挂在 body.spd-preset 上，
      // 避免顶栏/侧栏不在 layout 根元素内时选择器匹配不到
      'theme.preset': {
        immediate: true,
        handler(value) {
          this.applyPresetClass(value);
        }
      },
      isHomePage() {
        this.syncHomeTabs();
      },
      'theme.collapse'() {
        this.syncHomeTabs();
      },
      'theme.sideNavCollapse'() {
        this.syncHomeTabs();
      },
      'theme.bodyFullscreen'() {
        this.syncHomeTabs();
      }
    },
    created() {
      this.syncRecentMenus();
      this.$bus.$on(RECENT_MENUS_CHANGED, this.syncRecentMenus);
    },
    mounted() {
      this.rebindNavLinkage(this.theme.layoutStyle);
      this.mountHomeTabs();
    },
    beforeDestroy() {
      this.$bus.$off(RECENT_MENUS_CHANGED, this.syncRecentMenus);
      this.unbindTopNavLinkage();
      this.unbindSideNavLinkage();
      this.destroyHomeTabs();
      document.body.classList.remove('spd-preset');
      document.body.classList.remove('spd-layout-top');
      document.body.classList.remove('spd-side-collapsed');
    },
    methods: {
      // 切换 body 上的预设标识类
      applyPresetClass(preset) {
        document.body.classList.toggle('spd-preset', preset === 'spd');
      },
      // 顶部菜单布局需要把页签整体让到院徽宽度的右边
      applyLayoutModeClass(layoutStyle) {
        document.body.classList.toggle('spd-layout-top', layoutStyle === 'top');
      },
      /* 首页标签不能放在院徽节点里：顶栏层级低于侧栏，左侧和混合布局会被侧栏盖住。
         挂到 body 上，层级才能压过侧栏。 */
      mountHomeTabs() {
        const bar = document.createElement('div');
        bar.className = 'spd-side-home-tabs';
        ['首页', '菜单列表'].forEach((label) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'spd-side-home-tab';
          button.textContent = label;
          button.addEventListener('click', (event) => this.goHome(event));
          bar.appendChild(button);
        });
        document.body.appendChild(bar);
        this._homeTabs = bar;
        this.syncHomeTabs();
      },
      syncHomeTabs() {
        const bar = this._homeTabs;
        if (!bar) {
          return;
        }
        const narrow = !!(this.theme.collapse || this.theme.sideNavCollapse);
        document.body.classList.toggle('spd-side-collapsed', narrow);
        bar.classList.toggle('is-narrow', narrow);
        bar.classList.toggle('is-hidden', !!this.theme.bodyFullscreen);
        Array.prototype.forEach.call(bar.children, (button) => {
          button.classList.toggle('is-active', this.isHomePage);
        });
      },
      destroyHomeTabs() {
        if (this._homeTabs && this._homeTabs.parentNode) {
          this._homeTabs.parentNode.removeChild(this._homeTabs);
        }
        this._homeTabs = null;
      },
      // 按当前布局模式重新装配上侧/左侧联动监听
      rebindNavLinkage(layoutStyle) {
        this.unbindTopNavLinkage();
        this.unbindSideNavLinkage();
        this.$nextTick(() => {
          // 顶部一级目录联动只在 mix 布局成立：side/top 布局的顶栏是真实导航，
          // 拦下点击会让人点不动菜单
          if (layoutStyle === 'mix') {
            this.bindTopNavLinkage();
          }
          // 侧栏目录联动与布局无关：side/mix 都有侧栏目录树；
          // top 布局没有侧栏，bindSideNavLinkage 内部找不到元素会直接返回
          this.bindSideNavLinkage();
        });
      },
      // 顶部一级目录点击：同步左侧目录树（不跳转菜单首页）
      bindTopNavLinkage() {
        const nav = document.querySelector('.ele-admin-header-nav');
        if (!nav) {
          return;
        }
        this._navEl = nav;
        this._onNavClick = (e) => {
          const item = e.target.closest
            ? e.target.closest('.el-menu--horizontal > .el-menu-item')
            : null;
          if (!item || !nav.contains(item)) {
            return;
          }
          // mix 模式顶部一级是 router-link，阻止跳到没有组件的一级路由
          e.preventDefault();
          // capture 阶段同时阻断冒泡，避免该一级 path 被推给路由后
          // 命中 routes.js 的 '*' → redirect HOME_PATH 而跳回主菜单
          e.stopPropagation();
          const title = (item.textContent || '').trim();
          const hit = (this.menus || []).find(
            (m) => m.meta && m.meta.title && title.indexOf(m.meta.title) === 0
          );
          if (!hit) {
            return;
          }
          const layout = this.$refs.proLayout;
          if (layout && typeof layout.splitMenuData === 'function') {
            layout.headMenuActive = hit.path;
            layout.splitMenuData();
          }
          // 混合菜单模式下只同步左侧目录树即可，不再跳回菜单首页
          this.$bus.$emit('SPD_MENU_GROUP_CHANGE', hit.meta.title);
        };
        nav.addEventListener('click', this._onNavClick, true);
        // 侧栏为空时兜底选中第一个真实业务目录（跳过「最近使用」）
        this.$nextTick(() => {
          const layout = this.$refs.proLayout;
          if (!layout || typeof layout.splitMenuData !== 'function') {
            return;
          }
          if ((layout.sideMenuData || []).length) {
            return;
          }
          const first = (this.menus || []).find(
            (m) =>
              m.path !== '/__recent_menus__' &&
              m.children &&
              m.children.length
          );
          if (first) {
            layout.headMenuActive = first.path;
            layout.splitMenuData();
          }
        });
      },
      unbindTopNavLinkage() {
        if (this._navEl && this._onNavClick) {
          this._navEl.removeEventListener('click', this._onNavClick, true);
        }
        this._navEl = null;
        this._onNavClick = null;
      },
      // 侧边栏「目录」点击：只同步目录选中态，不跳转菜单首页。
      // 只处理 el-submenu 标题（目录），el-menu-item（业务菜单）仍按原逻辑跳转
      bindSideNavLinkage() {
        const side = document.querySelector('.ele-admin-sidebar');
        if (!side) {
          return;
        }
        this._sideEl = side;
        this._onSideClick = (e) => {
          const titleNode = e.target.closest
            ? e.target.closest('.el-submenu > .el-submenu__title')
            : null;
          if (!titleNode || !side.contains(titleNode)) {
            return;
          }
          const text = (titleNode.textContent || '').trim();
          const hit = (this.menus || []).find(
            (m) => m.meta && m.meta.title && text.indexOf(m.meta.title) === 0
          );
          if (!hit) {
            return;
          }
          // 先持久化：不在首页时点击、之后回到首页也能恢复该目录
          try {
            sessionStorage.setItem('SPD_ACTIVE_MENU_GROUP', hit.meta.title);
          } catch (err) {
            // 隐私模式下 sessionStorage 不可用时忽略
          }
          // 混合菜单模式下只同步目录选中态；业务菜单项仍按原逻辑跳转
          this.$bus.$emit('SPD_MENU_GROUP_CHANGE', hit.meta.title);
        };
        side.addEventListener('click', this._onSideClick, true);
      },
      unbindSideNavLinkage() {
        if (this._sideEl && this._onSideClick) {
          this._sideEl.removeEventListener('click', this._onSideClick, true);
        }
        this._sideEl = null;
        this._onSideClick = null;
      },
      syncRecentMenus(list) {
        this.recentMenus =
          list || getRecentMenus(this.$store.state.user.info);
      },
      recordRecentMenu(route) {
        const userInfo = this.$store.state.user.info;
        const menus = this.$store.state.user.menus || [];
        this.recentMenus = pushRecentMenu(route, userInfo, menus);
        this.$bus.$emit(RECENT_MENUS_CHANGED, this.recentMenus);
      },
      // 仅当从「最近使用」入口（/__recent_go__）进来时，保持一级目录停在「最近使用」
      keepRecentMenuGroupIfNeeded(_to, from) {
        if (!from?.path?.startsWith(RECENT_MENU_GO_PREFIX)) {
          return;
        }
        this.$nextTick(() => {
          const layout = this.$refs.proLayout;
          if (!layout || this.theme.layoutStyle !== 'mix') {
            return;
          }
          layout.headMenuActive = '/__recent_menus__';
          if (typeof layout.splitMenuData === 'function') {
            layout.splitMenuData();
          }
        });
      },
      /* 侧栏折叠切换 */
      updateCollapse(value) {
        this.$store.dispatch('theme/setCollapse', value);
      },
      /* 双侧栏一级折叠切换 */
      updateSideNavCollapse(value) {
        this.$store.dispatch('theme/setSideNavCollapse', value);
      },
      /* 内容区域全屏切换 */
      updateBodyFullscreen(value) {
        this.$store.dispatch('theme/setBodyFullscreen', value);
      },
      /* logo 点击事件 */
      onLogoClick(isHome) {
        isHome || this.$router.push(LAYOUT_PATH);
      },
      /* 首页、菜单列表都进入同一个主页。标签在院徽节点内部，阻止冒泡以免点到院徽跳转 */
      goHome(event) {
        if (event && event.stopPropagation) {
          event.stopPropagation();
        }
        if (this.$route.path !== HOME_PATH) {
          this.$router.push(HOME_PATH);
        }
      },
      /* 菜单列表已挪到侧栏顶部，不再挂在科室申领下面 */
      stripHomeShortcut(list) {
        return (list || []).reduce((acc, item) => {
          const title = (item.meta && item.meta.title) || item.title || '';
          if (item.path === HOME_PATH || title === '菜单列表') {
            return acc;
          }
          if (item.children && item.children.length) {
            acc.push({
              ...item,
              children: this.stripHomeShortcut(item.children)
            });
          } else {
            acc.push(item);
          }
          return acc;
        }, []);
      },
      /* 监听屏幕尺寸改变 */
      screenSizeChange() {
        this.$store.dispatch('theme/updateScreenSize');
        this.fullscreen = isFullscreen();
      },
      /* 全屏切换 */
      onFullscreen() {
        try {
          this.fullscreen = toggleFullscreen();
        } catch (e) {
          this.$message.error('您的浏览器不支持全屏模式');
        }
      },
      /* 页签右键菜单点击事件 */
      onTabContextMenu({ key, tabKey, item, active }) {
        switch (key) {
          case 'reload': // 刷新
            reloadPageTab({
              isHome: !item,
              fullPath: item?.fullPath ?? tabKey
            });
            break;
          case 'close': // 关闭当前
            removePageTab({
              key: item?.fullPath ?? tabKey,
              active
            });
            break;
          case 'left': // 关闭左侧
            removeLeftPageTab({
              key: tabKey,
              active
            });
            break;
          case 'right': // 关闭右侧
            removeRightPageTab({
              key: tabKey,
              active
            });
            break;
          case 'other': // 关闭其他
            removeOtherPageTab({
              key: tabKey,
              active
            });
            break;
        }
      },
      /* 菜单图标是否为本地 svg 名 */
      isSvgIcon,
      /* 菜单标题国际化 */
      i18n(_path, key) {
        if (!I18N_ENABLE || !key) {
          return;
        }
        const k = 'route.' + key + '._name';
        const title = this.$t(k);
        if (title !== k) {
          return title;
        }
      },
      //
      addPageTab,
      removePageTab,
      removeAllPageTab,
      removeLeftPageTab,
      removeRightPageTab,
      removeOtherPageTab,
      reloadPageTab,
      setHomeComponents,
      setPageTabs
    }
  };
</script>

<style lang="scss">
  // 菜单 svg 图标与字体图标同一尺寸，避免和文字挤在一起
  .ele-admin-sidebar-menus .menu-svg-icon.svg-icon,
  .ele-admin-sidebar-nav-menu .menu-svg-icon.svg-icon,
  .el-menu--popup .menu-svg-icon.svg-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    font-size: 18px;
    flex: 0 0 auto;
    vertical-align: middle;
    text-align: center;
  }

  // 侧栏菜单徽章样式，定位在右侧垂直居中并调小尺寸
  .ele-menu-badge {
    position: absolute;
    top: 50%;
    right: 14px;
    line-height: 1;
    margin-top: -9px;
    font-size: 0;

    .el-badge__content {
      height: 18px;
      line-height: 18px;
      border-radius: 9px;
      border: none;
      min-width: 18px;
      padding: 0 4px;
      box-sizing: border-box;
    }
  }

  // 父级菜单标题中右侧多定位一点，避免与箭头重合
  .el-submenu > .el-submenu__title .ele-menu-badge {
    right: 36px;
  }

  // 折叠悬浮中样式调整
  .el-menu--popup {
    .el-submenu > .el-submenu__title .ele-menu-badge {
      right: 20px;
    }
  }

  // 侧栏折叠后样式调整
  .ele-admin-collapse .ele-admin-sidebar-menus > .el-scrollbar {
    & > .el-scrollbar__wrap > .el-scrollbar__view > .el-menu {
      & > .el-menu-item,
      & > .el-submenu > .el-submenu__title {
        .ele-menu-badge {
          top: 2px;
          right: 2px;
          margin: 0;
        }
      }
    }
  }

  // 顶栏菜单标题中样式调整
  .ele-admin-header-nav > .el-scrollbar > .el-scrollbar__wrap {
    & > .el-scrollbar__view > .el-menu {
      & > .el-menu-item,
      & > .el-submenu > .el-submenu__title {
        .ele-menu-badge {
          position: static;
          right: auto;
          top: auto;
          display: inline-block;
          vertical-align: 6px;
          margin: 0 0 0 2px;
        }
      }
    }
  }

  // 双侧栏时一级侧栏菜单中样式调整，定位在右上角
  .ele-admin-sidebar-nav-menu > .el-scrollbar > .el-scrollbar__wrap {
    & > .el-scrollbar__view > .el-menu {
      & > .el-menu-item,
      & > .el-submenu > .el-submenu__title {
        .ele-menu-badge {
          top: 0;
          right: 0;
          margin: 0;
        }
      }
    }
  }

  // 双侧栏时一级侧栏菜单折叠后样式调整
  .ele-admin-nav-collapse .ele-admin-sidebar-nav-menu > .el-scrollbar {
    & > .el-scrollbar__wrap > .el-scrollbar__view > .el-menu {
      & > .el-menu-item,
      & > .el-submenu > .el-submenu__title {
        .ele-menu-badge {
          top: 0;
          right: 0;
        }
      }
    }
  }

  /* ===== SPD 界面风格预设（theme.preset === 'spd'）=====
     挂成 body.spd-preset，这些覆盖只在 SPD 预设下生效；
     切到「自定义」后完全交给 ele-admin 原生风格，硬编码不再和设置项打架。 */
  body.spd-preset {
    /* 侧栏目录：字体加粗加大、间距收紧、长名称分行、悬停/选中蓝色。
       排除 .el-menu--collapse：折叠态由 ele-admin 自己控制图标居中，不能被这里干扰 */
    .ele-admin-sidebar-menus .el-menu:not(.el-menu--collapse) {
      .el-menu-item,
      .el-submenu__title {
        /* ele-admin 用 `> .el-menu-item` 设了固定 height/line-height，
           特异性与这里相同且加载更晚，必须用 !important 才能让长名称真正撑开。
           右侧留出箭头空位，避免文字叠到箭头上。 */
        display: flex !important;
        align-items: center;
        height: auto !important;
        line-height: 1.4 !important;
        min-height: 40px;
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        padding-right: 32px !important;
        box-sizing: border-box;
        font-size: 14px;
        font-weight: 600;
        white-space: normal !important;
        word-break: break-word;
        overflow: visible;
      }
      /* 叶子菜单的图标和标题包在 router-link 里 */
      .el-menu-item > a {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
        color: inherit;
        line-height: inherit;
      }
      .el-menu-item > a > i,
      .el-menu-item > a > .menu-svg-icon,
      .el-submenu__title > i:not(.el-submenu__icon-arrow),
      .el-submenu__title > .menu-svg-icon {
        flex: 0 0 18px;
        width: 18px;
        margin-right: 8px;
        text-align: center;
        line-height: 1;
      }
      .el-submenu__title > .el-submenu__icon-arrow {
        right: 12px;
        margin-top: 0;
      }
      /* 文本不裁切；flex item 默认 min-width:auto 不会收缩，长名称要显式放开才能换行 */
      .el-menu-item > a > span,
      .el-submenu__title > span,
      .el-submenu__title > a {
        flex: 1;
        min-width: 0;
        line-height: inherit;
        white-space: normal !important;
        word-break: break-word;
      }
      > .el-submenu,
      > .el-menu-item {
        margin-top: 0;
      }
      .el-menu-item:hover,
      .el-submenu__title:hover {
        background-color: #409eff !important;
        color: #fff !important;
      }
      .el-menu-item.is-active {
        background-color: #ecf5ff !important;
        color: #409eff !important;
      }
    }
  }

  /* 顶栏「白下划线」根因（50%/80%/33% 等非 100% 缩放都会出现）：
     灰顶栏(#5b6472) 与白页签是上下两块独立盒子。浏览器缩放时色边界
     往往落在半个设备像素上，抗锯齿会在深色底上混出一条发白的细线——
     这不是边框，是光栅化问题；缩得越偏 100%，越容易看见。
     处理：
     1) 导航区 overflow:hidden，避免空 nav 冒出滚动条轨道；
     2) 面包屑跟顶栏同高并裁切，避免 72px item 溢出；
     3) 接缝用顶栏内侧同色描边收住，不再用投影压到页签或侧栏上。 */
  .ele-admin-header-nav {
    overflow: hidden;
  }

  /* 页签栏不再放小房子。没打开其他页面时，这一栏是空的 */
  .ele-admin-tabs > .ele-tab-tool.is-tab {
    display: none;
  }

  /* 首页 / 菜单列表固定在院徽正下方，和页签同一行，宽度跟院徽一致。
     节点挂在 body 上：侧栏层级高于顶栏，留在院徽里会被左侧、混合布局盖住。 */
  .spd-side-home-tabs {
    position: fixed;
    top: 72px;
    left: 0;
    z-index: 200;
    display: flex;
    width: 240px;
    height: 40px;
    box-sizing: border-box;
    background: #fff;
    border-right: 1px solid #e4e7ed;
    border-bottom: 1px solid #ebeef5;
  }
  .spd-side-home-tab {
    flex: 1;
    min-width: 0;
    height: 40px;
    margin: 0;
    padding: 0 4px;
    border: none;
    border-right: 1px solid #ebeef5;
    background: #fff;
    color: #606266;
    font-size: 14px;
    font-weight: 600;
    line-height: 40px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .spd-side-home-tab.is-active {
    color: #409eff;
    background: #ecf5ff;
    box-shadow: inset 0 -2px 0 #409eff;
  }
  /* 侧栏从页签行下面开始，避免目录盖住这两个标签 */
  .ele-admin-sidebar,
  .ele-admin-sidebar-nav {
    overflow: hidden;
  }
  .ele-admin-sidebar-menus,
  .ele-admin-sidebar-nav-menu {
    margin-top: 40px;
    min-height: 0;
  }
  /* 顶部菜单没有侧栏，页签整行右移出院徽的宽度，新页签在两个标签右边打开 */
  body.spd-layout-top .ele-admin-tabs {
    padding-left: 240px;
    box-sizing: border-box;
  }
  body.spd-layout-top.spd-side-collapsed .ele-admin-tabs {
    padding-left: 56px;
  }
  .spd-side-home-tabs.is-narrow {
    width: 56px;
  }
  .spd-side-home-tabs.is-narrow .spd-side-home-tab {
    padding: 0;
    font-size: 12px;
  }
  .spd-side-home-tabs.is-hidden {
    display: none;
  }

  .ele-admin-header .ele-admin-breadcrumb {
    align-self: stretch;
    min-width: 0;
    overflow: hidden;

    /* 与顶部菜单布局的一级目录同一套字体：15px、加粗、微软雅黑 */
    > .el-breadcrumb {
      height: 100%;
      font-size: 15px;
      font-weight: 600;
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    }

    .el-breadcrumb__item {
      height: 100%;
      line-height: normal;
      display: inline-flex;
      align-items: center;
    }

    .el-breadcrumb__inner,
    .el-breadcrumb__inner a,
    .el-breadcrumb__separator {
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
    }
  }

  /* 顶栏灰色：只跟 headStyle=dark 走，与界面预设、导航布局解耦。
     这样切到混合/顶部菜单布局时，顶栏不会突然变回 ele-admin 原生的深黑 #001529。
     暗黑模式下交给 ele-admin 自己的暗色顶栏，避免灰顶压在深色内容区上。
     注意：ele-admin 在 headStyle=primary 时也会挂 ele-admin-head-dark，
     必须排除 .ele-admin-header-primary，否则灰色 !important 会盖掉主色顶栏 */
  body:not(.ele-admin-theme-dark) .ele-admin-head-dark {
    .ele-admin-header:not(.ele-admin-header-primary) {
      background-color: #5b6472 !important;
      /* 接缝用顶栏内侧的同色边收住，不再用投影压到页签上 */
      box-shadow: inset 0 -1px 0 #5b6472 !important;

      .ele-admin-logo {
        background-color: #fff !important;
        box-shadow: none !important;
      }

      .ele-admin-breadcrumb {
        background-color: #5b6472;
      }
    }

    /* 页签只保留自身轻阴影，不再向上盖住顶栏 */
    &.ele-admin-show-tabs
      .ele-admin-header:not(.ele-admin-header-primary)
      ~ .ele-admin-main
      .ele-admin-tabs {
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    }

    .ele-admin-header-primary {
      box-shadow: inset 0 -1px 0 var(--color-primary) !important;
    }

    &.ele-admin-show-tabs
      .ele-admin-header-primary
      ~ .ele-admin-main
      .ele-admin-tabs {
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    }
  }

  /* 左上角院徽列与侧栏同宽，白底连成一列，不再在灰顶栏里另放一块铭牌 */
  .ele-admin-logo,
  .ele-admin-logo-auto .ele-admin-logo {
    width: 240px !important;
    height: 72px !important;
    box-sizing: border-box;
    border-right: 1px solid #e4e7ed;
    /* 首页标签用 fixed 挂在院徽节点里，不能被院徽裁掉 */
    overflow: visible !important;
  }
  .ele-admin-logo > .spd-hospital-logo {
    width: calc(100% - 16px) !important;
    height: calc(100% - 12px) !important;
    flex: 0 0 auto;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border-radius: 2px;
  }
  /* 侧栏折叠：logo 区宽度必须跟着侧栏一起收到 56px（ele-admin 的 $--sidebar-collapse-width），
     否则铭牌会在 240px 的容器里居中，看起来悬在右半侧 */
  .ele-admin-collapse .ele-admin-logo,
  .ele-admin-collapse.ele-admin-logo-auto .ele-admin-logo,
  .ele-admin-nav-collapse .ele-admin-logo {
    width: 56px !important;
  }
  /* 折叠态铭牌等比缩小 */
  .ele-admin-collapse .ele-admin-logo > .spd-hospital-logo,
  .ele-admin-nav-collapse .ele-admin-logo > .spd-hospital-logo {
    width: 44px !important;
    height: 44px !important;
  }
</style>
