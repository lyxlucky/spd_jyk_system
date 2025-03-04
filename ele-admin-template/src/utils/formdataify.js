import { TOKEN_STORE_NAME } from '@/config/setting';

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
* 格式数据为 get参数字符串 
* 
*/
export const formdataifyGet = (params) => {
    
    let getParamsStr = "?"
    let arr = []
    Object.keys(params).forEach(ele=>{
        arr.push(`${ele}=${params[ele]}`)
    })
    getParamsStr += arr.join('&')
    return getParamsStr;
};

/**
 * 结构赋值给Object
 * Data 要添加的原对象
 * params 要添加的对象
 */

export const DataToObject = (data, params) => {
    Object.entries(params).forEach(item => {
        data[item[0]] = item[1];
    })
    data.size = data.limit;
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    // 删除where属性
    Reflect.deleteProperty(data, 'where')
    return data;
};

/**
 * 生成GUID
 */
export const GetGuid = (len = 32, radix = 16) => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
};


/** 格式化日期 */
export const formatDate = (date, format) => {
    date = new Date(date);
    // 当前时间字符串
    var dateNowChar = new Date(Date.now());

    // 当前时间
    var dateNowLast =`${dateNowChar.toLocaleDateString().replace(/\//g, '-')}` + ` ${dateNowChar.toTimeString().substring(0, 8)}`


    format = format.toLowerCase()
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    var dateLast = "";
    switch (format) {
        case "yyyy":
            dateLast = `${year}`
            break;
        case "yyyy-mm":
            dateLast = `${year}-${month}`
            break;
        case "yyyy-mm-dd":
            dateLast = `${year}-${month}-${day}`
            break;
        case "yyyy-mm-dd hh:mi:ss":
            dateLast = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            break;
        default:
            dateLast = `${year}-${month}-${day}`
            break;
    }
    return dateLast;
};

function getAesKey() {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var nums = "";
    for (var i = 0; i < 32; i++) {
        var id = parseInt(Math.random() * 61);
        nums += chars[id];
    }
    return nums;
}
