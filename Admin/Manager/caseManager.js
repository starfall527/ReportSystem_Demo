/***
 * @Author cwx
 * @Description 病例管理后端
 * @Date 2021-10-21 17:25:59
 * @LastEditTime 2022-11-01 09:20:21
 * @FilePath \ReportSystem_Demo\Admin\Manager\caseManager.js
 */

const express = require("express");
const sqlMacros = require("../database/macro.js");
const router_case = express.Router();
const logger = require('log4js').getLogger();
const fs = require('fs');
const path = require('path');
const config = require('../config');
const slideCenter = require("../slideCenter/slideCenter.js");

/*** @note apidoc定义常规回复
 * @apiDefine CommonResponse
 * @apiSuccess {Number} code             状态码
 * @apiSuccess {String} msg              消息
 */

/*** @note apidoc定义pathCase表数据
 * @apiDefine caseSqlData
 * @apiSuccess {Object{...}} data               对象数组
 * @apiSuccess {Number} data.id                 唯一标识
 * @apiSuccess {String} data.status             病例状态
 * @apiSuccess {String} data.caseType           病例类型
 * @apiSuccess {String} data.pathologyNum       病理号
 * @apiSuccess {String} data.reportTitle        报告标题
 * @apiSuccess {String} data.consultationNum    会诊号
 * @apiSuccess {String} data.patName            病人姓名
 * @apiSuccess {String} data.patientInfo        病人信息
 * @apiSuccess {String} data.gender             性别
 * @apiSuccess {String} data.age                年龄
 * @apiSuccess {String} data.nation             病人民族
 * @apiSuccess {String} data.birthDate          出生日期
 * @apiSuccess {String} data.IDNum              身份证号
 * @apiSuccess {String} data.patTel             病人电话
 * @apiSuccess {String} data.familyTel          家属电话
 * 
 * 
 * @apiSuccess {String} data.subspecialty       亚专科
 * @apiSuccess {String} data.inspectionDate     送检时间
 * @apiSuccess {String} data.unit               送检单位
 * @apiSuccess {String} data.department         送检科室
 * @apiSuccess {String} data.hosName            医院名
 * @apiSuccess {String} data.doctor             医生名
 * @apiSuccess {String} data.doctorTel          医生电话
 * @apiSuccess {String} data.expert             会诊专家
 * 
 * @apiSuccess {String} data.isGynecology       是否妇科
 * @apiSuccess {String} data.lastMenses         末次月经
 * @apiSuccess {String} data.isMenopause        是否绝经
 * 
 * @apiSuccess {String} data.samplePart         取样部位
 * @apiSuccess {String} data.clinicalData       临床资料
 * @apiSuccess {String} data.clinicalDataFigure 临床资料附图
 * @apiSuccess {String} data.imgCheck           影像学检查
 * @apiSuccess {String} data.imgCheckFigure     影像学检查附图
 * @apiSuccess {String} data.history            病史
 * @apiSuccess {String} data.general            大体所见
 * @apiSuccess {String} data.originDiagnosis    原诊断意见
 * @apiSuccess {String} data.diagnosis          诊断意见
 * @apiSuccess {String} data.suggestion         补充意见
 * 
 * @apiSuccess {String} data.isSatisfied        标本是否满意
 * @apiSuccess {String} data.component          细胞成分
 * @apiSuccess {String} data.unsatisfiedReason  不满意理由
 * @apiSuccess {String} data.inflammation       炎症
 * @apiSuccess {String} data.reactChange        反应性改变
 * @apiSuccess {String} data.squamousCell       鳞状上皮细胞分析
 * @apiSuccess {String} data.glandularCell      腺上皮细胞分析
 * @apiSuccess {String} data.otherAnalysis      其它分析
 * 
 * @apiSuccess {String} data.note               备注
 * @apiSuccess {String} data.slideUrl           切片url json 对象数组
 * @apiSuccess {String} data.annotation         报告用图
 * @apiSuccess {String} data.reportPath         报告路径
 * @apiSuccess {String} data.signPath           签名图路径
 * 
 * @apiSuccess {String} data.freezeOrderDate    冰冻预约时间
 * @apiSuccess {String} data.uploadDate         上传时间
 * @apiSuccess {String} data.diagnoseDate       诊断时间
 * @apiSuccess {String} data.confirmDate        确认诊断时间 
 * @apiSuccess {String} data.date               时间戳
 */
