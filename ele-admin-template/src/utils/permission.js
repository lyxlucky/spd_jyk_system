/**
 * 权限、角色控制（v-permission / v-role）
 */
import store from '@/store';

export default {
  install(Vue) {
    Vue.prototype.$hasPermission = function (value) {
      return hasPermission(value);
    };
    Vue.prototype.$hasRole = function (value) {
      return hasRole(value);
    };
    Vue.directive('permission', {
      inserted(el, binding) {
        applyPermissionDirective(el, binding);
      },
      update(el, binding) {
        applyPermissionDirective(el, binding);
      }
    });
    Vue.directive('role', {
      inserted(el, binding) {
        if (!hasRole(binding.value)) {
          removeEl(el);
        }
      },
      update(el, binding) {
        if (!hasRole(binding.value)) {
          removeEl(el);
        }
      }
    });
  }
};

function removeEl(el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

function applyPermissionDirective(el, binding) {
  if (!hasPermission(binding.value)) {
    removeEl(el);
  }
}

/**
 * 是否有某些权限（字符串或数组，满足其一即可）
 * 对齐 authorities，并兼容 permission_group 的 Permission_Url 等字段
 */
export function hasPermission(value) {
  if (value == null || value === '') {
    return true;
  }
  const keys = Array.isArray(value) ? value.filter(Boolean) : [value];
  if (!keys.length) {
    return true;
  }
  const authorities = store.state?.user?.authorities || [];
  if (keys.some((k) => authorities.includes(k))) {
    return true;
  }
  const pg = store.state?.user?.info?.permission_group || [];
  return keys.some((key) =>
    pg.some((p) =>
      [
        p.component,
        p.path,
        p.title,
        p.Permission_Url,
        p.PERMISSION_URL,
        p.permission_name,
        p.PERMISSION_NAME,
        p.Permission_Name
      ].some((v) => v === key)
    )
  );
}

/**
 * 是否有某些角色
 */
export function hasRole(value) {
  if (value == null || value === '') {
    return true;
  }
  const roles = store.state?.user?.roles;
  if (roles == null || roles === '') {
    return false;
  }
  const keys = Array.isArray(value) ? value.filter(Boolean) : [value];
  if (!keys.length) {
    return true;
  }
  if (Array.isArray(roles)) {
    return keys.some((k) => roles.includes(k));
  }
  return keys.includes(roles);
}
