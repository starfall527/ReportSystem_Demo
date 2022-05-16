/***
 * @Author cwx
 * @Description 用户管理后端
 * @Date 2021-10-21 17:25:59
 * @LastEditTime 2022-05-16 17:25:52
 * @FilePath \ReportSystem_Demo\Admin\Manager\userManager.js
 */

const express = require("express");
const sqlMacros = require("../database/macro");
const router_user = express.Router();
const logger = require('log4js').getLogger('user');
const config = require('../config.js');

/***
 * @description: USER表定义
 * @field {*}   id              唯一标识    
 * @field {*}   role            身份
 * @field {*}   userName        用户姓名
 * @field {*}   name            登录名
 * @field {*}   phone           手机
 * @field {*}   password        密码
 * @field {*}   info            信息
 * @field {*}   examStatus      审核状态
 * @field {*}   authorization   权限
 * @field {*}   date            时间戳
 */
const createUserTable = sqlMacros.sqlExecute(`CREATE TABLE IF NOT EXISTS USER(
     id INTEGER not null PRIMARY KEY AUTOINCREMENT ,
     role VARCHAR(255) NOT NULL ,
     userName VARCHAR(255) NOT NULL unique ,
     name VARCHAR(255) ,
     phone VARCHAR(255) ,
     password VARCHAR(255) ,
     info VARCHAR(255) ,
     authorization VARCHAR(255) NOT NULL ,
     isExamined INTEGER ,
     date timestamp NOT NULL default (datetime('now','localtime'))
     )`);


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

router_user.get('/userTable', function (req, res) {
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

router_user.get('/adminTable', function (req, res) {
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

router_user.get('/roleTable', function (req, res) {
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

// 登录接口
router_user.get('/login', function (req, res) {
    let user = sqlMacros.sqlSelect('*', 'USER', true, 'userName', req.query.userName);
    let menu = config.readConfigFile('./webContent/json/menu.json');
    if (user === undefined) {} else if (user[0].role === "专家端") {
        menu.data.forEach(element => {
            if (element.title === "病例管理") {
                element.jump = "case/caseExpert";
                console.log(element);
            }
        });// 
    } else if (user[0].role === "上传端") {
        menu.data.forEach(element => {
            if (element.title === "病例管理") {
                element.jump = "case/caseUpload";
                console.log(element);
            }
        });
    }
    config.writeConfigFile('data', menu.data, './webContent/json/menu.json');
    // * 根据登录者的role,更改menu.json的数据,加载对应的界面 后续考虑结合权限管理封装函数,准备好几份menu.json,读取后直接覆盖即可

    var json = {
        code: 500,
        msg: '登录失败',
        data: {}
    };
    if (user === undefined) {
        json.msg = '未选中实验或查询无数据';
    } else {
        if (user[0].password === req.query.password) {
            json.data.access_token = "";
            // todo 分配token
        }
    }
    // res.send(json);
    menu = config.readConfigFile('./webContent/json/menu.json');
    console.log(menu);
    res.send({
        "code": 200,
        "msg": "登入成功",
        "data": {
            "access_token": "c262e61cd13ad99fc650e6908c7e5e65b63d2f32185ecfed6b801ee3fbdd5c0a"
        }
    });

});

/*** 新增用户
 * @api {post} /api/user/insert 新增用户
 * @apiName InsertUser
 * @apiGroup 步骤管理
 * @apiParam {Object} data                  数据对象
 * @apiParamExample 
 * 
 * @apiUse CommonResponse
 */
router_user.post('/insert', function (req, res) {
    let data = req.body.data;

    let role = sqlMacros.sqlSelect('*', 'ROLE', true, 'role', data.role);
    if (role === undefined) {
        logger.error('role not exist');
    } else {
        var reqValues = [data.userName, data.password, data.phone, data.role, role[0].authorization];
        var reqKeys = ['userName', 'password', 'phone', 'role', 'authorization'];
        let result = sqlMacros.sqlInsert(reqKeys, reqValues, 'USER');
    }
    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});


/*** 新增角色
 * @api {post} /api/user/role/insert 新增角色
 * @apiName InsertUser
 * @apiGroup 步骤管理
 * @apiParam {Object} data                  数据对象
 * @apiParamExample 
 * 
 * @apiUse CommonResponse
 */
router_user.post('/role/insert', function (req, res) {
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



/*** 删除用户
 * @api {post} /api/user/delete 删除用户
 * @apiName DeleteStep
 * @apiGroup 步骤管理
 * @apiParam {ObjectArray} data             数据对象
 * @apiParam {String} data.id               唯一标识
 * @apiParam {String} data.experimentID     实验ID
 * @apiParamExample 
    {
        "data": [{
            "id": 6,
            "experimentID": 5
        },{
            "id": 7,
            "experimentID": 5
        }]
    }
 * 
 * @apiUse CommonResponse
 */
router_user.post('/batchDel', function (req, res) {
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

/*** 删除角色
 * @api {post} /api/user/role/delete 删除角色
 * @apiName DeleteStep
 * @apiGroup 步骤管理
 * @apiParam {ObjectArray} data             数据对象
 * @apiParam {String} data.id               唯一标识
 * @apiParam {String} data.experimentID     实验ID
 * @apiParamExample 
    {
        "data": [{
            "id": 6,
            "experimentID": 5
        },{
            "id": 7,
            "experimentID": 5
        }]
    }
 * 
 * @apiUse CommonResponse
 */
router_user.post('/role/batchDel', function (req, res) {
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

/*** 更新步骤数据
 * @api {post} /api/user/update 更新步骤数据
 * @apiName UpdateStep
 * @apiGroup 步骤管理
 * 
 * @apiParam {Object} data           数据对象
 * @apiParam {String} data.id        唯一标识
 * @apiParam {String} data.field     更新的键
 * @apiParam {String} data.value     更新的键值
 * @apiParamExample 
    {
        "data": {
            "id": 8,
            "field": "userTime",
            "value": "20"
        }
    }
 * 
 * @apiUse CommonResponse
 */
router_user.post('/update', function (req, res) {
    let data = req.body.data;
    let result = sqlMacros.sqlUpdate(data.field, data.value,
        'USER', 'id', data.id);
    var json = {
        code: 200,
        msg: '成功'
    };
    res.send(json);
});




module.exports = {
    router_user
};