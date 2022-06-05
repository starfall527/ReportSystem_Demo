/***
 * @Author cwx
 * @Description 玻片管理后端
 * @Date 2021-10-21 17:25:59
 * @LastEditTime 2022-06-05 08:46:11
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
const fs = require('fs');
const html2pdf = require('html-pdf');
const path = require('path');

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
    "type VARCHAR(255) NOT NULL ," + // 病例类型
    "pathologyNum VARCHAR(255) NOT NULL ," + // 病理号
    "patName VARCHAR(255) NOT NULL ," + // 病人姓名
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

    "samplePart VARCHAR(255)," + // 取样部位 
    "clinicalData VARCHAR(255)," + // 临床资料
    "imgCheck VARCHAR(255)," + // 影像学检查
    "history VARCHAR(255)," + // 病史
    "general VARCHAR(255)," + // 大体所见
    "originDiagnosis VARCHAR(255)," + // 原诊断意见
    "diagnosis VARCHAR(255)," + // 诊断意见

    "note VARCHAR(255)," + // 备注
    "slideUrl TEXT," + // 切片url json数组
    "uploadDate timestamp," + // 上传时间
    "diagnoseDate timestamp," + // 诊断时间
    "confirmDate timestamp," + // 确认诊断时间
    "date timestamp NOT NULL default (datetime('now', 'localtime')))" // 建表时间
);

/***
 * @description:@note 查询病例
 * @param {*} res
 * @return {*}
 */
