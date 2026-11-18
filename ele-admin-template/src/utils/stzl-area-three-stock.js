import { HOME_HP } from '@/config/setting';

/** 肿瘤库区库存页路径（运维：自动入库/初始化/对码） */
export const STZL_AREA_INVENTORY_PATH = '/Inventory/WarehouseAreaThreeInventory';

export function isStzlHospital() {
  return HOME_HP === 'stzl';
}
