/***
 * @Author cwx
 * @Description 组织管理
 * @Date 2022-06-24 18:30:19
 * @LastEditTime 2022-07-15 14:49:47
 * @FilePath \ReportSystem_Demo\Admin\Manager\organization.js
 */
const express = require("express");
const sqlMacros = require("../database/macro.js");
const router_organization = express.Router();
const logger = require('log4js').getLogger();
const fs = require('fs');
const path = require('path');

/*** @note sql表定义
 * @description: organization表定义
 * @field {*}   id              唯一标识
 * @field {*}   status          病例状态
 * @field {*}   date            时间戳(建表时间)
 */
const createOrganizationTable = sqlMacros.sqlExecute(
    "CREATE TABLE IF NOT EXISTS ORGANIZATION(" +
    "id INTEGER not null PRIMARY KEY AUTOINCREMENT ," + // id 唯一标识
    "name VARCHAR(255) ," + // 组织名
    "status VARCHAR(255) ," + // 组织状态
    "reportTitle VARCHAR(255) ," + // 报告标题
    "describe VARCHAR(255)," + // 描述
    "note VARCHAR(255)," + // 备注
    "date timestamp NOT NULL default (datetime('now', 'localtime')))" // 建表时间
);
sqlMacros.sqlAlter('ORGANIZATION', 'describe', 'VARCHAR(255)', ''); //新增字段

/***
 * @description:@note 查询病例
 * @param {*} res
 * @return {*}
 */
router_organization.get('/table', function(req, res) {
    let result = sqlMacros.sqlSelect("*", 'ORGANIZATION');
    var json = {
        code: 200,
        msg: '成功',
        data: sqlMacros.getPageData(result, req.query.page, req.query.limit),
        count: result.length
    };
    if (result.length == 0) {
        json.msg = '查询无数据';
    }
    res.send(json);
});

/*** @note  新增组织
 * @api {post} /api/organization/insert 新增组织
 * @apiName InsertOrganization
 * @apiGroup 玻片管理
 * @apiParam {Object} data                  数据对象,具体字段由表单决定
 * @apiUse CommonResponse
 */
router_organization.post('/insert', function(req, res) {
    let data = req.body.data;
    var reqKeys = Object.keys(data);
    var reqValues = Object.values(data);
    var json = { code: 200, msg: '成功' };
    if (reqKeys.includes('id')) { // 编辑组织
        sqlMacros.sqlMultiUpdate(reqKeys, reqValues, 'ORGANIZATION', ['id'], [data.id]);
    } else { // 新增组织
        reqKeys.push('status');
        reqValues.push('启用');
        let newCase = sqlMacros.sqlQuery('*', 'ORGANIZATION', reqKeys, reqValues, 'AND');
        if (newCase.length === 0) {
            let result = sqlMacros.sqlInsert(reqKeys, reqValues, 'ORGANIZATION');
        } else {
            json = { code: 500, msg: '新增组织失败：组织已存在' };
            res.send(json);
            return;
        }
    }
    let newCase = sqlMacros.sqlQuery('*', 'ORGANIZATION', reqKeys, reqValues, 'AND');
    if (newCase.length > 0) {
        json.caseID = newCase[0].id;
    } else { json = { code: 500, msg: '新增/编辑组织失败' }; }
    res.send(json);
});



/*** @note  删除组织
 * @description: 删除
 * @param {*} delete
 * @param {*} res
 * @return {*}
 */
router_organization.get('/delete', function(req, res) {
    let data = req.query;
    let result = sqlMacros.sqlDelete('id', data.id, 'ORGANIZATION'); //删除所选数据 
    var json = { code: 200, msg: '成功' };
    res.send(json);
});



module.exports = {
    router_organization
};