router_case.get('/table', function (req, res) {
    let userName = req.query.userName;
    let result = [];
    let cases = sqlMacros.sqlSelect('*', 'pathCase');
    cases.forEach(element => {
        if (element.doctor === userName) {
            result.push(element);
        }
    });
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
 * @description:@note 专家端查询病例
 * @param {*} res
 * @return {*}
 */
router_case.get('/expertTable', function (req, res) {
    let userName = req.query.userName;
    let cases = sqlMacros.sqlSelect('*', 'pathCase');
    let result = [];
    cases.forEach(element => {
        if (element.expert !== null) {
            let experts = element.expert.split('/');
            experts.forEach(expertsElement => {
                if (expertsElement === userName) {
                    result.push(element);
                }
            });
        }
    }); // * 搜索指派给该专家的病例

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

/*** @note  条件查询
 * @description: 条件查询
 * @param {*} res
 * @return {*}
 */
router_case.post('/query', function (req, res) {
    let data = req.body.data;
    var reqKeys = Object.keys(data);
    var reqValues = Object.values(data);
    let result = sqlMacros.sqlQuery('*', 'pathCase', reqKeys, reqValues, 'AND');
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


/*** @note  删除病例
 * @description: 删除
 * @param {*} delete
 * @param {*} res
 * @return {*}
 */
router_case.get('/delete', function (req, res) {
    let data = req.query;
    let result = sqlMacros.sqlDelete('id', data.id, 'pathCase'); //删除所选数据
    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});

/*** @note  新增玻片数据
 * @api {post} /api/case/insert 新增玻片数据
 * @apiName InsertCase
 * @apiGroup 玻片管理
 * @apiParam {Object} data                  数据对象,具体字段由表单决定
 * @apiUse CommonResponse
 */
router_case.post('/insert', function (req, res) {
    let data = req.body.data;
    var reqKeys = Object.keys(data);
    var reqValues = Object.values(data);
    reqKeys.push('status');
    reqValues.push('未诊断');

    let result = sqlMacros.sqlInsert(reqKeys, reqValues, 'pathCase');
    let newCase = sqlMacros.sqlQuery('*', 'pathCase', reqKeys, reqValues, 'AND');
    var json = {
        code: 200,
        msg: '成功'
    };
    if (newCase.length > 0) {
        json.caseID = newCase[0].id;
    } else {
        json = {
            code: 500,
            msg: '新增病例失败'
        };
    }
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
router_case.post('/startConsultation', function (req, res) {
    let caseData = req.body.data;
    let flag = true;
    ["pathologyNum", "patName", "expert", "slideUrl"].forEach(element => {
        if (caseData[element] === "" || caseData[element] === undefined || caseData[element] === null) {
            flag = false;
        }
    }); // * 需要检查该病例的各个必填项是否为空,包括病理号,病人名,专家名,切片url等等
    if (flag) {
        let result = sqlMacros.sqlMultiUpdate(['status'], ['等待诊断'], 'pathCase', 'id', caseData.id);
        res.send({
            code: 200,
            msg: '成功'
        });
    } else {
        res.send({
            code: 500,
            msg: '病例信息未完善,请检查数据完整性'
        });
    }
});

/*** @note  选择专家
 * @api {post} /api/case/chooseExpert 选择专家
 * @apiName chooseExpert
 * @apiGroup 病例管理
 * @apiUse CommonResponse
 */
router_case.post('/chooseExpert', function (req, res) {
    let data = req.body.data;
    let caseID = req.body.caseID;
    let expertName = '';
    data.forEach(element => {
        expertName += element.name + '/';
    });
    if (expertName !== '') {
        expertName = expertName.slice(0, expertName.length - 1);
    }
    let result = sqlMacros.sqlMultiUpdate(['expert'], [expertName], 'pathCase', 'id', caseID);
    res.send({
        code: 200,
        msg: '成功'
    });
});


/*** @note  选择切片
 * @api {post} /api/case/chooseExpert 选择切片
 * @apiName chooseExpert
 * @apiGroup 病例管理
 * @apiUse CommonResponse
 */
router_case.post('/chooseSlide', function (req, res) {
    let data = req.body.data;
    let caseID = req.body.caseID;
    let slides = [];
    let result = sqlMacros.sqlMultiUpdate(['slideUrl'], [data.slideUrl], 'pathCase', 'id', caseID);
    res.send({
        code: 200,
        msg: '成功'
    });
});

// @note 更新病例数据
router_case.post('/update', function (req, res) {
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

/*** @note  生成报告
 * @description: 生成报告
 * @param {*} openReport
 * @param {*} res
 * @return {*}
 */
router_case.get('/openReport', function (req, res) {
    var caseData = req.query;
    // wkHtml(fs.createReadStream('./reportTemplate.html'), {
    //     output: 'wkReport.pdf',
    // });

    const puppeteer = require("puppeteer");
    const option = process.argv;
    var address = path.join('file:///', __dirname, '../../reportNormal.html'); //  等价于 'file:///E:/ReportSystem_Demo/reportNormal.html';

    (async () => {
        if (option.length >= 3) {
            address = option[2];
        }
        console.log(option);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 720
        }); // 设置视窗
        await page.goto(
            address, //
            {
                waitUntil: "networkidle2"
            }
        );
        await page.evaluate((caseData) => {
            document.getElementById("patNameLabel").innerHTML += caseData.patName; // 修改html内容
        }, caseData);
        await page.pdf({
            path: "report.pdf",
            format: "letter",
            printBackground: true,
            "-webkit-print-color-adjust": "exact",
        });
        await browser.close();
    })();

    // var html = fs.readFileSync('./reportNormal.html', 'utf8'); //caseForm  reportNormal
    // console.log(html);    

    // var options = {
    //     format: 'A4',
    //     border: {
    //         top: '30px',
    //         bottom: '30px',
    //         left: '10px'
    //     }
    // }; // html-pdf 转换参数配置
    // html2pdf.create(html, options).toFile('./report.pdf', function (err, res) {
    //     if (err) {
    //         console.log(res);
    //     } else {
    //         console.log(res);
    //     }
    // });

    var json = {
        code: 200,
        msg: '成功',
        path: ''
    };
    res.send(json);
});

module.exports = {
    router_case
};