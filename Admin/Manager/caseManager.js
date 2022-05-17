/***
 * @Author cwx
 * @Description 玻片管理后端
 * @Date 2021-10-21 17:25:59
 * @LastEditTime 2022-05-17 16:43:18
 * @FilePath \ReportSystem_Demo\Admin\Manager\caseManager.js
 */

// * 玻片管理的本质就是打印标签,记录该玻片的病人信息与实验信息 数据格式要能被后续的步骤解析
// * 与标签打印机的二次开发需求未确定,暂缓
// * 可能会有与LIS系统通信的需求
// * pathCase表添加字段, 可从该字段中读取实验信息
// * 集成标签打印,并能够把实验信息写入二维码中
// * 二维码承载内容:实验ID,玻片ID
// let o={
//      experimentID: "",
//      caseID: "",
// }


const express = require("express");
const sqlMacros = require("../database/macro.js");
const router_case = express.Router();
const logger = require('log4js').getLogger();

/*** @note sql表定义
 * @description: pathCase表定义
 * @field {*}   id              唯一标识
 * @field {*}   status          病例状态
 * @field {*}   pathologyNum    病理号
 * @field {*}   patName         病人姓名
 * @field {*}   gender          病人性别
 * @field {*}   age             病人年龄
 * @field {*}   department      送检单位
 * @field {*}   hosName         医院名
 * @field {*}   subspecialty    亚专科
 * @field {*}   samplePart      取样部位
 * @field {*}   expert          会诊专家
 * @field {*}   note            备注
 * @field {*}   uploadDate      上传时间
 * @field {*}   diagnoseDate    诊断时间
 * @field {*}   confirmDate     确认诊断时间
 * @field {*}   date            时间戳(建表时间)
 */
const createCaseTable = sqlMacros.sqlExecute(`CREATE TABLE IF NOT EXISTS pathCase(
    id INTEGER not null PRIMARY KEY AUTOINCREMENT ,
    status VARCHAR(255) NOT NULL ,
    pathologyNum VARCHAR(255) NOT NULL ,
    patName VARCHAR(255) NOT NULL ,
    patientInfo VARCHAR(255) ,
    gender VARCHAR(255) ,
    age VARCHAR(255) ,
    department VARCHAR(255) ,
    hosName VARCHAR(255) ,
    subspecialty VARCHAR(255) ,
    note VARCHAR(255) ,
    uploadDate timestamp ,
    diagnoseDate timestamp ,
    confirmDate timestamp ,
    date timestamp NOT NULL default (datetime('now','localtime'))
    )`);

// sqlMacros.sqlAlter('pathCase', 'patientInfo', 'VARCHAR(255)', '');

/*** apidoc定义pathCase表数据
 * @apiDefine CaseSqlData
 * @apiSuccess {Object} data                数据对象
 * @apiSuccess {String} data.id             唯一标识
 * @apiSuccess {String} data.pathologyNum   病理号
 * @apiSuccess {String} data.patName        病人姓名
 * @apiSuccess {String} data.hosName        医院名
 * @apiSuccess {String} data.date           创建时间
 */

/***
 * @description: 查询玻片
 * @param {*} res
 * @return {*}
 */
router_case.get('/table', function (req, res) {
    let result = sqlMacros.sqlSelect('*', 'pathCase');
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

/***
 * @description: 条件查询玻片
 * @param {*} res
 * @return {*}
 */
router_case.post('/query', function (req, res) {
    let data = req.body;
    let result = sqlMacros.sqlQuery('*', 'pathCase', ['pathologyNum', 'date'], [data.pathologyNum, data.date], 'AND');
    var json = {
        code: 200,
        msg: '成功',
        data: sqlMacros.getPageData(result, data.page, data.limit),
        count: result.length
    };
    if (result.length == 0) {
        json.msg = '查询无数据';
    }
    res.send(json);
});


/***
 * @description: 删除玻片
 * @param {*} delete
 * @param {*} res
 * @return {*}
 */
router_case.post('/delete', function (req, res) {
    let data = req.body.data;
    for (let i = 0; i < data.length; i++) {
        let result = sqlMacros.sqlDelete('id', data[i]['id'], 'pathCase');
    } //删除所选数据

    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});

/*** 新增玻片数据
 * @api {post} /api/case/insert 新增玻片数据
 * @apiName InsertCase
 * @apiGroup 玻片管理
 * 
 * @apiParam {Object} data                  数据对象
 * @apiParam {String} data.pathologyNum     病理号
 * @apiParam {String} data.patName          病人姓名
 * @apiParam {String} data.hosName          医院名
 * @apiParamExample 
  {
     
  }
 * 
 * @apiUse CommonResponse
 */
router_case.post('/insert', function (req, res) {
    let data = req.body.data;
    var reqValues = [data.pathologyNum, data.patName, data.hosName, data.note, data.experimentName];
    var reqKeys = ['pathologyNum', 'patName', 'hosName', 'note', 'experimentName'];
    let result = sqlMacros.sqlInsert(reqKeys, reqValues, 'pathCase');

    res.send({
        code: 200,
        msg: '成功'
    });
});


module.exports = {
    router_case
};