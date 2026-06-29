export function isAddGroupOk(data) {
  return data != null && data !== 0 && data !== '0';
}

export function mapPermissionTree(nodes) {
  return (nodes || []).map((node) => {
    const remarks =
      node.REMARKS != null && node.REMARKS !== '' ? `（${node.REMARKS}）` : '';
    const typeTag = node.TYPE === 1 || node.TYPE === '1' ? '（按钮）' : '';
    return {
      ID: node.ID,
      TYPE: node.TYPE,
      label: `${node.PERMISSION_NAME || ''}${typeTag}${remarks}`,
      children: mapPermissionTree(node.children)
    };
  });
}
