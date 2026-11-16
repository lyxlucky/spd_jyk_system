<template>
  <div class="ele-body">
    <div class="ele-page-header"> </div>

    <template v-if="isBdrm">
      <el-card class="menu-workbench" shadow="never" :body-style="{ padding: '0' }">
        <!-- 目录导航统一由系统顶部一级 / 左侧目录树承担，此处只展示该目录下的图标按钮 -->
        <section class="menu-group-main">
          <div class="menu-group-main-head">
            <span class="menu-group-main-title">
              {{ activeGroup ? activeGroup.title : '全部菜单' }}
            </span>
            <span class="menu-group-main-meta">
              共 {{ activeGroup ? activeGroup.items.length : 0 }} 项
            </span>
          </div>
          <div v-if="activeGroup && activeGroup.items.length" class="menu-tile-grid">
            <button
              v-for="p in activeGroup.items"
              :key="'tile-' + p.path"
              type="button"
              class="menu-tile"
              @click="changeRoute(p.path)"
            >
              <span class="menu-tile-icon">
                <menu-icon :icon="p.icon" :size="34" />
              </span>
              <span class="menu-tile-title">{{ p.title }}</span>
            </button>
          </div>
          <div v-else class="menu-tile-empty">该目录下暂无菜单</div>
        </section>
      </el-card>
    </template>

    <template v-else>
      <el-card class="menu-section-card" shadow="never">
        <div slot="header" class="menu-section-header">
          <span>最近使用</span>
          <el-button type="text" icon="el-icon-plus" @click="openAddRecentDialog">
            添加
          </el-button>
        </div>
        <div v-if="recentMenuItems.length" class="menu-icon-grid">
          <div
            class="block recent-block"
            v-for="p in recentMenuItems"
            :key="'recent-' + p.path"
          >
            <div class="menu-icon-item" @click="changeRoute(p.path)">
              <el-button type="text" class="button">
                <div class="menu-icon-wrap">
                  <menu-icon :icon="p.icon" :size="40" />
                </div>
                <div class="menu-icon-title">
                  <span>{{ p.title }}</span>
                </div>
              </el-button>
            </div>
            <i
              class="el-icon-close recent-remove"
              title="移除"
              @click.stop="removeRecentItem(p)"
            />
          </div>
        </div>
        <div v-else class="recent-empty">暂无最近使用，可点击右上角「添加」</div>
      </el-card>

      <el-dialog
        title="添加最近使用"
        :visible.sync="addRecentVisible"
        width="90%"
        top="5vh"
        append-to-body
        custom-class="add-recent-dialog"
      >
        <div class="menu-icon-grid add-recent-grid">
          <div
            class="block"
            v-for="p in pickMenuList"
            :key="'pick-' + p.path"
          >
            <div
              class="menu-icon-item"
              :class="{ 'is-added': isRecentPath(p.path) }"
              @click="pickAddRecent(p)"
            >
              <el-button type="text" class="button">
                <div class="menu-icon-wrap">
                  <menu-icon :icon="p.icon" :size="40" />
                </div>
                <div class="menu-icon-title">
                  <span>{{ p.title }}</span>
                </div>
              </el-button>
              <i v-if="isRecentPath(p.path)" class="el-icon-check add-check" />
            </div>
          </div>
        </div>
        <div slot="footer">
          <el-button type="primary" @click="addRecentVisible = false">
            完成
          </el-button>
        </div>
      </el-dialog>
    </template>

    <!-- 统计看板默认收起：展开时才请求相关接口，避免每次进首页都产生无谓开销 -->
    <div class="dashboard-toggle">
      <el-button
        type="text"
        :icon="showDashboard ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        @click="toggleDashboard"
      >
        {{ showDashboard ? '收起统计看板' : '展开统计看板' }}
      </el-button>
      <span>含提醒、快捷入口与消耗图表，展开时才会请求数据</span>
    </div>

    <template v-if="showDashboard">
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <el-card style="height: 110px; width: 49.6%" shadow="never">
        <div class="demo-image" style="display: flex; flex-wrap: wrap">
          <div
            class="block"
            style="margin: 10px"
            v-for="(item, index) in StaticMenuList"
            :Key="index"
          >
            <div
              v-permission="[item.PERMISSION]"
              style="
                width: 90px;
                height: 70px;
                border-radius: 2px;
                margin-right: 20px;
              "
              @click="handleClickVisible(item.VISIBLE)"
            >
              <el-button type="text" class="button">
                <div
                  style="width: 100px; display: flex; justify-content: center"
                >
                  <svg-icon
                    :icon-class="item.ICON || ''"
                    style="width: 40px; height: 40px"
                  />
                </div>
                <div
                  style="
                    width: 100px;
                    display: flex;
                    justify-content: center;
                    margin-top: 5px;
                    color: #606266;
                  "
                >
                  <div class="bottom clearfix">
                    <span>{{ item.TITLE }}</span>
                  </div>
                </div>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <el-card
        style="height: 110px; width: 49.6%; position: relative; bottom: 7px"
        shadow="never"
      >
        <div class="demo-image" style="display: flex; flex-wrap: wrap">
          <div
            class="block"
            v-for="(p, index) in NoticeMenuList"
            :key="index"
            style="margin: 10px"
          >
            <div
              style="
                width: 110px;
                height: 70px;
                border-radius: 2px;
                margin-right: 20px;
              "
              @click="changeRoute(p.component)"
            >
              <el-button type="text" class="button">
                <div
                  style="width: 100px; display: flex; justify-content: center"
                >
                  <svg-icon
                    :icon-class="p.icon || ''"
                    style="width: 40px; height: 40px"
                  />
                </div>
                <div
                  style="
                    width: 100px;
                    display: flex;
                    justify-content: center;
                    margin-top: 5px;
                    color: #606266;
                  "
                >
                  <div class="bottom clearfix">
                    <span>{{
                      p.path == '/KSInventory/KSExpirationReminder' ||
                      p.component == '/KSInventory/KSExpirationReminder' ||
                      p.path == '/KSInventory/KSRemind' ||
                      p.component == '/KSInventory/KSRemind'
                        ? `${p.title}（${JYkDefRemindTotal}个）`
                        : `${p.title}（${TableListTotal}个）`
                    }}</span>
                  </div>
                </div>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- echarts 图表 -->
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      "
    >
      <el-card v-loading="dataLoading" style="width: 50%">
        <el-date-picker
          v-model="dataYear"
          @change="getSaleroomData"
          type="year"
          value-format="yyyy"
          placeholder="请选择年份"
        >
        </el-date-picker>
        <ele-chart :option="saleChartOption" style="height: 285px" />
      </el-card>
      <el-card
        v-loading="lineLoading"
        style="width: 50%; position: relative; bottom: 7px"
      >
        <el-date-picker
          v-model="lineYear"
          @change="getLineChartData"
          type="year"
          value-format="yyyy"
          placeholder="请选择年份"
        >
        </el-date-picker>
        <ele-chart :option="lineChartOption" style="height: 285px" />
      </el-card>
    </div>

    <div>
      <el-card v-loading="top20Loading">
        <div style="display: flex; gap: 10px">
          <el-date-picker
            v-model="varTopTime"
            @change="getTop20"
            type="month"
            value-format="yyyy-MM"
            placeholder="请选择时间"
          >
          </el-date-picker>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-open"
            @click="getTop20"
          >
            切换
          </el-button>
        </div>

        <ele-chart
          :option="isVarOrUsed ? varTopOption : usedTopOption"
          style="height: 500px"
        />
      </el-card>
    </div>

    <BidVarInfoDept :visible.sync="BidListShowEdit" />
    <VarietyDataLzhLook :visible.sync="VarietyDataLzhLookShow" />
    <DpetOneAuthWithDept :visible.sync="DpetOneAuthWithDeptShow" />
    <!-- <NewBatchReminder :visible.sync="NewBatchRemindervisible"/> -->
    <ele-modal
      :close-on-click-modal="true"
      @update:visible="updateKSExpirationReminderVisible"
      width="90%"
      :visible="KSExpirationReminderVisible"
      title="库存近效期提醒"
    >
      <KSExpirationReminder></KSExpirationReminder>
    </ele-modal>

    <!-- 操作指引对话框 -->
    <el-dialog
      title="操作指引"
      :visible.sync="guideDialogVisible"
      width="400px"
      center
    >
      <div style="display: flex; justify-content: space-around; padding: 20px;">
        <el-button
          type="primary"
          icon="el-icon-video-camera"
          @click="openVideo"
          style="width: 140px; height: 80px;"
        >
          <div style="margin-top: 10px;">操作视频</div>
        </el-button>
        <el-button
          type="success"
          icon="el-icon-document"
          @click="downloadGuide"
          style="width: 140px; height: 80px;"
        >
          <div style="margin-top: 10px;">操作手册</div>
        </el-button>
      </div>
    </el-dialog>
    </template>
  </div>