const createCaseTable = sqlMacros.sqlExecute(
    "CREATE TABLE IF NOT EXISTS pathCase(" +
    "id INTEGER not null PRIMARY KEY AUTOINCREMENT ," + // id 唯一标识
    "status VARCHAR(255) NOT NULL ," + // 病例状态
    "caseType VARCHAR(255) ," + // 病例类型
    "pathologyNum VARCHAR(255) ," + // 病理号

    "reportTitle VARCHAR(255) ," + // 报告标题
    "consultationNum VARCHAR(255) ," + // 会诊号
    "patName VARCHAR(255) ," + // 病人姓名
    "patientInfo VARCHAR(255) ," + // 病人信息
    "gender VARCHAR(255) ," + // 性别
    "age VARCHAR(255) ," + // 病人年龄
    "nation VARCHAR(255) ," + // 病人民族
    "birthDate timestamp ," + // 出生日期
    "IDNum VARCHAR(255)," + // 身份证号
    "patTel VARCHAR(255) ," + // 病人电话
    "familyTel VARCHAR(255) ," + // 家属电话
    "subspecialty VARCHAR(255)," + // 亚专科
    "inspectionDate timestamp," + // 送检时间
    "unit VARCHAR(255)," + // 送检单位
    "department VARCHAR(255)," + // 送检科室
    "hosName VARCHAR(255)," + // 医院名
    "doctor VARCHAR(255)," + // 医生名
    "doctorTel VARCHAR(255)," + // 医生电话
    "expert VARCHAR(255)," + // 会诊专家

    "isGynecology VARCHAR(255)," + // 是否妇科    
    "lastMenses timestamp," + // 末次月经
    "isMenopause VARCHAR(255)," + // 是否绝经    

    "samplePart VARCHAR(255)," + // 取样部位 
    "clinicalData VARCHAR(255)," + // 临床资料
    "clinicalDataFigure VARCHAR(255)," + // 临床资料附图
    "imgCheck VARCHAR(255)," + // 影像学检查
    "imgCheckFigure VARCHAR(255)," + // 影像学检查附图
    "history VARCHAR(255)," + // 病史
    "general VARCHAR(255)," + // 大体所见
    "originDiagnosis VARCHAR(255)," + // 原诊断意见
    "diagnosis VARCHAR(255)," + // 诊断意见
    "suggestion VARCHAR(255)," + // 补充意见

    "isSatisfied VARCHAR(255)," + // 标本是否满意
    "component VARCHAR(255)," + // 细胞成分 
    "unsatisfiedReason VARCHAR(255)," + // 不满意理由
    "inflammation VARCHAR(255)," + // 炎症
    "reactChange VARCHAR(255)," + // 反应性改变
    "pathogen VARCHAR(255)," + // 病原体
    "squamousCell VARCHAR(255)," + // 鳞状上皮细胞分析
    "glandularCell VARCHAR(255)," + // 腺上皮细胞分析
    "otherAnalysis VARCHAR(255)," + // 其它分析

    "note VARCHAR(255)," + // 备注
    "slideUrl TEXT," + // 切片url json 对象数组
    "annotation TEXT," + // 报告用图
    "reportPath TEXT," + // 报告路径
    "signPath TEXT," + // 签名图路径

    "freezeOrderDate VARCHAR(255) ," + // 冰冻预约时间
    "uploadDate timestamp," + // 上传时间
    "diagnoseDate timestamp," + // 诊断时间
    "confirmDate timestamp," + // 确认诊断时间
    "date timestamp NOT NULL default (datetime('now', 'localtime')))" // 建表时间
);
// sqlMacros.sqlAlter('pathCase', 'clinicalDataFigure', 'VARCHAR(255)', ''); //新增字段
sqlMacros.sqlAlter('pathCase', 'suggestion', 'VARCHAR(255)', ''); //新增字段

/*** @note 查询病例
 * @api {get} /api/case/table 查询病例
 * @apiVersion 0.0.1
 * @apiName table
 * @apiGroup 病例管理
 * @apiUse caseSqlData
 * @apiUse CommonResponse
 * @apiSuccess {Number} count   返回数据个数
 */
router_case.get('/table', function(req, res) {
    let userName = req.query.userName;
    let result = [];
    let cases;
    if (![undefined].includes(req.query.filterSos)) { // 处理soul-table数据 返回各个字段所有可能出现的值
        let filterKeys = [];
        let filterValues = [];
        let filter = JSON.parse(req.query.filterSos);
        filter.forEach(element => {
            if (element.values.length > 0) { // * 防止element.values为[]时被加到filterValues
                filterKeys.push(element.field);
                filterValues.push(element.values);
            }
        });
        cases = sqlMacros.sqlQuery('*', 'pathCase', filterKeys, filterValues, 'AND');
    } else { cases = sqlMacros.sqlSelect('*', 'pathCase') }

    let user = sqlMacros.sqlSelect('*', 'USER', true, 'userName', userName);
    let mode = 'organization'; // 是否仅看自己的病例
    if (mode === 'organization') { // 看同组织的病例
        if (user.length > 0) {
            cases.forEach(element => {
                if (element.hosName === user[0].organization) { // 只能看自己建立的病例
                    result.push(element);
                }
            });
        }
    } else if (mode === 'self') {
        cases.forEach(element => {
            if (element.doctor === userName) { // 只看自己建立的病例
                result.push(element);
            }
        });
    }
    let pageData = sqlMacros.getPageData(result, req.query.page, req.query.limit);
    let NATtraverse = user[0].NATtraverse;
    replaceNATtraverse(pageData, NATtraverse);
    var json = {
        code: 200,
        msg: '成功',
        data: pageData,
        count: result.length
    };
    if (result.length == 0) {
        json.msg = '查询无数据';
    }
    res.send(json);
});

/*** @note 查询病例筛选值
 * @api {post} /api/case/table 查询病例筛选值
 * @apiVersion 0.0.1
 * @apiName tableFilter
 * @apiGroup 病例管理
 * 
 * @apiParam {Object} data 数据对象
 * @apiParam {String{...}} data.status       病例状态
 * @apiParam {String{...}} data.caseType     病例类型
 * @apiParam {String{...}} data.subspecialty 亚专科
 * @apiParam {String{...}} data.expert       专家
 * @apiUse CommonResponse
 */
