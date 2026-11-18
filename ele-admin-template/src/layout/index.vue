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
        const base = this.$store.state.user.menus || [];
        const group = buildRecentMenuGroup(this.recentMenus);
        return group ? [...base, group] : base;
      },
      // 主题状态
      ...mapGetters(['theme'])
    },
    watch: {
      $route: {
        immediate: true,
        handler(to) {
          this.recordRecentMenu(to);
        }
      },
      // 联动监听只对 mix 布局成立；切到 side/top 布局必须解绑，
      // 否则 capture 阶段的 preventDefault 会让人点不动真实菜单
      'theme.layoutStyle'(value) {
        this.rebindNavLinkage(value);
      },
      // 界面风格预设：SPD 预设的样式覆盖统一挂在 body.spd-preset 上，
      // 避免顶栏/侧栏不在 layout 根元素内时选择器匹配不到
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
    },
    methods: {
      // 切换 body 上的预设标识类
      applyPresetClass(preset) {
        document.body.classList.toggle('spd-preset', preset === 'spd');
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
  // 菜单 svg 图标对齐 el-icon-* 字体图标的尺寸与间距
  .ele-admin-sidebar-menus .menu-svg-icon.svg-icon,
  .ele-admin-sidebar-nav-menu .menu-svg-icon.svg-icon,
  .el-menu--popup .menu-svg-icon.svg-icon {
    width: 24px;
    height: 18px;
    margin-right: 5px;
    font-size: 18px;
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
           特异性与这里相同且加载更晚，必须用 !important 才能让长名称真正撑开 */
        height: auto !important;
        line-height: 1.4 !important;
        min-height: 38px;
        padding-top: 7px !important;
        padding-bottom: 7px !important;
        font-size: 14px;
        font-weight: 600;
        white-space: normal !important;
        word-break: break-word;
        overflow: visible;
      }
      /* 文本容器（span/a）：flex item 默认 min-width:auto 不会收缩，
         长名称会撑破而不是换行，这里显式放开 */
      .el-menu-item > span,
      .el-submenu__title > span,
      .el-menu-item > a,
      .el-submenu__title > a {
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
     3) 页签顶边用顶栏同色实心投影向上盖住接缝（比伪元素更稳，
        色边界被推到页签内侧，白晕不再压在灰顶上）。 */
  .ele-admin-header-nav {
    overflow: hidden;
  }

  .ele-admin-header .ele-admin-breadcrumb {
    align-self: stretch;
    overflow: hidden;

    > .el-breadcrumb {
      height: 100%;
    }

    .el-breadcrumb__item {
      height: 100%;
      line-height: normal;
      display: inline-flex;
      align-items: center;
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
      /* 实心投影向下延伸，盖住与页签之间的亚像素缝 */
      box-shadow: 0 1px 0 0 #5b6472, 0 2px 0 0 #5b6472,
        0 1px 4px rgba(0, 0, 0, 0.1) !important;

      .ele-admin-logo {
        background-color: #5b6472 !important;
      }

      .ele-admin-breadcrumb {
        background-color: #5b6472;
      }
    }

    /* 页签顶边再向上盖同色，把灰|白色边界推进页签内侧 */
    &.ele-admin-show-tabs
      .ele-admin-header:not(.ele-admin-header-primary)
      ~ .ele-admin-main
      .ele-admin-tabs {
      box-shadow: 0 -2px 0 0 #5b6472, 0 1px 4px rgba(0, 21, 41, 0.08);
    }

    .ele-admin-header-primary {
      box-shadow: 0 1px 0 0 var(--color-primary), 0 2px 0 0 var(--color-primary),
        0 1px 4px rgba(0, 0, 0, 0.1) !important;
    }

    &.ele-admin-show-tabs
      .ele-admin-header-primary
      ~ .ele-admin-main
      .ele-admin-tabs {
      box-shadow: 0 -2px 0 0 var(--color-primary),
        0 1px 4px rgba(0, 21, 41, 0.08);
    }
  }

  /* 左上角院徽：固定尺寸的白色铭牌 + 背景图 contain，
     不再用 <img> 替换元素，彻底避开 logo-auto 的 width:auto 塌缩 */
  .ele-admin-logo,
  .ele-admin-logo-auto .ele-admin-logo {
    width: 240px !important;
    height: 72px !important;
  }
  .ele-admin-logo > .spd-hospital-logo {
    width: 228px !important;
    height: 60px !important;
    flex: 0 0 auto;
    background-color: #fff;
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
