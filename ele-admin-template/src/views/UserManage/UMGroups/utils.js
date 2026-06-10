export function isAddGroupOk(data) {
  return data != null && data !== 0 && data !== '0';
}

export function mapPermissionTree(nodes) {
  return (nodes || []).map((node) => {
    const remarks =
      node.REMARKS != null && node.REMARKS !== '' ? `（${node.REMARKS}）` : '';
    return {
      ID: node.ID,
      label: `${node.PERMISSION_NAME || ''}${remarks}`,
      children: mapPermissionTree(node.children)
    };
  });
}