router_case.post('/table', function(req, res) {
    // 处理soul-table数据 返回各个字段所有可能出现的值
    let data = {
        status: [],
        caseType: [],
        subspecialty: [],
        doctor: [],
        expert: [],
        patName: [],
        pathologyNum: [],
        date: []
    };
    let userName = req.body.userName;
    let result = [];
    let cases = sqlMacros.sqlSelect('*', 'pathCase');
    let user = sqlMacros.sqlSelect('*', 'USER', true, 'userName', userName);
    let mode = 'organization'; // 是否仅看自己的病例
    if (mode === 'organization') { // 看同组织的病例
        if (user.length > 0) {
            cases.forEach(element => {
                if (element.hosName === user[0].organization) { // 只能看自己建立的病例
                    result.push(element);
                }
            });
        }
    } else if (mode === 'self') {
        cases.forEach(element => {
            if (element.doctor === userName) { // 只看自己建立的病例
                result.push(element);
            }
        });
    }

    cases.forEach(element => {
        data.status.push(element.status);
        data.caseType.push(element.caseType);
        data.subspecialty.push(element.subspecialty);
        data.expert.push(element.expert);
        data.doctor.push(element.doctor);
        data.patName.push(element.patName);
        data.pathologyNum.push(element.pathologyNum);
        data.date.push(element.date);
    });
    Object.keys(data).forEach(element => {
        data[element] = sqlMacros.uniqueArray(data[element]);
    });

    data.code = 200;
    data.msg = '成功';
    res.send(data);
});

/*** @note 专家端查询病例
 * @api {get} /api/case/expertTable 专家端查询病例
 * @apiVersion 0.0.1
 * @apiName expertTable
 * @apiGroup 病例管理
 * @apiUse caseSqlData
 * @apiUse CommonResponse
 * @apiSuccess {Number} count   返回数据个数
 */
router_case.get('/expertTable', function(req, res) {
    let userName = req.query.userName;
    let cases;
    let result = [];
    if (![undefined].includes(req.query.filterSos)) { // 处理soul-table数据 返回各个字段所有可能出现的值
        let filterKeys = [];
        let filterValues = [];
        let filter = JSON.parse(req.query.filterSos);
        filter.forEach(element => {
            if (element.values.length > 0) { // * 防止element.values为[]时被加到filterValues
                filterKeys.push(element.field);
                filterValues.push(element.values);
            }
        });
        cases = sqlMacros.sqlQuery('*', 'pathCase', filterKeys, filterValues, 'AND');
    } else { cases = sqlMacros.sqlSelect('*', 'pathCase') }

    cases.forEach(element => {
        if (element.expert !== null && ['等待诊断', '诊断完成', '专家退回', '专家重诊'].includes(element.status)) {
            let experts = element.expert.split('/');
            experts.forEach(expertsElement => {
                if (expertsElement === userName) {
                    result.push(element);
                }
            });
        }
    }); // * 搜索指派给该专家的病例 未发起的病例不显示

    let user = sqlMacros.sqlSelect('*', 'USER', true, 'userName', userName);
    let pageData = sqlMacros.getPageData(result, req.query.page, req.query.limit);
    let NATtraverse = user[0].NATtraverse;
    replaceNATtraverse(pageData, NATtraverse);
    var json = {
        code: 200,
        msg: '成功',
        data: pageData,
        count: result.length
    };
    if (result.length == 0) { json.msg = '查询无数据'; }
    res.send(json);
});

/*** @note 专家端查询病例筛选值
 * @api {post} /api/case/expertTable 专家端查询病例筛选值
 * @apiVersion 0.0.1
 * @apiName expertTableFilter
 * @apiGroup 病例管理
 * 
 * @apiParam {Object} data 数据对象
 * @apiParam {String{...}} data.status       病例状态
 * @apiParam {String{...}} data.caseType     病例类型
 * @apiParam {String{...}} data.subspecialty 亚专科
 * @apiParam {String{...}} data.hosName      医院
 * @apiParam {String{...}} data.doctor       医生
 * @apiUse CommonResponse
 */
router_case.post('/expertTable', function(req, res) {
    // 处理soul-table数据 返回各个字段所有可能出现的值
    let data = {
        status: [],
        caseType: [],
        subspecialty: [],
        hosName: [],
        doctor: [],
        patName: [],
        pathologyNum: [],
        date: []
    };
    let userName = req.body.userName;
    let result = [];
    let cases = sqlMacros.sqlSelect('*', 'pathCase');

    cases.forEach(element => {
        if (element.expert !== null && ['等待诊断', '诊断完成', '专家退回', '专家重诊'].includes(element.status)) {
            let experts = element.expert.split('/');
            experts.forEach(expertsElement => {
                if (expertsElement === userName) {
                    result.push(element);
                }
            });
        }
    }); // * 搜索指派给该专家的病例 未发起的病例不显示

    result.forEach(element => {
        data.status.push(element.status);
        data.caseType.push(element.caseType);
        data.subspecialty.push(element.subspecialty);
        data.hosName.push(element.hosName);
        data.doctor.push(element.doctor);
        data.patName.push(element.patName);
        data.pathologyNum.push(element.pathologyNum);
        data.date.push(element.date);
    });

    Object.keys(data).forEach(element => {
        data[element] = sqlMacros.uniqueArray(data[element]);
    });

    data.code = 200;
    data.msg = '成功';
    res.send(data);
});

/*** @note  条件查询
 * @description: 条件查询
 * @param {*} res
 * @return {*}
 */
