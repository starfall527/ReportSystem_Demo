/***
 * @Author cwx
 * @Description 用户管理后端
 * @Date 2021-10-21 17:25:59
 * @LastEditTime 2022-08-24 10:17:49
 * @FilePath \ReportSystem_Demo\Admin\Manager\userManager.js
 */

const express = require("express");
const sqlMacros = require("../database/macro");
const router_user = express.Router();
const logger = require('log4js').getLogger('user');
const config = require('../config.js');
const md5 = require('md5');

/*** @note apidoc定义user表数据
 * @apiDefine UserSqlData
 * @apiSuccess {Object{...}} data           对象数组
 * @apiSuccess {Number} data.id             唯一标识
 * @apiSuccess {String} data.role           身份
 * @apiSuccess {String} data.userName       用户姓名
 * @apiSuccess {String} data.organization   组织名
 * @apiSuccess {String} data.name           登录名
 * @apiSuccess {String} data.phone          手机
 * @apiSuccess {String} data.password       密码
 * @apiSuccess {String} data.sign           签名路径
 * @apiSuccess {String} data.info           信息
 * @apiSuccess {String} data.subspecialty   亚专科
 * @apiSuccess {String} data.authorization  权限
 * @apiSuccess {String} data.reportTitle    报告标题
 * @apiSuccess {String} data.slideCenterIP  slideCenterIP
 * @apiSuccess {String} data.NATtraverse    内网穿透host
 * @apiSuccess {String} data.isExamined     审核状态
 * @apiSuccess {String} data.date           时间戳
 */
const createUserTable = sqlMacros.sqlExecute(`CREATE TABLE IF NOT EXISTS USER(
     id INTEGER not null PRIMARY KEY AUTOINCREMENT ,
     role VARCHAR(255) NOT NULL ,
     userName VARCHAR(255) NOT NULL unique ,
     organization VARCHAR(255) ,
     name VARCHAR(255) ,
     phone VARCHAR(255) ,
     password VARCHAR(255) ,
     sign VARCHAR(255) ,
     info VARCHAR(255) ,
     subspecialty VARCHAR(255) , 
     authorization VARCHAR(255) ,
     reportTitle VARCHAR(255) ,
     slideCenterIP VARCHAR(255) ,
     NATtraverse VARCHAR(255) ,
     isExamined INTEGER ,
     date timestamp NOT NULL default (datetime('now','localtime'))
     )`);

// sqlMacros.sqlAlter('USER', 'reportTitle', 'VARCHAR(255)', ''); //新增字段

/***
 * @description: ROLE表定义
 * @field {*}   id              唯一标识    
 * @field {*}   role            身份
 * @field {*}   Authorization   权限,json封装好的类 {'1':'1','2':'2','3':'3'}
 * @field {*}   info            信息
 * @field {*}   Authorization   权限
 * @field {*}   date            时间戳
 */
const createRoleTable = sqlMacros.sqlExecute(`CREATE TABLE IF NOT EXISTS ROLE(
    id INTEGER not null PRIMARY KEY AUTOINCREMENT ,
    role VARCHAR(255) NOT NULL ,
    authorization TEXT NOT NULL ,
    description VARCHAR(255) ,
    date timestamp NOT NULL default (datetime('now','localtime'))
    )`);

function initUser() {
    if (sqlMacros.getTableCount('USER', false) === 0) {
        sqlMacros.sqlInsert(['name', 'userName', 'password', 'role', 'sign'],
            ['admin', 'admin', '123456', '管理员', '/sign/0_sign.jpeg'], 'USER');
    }
    
    if (sqlMacros.getTableCount('USER', false) === 0) {
        sqlMacros.sqlInsert(['name', 'userName', 'password', 'role', 'sign'],
            ['testuser1', 'testuser1', '123456', '管理员', '/sign/0_sign.jpeg'], 'USER');
    }
}
initUser();
// @note 用户列表
router_user.get('/userTable', function(req, res) {
    let result = sqlMacros.sqlSelect('*', 'USER');
    let pageData = sqlMacros.getPageData(result, req.query.page, req.query.limit);
    pageData.forEach(element => {
        if (![null, undefined, ''].includes(element.sign)) {
            element.sign += '?' + Math.floor(Math.random() * 100 + 1); // * 给前台的数据url加上随机数,浏览器才会更新图片
        }
    });
    var json = {
        code: 200,
        msg: '成功',
        data: pageData,
        count: result.length
    };
    if (result.length == 0) {
        json.msg = '未选中实验或查询无数据';
    }
    res.send(json);
});

