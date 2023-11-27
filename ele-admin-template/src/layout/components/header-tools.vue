<!-- 顶栏右侧区域 -->
<template>
  <div class="ele-admin-header-tool">
    <!-- 全屏切换 -->
    <div class="ele-admin-header-tool-item hidden-xs-only" @click="toggleFullscreen">
      <i v-if="fullscreen" class="el-icon-_screen-restore"></i>
      <i v-else class="el-icon-_screen-full"></i>
    </div>
    <!-- 语言切换 -->
    <div class="ele-admin-header-tool-item">
      <i18n-icon />
    </div>
    <!-- 消息通知 -->
    <div class="ele-admin-header-tool-item">
      <header-notice />
    </div>
    <!-- 用户信息 -->
    <div class="ele-admin-header-tool-item">
      <el-dropdown @command="onUserDropClick">
        <div class="ele-admin-header-avatar">
          <el-avatar :src="loginUser.avatar" />
          <span class="hidden-xs-only">{{ loginUser.nickname }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <template v-slot:dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile" icon="el-icon-user">
              {{ $t('layout.header.profile') }}
            </el-dropdown-item>
            <!-- <el-dropdown-item command="password" icon="el-icon-key">
              {{ $t('layout.header.password') }}
            </el-dropdown-item> -->
            <el-dropdown-item command="logout" icon="el-icon-switch-button" divided>
              {{ $t('layout.header.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 用户名称 -->
    <div class="ele-admin-header-tool-item">
      <h5>{{UserName}}</h5>
    </div>
    <!-- 科室名称 -->
    <div class="ele-admin-header-tool-item">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">{{DeptNow}}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(d,index) in userDept" :key="d.Dept_Two_Code+index" :command="d.Dept_Two_Name+','+d.Dept_Two_Code">{{d.Dept_Two_Name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 主题设置 -->
    <div class="ele-admin-header-tool-item" @click="openSetting">
      <i class="el-icon-_more"></i>
    </div>
    <!-- 修改密码弹窗 -->
    <!-- <password-modal :visible.sync="passwordVisible" /> -->
    <!-- 主题设置抽屉 -->
    <setting-drawer :visible.sync="settingVisible" />
  </div>
</template>

<script>
import HeaderNotice from './header-notice.vue';
import PasswordModal from './password-modal.vue';
import SettingDrawer from './setting-drawer.vue';
import I18nIcon from './i18n-icon.vue';
import { logout } from '@/utils/page-tab-util';

export default {
  components: { HeaderNotice, PasswordModal, SettingDrawer, I18nIcon },
  props: {
    // 是否是全屏
    fullscreen: Boolean
  },
  data() {
    return {
      // 是否显示修改密码弹窗
      passwordVisible: false,
      // 是否显示主题设置抽屉
      settingVisible: false
      //
      // userDept:[]
    };
  },
  computed: {
    // 当前用户信息
    loginUser() {
      return this.$store.state.user.info;
    },
    // 用户科室
    userDept() {
      return this.$store.state.user.info.userDept;
    },
    DeptNow() {
      return this.$store.state.user.info.DeptNow.Dept_Two_Name;
    },
    UserName() {
      return this.$store.state.user.info.UserName;
    }
  },
  methods: {
    handleCommand(command) {
      var userDept = command.split(',');
      this.$store.state.user.info.DeptNow.Dept_Two_Name = userDept[0];
      this.$store.state.user.info.DeptNow.Dept_Two_Code = userDept[1];
    },
    /* 用户信息下拉点击事件 */
    onUserDropClick(command) {
      if (command === 'password') {
        this.passwordVisible = true;
      } else if (command === 'profile') {
        if (this.$route.fullPath !== '/user/profile') {
          this.$router.push('/user/profile');
        }
      } else if (command === 'logout') {
        // 退出登录
        this.$confirm(
          this.$t('layout.logout.message'),
          this.$t('layout.logout.title'),
          { type: 'warning' }
        )
          .then(() => {
            logout();
          })
          .catch(() => {});
      }
    },
    /* 全屏切换 */
    toggleFullscreen() {
      this.$emit('fullscreen');
    },
    /* 打开设置抽屉 */
    openSetting() {
      this.settingVisible = true;
    }
  }
};
</script>