router_case.post('/query', function(req, res) {
    let data = req.body.data;
    let NATtraverse = '';
    let user = sqlMacros.sqlSelect('*', 'USER', true, 'userName', data.userName);
    if (user.length > 0) {
        NATtraverse = user[0].NATtraverse;
    }
    delete data.userName;
    var reqKeys = Object.keys(data);
    var reqValues = Object.values(data);
    let result = sqlMacros.sqlQuery('*', 'pathCase', reqKeys, reqValues, 'AND');
    let pageData = sqlMacros.getPageData(result, req.query.page, req.query.limit);
    replaceNATtraverse(pageData, NATtraverse);

    var json = {
        code: 200,
        msg: '成功',
        data: pageData,
        count: result.length,
        NATtraverse: NATtraverse
    };
    if (result.length == 0) { json.msg = '查询无数据'; }
    res.send(json);
});


/*** @note  删除病例
 * @api {get} /api/case/delete 删除病例
 * @apiName deleteCase
 * @apiGroup 病例管理
 * @apiParam {Object} data                  数据对象
 * @apiParam {Object} data.id               病例id
 * @apiUse CommonResponse
 */
router_case.get('/delete', function(req, res) {
    let data = req.query;
    let result = sqlMacros.sqlDelete('id', data.id, 'pathCase'); //删除所选数据
    let reportPath = path.join(process.cwd(), '/upload/', data.reportPath);
    if (fs.existsSync(reportPath) && ![null, '', undefined].includes(data.reportPath)) {
        fs.unlinkSync(reportPath); // * 删除相关pdf文件
    }
    var json = { code: 200, msg: '成功' };
    res.send(json);
});

/*** @note 批量删除病例
 * @api {post} /api/case/batchDel 批量删除病例
 * @apiName BatchDeleteCase
 * @apiGroup 病例管理
 * @apiParam {ObjectArray} data             数据对象
 * @apiParam {Object} data.id               病例id
 * @apiUse CommonResponse
 */
router_case.post('/batchDel', function(req, res) {
    let data = req.body.data;
    for (let i = 0; i < data.length; i++) {
        let reportPath = path.join(process.cwd(), '/upload/', data[i].reportPath);
        if (fs.existsSync(reportPath) && ![null, '', undefined].includes(data[i].reportPath)) {
            fs.unlinkSync(reportPath); // * 删除相关pdf文件
        }
        let result = sqlMacros.sqlDelete('id', data[i]['id'], 'pathCase');
    } // * 根据id删除所选数据

    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});

/*** @note  新增病例数据
 * @api {post} /api/case/insert 新增病例数据
 * @apiName InsertCase
 * @apiGroup 病例管理
 * @apiParam {Object} data                  数据对象,具体字段参考列表
 * @apiUse CommonResponse
 */
router_case.post('/insert', function(req, res) {
    let data = req.body.data;
    delete data.file;
    if (data.caseType === "常规病例") {
        data.isGynecology = "非妇科";
        data.isMenopause = '';
        data.lastMenses = '';
    } else if (data.caseType === "TBS病例") {
        if (data.isGynecology === "非妇科") {
            data.isMenopause = '';
            data.lastMenses = '';
        }
    }
    var reqKeys = Object.keys(data);
    var reqValues = Object.values(data);
    reqKeys.push('status');
    reqValues.push('待发起会诊');

    var json = { code: 200, msg: '成功' };
    if (reqKeys.includes('id')) { // 编辑病例
        let user = sqlMacros.sqlQuery('*', 'USER', ['userName'], [data.expert], 'AND');
        if (user.length > 0) {
            reqKeys.push('signPath');
            reqValues.push(user[0].sign);
        }
        sqlMacros.sqlMultiUpdate(reqKeys, reqValues, 'pathCase', ['id'], [data.id]);
        json.caseID = data.id;
        reqKeys = reqKeys.slice(-1);
        reqValues = reqValues.slice(-1);
    } else { // 新增病例
        let user = sqlMacros.sqlQuery('*', 'USER', ['userName'], [data.expert], 'AND');
        if (user.length > 0) {
            reqKeys.push('signPath');
            reqValues.push(user[0].sign);
            if ([undefined, 'null', null, ''].includes(user[0].sign)) {
                json = { code: 500, msg: '所选专家未上传电子签名,无法指派' };
                res.send(json);
                return;
            }
        } else {
            json = { code: 500, msg: '未查询到专家' };
            res.send(json);
            return;
        }
        let result = sqlMacros.sqlInsert(reqKeys, reqValues, 'pathCase');
    }
    // console.log(reqKeys);
    // console.log(reqValues);
    let newCase = sqlMacros.sqlQuery('*', 'pathCase', reqKeys, reqValues, 'AND');
    if (newCase.length > 0) {
        json.caseID = newCase[0].id;
    } else { json = { code: 500, msg: '新增病例失败' }; } //状态不对,发起会诊后再编辑会错误弹这个
    res.send(json);
});

/*** @note  发起会诊
 * @api {post} /api/case/startConsultation 发起会诊
 * @apiName startConsultation
 * @apiGroup 病例管理
 * @apiParam {Object} data                  数据对象
 * @apiParam {String} data.pathologyNum     病理号
 * @apiParam {String} data.patName          病人姓名
 * @apiParam {String} data.hosName          医院名 
 * @apiUse CommonResponse
 */