// @note 专家列表
router_user.get('/expertTable', function(req, res) {
    let result;
    // if ([null, undefined].includes(req.query.queryData)) {
    //     let data = req.query.queryData;
    //     var reqKeys = Object.keys(data);
    //     var reqValues = Object.values(data);
    //     result = sqlMacros.sqlQuery('*', 'USER', reqKeys, reqValues, 'AND');
    // } 条件搜索暂时不用做 优先级低
    result = sqlMacros.sqlSelect('*', 'USER', true, 'role', '专家端');

    var json = {
        code: 200,
        msg: '成功',
        data: sqlMacros.getPageData(result, req.query.page, req.query.limit),
        count: result.length
    };
    if (result.length == 0) {
        json.msg = '未选中实验或查询无数据';
    }
    res.send(json);
});

// @note 查询管理员
router_user.get('/adminTable', function(req, res) {
    let result = sqlMacros.sqlSelect('*', 'USER');
    var json = {
        code: 200,
        msg: '成功',
        data: sqlMacros.getPageData(result, req.query.page, req.query.limit),
        count: result.length
    };
    if (result.length == 0) {
        json.msg = '未选中实验或查询无数据';
    }
    res.send(json);
});

// @note 查询角色
router_user.get('/roleTable', function(req, res) {
    let result = sqlMacros.sqlSelect('*', 'ROLE');
    var json = {
        code: 200,
        msg: '成功',
        data: sqlMacros.getPageData(result, req.query.page, req.query.limit),
        count: result.length
    };
    if (result.length == 0) {
        json.msg = '未选中实验或查询无数据';
    } else {
        json.data.forEach(element => {
            let authorization = JSON.parse(element.authorization);
            let result = '';
            for (let i = 0; i < Object.keys(authorization).length; i++) {
                result += Object.keys(authorization)[i] + '/';
            }
            element.authorization = result.slice(0, result.length - 1);
        });
    }
    res.send(json);
});

// @note 查询专家
router_user.post('/queryExpert', function(req, res) {
    let data = req.body;
    var reqKeys = Object.keys(data).splice(2, Object.keys(data).length - 1);
    var reqValues = Object.values(data).splice(2, Object.values(data).length - 1);
    let result = sqlMacros.sqlQuery('*', 'USER', reqKeys, reqValues, 'AND'); // 默认是AND查询,看界面要不要配置OR方式
    var json = {
        code: 200,
        msg: '成功',
        data: sqlMacros.getPageData(result, req.query.page, req.query.limit),
        count: result.length
    };
    if (result.length == 0) {
        json.msg = '未选中实验或查询无数据';
    }
    res.send(json);
});

