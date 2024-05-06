import { toDateString } from 'ele-admin';

//获取日期对象
let date = new Date();

//获取本月第一天
export function getFirstDayOfMonth (format) {
  return toDateString((new Date(date.getFullYear(), date.getMonth(), 1)), format);
}

//获取本月最后一天
export function getLastDayOfMonth (format) {
    return toDateString((new Date(date.getFullYear(), date.getMonth() + 1, 0)), format);
}