router_case.post('/startConsultation', function(req, res) {
    let caseData = req.body.data;
    let flag = true;
    if (caseData.length > 0) {
        let incompleteData = [];
        caseData.forEach(caseElement => {
            flag = true;
            ["pathologyNum", "patName", "expert", "slideUrl", "caseType"].forEach(element => {
                if ([null, undefined, "", 'null'].includes(caseElement[element])) {
                    flag = false;
                    incompleteData.push(caseElement);
                }
            }); // * 需要检查该病例的各个必填项是否为空,包括病理号,病人名,专家名,切片url等等  
            if (flag) {
                let result = sqlMacros.sqlMultiUpdate(['status', 'uploadDate'],
                    ['等待诊断', new Date().Format("yyyy-MM-dd hh:mm:ss")], 'pathCase', 'id', caseElement.id);
            }
        });
        sqlMacros.uniqueArray(incompleteData);
        if (incompleteData.length === 0) {
            res.send({
                code: 200,
                msg: '成功'
            });
        } else { res.send({ code: 500, msg: '有病例信息未完善,请检查数据完整性' }); }
    } else {
        ["pathologyNum", "patName", "expert", "slideUrl", "caseType"].forEach(element => {
            if (caseData[element] === "" || caseData[element] === undefined || caseData[element] === null) {
                flag = false;
            }
        }); // * 需要检查该病例的各个必填项是否为空,包括病理号,病人名,专家名,切片url等等
        if (flag) {
            let result = sqlMacros.sqlMultiUpdate(['status', 'uploadDate'], ['等待诊断', new Date().Format("yyyy-MM-dd hh:mm:ss")], 'pathCase', 'id', caseData.id);
            res.send({
                code: 200,
                msg: '成功'
            });
        } else { res.send({ code: 500, msg: '有病例信息未完善,请检查数据完整性' }); }
    }
});

// /*** @note  选择专家
//  * @api {post} /api/case/chooseExpert 选择专家 暂时没用
//  * @apiName chooseExpert
//  * @apiGroup 病例管理
//  * @apiUse CommonResponse
//  */
// router_case.post('/chooseExpert', function(req, res) {
//     let data = req.body.data;
//     let caseID = req.body.caseID;
//     let expertName = '';
//     data.forEach(element => { expertName += element.name + '/'; });
//     if (expertName !== '') {
//         expertName = expertName.slice(0, expertName.length - 1);
//     }
//     let result = sqlMacros.sqlMultiUpdate(['expert'], [expertName], 'pathCase', 'id', caseID);
//     res.send({ code: 200, msg: '成功' });
// });


// /*** @note  选择切片
//  * @api {post} /api/case/chooseSlide 选择切片 暂时没用
//  * @apiName chooseSlide
//  * @apiGroup 病例管理
//  * @apiUse CommonResponse
//  */
// router_case.post('/chooseSlide', function(req, res) {
//     let data = req.body.data;
//     let caseID = req.body.caseID;
//     let slides = [];
//     let result = sqlMacros.sqlMultiUpdate(['slideUrl'], [data.slideUrl], 'pathCase', 'id', caseID);
//     res.send({ code: 200, msg: '成功' });
// });

// /*** @note  选择报告用图
//  * @api {post} /api/case/chooseAnnotation 选择报告用图 暂时没用
//  * @apiName chooseExpert
//  * @apiGroup 病例管理
//  * @apiUse CommonResponse
//  */
// router_case.post('/chooseAnnotation', function(req, res) {
//     let data = req.body.data;
//     let annotation = [];
//     data.forEach(element => {
//         annotation.push(element);
//     });
//     sqlMacros.sqlMultiUpdate(['annotation'], [JSON.stringify(annotation)], 'pathCase', 'id', req.body.caseID);
//     res.send({
//         code: 200,
//         msg: '成功'
//     });
// });

// @note 更新病例数据
router_case.post('/update', function(req, res) {
    let data = req.body.data;
    var reqKeys = Object.keys(data);
    var reqValues = Object.values(data);
    let result = sqlMacros.sqlMultiUpdate(reqKeys, reqValues,
        'pathCase', 'id', req.body.caseID);
    let newData = sqlMacros.sqlSelect('*', 'pathCase', true, 'id', req.body.caseID);
    var json = {
        code: 200,
        msg: '成功'
    };
    if (newData.length > 0) {
        json.data = newData[0];
    }
    res.send(json);
});

const puppeteer = require("puppeteer");
const { resolve } = require("path");
/*** @note 生成报告
 * @api {post} /api/case/openReport 生成报告
 * @apiName openReport
 * @apiGroup 病例管理
 * @apiUse CommonResponse
 * @apiParam {String} reportPath 报告路径
 */
