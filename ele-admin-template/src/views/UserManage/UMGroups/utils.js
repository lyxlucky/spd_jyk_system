import { isButtonPermission } from '@/utils/permissionType';

export function isAddGroupOk(data) {
  return data != null && data !== 0 && data !== '0';
}

export function formatPermissionType(type) {
  return isButtonPermission({ TYPE: type }) ? '按钮' : '菜单';
}

function createTreeNode({ id, type, label, url, remarks, isRoute, children = [] }) {
  const isButton = isButtonPermission({ TYPE: type });
  return {
    ID: id,
    TYPE: type ?? 0,
    permissionType: isRoute ? 'route' : isButton ? 'button' : 'menu',
    label: label || '',
    Permission_Url: url || '',
    Remarks: remarks || '',
    children
  };
}

function findMenuNode(roots, pid) {
  if (pid == null || pid === '') {
    return null;
  }
  const pidStr = String(pid);
  for (const root of roots) {
    for (const menu of root.children || []) {
      if (menu.permissionType === 'menu' && String(menu.ID) === pidStr) {
        return menu;
      }
    }
  }
  return null;
}

/**
 * 构建分配权限树：一级目录 + 菜单 + 挂在菜单下的按钮权限。
 */
export function buildAssignPermissionTree(treeList, permissionList) {
  const roots = [];
  const addedPermissionIds = new Set();
  const orphanButtons = [];

  (treeList || []).forEach((parent) => {
    const rootNode = createTreeNode({
      id: parent.ID,
      type: 0,
      label: parent.PERMISSION_NAME,
      url: parent.COMPONENT,
      isRoute: true,
      children: []
    });

    (parent.children || []).forEach((child) => {
      const childNode = createTreeNode({
        id: child.ID,
        type: child.TYPE,
        label: child.PERMISSION_NAME,
        url: child.COMPONENT,
        remarks: child.REMARKS,
        children: []
      });
      rootNode.children.push(childNode);
      addedPermissionIds.add(child.ID);
    });

    roots.push(rootNode);
  });

  (permissionList || []).forEach((item) => {
    if (!isButtonPermission(item) || addedPermissionIds.has(item.ID)) {
      return;
    }

    const btnNode = createTreeNode({
      id: item.ID,
      type: item.TYPE,
      label: item.Permission_Name,
      url: item.Permission_Url,
      remarks: item.Remarks,
      children: []
    });

    const parentNode = findMenuNode(roots, item.PID);
    if (parentNode) {
      parentNode.children.push(btnNode);
    } else {
      orphanButtons.push(btnNode);
    }
    addedPermissionIds.add(item.ID);
  });

  if (orphanButtons.length) {
    roots.push(
      createTreeNode({
        id: '__orphan_buttons__',
        type: 0,
        label: '其他按钮',
        isRoute: true,
        children: orphanButtons
      })
    );
  }

  return roots;
}

/** @deprecated 请使用 buildAssignPermissionTree */
export function mapPermissionTree(nodes) {
  return (nodes || []).map((node) => {
    const remarks =
      node.REMARKS != null && node.REMARKS !== '' ? `（${node.REMARKS}）` : '';
    const typeTag = isButtonPermission(node) ? '（按钮）' : '';
    return {
      ID: node.ID,
      TYPE: node.TYPE,
      permissionType: isButtonPermission(node) ? 'button' : 'menu',
      label: `${node.PERMISSION_NAME || ''}${typeTag}${remarks}`,
      children: mapPermissionTree(node.children)
    };
  });
}
