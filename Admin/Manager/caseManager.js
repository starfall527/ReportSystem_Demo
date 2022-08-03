/***
 * @Author cwx
 * @Description 病例管理后端
 * @Date 2021-10-21 17:25:59
 * @LastEditTime 2022-08-02 16:56:50
 * @FilePath \ReportSystem_Demo\Admin\Manager\caseManager.js
 */

const express = require("express");
const sqlMacros = require("../database/macro.js");
const router_case = express.Router();
const logger = require('log4js').getLogger();
const fs = require('fs');
const path = require('path');
const config = require('../config');

/*** @note sql表定义
 * @description: pathCase表定义
 * @field {*}   id              唯一标识
 * @field {*}   status          病例状态
 * @field {*}   pathologyNum    病理号
 * @field {*}   patName         病人姓名
 * @field {*}   gender          病人性别
 * @field {*}   age             病人年龄
 * @field {*}   birthDate       出生日期
 * @field {*}   IDNum           身份证号
 * @field {*}   patTel          病人电话
 * @field {*}   familyTel       家属电话
 * @field {*}   subspecialty    专科 
 * @field {*}   inspectionDate  送检时间
 * @field {*}   unit            送检单位
 * @field {*}   department      送检科室
 * @field {*}   hosName         医院名
 * @field {*}   doctor          医生名
 * @field {*}   doctorTel       医生电话
 * @field {*}   samplePart      取样部位
 * @field {*}   expert          会诊专家
 * @field {*}   note            备注
 * @field {*}   uploadDate      上传时间
 * @field {*}   diagnoseDate    诊断时间
 * @field {*}   confirmDate     确认诊断时间
 * @field {*}   date            时间戳(建表时间)
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
    "subspecialty VARCHAR(255)," + // 专科
    "inspectionDate timestamp," + // 送检时间
    "unit VARCHAR(255)," + // 送检单位
    "department VARCHAR(255)," + // 送检科室
    "hosName VARCHAR(255)," + // 医院名
    "doctor VARCHAR(255)," + // 医生名
    "doctorTel VARCHAR(255)," + // 医生电话
    "expert VARCHAR(255)," + // 会诊专家

    "lastMenses VARCHAR(255)," + // 末次月经
    "isMenopause VARCHAR(255)," + // 是否绝经    

    "samplePart VARCHAR(255)," + // 取样部位 
    "clinicalData VARCHAR(255)," + // 临床资料
    "imgCheck VARCHAR(255)," + // 影像学检查
    "history VARCHAR(255)," + // 病史
    "general VARCHAR(255)," + // 大体所见
    "originDiagnosis VARCHAR(255)," + // 原诊断意见
    "diagnosis VARCHAR(255)," + // 诊断意见

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
    "slideUrl TEXT," + // 切片url json数组
    "annotation TEXT," + // 报告用图
    "reportPath TEXT," + // 报告路径
    "signPath TEXT," + // 签名图路径

    "freezeOrderDate VARCHAR(255) ," + // 冰冻预约时间
    "uploadDate timestamp," + // 上传时间
    "diagnoseDate timestamp," + // 诊断时间
    "confirmDate timestamp," + // 确认诊断时间
    "date timestamp NOT NULL default (datetime('now', 'localtime')))" // 建表时间
);
// sqlMacros.sqlAlter('pathCase','consultationNum','VARCHAR(255)',''); //新增字段

/***
 * @description:@note 查询病例
 * @param {*} res
 * @return {*}
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
            filterKeys.push(element.field);
            filterValues.push(element.values);
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
 * @description:@note 查询病例
 * @param {*} res
 * @return {*}
 */
router_case.post('/table', function(req, res) {
    // 处理soul-table数据 返回各个字段所有可能出现的值
    let data = {
        status: [],
        caseType: [],
        subspecialty: [],
        expert: [],
        code: 200,
        msg: '成功',
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
    });
    data.status = sqlMacros.uniqueArray(data.status);
    data.caseType = sqlMacros.uniqueArray(data.caseType);
    data.subspecialty = sqlMacros.uniqueArray(data.subspecialty);
    data.expert = sqlMacros.uniqueArray(data.expert);

    res.send(data);
});

