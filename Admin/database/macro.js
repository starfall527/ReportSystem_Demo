/***
 * @Author cwx
 * @Description 数据库操作
 * @Date 2021-10-21 17:25:59
 * @LastEditTime 2022-05-11 15:51:20
 * @FilePath \ReportSystem_Demo\Admin\database\macro.js
 * @reference https://github.com/JoshuaWise/better-sqlite3 
 * @PS 后台数据暂时不做排序(即使要做估计也只需要针对时间排序,表格内置sort只对当前分页有效),优先级较低
 */
 const Database = require("better-sqlite3");
 const db = new Database('./ihc.db');
 const logger = require('log4js').getLogger('database');
 
 // todo 设计一个数据库升级的方法,使得版本更新时,可以在不丢失数据的情况下更新表的结构(sqlAlter内有查询当前数据库结构的逻辑)
 // 思路:使用一个对象,记录数据库的结构,每次更新时,比对数据库结构,如果不一致,则使用ALTER功能更新数据库结构
 
 /***
  * @description: 统计表中符合条件的数据的总数
  * @param {*} tableName 表名
  * @param {*} where     是否需要条件查询
  * @param {*} key1      条件查询键
  * @param {*} key1value 条件查询键值
  * @return {int} 查询结果
  */
 function getTableCount(tableName, where, key1, key1value) {
     let sqlString;
     if (where == false) {
         sqlString = `SELECT count(*) FROM ${tableName}`;
     } else {
         sqlString = `SELECT count(*) FROM ${tableName} WHERE ${key1} = '${key1value}'`;
     }
     return db.prepare(sqlString).get()['count(*)'];
 }
 
 /*** @note 查询数据
  * @description: 查询数据
  * @param {*} key1      需要查询的键
  * @param {*} tableName 表名
  * @param {*} where     是否需要条件查询
  * @param {*} key2      条件查询键
  * @param {*} key2value 条件查询键值
  * @return {json}  查询结果
  * todo 这里没加保护,不好用.优化方案:对查不到的情况添加保护
  */
 function sqlSelect(key1, tableName, where, key2, key2value) {
     let sqlString;
     if (where == true) {
         sqlString = `SELECT ${key1} FROM ${tableName} WHERE ${key2} = '${key2value}'`
     } else {
         sqlString = `SELECT ${key1} FROM ${tableName} `
     }
     return db.prepare(sqlString).all();
 }
 
 /*** 
  * @description: 多条件查询数据
  * @param {*} key1          需要查询的键
  * @param {*} tableName     表名
  * @param {*} keys2         条件查询键数组
  * @param {*} keys2value    条件查询键值数组
  * @param {*} type          AND/OR
  * @return {json}  查询结果
  * @PS  可接受时间范围查询,目前仅支持laydate格式
  * @PPS 可接受同一条件多值查询,传入键值需为Array格式
  */
 function sqlQuery(key1, tableName, keys2, keys2value, type) {
     let sqlString = `SELECT ${key1} FROM ${tableName} `,
         timeRange = null,
         queryArrayString = "";
 
     for (let i = keys2value.length - 1; i >= 0; i--) {
         if (keys2value[i] == '' || keys2value[i] == undefined) {
             keys2value.splice(i, 1);
             keys2.splice(i, 1);
         } // 检查keys2value是否有空值,如有则删除该条件
         else if (typeof keys2value[i] == 'string') {
             if ((keys2[i].includes('date') || keys2[i].includes('Date') ||
                     keys2[i].includes('time') || keys2[i].includes('Time')) && keys2value[i].includes(' - ')) {
                 timeRange = {
                     key: keys2[i],
                     startTime: keys2value[i].split(' - ')[0],
                     endTime: keys2value[i].split(' - ')[1],
                 };
                 keys2value.splice(i, 1);
                 keys2.splice(i, 1);
             } // 检查keys2value是否为时间范围,目前仅支持日期
         }
 
         if (typeof keys2value[i] == 'object') {
             for (let j = 0; j < keys2value[i].length; j++) {
                 if (j < keys2value[i].length - 1) {
                     queryArrayString += ` ${keys2[i]} = '${keys2value[i][j]}' OR `;
                 } else {
                     queryArrayString += `${keys2[i]} = '${keys2value[i][j]}'`;
                 }
             }
             keys2value.splice(i, 1);
             keys2.splice(i, 1); //弹出当前key2和key2value,在队尾添加拆分后的key2/key2value(无需检查)   
         } // 检查key2value是否包含数组 PS:判断条件是object,Array属于Object,或许可能需要精准识别Array
     }
 
     if (keys2.length > 0 || timeRange != null || queryArrayString != "") {
         sqlString += ' WHERE ';
         // 若检查后的条件不为空,则加上WHERE,否则返回全部数据
         if (type == 'AND') {
             for (let i = 0; i < keys2.length; i++) {
                 if (i < keys2.length - 1) {
                     sqlString += `${keys2[i]} = '${keys2value[i]}' AND `;
                 } else {
                     sqlString += `${keys2[i]} = '${keys2value[i]}'`;
                 }
             }
             if (timeRange != null) {
                 sqlString += `${timeRange.key} >= '${timeRange.startTime}' AND ${timeRange.key} <= '${timeRange.endTime}'`;
             }
         } else if (type == 'OR') {
             for (let i = 0; i < keys2.length; i++) {
                 if (i < keys2.length - 1) {
                     sqlString += `${keys2[i]} = '${keys2value[i]}' OR `;
                 } else {
                     sqlString += `${keys2[i]} = '${keys2value[i]}'`;
                 }
             }
         }
         sqlString += queryArrayString;
     }
     logger.info(sqlString);
     // todo 这里做个保护,如果查不到,则返回空数组(或者是[{}]),不要返回undefined
     // todo 这样的话 之前用length的判断都作废了
     return db.prepare(sqlString).all();
 }
 
 
 /*** @note 更新数据
  * @description: 更新数据
  * @param {*} key1      需要更新的键
  * @param {*} key1value 需要更新的键值
  * @param {*} tableName 表名
  * @param {*} where     是否需要条件查询
  * @param {*} key2      条件查询键
  * @param {*} key2value 条件查询键值
  * @return {json}  更新结果
  */
 function sqlUpdate(key1, key1value, tableName, key2, key2value) {
     let sqlString = `UPDATE ${tableName} SET ${key1} = '${key1value}' WHERE ${key2} = '${key2value}'`;
     logger.debug(sqlString);
     //return '';
     return db.prepare(sqlString).run();
 }
 
 
 /***
  * @description: 更新多条数据
  * @param {Array} keys1      需要更新的键
  * @param {Array} keys1value 需要更新的键值
  * @param {*} tableName  表名
  * @param {Array} key2      条件查询键
  * @param {Array} key2value 条件查询键值
  * @param {*} type     条件查询类型
  * @return {*}  更新结果
  */
 function sqlMultiUpdate(keys1, keys1value, tableName, keys2, keys2value, type) {
 
     let checkArray = [keys1, keys1value];
     if (['AND', 'OR'].includes(type)) {
         checkArray.push(keys2, keys2value);
         checkArray.forEach(function (element) {
             if (typeof element !== 'object') {
                 logger.error(`input params type incorrect, ${element} is not an array`); // 提醒参数类型错误
             }
         })
     }
     let sqlString = "UPDATE " + tableName + " SET ";
     for (let i = 0; i < keys1.length; i++) {
         if (i < keys1.length - 1) {
             sqlString += `${keys1[i]} = '${keys1value[i]}' , `;
         } else {
             sqlString += `${keys1[i]} = '${keys1value[i]}' `;
         }
     }
 
     sqlString += " WHERE ";
     if (type == 'AND') {
         for (let i = 0; i < keys2.length; i++) {
             if (i < keys2.length - 1) {
                 sqlString += `${keys2[i]} = '${keys2value[i]}' AND `;
             } else {
                 sqlString += `${keys2[i]} = '${keys2value[i]}' `;
             }
         }
     } else if (type == 'OR') {
         for (let i = 0; i < keys2.length; i++) {
             if (i < keys2.length - 1) {
                 sqlString += `${keys2[i]} = '${keys2value[i]}' OR `;
             } else {
                 sqlString += `${keys2[i]} = '${keys2value[i]}' `;
             }
         }
     } else {
         sqlString += `${keys2} = '${keys2value}' `;
     }
 
     // logger.warn(sqlString);
     return db.prepare(sqlString).run();
 }
 
 /*** @note 删除数据
  * @description: 删除数据
  * @param {*} key1      需要删除数据的键
  * @param {*} key1value 需要删除数据的键值
  * @param {*} tableName 表名
  * @return {*}  删除结果
  */
 function sqlDelete(key1, key1value, tableName) {
     let sqlString = `DELETE FROM ${tableName} WHERE ${key1} = '${key1value}'`
     logger.debug(sqlString);
     return db.prepare(sqlString).run();
 }
 
 /*** @note 插入数据
  * @description:  插入数据
  * @param {array} keys      插入的键
  * @param {array} values    插入的键值    
  * @param {*} tableName 表名
  * @return {*}
  */
 function sqlInsert(keys, values, tableName) {
     let sqlString = `INSERT INTO ${tableName} (`
     for (let i = 0; i < keys.length; i++) {
         if (i != keys.length - 1) {
             sqlString += `'${keys[i]}',`;
         } else {
             sqlString += `'${keys[i]}')`;
         }
     }
 
     sqlString += 'VALUES(';
     for (let i = 0; i < values.length; i++) {
         if (i != values.length - 1) {
             sqlString += `'${values[i]}',`;
         } else {
             sqlString += `'${values[i]}')`;
         }
     }
     // logger.debug(sqlString);
     return db.prepare(sqlString).run();
 }
 
 /*** 
  * @description: 插入数据语句
  * @param {array} keys      插入的键
  * @param {array} values    插入的键值    
  * @param {*} tableName 表名
  * @return {*} sqlString
  */
 function getSqlInsertString(keys, values, tableName) {
     let sqlString = `INSERT INTO ${tableName} (`
     for (let i = 0; i < keys.length; i++) {
         if (i != keys.length - 1) {
             sqlString += `'${keys[i]}',`;
         } else {
             sqlString += `'${keys[i]}')`;
         }
     }
 
     sqlString += ' VALUES(';
     for (let i = 0; i < values.length; i++) {
         if (i != values.length - 1) {
             sqlString += `'${values[i]}',`;
         } else {
             sqlString += `'${values[i]}')`;
         }
     }
     return (sqlString);
 }
 
 /***
  * @description: 清空表 不改变表的结构
  * @param {*} tableName 表名
  * @return {*}
  */
 function sqlClearTable(tableName) {
     let sqlString = `DELETE FROM ${tableName};`;
     db.prepare(sqlString).run();
     sqlString = `update sqlite_sequence SET seq = 0 where name = '${tableName}'`
     return db.prepare(sqlString).run();
 }
 
 /***
  * @description: 获取步骤数量
  * @param {*} experimentID
  * @return {*}
  */
 function getStepCount(experimentID) {
     let sqlString = `SELECT stepCount FROM EXPERIMENT WHERE id = '${experimentID}'`;
     return db.prepare(sqlString).get()['stepCount'];
 }
 
 
 /***
  * @description: 获取当前分页数据
  * @param {*} sqlData   sql操作后获得的数据
  * @param {*} page      页码
  * @param {*} limit     每页显示数据条数
  * @return {*}
  * @TODO 先取所有数据,再截取分页数据,资源大概会有一点点点浪费(小问题)
  */
 function getPageData(sqlData, page, limit) {
     let data;
     if (page != undefined || limit != undefined) {
         let start = (page - 1) * limit,
             end = page * limit;
         data = sqlData.slice(start, end);
     } else {
         data = sqlData;
     }
     return data;
 }
 
 /*** 合并事务并执行
  * @description: 合并事务并执行
  * @param {*} sqlStringArray
  * @return {*}
  */
 function sqlTransaction(sqlStringArray) {
     const transaction = db.transaction(function (array) {
         for (let i = 0; i < array.length; i++) {
             db.prepare(array[i]).run();
         }
     }) // * 定义transaction实现
     transaction(sqlStringArray); // * 将sqlStringArray传入transaction中
 }
 
 /***
  * @description: 执行sql语句
  * @param {*} sqlString
  * @return {*}
  */
 function sqlExecute(sqlString) {
     return db.exec(sqlString);
 }
 
 /***
  * @description: 在现有表中增加属性
  * @param {*} table         表名
  * @param {*} property      属性名
  * @param {*} type          属性类型
  * @param {*} additions     附加说明,例如 not null , unique等
  * @return {*}
  */
 function sqlAlter(table, property, type, additions) {
     let tableInfo = db.prepare(`SELECT * FROM sqlite_master`).all();
     tableInfo.forEach(element => {
         if (element.name == table) {
             if (!element.sql.includes(property)) {
                 let sqlString = `ALTER TABLE ${table} ADD COLUMN ${property} ${type} ${additions}`;
                 logger.info(sqlString);
                 db.prepare(sqlString).run();
             } else {
                 logger.info(`property ${property} already exists in ${table}`);
             }
         }
     });
 }
 
 /***
  * @description: 删除表
  * @param {*} table 表名
  * @return {*}
  */
 function sqlDropTable(table) {
     return db.exec(`DROP TABLE ${table}`);
 }
 
 
 module.exports = {
     sqlExecute,
     sqlSelect,
     sqlQuery,
     sqlUpdate,
     sqlDelete,
     sqlInsert,
     sqlAlter,
     sqlTransaction,
     getTableCount,
     getStepCount,
     sqlMultiUpdate,
     sqlClearTable,
     sqlDropTable,
 
     getPageData,
     getSqlInsertString,
 };