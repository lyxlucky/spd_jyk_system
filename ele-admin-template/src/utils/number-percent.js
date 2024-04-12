export function numberToPercent(number){
    // 将传进来的小数转换为百分比并返回
    return (number * 100).toFixed(2) + '%'
}