/***
 * @description:@note 专家端查询病例
 * @param {*} res
 * @return {*}
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
            filterKeys.push(element.field);
            filterValues.push(element.values);
        });
        cases = sqlMacros.sqlQuery('*', 'pathCase', filterKeys, filterValues, 'AND');
    } else { cases = sqlMacros.sqlSelect('*', 'pathCase') }

    cases.forEach(element => {
        if (element.expert !== null && ['等待诊断', '诊断完成'].includes(element.status)) {
            let experts = element.expert.split('/');
            experts.forEach(expertsElement => {
                if (expertsElement === userName) {
                    result.push(element);
                }
            });
        }
    }); // * 搜索指派给该专家的病例 未发起的病例不显示

    var json = {
        code: 200,
        msg: '成功',
        data: sqlMacros.getPageData(result, req.query.page, req.query.limit),
        count: result.length
    };
    if (result.length == 0) { json.msg = '查询无数据'; }
    res.send(json);
});

/***
 * @description:@note 查询病例
 * @param {*} res
 * @return {*}
 */
router_case.post('/expertTable', function(req, res) {
    // 处理soul-table数据 返回各个字段所有可能出现的值
    let data = {
        status: [],
        caseType: [],
        subspecialty: [],
        hosName: [],
        doctor: [],
        code: 200,
        msg: '成功',
    };
    let userName = req.body.userName;
    let result = [];
    let cases = sqlMacros.sqlSelect('*', 'pathCase');

    cases.forEach(element => {
        if (element.expert !== null && ['等待诊断', '诊断完成'].includes(element.status)) {
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
    });
    data.status = sqlMacros.uniqueArray(data.status);
    data.caseType = sqlMacros.uniqueArray(data.caseType);
    data.subspecialty = sqlMacros.uniqueArray(data.subspecialty);
    data.hosName = sqlMacros.uniqueArray(data.hosName);
    data.doctor = sqlMacros.uniqueArray(data.doctor);

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
    var json = {
        code: 200,
        msg: '成功',
        data: sqlMacros.getPageData(result, data.page, data.limit),
        count: result.length,
        NATtraverse: NATtraverse
    };
    if (result.length == 0) { json.msg = '查询无数据'; }
    res.send(json);
});


/*** @note  删除病例
 * @description: 删除
 * @param {*} delete
 * @param {*} res
 * @return {*}
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

/*** @note  新增病例数据
 * @api {post} /api/case/insert 新增病例数据
 * @apiName InsertCase
 * @apiGroup 病例管理
 * @apiParam {Object} data                  数据对象,具体字段由表单决定
 * @apiUse CommonResponse
 */
router_case.post('/insert', function(req, res) {
    let data = req.body.data;
    var reqKeys = Object.keys(data);
    var reqValues = Object.values(data);
    reqKeys.push('status');
    reqValues.push('待发起会诊');

    var json = { code: 200, msg: '成功' };
    if (reqKeys.includes('id')) { // 编辑病例
        sqlMacros.sqlMultiUpdate(reqKeys, reqValues, 'pathCase', ['id'], [data.id]);
        json.caseID = data.id;
        reqKeys = reqKeys.slice(-1);
        reqValues = reqValues.slice(-1);
    } else { // 新增病例
        let user = sqlMacros.sqlQuery('*', 'USER', ['userName'], [data.expert], 'AND');
        if (user.length > 0) {
            reqKeys.push('signPath');
            reqValues.push(user[0].sign);
        }
        let result = sqlMacros.sqlInsert(reqKeys, reqValues, 'pathCase');
    }
    let newCase = sqlMacros.sqlQuery('*', 'pathCase', reqKeys, reqValues, 'AND');
    if (newCase.length > 0) {
        json.caseID = newCase[0].id;
    } else { json = { code: 500, msg: '新增病例失败' }; } //状态不对,发起会诊后再编辑会错误弹这个
    res.send(json);
});

/*** @note  发起会诊
 * @api {post} /api/case/startConsultation 新增玻片数据
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
            ["pathologyNum", "patName", "expert", "slideUrl"].forEach(element => {
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
        ["pathologyNum", "patName", "expert", "slideUrl"].forEach(element => {
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

/*** @note  选择专家
 * @api {post} /api/case/chooseExpert 选择专家
 * @apiName chooseExpert
 * @apiGroup 病例管理
 * @apiUse CommonResponse
 */
router_case.post('/chooseExpert', function(req, res) {
    let data = req.body.data;
    let caseID = req.body.caseID;
    let expertName = '';
    data.forEach(element => { expertName += element.name + '/'; });
    if (expertName !== '') {
        expertName = expertName.slice(0, expertName.length - 1);
    }
    let result = sqlMacros.sqlMultiUpdate(['expert'], [expertName], 'pathCase', 'id', caseID);
    res.send({ code: 200, msg: '成功' });
});


/*** @note  选择切片
 * @api {post} /api/case/chooseExpert 选择切片
 * @apiName chooseExpert
 * @apiGroup 病例管理
 * @apiUse CommonResponse
 */
router_case.post('/chooseSlide', function(req, res) {
    let data = req.body.data;
    let caseID = req.body.caseID;
    let slides = [];
    let result = sqlMacros.sqlMultiUpdate(['slideUrl'], [data.slideUrl], 'pathCase', 'id', caseID);
    res.send({ code: 200, msg: '成功' });
});

/*** @note  选择报告用图
 * @api {post} /api/case/chooseExpert 选择报告用图
 * @apiName chooseExpert
 * @apiGroup 病例管理
 * @apiUse CommonResponse
 */
router_case.post('/chooseAnnotation', function(req, res) {
    let data = req.body.data;
    let annotation = [];
    data.forEach(element => {
        annotation.push(element);
    });
    sqlMacros.sqlMultiUpdate(['annotation'], [JSON.stringify(annotation)], 'pathCase', 'id', req.body.caseID);
    res.send({
        code: 200,
        msg: '成功'
    });
});

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

// @note 编辑病例数据
router_case.post('/edit', function(req, res) {
    let data = req.body.data;
    var reqKeys = Object.keys(data);
    var reqValues = Object.values(data);
    let result = sqlMacros.sqlMultiUpdate(reqKeys, reqValues,
        'pathCase', 'id', req.body.caseID);
    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});

const puppeteer = require("puppeteer");
const { resolve } = require("path");
/*** @note  生成报告
 * @description: 生成报告
 * @param {*} openReport
 * @param {*} res
 * @return {*}
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

    var address = path.join('file:///', process.cwd(), `/templet/report${type}.html`); //  路径和caseType相关
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
                    if ([null, ''].includes(element) && key !== "unsatisfiedReason") {
                        caseData[key] = '无';
                    }
                }
            }
            let error = [];
            if (![null, undefined].includes(document.getElementById("reportTitle")) &&
                ![null, undefined, '无'].includes(caseData.reportTitle)) {
                document.getElementById("reportTitle").innerHTML = caseData.reportTitle;
                if (![null, undefined].includes(document.getElementById("subtitle"))) {
                    if (![null, undefined, '', 'null', '无'].includes(caseData.subtitle)) {
                        document.getElementById("subtitle").innerHTML = caseData.subtitle;
                    } else {
                        document.getElementById("subtitle").setAttribute("style", "display:none;");
                    }
                }
                error.push("reportTitle");
            }
            if (![null, undefined].includes(document.getElementById("pathologyNumLabel"))) {
                document.getElementById("pathologyNumLabel").innerHTML += caseData.pathologyNum;
                error.push("pathologyNumLabel");
            }
            if (![null, undefined].includes(document.getElementById("patNameLabel"))) {
                document.getElementById("patNameLabel").innerHTML += caseData.patName; // 病人姓名
                error.push("patNameLabel");
            }
            if (![null, undefined].includes(document.getElementById("genderLabel"))) {
                document.getElementById("genderLabel").innerHTML += caseData.gender; // 性别
                error.push("genderLabel");
            }
            if (![null, undefined].includes(document.getElementById("ageLabel"))) {
                document.getElementById("ageLabel").innerHTML += caseData.age; // 年龄
                error.push("ageLabel");
            }
            if (![null, undefined].includes(document.getElementById("doctorLabel"))) {
                document.getElementById("doctorLabel").innerHTML += caseData.doctor; // 医生
                error.push("doctorLabel");
            }
            if (![null, undefined].includes(document.getElementById("samplePartLabel"))) {
                document.getElementById("samplePartLabel").innerHTML += caseData.samplePart; // 取样位置
                error.push("samplePartLabel");
            }
            if (![null, undefined].includes(document.getElementById("unitLabel"))) {
                document.getElementById("unitLabel").innerHTML += caseData.unit; // 送检单位
                error.push("unitLabel");
            }
            if (![null, undefined].includes(document.getElementById("inspectionDateLabel"))) {
                document.getElementById("inspectionDateLabel").innerHTML += caseData.inspectionDate; // 送检日期
                error.push("inspectionDateLabel");
            }
            if (![null, undefined].includes(document.getElementById("historyLabel"))) {
                document.getElementById("historyLabel").innerHTML += caseData.history; // 病史
                error.push("historyLabel");
            }
            if (![null, undefined].includes(document.getElementById("clinicalData"))) {
                document.getElementById("clinicalData").innerHTML += caseData.clinicalData; // 临床资料
            }
            if (![null, undefined].includes(document.getElementById("imgCheck"))) {
                document.getElementById("imgCheck").innerHTML += caseData.imgCheck; // 影像学检查
            }

            if (caseData.caseType === "常规病例") {
                if (![null, undefined].includes(document.getElementById("originDiagnosis"))) {
                    document.getElementById("originDiagnosis").innerHTML += caseData.originDiagnosis; // 原诊断意见
                }
                if (![null, undefined].includes(document.getElementById("general"))) {
                    document.getElementById("general").innerHTML += caseData.general; // 大体所见
                }
            } else if (caseData.caseType === "TBS病例") {
                if (![null, undefined].includes(document.getElementById("sampleQuality"))) {
                    document.getElementById("sampleQuality").innerHTML +=
                        `${caseData.isSatisfied};${caseData.unsatisfiedReason}`; // 标本质量
                }
                if (![null, undefined].includes(document.getElementById("component"))) {
                    document.getElementById("component").innerHTML += caseData.component; // 细胞成分
                }
                if (![null, undefined].includes(document.getElementById("inflammation"))) {
                    document.getElementById("inflammation").innerHTML += caseData.inflammation; // 炎症
                }
                if (![null, undefined].includes(document.getElementById("reactChange"))) {
                    document.getElementById("reactChange").innerHTML += caseData.reactChange; // 反应性改变
                }
                if (![null, undefined].includes(document.getElementById("pathogen"))) {
                    document.getElementById("pathogen").innerHTML += caseData.pathogen; // 病原体
                }
                if (![null, undefined].includes(document.getElementById("squamousCell"))) {
                    document.getElementById("squamousCell").innerHTML += caseData.squamousCell; // 鳞状上皮细胞分析
                }
                if (![null, undefined].includes(document.getElementById("glandularCell"))) {
                    document.getElementById("glandularCell").innerHTML += caseData.glandularCell; // 腺上皮细胞分析
                }
                if (![null, undefined].includes(document.getElementById("otherAnalysis"))) {
                    document.getElementById("otherAnalysis").innerHTML += caseData.otherAnalysis; // 其它分析
                }
            }

            if (annotationUrl.length > 0) {
                for (let i = 0; i < 3; i++) {
                    if (![null, undefined].includes(document.getElementById(`annotation${i}`))) {
                        if (i < annotationUrl.length) { // 上限3个标注图
                            document.getElementById(`annotation${i}`).setAttribute('src', annotationUrl[i].annotationUrl); // 标注图   
                        } else { document.getElementById(`annotation${i}`).setAttribute('style', "display:none;"); } // 标注图 
                    }
                }
            }
            if (![null, undefined].includes(document.getElementById("diagnosis"))) {
                document.getElementById("diagnosis").innerHTML += caseData.diagnosis; // 其它分析
            }
            if (![null, undefined].includes(document.getElementById("signImg"))) {
                document.getElementById("signImg").setAttribute('src',
                    '../upload' + caseData.signPath + '?' + Math.floor(Math.random() * 100 + 1)); // 电子签名 这里路径是图片相对于模板的路径
            }
            if (![null, undefined].includes(document.getElementById("diagnoseDate"))) {
                document.getElementById("diagnoseDate").innerHTML = caseData.diagnoseDate; // 诊断日期
            }
            return error;
        }, caseData).then(error => {
            // console.log(error);
        });
        // await page.waitForFunction('window.renderdone', {
        //     polling: 120
        // });

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
});

module.exports = {
    router_case
};