// @note 条件查询用户
router_user.post('/query', function(req, res) {
    let data = req.body;
    var reqKeys = Object.keys(data).splice(2, Object.keys(data).length - 1);
    var reqValues = Object.values(data).splice(2, Object.values(data).length - 1);
    let result = sqlMacros.sqlQuery('*', 'USER', reqKeys, reqValues, 'AND'); // 默认是AND查询,看界面要不要配置OR方式
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

/*** @note 登录接口
 * @api {get} /api/user/login 登录接口
 * @apiVersion 0.0.1
 * @apiName login
 * @apiGroup 用户管理
 * @apiParam {String} userName 用户名
 * @apiParam {String} password 密码
 * 
 * @apiUse CommonResponse
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
    {
        "code": 200,
        "msg": "登录成功",
        "data": { "userID": 1, "userName": "工程师1", "access_token": "8dda2da20cba25291b4c83990d144e49" }
    }    
 * @apiSuccessExample 401-Response:
 *   HTTP/1.1 401 unauthorized
    {
        code: 401,
        msg: '密码错误'
    }    
 * @apiSuccessExample 500-Response:
 *   HTTP/1.1 500 Error
    {
        code: 500,
        msg: '未找到用户'
    }
 */ 
router_user.get('/login', function(req, res) {
    let user = sqlMacros.sqlSelect('*', 'USER', true, 'userName', req.query.userName);
    let menu = config.readConfigFile('./webContent/json/menu.json');
    if (user.length === 0) {
        logger.error('未找到用户');
        res.send({
            code: 500,
            msg: '未找到用户',
            data: {}
        });
    } else {
        let role = sqlMacros.sqlSelect('*', 'ROLE', true, 'role', user[0].role);
        if (user[0].role === "专家端") {
            menu = config.readConfigFile('./webContent/json/menu-expert.json');
            // menu.data.forEach(element => {
            //     if (element.title === "病例管理") {
            //         element.jump = "case/caseExpert";
            //     }
            // });
        } else if (user[0].role === "上传端") {
            menu = config.readConfigFile('./webContent/json/menu-upload.json');
            // menu.data.forEach(element => {
            //     if (element.title === "病例管理") {
            //         element.jump = "case/caseUpload";
            //     }
            // });
        } else if (user[0].role === "管理员") {
            menu = config.readConfigFile('./webContent/json/menu-admin.json');
        }

        config.writeConfigFile('data', menu.data, './webContent/json/menu.json');
        var json = {
            code: 500,
            msg: '登录失败',
            data: {}
        };
        if (user === undefined) {
            json.msg = '未选中实验或查询无数据';
        } else {
            if (user[0].password === req.query.password) {
                json = {
                    code: 200,
                    msg: '登录成功',
                    data: {
                        userID: user[0].id,
                        userName: user[0].userName,
                        access_token: md5(`${user[0].id}${user[0].userName}${Date.now()}`),
                        role: user[0].role,
                        organization: user[0].organization
                    }
                };
                global.session.push(json.data); // * 暂存在全局变量 待优化
            } else {
                json.msg = '密码错误';
            }
        }
        res.send(json);
    }
    // * 根据登录者的role,更改menu.json的数据,加载对应的界面 后续考虑结合权限管理封装函数,准备好几份menu.json,读取后直接覆盖即可
});

// session接口
router_user.get('/getSessionData', function(req, res) {
    let userName = '';
    let flag = false;
    global.session.forEach(element => {
        if (element.access_token == req.query.access_token) {
            userName = element.userName;
            flag = true;
        }
    });
    let json = {
        "code": 200,
        "msg": "",
        "data": {
            "userName": userName
        }
    }
    json.code = flag ? 200 : 200; // * 目前根据msg进行判断,平滑切换到login.html 避免Alert弹窗给用户不好的体验
    json.msg = flag ? '' : '登录已过期';
    res.send(json);
});

// 登出接口
router_user.get('/logout', function(req, res) {
    sqlMacros.sqlMultiUpdate(['isLoggedIn'], ['false'], 'USER', 'name', '')
});


/*** @note 新增用户 
 * @api {post} /api/user/insert 新增用户
 * @apiName InsertUser
 * @apiGroup 用户管理
 * @apiParam {Object} data                  数据对象
 * @apiParam {Object} data.userName         用户名
 * @apiParam {Object} data.password         密码
 * @apiParam {Object} data.phone            手机
 * @apiParam {Object} data.organization     组织
 * @apiParam {Object} data.role             角色
 * @apiUse CommonResponse
 */
router_user.post('/insert', function(req, res) {
    let data = req.body.data;
    let role = sqlMacros.sqlSelect('*', 'ROLE', true, 'role', data.role);
    if (role.length === 0) {
        logger.error('role not exist');
    } else {
        var reqValues = [data.userName, data.userName, data.password, data.phone, data.organization, data.role, role[0].authorization];
        var reqKeys = ['userName', 'name', 'password', 'phone', 'organization', 'role', 'authorization'];
        let result = sqlMacros.sqlInsert(reqKeys, reqValues, 'USER');
    }
    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});


/*** @note 新增角色
 * @api {post} /api/user/role/insert 新增角色
 * @apiName InsertUser
 * @apiGroup 步骤管理
 * @apiParam {Object} data                  数据对象
 * @apiParam {String} limits[i]             权限 on/off
 * 
 * @apiUse CommonResponse
 */
router_user.post('/role/insert', function(req, res) {
    let data = req.body.data;
    let authorization = {
        0: "账户管理",
        1: "系统配置",
        2: "病例管理",
        3: "会诊管理",
        4: "病例诊断",
        data: {}
    }; // * 权限的种类姑且放在插入这里,后续修改时要将老数据更新
    for (let i = 0; i < Object.keys(authorization).length - 1; i++) {
        let index = "limits[" + i.toString() + ']';
        if (data[index] === "on") {
            authorization.data[authorization[i]] = true;
        }
    }
    var reqValues = [data.roleName, JSON.stringify(authorization.data), data.description];
    var reqKeys = ['role', 'authorization', 'description'];
    let result = sqlMacros.sqlInsert(reqKeys, reqValues, 'ROLE');

    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});

/*** @note 批量删除用户
 * @api {post} /api/user/delete 删除用户
 * @apiName DeleteStep
 * @apiGroup 步骤管理
 * @apiParam {ObjectArray} data             数据对象
 * @apiParam {String} data.id               唯一标识
 * @apiParam {String} data.experimentID     实验ID
 * @apiUse CommonResponse
 */
router_user.post('/batchDel', function(req, res) {
    let data = req.body.data;
    for (let i = 0; i < data.length; i++) {
        let result = sqlMacros.sqlDelete('id', data[i]['id'], 'USER');
    } // * 根据id删除所选数据

    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});


/*** @note 删除用户
 * @description: 删除用户
 * @param {*} delete
 * @param {*} res
 * @return {*}
 */
router_user.get('/delete', function(req, res) {
    let data = req.query;
    let result = sqlMacros.sqlDelete('id', data.id, 'USER'); //删除所选数据
    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});

/*** @note 删除角色
 * @api {post} /api/user/role/delete 删除角色
 * @apiName DeleteStep
 * @apiGroup 步骤管理
 */
router_user.post('/role/batchDel', function(req, res) {
    let data = req.body.data;
    for (let i = 0; i < data.length; i++) {
        let result = sqlMacros.sqlDelete('id', data[i]['id'], 'ROLE');
    } // * 根据id删除所选数据

    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});

/*** @note 更新用户数据
 * @api {post} /api/user/update 更新用户数据
 * @apiName UpdateStep
 * @apiGroup 用户管理
 * 
 * @apiParam {Object} data           数据对象
 * @apiParam {String} data.id        唯一标识
 * @apiParam {String} data.field     更新的键
 * @apiParam {String} data.value     更新的键值
 * @apiUse CommonResponse
 */
router_user.post('/update', function(req, res) {
    let data = req.body.data;
    var reqKeys = Object.keys(data);
    var reqValues = Object.values(data);
    let result = sqlMacros.sqlMultiUpdate(reqKeys, reqValues,
        'USER', 'id', data.id);
    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});

var multiparty = require("multiparty") // 解析form-data上传
var fs = require('fs')
var path = require('path')

/*** @note 更改密码
 * @api {post} /api/user/setPassword 更改密码
 * @apiName UpdateStep
 * @apiGroup 用户管理 
 * @apiParam {Object} data           数据对象
 * @apiParam {String} data.id        唯一标识
 * @apiParam {String} data.field     更新的键
 * @apiParam {String} data.value     更新的键值
 * @apiUse CommonResponse
 */
router_user.post('/setPassword', function(req, res) {
    let data = req.body.data;
    let user = sqlMacros.sqlQuery('*', 'USER', ['id'], [data.userID], 'AND');
    if (user[0].password !== data.oldPassword) {
        res.send({
            code: 500,
            msg: '密码错误!'
        });
        return;
    } else {
        let result = sqlMacros.sqlMultiUpdate(['password'], [data.password],
            'USER', 'id', data.userID);
        var json = {
            code: 200,
            msg: '成功'
        };
        res.send(json);
    }
});

module.exports = {
    router_user
};