router_case.get('/openReport', function(req, res) {
    var caseData = req.query;
    const option = process.argv;
    var type = caseData.caseType;
    var userName = caseData.userName;
    var user = sqlMacros.sqlSelect('*', 'USER', true, 'userName', userName);
    if (user.length > 0) {
        user = user[0];
        if (!['', null, undefined, 'null'].includes(user.reportTitle)) {
            caseData.reportTitle = JSON.parse(user.reportTitle)[type].reportTitle;
            caseData.subtitle = JSON.parse(user.reportTitle)[type].subtitle;
        } else {
            let organization = sqlMacros.sqlSelect('*', 'organization', true, 'name', user.organization);
            if (organization.length > 0) {
                organization = organization[0];
                caseData.reportTitle = organization.reportTitle;
            }
        }
    } else {
        logger.error(`用户不存在,无法生成报告,请联系管理员  userName:${userName}`);
        var json = { code: 500, msg: '当前用户不存在,无法生成报告,请联系管理员' };
        res.send(json);
        return;
    }
    let caseTypeDisplay = {
        '常规病例': 'Normal',
        'TBS病例': 'TBS',
    };
    type = caseTypeDisplay[type];
    let executablePath = '';
    if (![null, undefined, ''].includes(config.readConfigFile().chromePath)) {
        executablePath = config.readConfigFile().chromePath;
    }
    const puppeteerConf = {
        // headless: false,
        defaultViewport: { width: 1300, height: 900 },
        slowMo: 30,
        devtools: false,
        executablePath: executablePath // * 部署时需要配置chrome路径,否则无法生成pdf
    };

    var address = path.join('file:///', process.cwd(), `upload/templet/report${type}.html`); //  路径和caseType相关
    var reportPath = '';
    let checkFlag = false;
    (async () => {
        if (option.length >= 3) { address = option[2]; }
        const browser = await puppeteer.launch(puppeteerConf);
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080
        }); // 设置视窗
        await page.goto(address, { waitUntil: "networkidle2" });
        await page.evaluate((caseData) => {
            let annotationUrl = JSON.parse(caseData.annotation);
            for (const key in caseData) {
                if (Object.hasOwnProperty.call(caseData, key)) {
                    const element = caseData[key];
                    if ([null, ''].includes(element) && !["unsatisfiedReason", 'isMenopause',
                            'clinicalDataFigure', 'imgCheckFigure'
                        ].includes(key)) {
                        caseData[key] = '无';
                    }
                }
            }
            let error = [];
            if (![null, undefined, ''].includes(document.getElementById("reportTitle")) &&
                ![null, undefined, '无'].includes(caseData.reportTitle)) {
                document.getElementById("reportTitle").innerHTML = caseData.reportTitle;
                if (![null, undefined, ''].includes(document.getElementById("subtitle"))) {
                    if (![null, undefined, '', 'null', '无'].includes(caseData.subtitle)) {
                        document.getElementById("subtitle").innerHTML = caseData.subtitle;
                    } else {
                        document.getElementById("subtitle").setAttribute("style", "display:none;");
                    }
                }
                error.push("reportTitle");
            }
            if (caseData.caseType === "TBS病例" && caseData.isGynecology === "妇科") {
                if (![null, undefined, ''].includes(document.getElementById("isMenopause"))) {
                    document.getElementById("isMenopause").innerHTML += caseData.isMenopause;
                    if (![null, undefined, ''].includes(document.getElementById("lastMenses"))) {
                        if (caseData.isMenopause === "是") {
                            document.getElementById("lastMenses").innerHTML = '绝经日期:';
                        }
                        document.getElementById("lastMenses").innerHTML += caseData.lastMenses;
                    }
                }
            } else if (caseData.caseType === "TBS病例") {
                document.getElementById("isMenopause").setAttribute("style", "display:none;");
                document.getElementById("lastMenses").setAttribute("style", "display:none;");
            }

            if (![null, undefined, ''].includes(document.getElementById("pathologyNumLabel"))) {
                document.getElementById("pathologyNumLabel").innerHTML += caseData.pathologyNum;
                error.push("pathologyNumLabel");
            }
            if (![null, undefined, ''].includes(document.getElementById("patNameLabel"))) {
                document.getElementById("patNameLabel").innerHTML += caseData.patName; // 病人姓名
                error.push("patNameLabel");
            }
            if (![null, undefined, ''].includes(document.getElementById("genderLabel"))) {
                document.getElementById("genderLabel").innerHTML += caseData.gender; // 性别
                error.push("genderLabel");
            }
            if (![null, undefined, ''].includes(document.getElementById("ageLabel"))) {
                document.getElementById("ageLabel").innerHTML += caseData.age; // 年龄
                error.push("ageLabel");
            }
            if (![null, undefined, ''].includes(document.getElementById("doctorLabel"))) {
                document.getElementById("doctorLabel").innerHTML += caseData.doctor; // 医生
                error.push("doctorLabel");
            }
            if (![null, undefined, ''].includes(document.getElementById("hosNameLabel"))) {
                document.getElementById("hosNameLabel").innerHTML += caseData.hosName; // 医生
                error.push("hosNameLabel");
            }
            if (![null, undefined, ''].includes(document.getElementById("samplePartLabel"))) {
                document.getElementById("samplePartLabel").innerHTML += caseData.samplePart; // 取样位置
                error.push("samplePartLabel");
            }
            if (![null, undefined, ''].includes(document.getElementById("unitLabel"))) {
                document.getElementById("unitLabel").innerHTML += caseData.unit; // 送检单位
                error.push("unitLabel");
            }
            if (![null, undefined, ''].includes(document.getElementById("uploadDateLabel"))) {
                document.getElementById("uploadDateLabel").innerHTML += caseData.uploadDate; // 发起会诊时间
                error.push("uploadDateLabel");
            }
            if (![null, undefined, ''].includes(document.getElementById("history"))) {
                document.getElementById("history").innerHTML += caseData.history; // 病史
                error.push("history");
            }
            if (![null, undefined, ''].includes(document.getElementById("clinicalData"))) {
                document.getElementById("clinicalData").innerHTML += caseData.clinicalData; // 临床资料                
                if (['无', '', null, undefined].includes(caseData.clinicalData) && ![null, undefined, '', 'null'].includes(caseData.clinicalDataFigure)) {
                    document.getElementById("clinicalData").setAttribute('style', "display:none;");
                }
            }
            if (![null, undefined, ''].includes(document.getElementById("imgCheck"))) {
                document.getElementById("imgCheck").innerHTML += caseData.imgCheck; // 影像学检查
                if (['无', '', null, undefined].includes(caseData.imgCheck) && ![null, undefined, '', 'null'].includes(caseData.imgCheckFigure)) {
                    document.getElementById("imgCheck").setAttribute('style', "display:none;");
                }
            }
            if (![null, undefined, ''].includes(document.getElementById("clinicalDataFigure")) &&
                ![null, undefined, '', 'null'].includes(caseData.clinicalDataFigure)) {
                document.getElementById("clinicalDataFigure").setAttribute('src', '../../upload' + caseData.clinicalDataFigure);
                document.getElementById("clinicalDataFigure").setAttribute('style', "display:block;");
                // document.getElementById("clinicalData").innerHTML = "临床资料:";
            }
            if (![null, undefined, ''].includes(document.getElementById("imgCheckFigure")) &&
                ![null, undefined, '', 'null'].includes(caseData.imgCheckFigure)) {
                document.getElementById("imgCheckFigure").setAttribute('src', '../../upload' + caseData.imgCheckFigure);
                document.getElementById("imgCheckFigure").setAttribute('style', "display:block;");
                // document.getElementById("imgCheck").innerHTML = "影像学检查:";
            }

            if (caseData.caseType === "常规病例") {
                if (![null, undefined, ''].includes(document.getElementById("general"))) {
                    document.getElementById("general").innerHTML += caseData.general; // 大体所见
                }
            } else if (caseData.caseType === "TBS病例") {
                if (![null, undefined, ''].includes(document.getElementById("sampleQuality"))) {
                    let semiColon = '';
                    if (![null, undefined, ''].includes(caseData.unsatisfiedReason)) {
                        semiColon = ';'; // * 不满意时,需要加分号隔开 不满意理由
                    }
                    document.getElementById("sampleQuality").innerHTML +=
                        `${caseData.isSatisfied}${semiColon}${caseData.unsatisfiedReason}`; // 标本质量
                }
                if (![null, undefined, ''].includes(document.getElementById("component"))) {
                    document.getElementById("component").innerHTML += caseData.component; // 细胞成分
                }
                if (![null, undefined, ''].includes(document.getElementById("inflammation"))) {
                    document.getElementById("inflammation").innerHTML += caseData.inflammation; // 炎症
                }
                if (![null, undefined, ''].includes(document.getElementById("reactChange"))) {
                    document.getElementById("reactChange").innerHTML += caseData.reactChange; // 反应性改变
                }
                if (![null, undefined, ''].includes(document.getElementById("pathogen"))) {
                    document.getElementById("pathogen").innerHTML += caseData.pathogen; // 病原体
                }
                if (![null, undefined, ''].includes(document.getElementById("squamousCell"))) {
                    document.getElementById("squamousCell").innerHTML += caseData.squamousCell; // 鳞状上皮细胞分析
                }
                if (![null, undefined, ''].includes(document.getElementById("glandularCell"))) {
                    document.getElementById("glandularCell").innerHTML += caseData.glandularCell; // 腺上皮细胞分析
                }
                if (![null, undefined, ''].includes(document.getElementById("otherAnalysis"))) {
                    document.getElementById("otherAnalysis").innerHTML += caseData.otherAnalysis; // 其它分析
                }
            }

            if (![null, undefined, ''].includes(document.getElementById("note"))) {
                document.getElementById("note").innerHTML += caseData.note; // 原诊断意见
            }
            if (![null, undefined, ''].includes(document.getElementById("originDiagnosis"))) {
                document.getElementById("originDiagnosis").innerHTML += caseData.originDiagnosis; // 原诊断意见
            }

            if (annotationUrl.length > 0) {
                for (let i = 0; i < 3; i++) {
                    if (![null, undefined, ''].includes(document.getElementById(`annotation${i}`))) {
                        if (i < annotationUrl.length) { // 上限3个标注图
                            document.getElementById(`annotation${i}`).setAttribute('src', annotationUrl[i].annotationUrl); // 标注图   
                        } else { document.getElementById(`annotation${i}`).setAttribute('style', "display:none;"); } // 标注图 
                    }
                }
            }
            if (![null, undefined, ''].includes(document.getElementById("diagnosis"))) {
                document.getElementById("diagnosis").innerHTML += caseData.diagnosis; // 诊断意见
            }
            if (![null, undefined, ''].includes(document.getElementById("suggestion"))) {
                document.getElementById("suggestion").innerHTML += caseData.suggestion; // 补充意见
            }
            if (![null, undefined, ''].includes(document.getElementById("signImg"))) {
                document.getElementById("signImg").setAttribute('src',
                    '../../upload' + caseData.signPath + '?' + Math.floor(Math.random() * 100 + 1)); // 电子签名 这里路径是图片相对于模板的路径
            }
            if (![null, undefined, ''].includes(document.getElementById("diagnoseDate"))) {
                document.getElementById("diagnoseDate").innerHTML += caseData.diagnoseDate; // 诊断日期
            }
            return error;
        }, caseData).then(error => {
            // console.log(error); // * 调试用,检测未定义dom
        });
        // ! 目前pdf只能生成一页 需要滚动截图 或是研究page.pdf的参数

        function imagesHaveLoaded() { return Array.from(document.images).every((i) => i.complete); }
        await page.waitForFunction(imagesHaveLoaded); // 等待图片加载完成
        await page.waitForTimeout(100); // * 额外延时
        // await page.screenshot({
        //     path: './' + caseData.pathologyNum + '.png'
        // }); // 截图

        reportPath = 'report/report_' + caseData.id + '.pdf';
        await page.pdf({
            path: process.cwd() + '/upload/' + reportPath,
            format: "A4",
            printBackground: true,
            fullPage: true,
            "-webkit-print-color-adjust": "exact",
        }).then(() => {
            sqlMacros.sqlMultiUpdate(['reportPath'], [reportPath], 'pathCase', 'id', caseData.id);
            logger.info('pdf生成成功,path:' + process.cwd() + '/upload/' + reportPath);
            checkFlag = true;
        });
        await browser.close();
    })()
    let timeout = 0;
    let check = setInterval(() => {
        if (checkFlag) {
            var json = {
                code: 200,
                msg: '成功',
                reportPath: reportPath
            };
            clearInterval(check);
            res.send(json);
        } else {
            timeout += 200;
            if (timeout >= 15000) { // 设置超时5秒
                clearInterval(check);
                res.send({
                    code: 500,
                    msg: '报告生成超时'
                });
            }
        }
    }, 200);

    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                // 页面的当前高度
                let totalHeight = 0;
                // 每次向下滚动的距离
                let distance = 100;
                // 通过setInterval循环执行
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;

                    // 执行滚动操作
                    window.scrollBy(0, distance);

                    // 如果滚动的距离大于当前元素高度则停止执行
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        }); // 完成懒加载后可以完整截图或者爬取数据等操作
    }
});

