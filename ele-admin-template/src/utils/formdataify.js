/**
* 格式数据为 表单 form-data 
* Content-Type: multipart/form-data
*/

export const formdataify = (params) => {
    const formData = new FormData();
    Object.keys(params).forEach(key => {
        if (typeof params[key] == "string") {
            formData.append(key, params[key]);
        } else {
            formData.append(key, JSON.stringify(params[key]));
        }
    });
    return formData;
};

/**
 * 结构赋值给Object
 * Data 要添加的原对象
 * params 要添加的对象
 */

export const DataToObject = (data,params) => {
    Object.entries(params).forEach(item=>{
        data[item[0]] = item[1];
    })
    data.size = data.limit;
    data.Token = sessionStorage.getItem('Token');
    // 删除where属性
    Reflect.deleteProperty(data, 'where')
    return data;
};