</template>

<script>
  import BidVarInfoDept from '@/views/KSInventory/ReferenceComponent/BidVarInfoDept/index';
  import VarietyDataLzhLook from '@/views/KSInventory/ReferenceComponent/VarietyDataLzhLook/index';
  import DpetOneAuthWithDept from '@/views/KSInventory/ReferenceComponent/DpetOneAuthWithDept/index';
  import KSExpirationReminder from '@/views/KSInventory/KSExpirationReminder/index';
  import {
    API_BASE_URL,
    BACK_BASE_URL,
    BLACK_ROUTER,
    HOME_HP
  } from '@/config/setting';
  import { getAesKey } from '@/utils/aes-util';
  import { getTableList } from '@/api/KSInventory/KSNewBatchReminder/index';
  import { SearchDefRemind } from '@/api/KSInventory/KSExpirationReminder';
  // import NewBatchReminder from './components/NewBatchReminder';

  import {
    getStaticsDataHistogram,
    getStaticsDataLineChart,
    getCurrentDeptVarTop20,
    getJykUsedQty
  } from '@/api/KSInventory/MenuList/index';
  import {
    getRecentMenus,
    addRecentMenu,
    removeRecentMenu,
    RECENT_MENUS_CHANGED
  } from '@/utils/recent-menu-util';
  import EleChart from 'ele-admin/packages/ele-chart';
  import MenuIcon from '@/components/MenuIcon';
  export default {
    name: 'MenuList',
    components: {
      // UserImport
      EleChart,
      MenuIcon,
      BidVarInfoDept,
      VarietyDataLzhLook,
      DpetOneAuthWithDept,
      KSExpirationReminder
      // NewBatchReminder
    },
    data() {
      return {
        MenuList: null,
        // 菜单分组与当前选中目录（由系统侧栏 / 顶部一级驱动）
        menuGroups: [],
        activeGroupId: '',
        // 统计看板默认收起，展开时才加载数据
        showDashboard: false,
        dashboardLoaded: false,
        recentMenuItems: [],
        addRecentVisible: false,
        pickMenuList: [],
        KSExpirationReminderVisible: false,
        NoticeMenuList: null,
        guideDialogVisible: false,
        JYkDefRemindTotal: 0,
        TableListTotal: 0,
        saleroomData: [],
        varData: [],
        usedData: [],
        lineChartData: [],
        dataYear: this.$moment().format('YYYY'),
        lineYear: this.$moment().format('YYYY'),
        varTopTime: this.$moment().format('YYYY-MM'),
        dataLoading: true,
        lineLoading: true,
        top20Loading: true,
        // 为true时调用品种前三十为false时调用盒数前三十
        isVarOrUsed: true,
        BidListShowEdit: false,
        VarietyDataLzhLookShow: false,
        DpetOneAuthWithDeptShow: false,
        NewBatchRemindervisible: false,
        StaticMenuList: [
          {
            ICON: 'zhongbiaomulu',
            TITLE: '中标目录',
            VISIBLE: 'BidListShowEdit',
            PERMISSION: 'zhongbiaomulu'
          },
          {
            ICON: 'zaiyongmulu',
            TITLE: '在用目录',
            VISIBLE: 'VarietyDataLzhLookShow',
            PERMISSION: 'zaiyongmulu'
          },
          {
            ICON: 'keshimulu',
            TITLE: '科室目录',
            VISIBLE: 'DpetOneAuthWithDeptShow',
            PERMISSION: 'keshimulu'
          },
          {
            ICON: 'shenglingzhiying',
            TITLE: '申领指引',
            VISIBLE: '',
            PERMISSION: 'shenlinzhiyin'
          }
        ]
      };
    },
    methods: {
      updateKSExpirationReminderVisible(){
        this.KSExpirationReminderVisible = !this.KSExpirationReminderVisible;
      },
      getJYkDefRemindTotal() {
        SearchDefRemind({
          page: 1,
          limit: 9999,
          where: {
            sourceFrom: this.$store.state.user.info.DeptNow.Dept_Two_Code
          }
        }).then((res) => {
          this.JYkDefRemindTotal = res.total;
        });
      },
      getTableListTotal() {
        getTableList({
          page: 1,
          limit: 9999,
          where: {
            isShow: '0'
          }
        }).then((res) => {
          this.TableListTotal = res.total;
          let exists = this.$store.state.user.info.permission_group.some(
            (item) => {
              return item.path === '/KSInventory/KSNewBatchReminder';
            }
          );
          if (exists && this.TableListTotal > 0) {
            this.$notify.info({
              title: '新批号提醒',
              message: `有${this.TableListTotal}个新批号，点击查看详情`,
              duration: 5000,
              onClick: () => {
                // 点击通知时跳转到新批号提醒页面
                this.$router.push('/KSInventory/KSNewBatchReminder');
              }
            });
          }
        });
      },
      handleClickVisible(visibleProperty) {
        if (visibleProperty) {
          this[visibleProperty] = true;
        } else {
          this.guideDialogVisible = true;
        }
      },
      downloadGuide() {
        var url = `${BACK_BASE_URL}/ZL/上药控股SPD科室操作手册.pdf`;
        window.open(url.replace('/undefined', ''));
        this.guideDialogVisible = false;
      },
      openVideo() {
        var url = `${BACK_BASE_URL}/ZL/上药控股SPD科室操作视频.mp4`;
        window.open(url.replace('/undefined', ''));
        this.guideDialogVisible = false;
      },
      getTop20() {
        this.isVarOrUsed = !this.isVarOrUsed;
        if (this.isVarOrUsed) {
          this.$nextTick(() => {
            this.top20Loading = true;
            getCurrentDeptVarTop20({ time: this.varTopTime })
              .then((res) => {
                this.top20Loading = false;
                this.varData = res.result;
              })
              .catch((err) => {
                this.$message.error(err);
                this.top20Loading = false;
              });
          });
        } else {
          this.$nextTick(() => {
            this.top20Loading = true;
            getJykUsedQty({ time: this.varTopTime })
              .then((res) => {
                this.top20Loading = false;
                this.usedData = res.data;
              })
              .catch((err) => {
                this.$message.error(err);
                this.top20Loading = false;
              });
          });
        }
      },
      /* 获取数据 */
      getSaleroomData() {
        this.$nextTick(() => {
          this.dataLoading = true;
          getStaticsDataHistogram({ time: this.dataYear })
            .then((res) => {
              this.dataLoading = false;
              this.saleroomData = res.result;
            })
            .catch((err) => {
              this.$message.error(err);
              this.dataLoading = false;
            });
        });
      },
      getLineChartData() {
        this.$nextTick(() => {
          this.lineLoading = true;
          getStaticsDataLineChart({ time: this.lineYear })
            .then((res) => {
              this.lineLoading = false;
              this.lineChartData = res.result;
            })
            .catch((err) => {
              this.$message.error(err);
              this.lineLoading = false;
            });
        });
      },
      changeRoute(data) {
        const path = data || '';
        if (
          path === '/KSInventory/KSExpirationReminder' ||
          path === '/KSInventory/KSRemind'
        ) {
          this.KSExpirationReminderVisible = true;
          return;
        }
        this.$router.push(this.$route?.query?.from ?? data);
      },
      refreshRecentMenus(list) {
        this.recentMenuItems =
          list || getRecentMenus(this.$store.state.user.info);
      },
      emitRecentChanged(list) {
        this.$bus.$emit(RECENT_MENUS_CHANGED, list);
      },
      openAddRecentDialog() {
        this.addRecentVisible = true;
      },
      isRecentPath(path) {
        return this.recentMenuItems.some((m) => m.path === path);
      },
      pickAddRecent(item) {
        const userInfo = this.$store.state.user.info;
        // 已添加则取消，未添加则加入
        if (this.isRecentPath(item.path)) {
          const list = removeRecentMenu(item.path, userInfo);
          this.refreshRecentMenus(list);
          this.emitRecentChanged(list);
          return;
        }
        const { list, ok, message } = addRecentMenu(item, userInfo);
        this.refreshRecentMenus(list);
        this.emitRecentChanged(list);
        if (!ok && message) {
          this.$message.warning(message);
        }
      },
      removeRecentItem(item) {
        const list = removeRecentMenu(item.path, this.$store.state.user.info);
        this.refreshRecentMenus(list);
        this.emitRecentChanged(list);
      },
    selectMenuGroup(group) {
      this.activeGroupId = group.id;
      try {
        sessionStorage.setItem('SPD_ACTIVE_MENU_GROUP', group.title);
      } catch (e) {
        // 隐私模式下 sessionStorage 不可用时忽略，不影响菜单切换
      }
    },
    // 由 layout/index.vue 在顶部/侧栏目录点击时广播，统一驱动工作台选中态
    onMenuGroupChange(title) {
      const key = String(title || '').trim();
      const hit = this.menuGroups.find(
        (g) => g.title === key || (g.title && key.indexOf(g.title) === 0)
      );
      if (hit) {
        this.selectMenuGroup(hit);
      }
    },
    // 最近使用记录变化时重建分组，保持首页与侧栏同步
    refreshRecentGroup() {
      if (!this.isBdrm) {
        return;
      }
      this.permission_groupList();
    },
    // 看板按需加载：只在首次展开时请求，后续由年份/切换控件自行刷新
    toggleDashboard() {
      this.showDashboard = !this.showDashboard;
      if (this.showDashboard && !this.dashboardLoaded) {
        this.dashboardLoaded = true;
        this.loadDashboardData();
      }
    },
    loadDashboardData() {
      this.getJYkDefRemindTotal();
      this.getTableListTotal();
      this.getSaleroomData();
      this.getLineChartData();
      this.getTop20();
    },
    // 按 permission_group 的 PID 把叶子菜单归到一级目录，供 tab / 侧栏 / 主区共用
    buildMenuGroups(allMenus, tiledMenus) {
      const byId = {};
      allMenus.forEach((m) => {
        byId[String(m.ID)] = m;
      });
      const isTop = (m) => m.PID == null || m.PID === '' || m.PID === '0';
      const groups = allMenus.filter(isTop).map((t) => ({
        id: String(t.ID),
        title: t.title,
        icon: t.icon || '',
        items: []
      }));
      const groupById = {};
      groups.forEach((g) => {
        groupById[g.id] = g;
      });
      const other = {
        id: '__other__',
        title: '其他',
        icon: 'el-icon-menu',
        items: []
      };
      tiledMenus.forEach((item) => {
        let pid = item.PID;
        let guard = 0;
        while (
          pid != null &&
          pid !== '' &&
          !groupById[String(pid)] &&
          guard < 6
        ) {
          const parent = byId[String(pid)];
          if (!parent || isTop(parent)) {
            break;
          }
          pid = parent.PID;
          guard += 1;
        }
        const group = groupById[String(pid)] || other;
        const path = item.component || item.path;
        if (!path || !item.title) {
          return;
        }
        group.items.push({
          path,
          title: item.title,
          icon: item.icon || ''
        });
      });
      const result = groups.filter((g) => g.items.length);
      if (other.items.length) {
        result.push(other);
      }
      // 「最近使用」虚拟目录：有记录才显示，与侧栏同源（最多 10 条）
      let recentItems = [];
      try {
        recentItems = getRecentMenus(this.$store.state.user.info).map((m) => ({
          path: m.path,
          title: m.title,
          icon: m.icon || ''
        }));
      } catch (e) {
        recentItems = [];
      }
      if (recentItems.length) {
        result.unshift({
          id: '__recent__',
          title: '最近使用',
          icon: 'el-icon-time',
          items: recentItems
        });
      }
      this.menuGroups = result;
      let rememberedTitle = '';
      try {
        rememberedTitle = sessionStorage.getItem('SPD_ACTIVE_MENU_GROUP') || '';
      } catch (e) {
        rememberedTitle = '';
      }
      const remembered = result.find((g) => g.title === rememberedTitle);
      if (remembered) {
        // 回到主菜单时恢复上次点击的目录
        this.activeGroupId = remembered.id;
      } else if (!result.some((g) => g.id === this.activeGroupId)) {
        // 默认仍落在第一个真实目录，不因「最近使用」插入而改变
        const fallback = result.find((g) => g.id !== '__recent__') || result[0];
        this.activeGroupId = fallback ? fallback.id : '';
      }
    },
    permission_groupList() {
      const allMenus = [
        ...(this.$store.state.user.info.permission_group || [])
      ];
      let permission_group = [...allMenus];

        const blackList = [
          '申领计划管理_审核按钮',
          '申领计划管理_审批按钮',
          '科室申领',
          '菜单列表',
          '入库管理',
          'UDI条码查询',
          'UDI主码管理',
          'HIS使用计费',
          '库存查询_',
          '入库管理V2',
          '医疗耗材验收',
          'UDI院内流转查询',
          '产品主码管理',
          '利用率',
          '基础数据管理',
          '出库管理',
          '库存管理',
          '调库主单-确认调库',
          '调库主单-提交调库',
          '检验科仪器分析',
          '科室目录',
          '在用目录',
          '中标目录',
          '申领指引',
          '新资质审核',
          '科室目录导出',
          '中标目录导出',
          '溯源管理',
          '溯源查询(新)',
          '价格变动记录(新)',
          '结算管理',
          '跟台耗材管理',
          '作业管理',
          '手术室耗材预约_搜索权限'
        ];
        permission_group = permission_group.filter((res) => {
          return !blackList.includes(res.title);
        });

        const rightMenuList = [
          '/KSInventory/KSNewBatchReminder',
          '/KSInventory/KSExpirationReminder',
          '/KSInventory/KSRemind'
        ];
        this.NoticeMenuList = permission_group.filter((res) => {
          return rightMenuList.includes(res.component) || rightMenuList.includes(res.path);
        });
        // 登录自动弹窗由 layout/login-tip-dialogs 统一处理（同会话只弹一次）

        const tiledMenus = permission_group.filter(
          (res) =>
            !rightMenuList.includes(res.component) &&
            !rightMenuList.includes(res.path)
        );

        if (this.isBdrm) {
          this.buildMenuGroups(allMenus, tiledMenus);
          this.MenuList = null;
          this.pickMenuList = [];
          return;
        }

        this.pickMenuList = tiledMenus
          .map((res) => ({
            path: res.component || res.path,
            title: res.title,
            icon: res.icon || ''
          }))
          .filter((res) => res.path && res.title);
      }
    },
    mounted() {
      //this.getSaleroomData();
      this.$bus.$on('handleCommand', () => {
        // 仅看板展开时才刷新，避免无谓请求
        if (this.showDashboard) {
          this.loadDashboardData();
        }
      });
      if (!this.isBdrm) {
        this.$bus.$on(RECENT_MENUS_CHANGED, this.refreshRecentMenus);
      } else {
        this.$bus.$on(RECENT_MENUS_CHANGED, this.refreshRecentGroup);
      }
      this.$bus.$on('SPD_MENU_GROUP_CHANGE', this.onMenuGroupChange);
    },
    beforeDestroy() {
      this.$bus.$off('handleCommand');
      if (!this.isBdrm) {
        this.$bus.$off(RECENT_MENUS_CHANGED, this.refreshRecentMenus);
      } else {
        this.$bus.$off(RECENT_MENUS_CHANGED, this.refreshRecentGroup);
      }
      this.$bus.$off('SPD_MENU_GROUP_CHANGE', this.onMenuGroupChange);
    },
    computed: {
      isBdrm() {
        return HOME_HP === 'bdrm';
      },
      activeGroup() {
        return (
          this.menuGroups.find((g) => g.id === this.activeGroupId) || null
        );
      },
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      lineChartOption() {
        const months = [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ];

        // 初始化数据结构，默认填充为 0 或者 null
        const initData = Array.from({ length: 12 }, () => ({
          TOTAL_MONEY: 0,
          PAST_TOTAL_MONEY: 0,
          MON_CHANGE_PERCENT: 0,
          YEAR_CHANGE_PERCENT: 0
        }));

        // 填充实际数据到对应的月份位置, 并将金额转换为万元
        this.lineChartData.forEach((item) => {
          if (item.MONTH) {
            const monthIndex = this.$moment(item.MONTH, 'YYYY-MM').month(); // 使用 moment.js 解析月份并转换为索引
            initData[monthIndex].TOTAL_MONEY = item.TOTAL_MONEY / 10000; // 将金额转换为万元
          }
          if (item.PAST_MONTH) {
            const pastMonthIndex = this.$moment(
              item.PAST_MONTH,
              'YYYY-MM'
            ).month();
            initData[pastMonthIndex].PAST_TOTAL_MONEY =
              item.PAST_TOTAL_MONEY / 10000; // 将金额转换为万元
          }
        });

        // 计算同比和环比 (注意：这里计算同比环比仍然基于万元单位的金额)
        for (let i = 0; i < 12; i++) {
          const current = initData[i].TOTAL_MONEY;
          const previous = initData[i].PAST_TOTAL_MONEY;
          const lastMonth = i > 0 ? initData[i - 1].TOTAL_MONEY : 0;

          const yoy = previous ? ((current - previous) / previous) * 100 : 0;
          const mom = lastMonth ? ((current - lastMonth) / lastMonth) * 100 : 0;

          initData[i].YEAR_CHANGE_PERCENT = yoy.toFixed(2);
          initData[i].MON_CHANGE_PERCENT = mom.toFixed(2);
        }

        const yoyChangePercentData = initData.map((d) => d.YEAR_CHANGE_PERCENT);
        const momChangePercentData = initData.map((d) => d.MON_CHANGE_PERCENT);

        return {
          title: {
            text: '消耗折线图',
            left: 'right',
            top: 'top'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              let result = params[0].name + '<br/>';
              params.forEach(function (item) {
                let valueToDisplay = item.value; // 默认值

                if (item.seriesName === '同比' || item.seriesName === '环比') {
                  // 如果是同比或环比，保持百分比显示
                  valueToDisplay = item.value + '%';
                } else if (
                  item.seriesName === '实际金额' ||
                  item.seriesName === '去年同期金额'
                ) {
                  valueToDisplay = item.value.toFixed(2) + '万元'; //  直接显示万元，因为数据已经是万元单位
                } else {
                  valueToDisplay = item.value + '%'; // 默认情况仍然显示百分比
                }

                result +=
                  item.marker +
                  item.seriesName +
                  ': ' +
                  valueToDisplay +
                  '<br/>';
              });
              return result;
            }
          },
          legend: {
            data: ['同比', '环比']
          },
          xAxis: [
            {
              type: 'category',
              data: months
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}%' // y轴标签仍然显示百分比
              }
            }
          ],
          series: [
            {
              type: 'line',
              name: '同比',
              data: yoyChangePercentData
            },
            {
              type: 'line',
              name: '环比',
              data: momChangePercentData
            }
          ]
        };
      },

      varTopOption() {
        return {
          title: {
            text: `${this.$store.state.user.info.DeptNow.Dept_Two_Name}-金额消耗排名Top 20`,
            left: 'right',
            top: 'top'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              // params 是一个数组，包含当前 hover 的柱子信息
              const item = params[0];
              const dataIndex = item.dataIndex;
              const varItem = this.varData[dataIndex];
              return `
                品种编码:${varItem.VARIETIE_CODE_NEW} <br/>
                品种名称: ${item.name}<br/>
                消耗金额: ${Number(item.value).toFixed(2)} 万元
              `;
            }.bind(this)
          },
          xAxis: {
            type: 'value',
            name: '消耗金额 (万元)'
          },
          yAxis: {
            type: 'category',
            interval: 0,
            axisLabel: {
              color: 'black' // 设置 y 轴标签颜色为红色
            },
            data: this.varData.map((item) => item.VARIETIE_NAME),
            inverse: true // 降序排列
          },
          grid: {
            // 添加 grid 属性
            containLabel: true
          },
          series: [
            {
              type: 'bar',
              data: this.varData.map((item) =>
                (Number(item.TOTALMONEY) / 10000).toFixed(2)
              ),
              label: {
                show: true,
                position: 'right',
                formatter: '{c} 万元' // 显示数值 + 单位
              }
            }
          ]
        };
      },
      usedTopOption() {
        return {
          title: {
            text: `${this.$store.state.user.info.DeptNow.Dept_Two_Name}-盒数消耗排名Top 20`,
            left: 'right',
            top: 'top'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              // params 是一个数组，包含当前 hover 的柱子信息
              const item = params[0];
              const dataIndex = item.dataIndex;
              const usedItem = this.usedData[dataIndex];
              return `
                品种名称:${item.name} <br/>
                品种规格: ${usedItem.SPECIFICATION_OR_TYPE}<br/>
                消耗数量: ${Number(item.value)} 盒
              `;
            }.bind(this)
          },
          xAxis: {
            type: 'value',
            name: '消耗数量 (盒)'
          },
          yAxis: {
            type: 'category',
            axisLabel: {
              color: 'black' // 设置 y 轴标签颜色为红色
            },
            interval: 0,
            data: this.usedData.map((item) => item.VARIETIE_NAME),
            inverse: true // 降序排列
          },
          grid: {
            // 添加 grid 属性
            containLabel: true
          },
          series: [
            {
              type: 'bar',
              data: this.usedData.map((item) => Number(item.QTY)),
              label: {
                show: true,
                position: 'right',
                formatter: '{c} 盒' // 显示数值 + 单位
              }
            }
          ]
        };
      },

      /* 配置 */
      saleChartOption() {
        const months = [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ];

        // 初始化数据结构，默认填充为 0 或者 null
        const initData = Array.from({ length: 12 }, () => ({
          TOTAL_MONEY: 0,
          PAST_TOTAL_MONEY: 0
        }));

        // 填充实际数据到对应的月份位置
        this.saleroomData.forEach((item) => {
          if (item.MONTH) {
            const monthIndex = this.$moment(item.MONTH, 'YYYY-MM').month(); // 使用 moment.js 解析月份并转换为索引
            initData[monthIndex].TOTAL_MONEY = item.TOTAL_MONEY / 10000; // 转换为万元
          }
          if (item.PAST_MONTH) {
            const pastMonthIndex = this.$moment(
              item.PAST_MONTH,
              'YYYY-MM'
            ).month();
            initData[pastMonthIndex].PAST_TOTAL_MONEY =
              item.PAST_TOTAL_MONEY / 10000; // 转换为万元
          }
        });

        // 提取每个月的 TOTAL_MONEY 和 PAST_TOTAL_MONEY 数据
        const totalMoneyData = initData.map((d) => d.TOTAL_MONEY);
        const pastTotalMoneyData = initData.map((d) => d.PAST_TOTAL_MONEY);

        return {
          title: {
            text: '消耗统计柱状图',
            left: 'right',
            top: 'top'
          },
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              let result = `${params[0].axisValue}<br/>`;
              params.forEach((item) => {
                result += `${item.marker}${item.seriesName}: ${item.data} 万元<br/>`;
              });
              return result;
            }
          },
          legend: {
            data: ['今年', '去年']
          },
          xAxis: [
            {
              type: 'category',
              data: months
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value} 万元' // 设置 y 轴单位为“万元”
              }
            }
          ],
          series: [
            {
              name: '今年',
              type: 'bar',
              data: totalMoneyData
            },
            {
              name: '去年',
              type: 'bar',
              data: pastTotalMoneyData
            }
          ]
        };
      }
    },
    created() {
      // 统计看板默认收起，5 个统计接口改由 toggleDashboard 首次展开时按需加载
      this.permission_groupList();
      if (!this.isBdrm) {
        this.refreshRecentMenus();
      }
      // this.NewBatchRemindervisible = true;
      /* 获取数据 */
      localStorage.AesKey = getAesKey();
    },
    activated() {
      if (!this.isBdrm) {
        this.refreshRecentMenus();
      }
      // 从其它页签回到主页时，恢复侧栏最后一次选中的目录
      try {
        const title = sessionStorage.getItem('SPD_ACTIVE_MENU_GROUP') || '';
        const hit = this.menuGroups.find((g) => g.title === title);
        if (hit) {
          this.activeGroupId = hit.id;
        }
      } catch (e) {
        // sessionStorage 不可用时忽略
      }
    }
  };