var multiparty = require("multiparty") // 解析form-data上传
/*** @note 上传附图
 * @api {post} /api/user/uploadFigure 上传附图
 * @apiName uploadFigure
 * @apiGroup 病例管理
 * @apiParam {Object} data           数据对象
 * @apiParam {String} data.id        唯一标识
 * @apiParam {String} data.field     更新的键
 * @apiParam {String} data.value     更新的键值
 * @apiParamExample 
 * {}
 * @apiUse CommonResponse
 */
router_case.post('/uploadFigure', function(req, res) {
    let caseID = req.headers.id;
    let fileName = '';
    let from_data = new multiparty.Form()
    from_data.parse(req);
    from_data.on("part", async part => {
        if (part.filename) {
            let uploadDir = `upload/figure/`; // 指定文件存储目录
            fileName = `case${caseID}_${req.headers.type}` + '.jpg'; // * 统一格式为jpg 跟随上传文件格式则替换为part.filename.slice(part.filename.lastIndexOf('.'));
            let fullPath = path.join(process.cwd(), uploadDir, fileName);
            // sqlMacros.sqlMultiUpdate([req.headers.type], ['/figure/' + fileName], 'pathCase', 'id', caseID); // * 存在数据库的路径,去掉upload,方便前端加载
            // * 路径在前端保存了,按下“保存”按钮后再写入数据库
            const writeStream = fs.createWriteStream(fullPath); // 保存文件
            part.pipe(writeStream);
        }
        var json = {
            code: 200,
            msg: '成功',
            url: '/figure/' + fileName // * 前端的路径从upload开始算
        };
        res.send(json);
    })
});


