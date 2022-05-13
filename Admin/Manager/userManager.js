/***
 * @Author cwx
 * @Description 用户管理后端
 * @Date 2021-10-21 17:25:59
 * @LastEditTime 2022-05-13 17:10:06
 * @FilePath \ReportSystem_Demo\Admin\Manager\userManager.js
 */

const express = require("express");
const sqlMacros = require("../database/macro");
const router_user = express.Router();
const logger = require('log4js').getLogger('user');

/***
 * @description: USER表定义
 * @field {*}   id              唯一标识    
 * @field {*}   role            身份
 * @field {*}   name            试剂名
 * @field {*}   phone        手机
 * @field {*}   password        密码
 * @field {*}   info            信息
 * @field {*}   Authorization   权限
 * @field {*}   date            时间戳
 */
const createUserTable = sqlMacros.sqlExecute(`CREATE TABLE IF NOT EXISTS USER(
     id INTEGER not null PRIMARY KEY AUTOINCREMENT ,
     role VARCHAR(255) NOT NULL ,
     userName VARCHAR(255) NOT NULL unique ,
     name VARCHAR(255) NOT NULL ,
     phone VARCHAR(255) ,
     password VARCHAR(255) ,
     info VARCHAR(255) ,
     Authorization VARCHAR(255) NOT NULL ,
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

router_user.get('/login', function (req, res) {
    let user = sqlMacros.sqlSelect('*', 'USER', true, 'userName', req.query.userName);

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

    var reqValues = [data.name, data.password, data.phone];
    var reqKeys = ['name', 'password', 'phone'];
    let result = sqlMacros.sqlInsert(reqKeys, reqValues, 'USER');

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



/*** 删除步骤
 * @api {post} /api/user/delete 删除步骤
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
router_user.post('/delete', function (req, res) {

    let data = req.body.data;
    for (let i = 0; i < data.length; i++) {
        let result = sqlMacros.sqlDelete('id', data[i]['id'], 'USER');
    } //删除所选数据

    let select_result = sqlMacros.sqlSelect('id', 'USER', true,
        'experimentID', data[0]['experimentID']);
    for (let i = 0; i < select_result.length; i++) {
        let result = sqlMacros.sqlUpdate('sequence', i + 1,
            'USER', 'id', select_result[i]['id']);
    } //重新排序

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