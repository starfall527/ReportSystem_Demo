/***
 * @Author cwx
 * @Description 配置文件
 * @Date 2021-11-24 10:23:33
 * @LastEditTime 2022-05-11 17:48:44
 * @FilePath \ReportSystem_Demo\Admin\config.js
 */

const fs = require('fs');
const configFile = require('path').join(process.cwd(), '/config.json');

const logger = require('log4js').getLogger();

/***
 * @description: 读取config.json数据
 * @param {*}
 * @return {*}  
 */
function readConfigFile() {
    // 如果文件存在 读取数据 fs.existsSync(path)
    let result;
    result = JSON.parse(fs.readFileSync(configFile, 'utf8', (err, data) => {
        if (err) {
            logger.debug(err)
        }
    }))
    // logger.debug(result);
    return result;
}

/***
 * @description 数据写入config.json
 * @param {*} key   键
 * @param {*} value 值 可以是object/array/value
 * @return {*}
 */
function writeConfigFile(key, value) {
    let result = readConfigFile();
    result[key] = value;
    var str = JSON.stringify(result, "", "\t");

    fs.writeFile(configFile, str, function (err) {
        if (err) {
            logger.error(err);
        }
    }) // * 这里用Sync同步,方便连续写入
}

/***
 * @description: 检查config属性是否存在
 * @param {*}
 * @return {*}
 */
function checkConfigProperty(module, property) {
    if (!Object.keys(module).includes(`${property}`)) {
        logger.error(`${module} is not complete , require ${property}`);
        return false;
    } else {
        return true;
    }
}

module.exports = {
    readConfigFile,
    writeConfigFile,
    checkConfigProperty
}