/*** @note 取消附图
 * @api {post} /api/user/cancelFigure 取消附图
 * @apiName cancelFigure
 * @apiGroup 病例管理
 * @apiParam {Object} data           数据对象
 * @apiParam {String} data.id        病例ID
 * @apiParam {String} data.type      附图类型
 * @apiUse CommonResponse
 */
router_case.get('/cancelFigure', function(req, res) {
    let caseID = req.query.id;
    let fileName = `case${caseID}_${req.query.type}` + '.jpg'; // * 统一格式为jpg 跟随上传文件格式则替换为part.filename.slice(part.filename.lastIndexOf('.'));
    let uploadDir = `upload/figure/`; // 指定文件存储目录
    let fullPath = path.join(process.cwd(), uploadDir, fileName);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // * 删除相关pdf文件
    }
    sqlMacros.sqlMultiUpdate([req.query.type], [''], 'pathCase', 'id', caseID); // * 存在数据库的路径,去掉upload,方便前端加载
    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});

function replaceNATtraverse(pageData, NATtraverse) {
    if (!['', null, undefined, 'null'].includes(NATtraverse)) {
        pageData.forEach(element => {
            if (!['', null, undefined, 'null'].includes(element.slideUrl)) {
                let tmpSlideUrl = JSON.parse(element.slideUrl);
                tmpSlideUrl.forEach(slideUrlElement => {
                    slideUrlElement.slideUrl = slideCenter.urlReplaceIP(slideUrlElement.slideUrl, NATtraverse)
                    slideUrlElement.label = slideCenter.urlReplaceIP(slideUrlElement.label, NATtraverse)
                    slideUrlElement.thumbnail = slideCenter.urlReplaceIP(slideUrlElement.thumbnail, NATtraverse)
                });
                element.slideUrl = JSON.stringify(tmpSlideUrl);
            }
            if (!['', null, undefined, 'null'].includes(element.annotation)) {
                let tmpAnnotation = JSON.parse(element.slideUrl);
                tmpAnnotation.forEach(annotationElement => {
                    annotationElement.annotationUrl = slideCenter.urlReplaceIP(annotationElement.annotationUrl, NATtraverse)
                });
                element.annotation = JSON.stringify(tmpAnnotation);
            }
            // 来自外网的访问需要把apiRes的127.0.0.1:9804替换成NATtraverse
        });
    }
    return pageData;
}

module.exports = {
    router_case
};