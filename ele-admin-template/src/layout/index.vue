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
    <!-- 登录后效期提醒 -->
    <login-tip-dialogs />
    <!-- 菜单图标 -->
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
      <!-- 用背景图，避免图片被压扁 -->
      <div
        class="spd-hospital-logo"
        role="img"
        aria-label="医院院徽"
        :style="{ backgroundImage: 'url(' + hospitalLogo + ')' }"
      ></div>
    </template>
    <template v-for="slotName in ['top', 'tab-title']" v-slot:[slotName]="{ item, title }">
      <span v-if="item">{{ title }}</span>
      <div
        v-else-if="!theme.bodyFullscreen && (slotName === 'top' || theme.layoutStyle === 'top')"
        class="spd-side-home-tabs"
        :class="{ 'is-narrow': theme.collapse || theme.sideNavCollapse }"
      >
        <button
          v-for="label in ['首页', '菜单列表']"
          :key="label"
          type="button"
          class="spd-side-home-tab"
          :class="{ 'is-active': isHomePage }"
          :title="label"
          @click.stop="goHome"
        >
          {{ label }}
        </button>
      </div>
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
      // 院徽，与登录页同一来源
      hospitalLogo() {
        return getHospitalLogo();
      },
      // 当前语言
      locale() {
        return this.$i18n.locale;
      },
      // 「最近使用」放最后，避免抢业务菜单的路由匹配
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
          // 最近使用：停在该目录
          this.keepRecentMenuGroupIfNeeded(to, from);
        }
      },
      // 切布局时重绑菜单联动
      'theme.layoutStyle': {
        immediate: true,
        handler(value) {
          this.applyLayoutModeClass(value);
          this.rebindNavLinkage(value);
        }
      },
      // SPD 预设挂在 body
      'theme.preset': {
        immediate: true,
        handler(value) {
          this.applyPresetClass(value);
        }
      }
    },
    created() {
      this.syncRecentMenus();
      this.$bus.$on(RECENT_MENUS_CHANGED, this.syncRecentMenus);
    },
    mounted() {
      this.rebindNavLinkage(this.theme.layoutStyle);
    },
    beforeDestroy() {
      this.$bus.$off(RECENT_MENUS_CHANGED, this.syncRecentMenus);
      this.unbindTopNavLinkage();
      this.unbindSideNavLinkage();
      document.body.classList.remove('spd-preset');
      document.body.classList.remove('spd-layout-top');
    },
    methods: {
      // 切换预设标识
      applyPresetClass(preset) {
        document.body.classList.toggle('spd-preset', preset === 'spd');
      },
      // 顶部菜单：页签右移
      applyLayoutModeClass(layoutStyle) {
        document.body.classList.toggle('spd-layout-top', layoutStyle === 'top');
      },
      // 按布局重绑菜单联动
      rebindNavLinkage(layoutStyle) {
        this.unbindTopNavLinkage();
        this.unbindSideNavLinkage();
        this.$nextTick(() => {
          // 仅混合布局拦截顶部点击
          if (layoutStyle === 'mix') {
            this.bindTopNavLinkage();
          }
          // 侧栏目录联动
          this.bindSideNavLinkage();
        });
      },
      // 顶部一级点击只同步左侧目录
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
          // 不跳空的一级路由
          e.preventDefault();
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
          // 只同步左侧目录
          this.$bus.$emit('SPD_MENU_GROUP_CHANGE', hit.meta.title);
        };
        nav.addEventListener('click', this._onNavClick, true);
        // 侧栏为空时选中第一个业务目录
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
      // 点侧栏目录只同步选中，业务菜单仍跳转
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
          // 记下当前目录，回首页后可恢复
          try {
            sessionStorage.setItem('SPD_ACTIVE_MENU_GROUP', hit.meta.title);
          } catch (err) {
            // 存不下就忽略
          }
          // 只同步目录选中态
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
      // 从「最近使用」进入时，一级目录停在该项
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
      // 回主页，不触发院徽点击
      goHome() {
        if (this.$route.path !== HOME_PATH) {
          this.$router.push(HOME_PATH);
        }
      },
      // 菜单树去掉首页
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

  /* SPD 预设 */
  body.spd-preset {
    /* 侧栏目录可换行 */
    .ele-admin-sidebar-menus .el-menu:not(.el-menu--collapse) {
      .el-menu-item,
      .el-submenu__title {
        /* 长名称换行 */
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
      /* 叶子菜单 */
      .el-menu-item > a {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
        color: inherit;
        line-height: inherit;
      }
      /*
       * Element 默认 el-icon 宽 24px，SVG 被我们压成 18px，
       * 同级菜单会看起来「有的图标和文字空一截」。统一成同一槽位。
       */
      .el-menu-item > i:not(.el-submenu__icon-arrow),
      .el-menu-item > a > i,
      .el-menu-item [class^='el-icon-'],
      .el-menu-item [class*=' el-icon-'],
      .el-menu-item .menu-svg-icon,
      .el-submenu__title > i:not(.el-submenu__icon-arrow),
      .el-submenu__title [class^='el-icon-'],
      .el-submenu__title [class*=' el-icon-'],
      .el-submenu__title .menu-svg-icon {
        flex: 0 0 18px !important;
        width: 18px !important;
        min-width: 18px !important;
        height: 18px;
        margin-right: 8px !important;
        font-size: 16px !important;
        text-align: center;
        line-height: 1 !important;
        vertical-align: middle;
      }
      .el-submenu__title > .el-submenu__icon-arrow {
        right: 12px;
        margin-top: 0;
      }
      /* 长名称换行 */
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

  /* 顶栏接缝不发白 */
  .ele-admin-header-nav {
    overflow: hidden;
  }

  /* 去掉页签栏小房子 */
  .ele-admin-tabs > .ele-tab-tool.is-tab {
    display: none;
  }

  /* 首页标签：院徽正下方 */
  .spd-side-home-tabs {
    display: flex;
    flex: 0 0 auto;
    width: 100%;
    height: 30px;
    box-sizing: border-box;
    background: #fff;
    border-right: 1px solid #e4e7ed;
    border-bottom: 1px solid #ebeef5;
  }
  .spd-side-home-tab {
    flex: 1;
    min-width: 0;
    height: 30px;
    margin: 0;
    padding: 0 4px;
    border: none;
    border-right: 1px solid #ebeef5;
    background: #fff;
    color: #606266;
    font-size: 13px;
    font-weight: 600;
    line-height: 30px;
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
  /* 侧栏避开首页标签 */
  .ele-admin-sidebar,
  .ele-admin-sidebar-nav {
    overflow: hidden;
  }
  .ele-admin-sidebar-menus,
  .ele-admin-sidebar-nav-menu {
    min-height: 0;
  }
  /* 顶部导航用页签栏的首页插槽，和业务页签一起排列。 */
  body.spd-layout-top .ele-admin-body:first-child > .ele-admin-tabs {
    padding-left: 0;
  }
  body.spd-layout-top .ele-admin-body:first-child > .ele-admin-tabs > .ele-tab-tool.is-tab:has(.spd-side-home-tabs) {
    display: flex;
    width: 240px;
    padding: 0;
  }
  body.spd-layout-top .ele-admin-collapse .ele-admin-body:first-child > .ele-admin-tabs > .ele-tab-tool.is-tab {
    width: 56px;
  }
  .ele-tab-tool > .spd-side-home-tabs {
    position: relative;
    z-index: 2;
  }
  .spd-side-home-tabs.is-narrow .spd-side-home-tab {
    padding: 0;
    font-size: 12px;
  }

  .ele-admin-header .ele-admin-breadcrumb {
    align-self: stretch;
    min-width: 0;
    overflow: hidden;

    /* 与顶部菜单同一字体 */
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

  /* 暗色顶栏固定灰 */
  body:not(.ele-admin-theme-dark) .ele-admin-head-dark {
    .ele-admin-header:not(.ele-admin-header-primary) {
      background-color: #5b6472 !important;
      /* 接缝同色边 */
      box-shadow: inset 0 -1px 0 #5b6472 !important;

      .ele-admin-logo {
        background-color: #fff !important;
        box-shadow: none !important;
      }

      .ele-admin-breadcrumb {
        background-color: #5b6472;
      }
    }

    /* 页签阴影不盖顶栏 */
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

  /* 院徽列与侧栏同宽 */
  .ele-admin-logo,
  .ele-admin-logo-auto .ele-admin-logo {
    width: 240px !important;
    height: 42px !important;
    box-sizing: border-box;
    border-right: 1px solid #e4e7ed;
    /* 不裁切下方内容 */
    overflow: visible !important;
  }
  .ele-admin-logo > .spd-hospital-logo {
    width: calc(100% - 12px) !important;
    height: calc(100% - 6px) !important;
    flex: 0 0 auto;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border-radius: 2px;
  }
  /* 折叠时院徽列收到 56px */
  .ele-admin-collapse .ele-admin-logo,
  .ele-admin-collapse.ele-admin-logo-auto .ele-admin-logo,
  .ele-admin-nav-collapse .ele-admin-logo {
    width: 56px !important;
  }
  /* 折叠时院徽缩小 */
  .ele-admin-collapse .ele-admin-logo > .spd-hospital-logo,
  .ele-admin-nav-collapse .ele-admin-logo > .spd-hospital-logo {
    width: 28px !important;
    height: 28px !important;
  }
</style>
