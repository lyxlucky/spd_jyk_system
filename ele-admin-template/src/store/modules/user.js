/**
 * 登录状态管理
 */
import { formatMenus, toTreeData, formatTreeData, deepClone } from 'ele-admin';
import { USER_MENUS, BLACK_LIST_ROUTERS } from '@/config/setting';
import { getUserInfo } from '@/api/layout';

export default {
  namespaced: true,
  state: {
    // 当前登录用户信息
    info: null,
    // 当前登录用户的菜单
    menus: null,
    // 当前登录用户的权限
    authorities: [],
    // 当前登录用户的角色
    roles: [],
    // 登录账号密码
    loginInfo: [],

    // 加密参数
    encrypted: {
      // 密钥
      KEY: "19941120240000001994112024000000",
      // 偏移量
      IV: "1994112024000000"
      // IV: "2019062500000000"
    },
    deptPlanNewMainId: "",
    DeptDeclarAndApprovalMainId: ""

  },
  mutations: {
    // 设置登录用户的信息
    setUserInfo(state, info) {
      state.info = deepClone(info)
    },
    // 设置登录用户的菜单
    setMenus(state, menus) {
      state.menus = menus;
    },
    // 设置登录用户的权限
    setAuthorities(state, authorities) {
      state.authorities = authorities;
    },
    // 设置登录用户的角色
    setRoles(state, roles) {
      state.roles = roles;
    },
    // 设置登录账号密码
    setLoginInfo(state, loginInfo) {
      state.loginInfo = loginInfo;
    },

    // 设置科室计划申报下表单ID参数
    setDeptPlanNewMainId(state, deptPlanNewMainId) {
      state.deptPlanNewMainId = deptPlanNewMainId;
    },

    setDeptNowInfoName(state, info) {
      state.info.DeptNow.Dept_Two_Name = info;
    },

    setDeptNowInfoCode(state, info) {
      state.info.DeptNow.Dept_Two_Code = info;
    },
    // 设置科室申报审批上表格ID
    setDeptDeclarAndApprovalMainId(state, info) {
      state.DeptDeclarAndApprovalMainId = info;
    },
  },
  actions: {
    /**
     * 请求用户信息、权限、角色、菜单
     */
    async fetchUserInfo({ commit }) {
      var data = this.state.user.loginInfo;
      // data.Token = sessionStorage.getItem('Token') ? sessionStorage.getItem('Token') : "0";
      const result = await getUserInfo(data).catch(() => { });
      result.DeptNow = result.userDept[0];
      if (!result) {
        return {};
      }
      // 用户信息
      commit('setUserInfo', result);
      // 用户权限
      const authorities = result.permission_group.map((item) => {
        return item.component;
      });
      commit('setAuthorities', authorities);

      // 用户角色
      // const roles = result.Group_Name?.map((d) => d.Group_ID) ?? [];
      const roles = result.Group_Name;
      commit('setRoles', roles);
      // 用户菜单, 过滤掉按钮类型并转为 children 形式
      //过滤
      const childrens = result.permission_group.filter((d) => {
        return !BLACK_LIST_ROUTERS.includes(d.component);
      });

      const { menus, homePath } = formatMenus(
        USER_MENUS ??
        toTreeData({
          // data: result.authorities?.filter((d) => d.menuType !== 1),
          data: childrens,
          idField: 'ID',
          parentIdField: 'PID'
        })
      );
      commit('setMenus', menus);
      return { menus, homePath };
    },
    /**
     * 更新用户信息
     */
    setInfo({ commit }, value) {
      commit('setUserInfo', value);
    },
    /**
     * 更新菜单数据
     */
    setMenus({ commit }, value) {
      commit('setMenus', value);
    },
    /**
     * 更新菜单的badge
     */
    setMenuBadge({ commit, state }, { path, value, color }) {
      const menus = formatTreeData(state.menus, (m) => {
        if (path === m.path) {
          return {
            ...m,
            meta: {
              ...m.meta,
              badge: value,
              badgeColor: color
            }
          };
        }
        return m;
      });
      commit('setMenus', menus);
    }
  }
};