</script>

<style scoped>
  .menu-section-card {
    margin-bottom: 12px;
  }
  .menu-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
  }
  .menu-icon-grid {
    display: flex;
    flex-wrap: wrap;
  }
  .menu-icon-grid .block {
    margin: 10px;
  }
  .menu-icon-item {
    width: 90px;
    height: 70px;
    border-radius: 2px;
    margin-right: 20px;
    cursor: pointer;
  }
  .menu-icon-wrap {
    width: 100px;
    display: flex;
    justify-content: center;
  }
  /* 最近使用、添加弹窗里的字体图标沿用主题色；北京院区网格无此容器，与 svg 同色 */
  .menu-icon-wrap .menu-font-icon {
    color: #409eff;
  }
  .menu-icon-title {
    width: 100px;
    display: flex;
    justify-content: center;
    margin-top: 5px;
    color: #606266;
  }
  .recent-block {
    position: relative;
  }
  .recent-remove {
    position: absolute;
    top: 0;
    right: 8px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    border-radius: 50%;
    background: #c0c4cc;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .recent-block:hover .recent-remove {
    opacity: 1;
  }
  .recent-remove:hover {
    background: #f56c6c;
  }
  .recent-empty {
    color: #909399;
    font-size: 13px;
    padding: 8px 0 4px;
  }
  .add-recent-grid {
    max-height: 70vh;
    overflow-y: auto;
  }
  .menu-icon-item.is-added {
    opacity: 0.55;
    position: relative;
  }
  .add-check {
    position: absolute;
    top: 0;
    right: 8px;
    color: #67c23a;
    font-size: 16px;
    font-weight: bold;
  }

  /* 菜单首页：只展示当前目录下的图标按钮，目录导航由系统侧栏/顶部一级承担 */
  .menu-workbench {
    margin-bottom: 12px;
  }
  .dashboard-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 4px 2px;
    color: #909399;
    font-size: 12px;
  }
  .menu-group-main {
    min-height: 300px;
    padding: 12px 14px 16px;
  }
  .menu-group-main-head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
  }
  .menu-group-main-title {
    color: #303133;
    font-size: 15px;
    font-weight: 600;
  }
  .menu-group-main-meta {
    color: #909399;
    font-size: 12px;
  }
  .menu-tile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
    gap: 8px;
  }
  .menu-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 92px;
    padding: 8px 6px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
  }
  .menu-tile:hover {
    border-color: #409eff;
    background: #ecf5ff;
  }
  .menu-tile-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    color: #409eff;
  }
  .menu-tile-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-word;
    text-align: center;
    color: #303133;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.35;
  }
  .menu-tile:hover .menu-tile-title {
    color: #409eff;
  }
  .menu-tile-empty {
    padding: 40px 0;
    color: #909399;
    font-size: 13px;
    text-align: center;
  }
</style>
