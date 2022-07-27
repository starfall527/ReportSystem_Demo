/***
 * @Author cwx
 * @Description 
 * @Date 2022-07-20 11:49:11
 * @LastEditTime 2022-07-26 17:58:50
 * @FilePath \ReportSystem_Demo\Admin\slideCenter\slideCenterCloud.js
 */

const express = require("express");
const router_slideCenter = express.Router();
const sqlMacros = require("../database/macro");
const fs = require('fs');
var http = require("http");
const logger = require('log4js').getLogger();
const base64 = require('js-base64');
const config = require('../config');
const https = require('https');
const jimp = require('jimp');

var options = {
    hostname: '127.0.0.1',
    port: 9804,
    socket: `https://api.sc.trial.omnipath.cc`,
    NATtraverse: "",
    path: `/api/app/odm-slide/slide-uri`,
    headers: { 'Content-Type': 'text/json' }
};
// global.kingmedAPI= 'https://rpdp-uat.kingmed.com.cn'; // 测试接口
// global.userInfo = { username: 'testuser1', password: '123456' } // 测试接口

global.kingmedAPI = 'https://epathology.kingmed.com.cn'; // 生产接口
global.userInfo = { username: 'intemedic', password: '9565454239' } // 生产接口

/***
 * @description: 发送https请求
 * @param {*} url
 * @param {*} options
 * @return {*}
 */
async function sendHttpsRequest(url, options) {
    return new Promise((resolve, reject) => {
        var req = https.request(url, options, function(res) {
            res.on('data', (d) => {
                // console.log(d);
                if (options.returnBase64) { // base64解码
                    let base64str = 'data:image/jpeg;base64,' + d.toString('base64'); // 返回指定格式(jpg)的base64字符串
                    resolve(base64str);
                } else {
                    resolve(d.toString());
                }
            });
        });
        req.on("error", function(err) {
            console.log('statusCode:', err.statusCode);
            console.log(err.message);
            reject(err.message);
        });
        req.end();
    }).catch(err => {
        console.error(err);
    })
}

async function sendHttpsPostRequest(url, options, postData) {
    return new Promise((resolve, reject) => {
        var req = https.request(url, options, function(res) {
            if (!['', null, undefined, 'null'].includes(res.headers['set-cookie'])) {
                global.cookie = res.headers['set-cookie'][0].split(';')[0]; // 获取cookie
            }
            res.on('data', (d) => {
                // console.log(d);
                resolve(d.toString());
            });
        });
        req.write(postData);
        req.on("error", function(err) {
            console.log('statusCode:', err.statusCode);
            console.log(err.message);
            reject(err.message);
        });
        req.end();
    }).catch(err => {
        console.error(err);
    })
}

// 获取公有云sc的token
router_slideCenter.get('/getToken', function(req, res) {
    let data = req.query;
    if (![null, undefined, '', 'null'].includes(data.access_token)) {
        global.scToken = 'Bearer ' + data.access_token; // * 返回的token前面要加 Bearer 否则无效
        // global.tenantName = 'intemedic';
        global.tenantName = 'kingmed'; 
    }
    var json = {
        code: 200,
        msg: '成功',
    };
    res.send(json);
});

function loginKingMed() {
    let url = `${global.kingmedAPI}/dp/sa/login`; // 登录接口
    let httpsOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        path: url,
        data: global.userInfo // 生产接口账号
    };
    let postData = JSON.stringify(httpsOptions.data);
    sendHttpsPostRequest(url, httpsOptions, postData).then(apiRes => {
        console.log(apiRes)
    })
}
loginKingMed(); // 启动时登录金域

async function testThumbnail() { // 测试 从slideCenter获取缩略图
    let url = `${options.socket}/api/app/odm-slide/named-image?Path=/test/G21-0848.tron&TenantName=intemedic&ImageName=label+macro`;
    let httpsOptions = {
        headers: {
            authorization: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkM4OTcxQkEzQTBENDBEQTI5QUI1OTAxN0IzQUFDRDZBIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NTg0ODUyODUsImV4cCI6MTY5MDAyMTI4NSwiaXNzIjoiaHR0cHM6Ly9hdXRoLnNjLnRyaWFsLm9tbmlwYXRoLmNjOjQ0MyIsImF1ZCI6IkFwcCIsImNsaWVudF9pZCI6Ik9kbV9BcHAiLCJiYWNrZW5kIjoidHJ1ZSIsImlhdCI6MTY1ODQ4NTI4NSwic2NvcGUiOlsiQXBwIl19.bbeMQ5H0L4Q7faB_lJ0gLuBF19g5rNPCNNR1TZbARgvzoGRfOfQvJ6ZwSA2UN-3Y4vFJLqjbN92jQbKcrfV4b01eqDAL389ZJ6y-43maEO2hkvK-xfSpBsfiJJxP1HUuTT7I3Kc8phpToOfEhNX3pE3IIAvJbW-O0cxiG7Ojbq3-is11pnrAlc_VIbde2BPofNvD6wNYN15P0qDjKwyFeH9JtIRvbydzCIkZJ00VHMjzB-3IV0jdcTJbfBedgQA3XS7w6s50Ox8NiUw-OuUUw0864khHhhOMY6IMFfvtjnxl7VVzT7FbY9H5trMA6hWutk_9aryoWzD6t_uXz3nvnw"
        },
        path: url,
        returnBase64: true
    }
    let thumbnail;
    await sendHttpsRequest(url, httpsOptions).then(apiRes => {
        thumbnail = apiRes;
    })
}
// testThumbnail();

// 查看sc切片
router_slideCenter.get('/openSlide', async function(req, res) {
    if (!['', null, undefined, 'null'].includes(global.scToken)) {
        let data = req.query;
        let url = `${options.socket}/api/app/odm-slide/slide-uri?Path=${encodeURI(data.path)}&userName=sas_user&TenantName=${encodeURI(data.tenantName)}&IsReadOnly=false`;
        let httpsOptions = {
            headers: {
                authorization: global.scToken
            },
            path: url
        }
        var slideUrl = '';
        await sendHttpsRequest(url, httpsOptions).then(apiRes => {
            slideUrl = 'https://web.sc.trial.omnipath.cc' + apiRes + '&vendorScript=https://web.sc.trial.omnipath.cc/static/vendor/kingmed.js';
            // * slideUrl加入vendor-script的公网地址
            // console.log(slideUrl)
        })

        var json = {
            code: 200,
            msg: '成功',
            data: {
                fileName: data.fileName,
                scToken: global.scToken,
                slideUrl: slideUrl
            }
        };
        res.send(json);
    }
});


// 向金域上传切片
router_slideCenter.get('/uploadSlide', async function(req, res) {
    if (!['', null, undefined, 'null'].includes(global.scToken)) {
        let data = req.query;
        let url = `${options.socket}/api/app/odm-slide/slide-uri?Path=${encodeURI(data.path)}&userName=sas_user&TenantName=${encodeURI(data.tenantName)}&IsReadOnly=${encodeURI(data.isReadOnly)}`;
        let httpsOptions = {
            headers: {
                authorization: global.scToken
            },
            path: url
        }
        let checkFlag = false;
        var slideUrl = '';
        await sendHttpsRequest(url, httpsOptions).then(apiRes => {
            slideUrl = 'https://web.sc.trial.omnipath.cc' + apiRes + '&vendorScript=https://web.sc.trial.omnipath.cc/static/vendor/kingmed.js';
            // * slideUrl加入vendor-script的公网地址
            // console.log(slideUrl)
        })

        url = `${options.socket}/api/app/odm-slide/named-image?Path=${encodeURI(data.path)}&TenantName=${encodeURI(data.tenantName)}&ImageName=thumbnail`;
        let thumbnail;
        httpsOptions.path = url;
        httpsOptions.returnBase64 = true;
        await sendHttpsRequest(url, httpsOptions).then(apiRes => {
            thumbnail = apiRes;
            // console.log(thumbnail);
        })

        url = `${options.socket}/api/app/odm-slide/named-image?Path=${encodeURI(data.path)}&TenantName=${encodeURI(data.tenantName)}&ImageName=label`;
        let label;
        httpsOptions.path = url;
        httpsOptions.returnBase64 = true;
        await sendHttpsRequest(url, httpsOptions).then(apiRes => {
            label = apiRes;
            // console.log(label);
        })
        httpsOptions.returnBase64 = false;

        let kingMedUrl = `${global.kingmedAPI}/dp/xzw/slide`;
        let barcode = data.barcode;
        let postData = JSON.stringify({
            barcode: barcode,
            labelWithOverview: thumbnail,
            overview: thumbnail, // 切片缩略图
            label: label, // 标签图
            url: slideUrl,
            scannerModel: 'IMD-NEO-5X', // * 扫描仪型号
            createDateTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            vendor: 'InteMedic', // 厂商名 大小写敏感,错误则导致无法截图
            user: global.userInfo.username // 测试接口账号
        });
        if (slideUrl != '') {
            sendHttpsPostRequest(kingMedUrl, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*',
                    'Content-Type': 'application/json',
                    "Cookie": global.cookie
                }
            }, postData).then(kingMedRes => {
                console.log(`kingMedRes: ${kingMedRes}`);
                var json = {
                    code: 200,
                    msg: '成功'
                };
                res.send(json);
            })
        } else {
            var json = {
                code: 500,
                msg: '获取切片地址失败'
            };
            res.send(json);
        }
    } else {
        var json = {
            code: 500,
            msg: '未获取token,无法访问slideCenter'
        };
        res.send(json);
    }

});

// @note 获取sc文件树
router_slideCenter.get('/table', function(req, res) {
    let data = req.query;
    let tableData = [];
    let NATtraverse = '';
    let user = sqlMacros.sqlSelect('*', 'USER', true, 'userName', req.query.userName);
    if (user.length > 0) {
        NATtraverse = user[0].NATtraverse;
    }
    if (data.path !== '') {
        // tableData = getFileList(data.path, [], false, '.tron', NATtraverse)
        // tableData = getFileListAPI(data.path, [], false, '.tron', global.tenantName);

        let postfix = '.tron';
        var filesList = [];
        getSlides(data.path, global.tenantName, 20).then(apiRes => {
            apiRes = JSON.parse(apiRes);
            if (!['', null, undefined, 'null'].includes(apiRes.items)) {
                apiRes.items.forEach((item) => {
                    // 判断是否是目录，是就继续递归
                    if (postfix !== "") {
                        if (item.path.includes(postfix)) {
                            filesList.push({
                                path: item.path,
                                fileName: item.displayName,
                                thumbnailUrl: getThumbnailUrl(item.path, global.tenantName),
                                labelUrl: getLabelUrl(item.path, global.tenantName),
                                tenantName: global.tenantName,
                                isReadOnly: false,
                            });
                        }
                    } else {
                        filesList.push({
                            path: item.path,
                            fileName: item.displayName,
                            thumbnailUrl: getThumbnailUrl(item.path, global.tenantName),
                            tenantName: global.tenantName,
                            isReadOnly: false,
                        });
                    }
                });
            }
            tableData = filesList;
            let pageData = sqlMacros.getPageData(tableData, req.query.page, req.query.limit);
            var json = {
                code: 200,
                msg: '成功',
                data: pageData,
                count: tableData.length
            };
            if (res.length == 0) {
                json.msg = '查询无数据';
            }
            res.send(json);
        })
    } else { res.send({ code: 200, msg: '路径为空' }); }
});

async function getSlideUrl(path, tenantName, isReadOnly, userName) {
    let url = `${options.socket}/api/app/odm-slide/slide-uri?Path=${encodeURI(path)}&TenantName=${encodeURI(tenantName)}&IsReadOnly=${encodeURI(isReadOnly)}`;
    let httpsOptions = {
        headers: {
            authorization: global.scToken
        },
        path: url
    }
    sendHttpsRequest(url, httpsOptions).then(res => {})
}

function getThumbnailUrl(path, tenantName) {
    let url = `${options.socket}/api/app/odm-slide/named-image?Path=${encodeURI(path)}&TenantName=${encodeURI(tenantName)}&ImageName=thumbnail`;
    return url;
}
async function getThumbnail(path, tenantName) {
    let url = `${options.socket}/api/app/odm-slide/named-image?Path=${encodeURI(path)}&TenantName=${encodeURI(tenantName)}&ImageName=thumbnail`;
    let httpsOptions = {
        headers: {
            authorization: global.scToken
        },
        path: url
    }
    sendHttpsRequest(url, httpsOptions).then(res => {
        return res;
    })
}

function getLabelUrl(path, tenantName) {
    let url = `${options.socket}/api/app/odm-slide/named-image?Path=${encodeURI(path)}&TenantName=${encodeURI(tenantName)}&ImageName=label`;
    return url;
}


/***
 * @description: 获取文件夹信息
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
async function getFolders(path, tenantName, maxResultCount) {
    maxResultCount = 20;
    let url = `${options.socket}/api/app/odm-slide/folders?Path=${encodeURI(path)}&skipCount=0&maxResultCount=${maxResultCount}&TenantName=${tenantName}`;
    let httpsOptions = {
        headers: {
            authorization: global.scToken
        },
        path: url
    }
    let result = await sendHttpsRequest(url, httpsOptions);
    return result;
}

/***
 * @description: 获取文件夹下切片列表
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
async function getSlides(path, tenantName, maxResultCount) {
    let url = `${options.socket}/api/app/odm-slide/slides?Path=${encodeURI(path)}&skipCount=0&maxResultCount=${maxResultCount}&TenantName=${tenantName}`;
    let httpsOptions = {
        headers: {
            authorization: global.scToken
        },
        path: url
    }
    let result = await sendHttpsRequest(url, httpsOptions);
    return result;
}

var folderList = [];

// @note 获取tree数据
router_slideCenter.get('/getFolders', function(req, res) {
    if (!['', null, undefined, 'null'].includes(global.scToken)) {
        getFolders(req.query.path, global.tenantName, 20).then(apiRes => {
            var rootNode = {
                title: req.query.title,
                field: req.query.path,
                spread: true,
                children: []
            };
            if (apiRes !== undefined) {
                apiRes = JSON.parse(apiRes);
                apiRes.items.forEach(item => {
                    let node = {
                        title: item.displayName,
                        field: item.path,
                        spread: true
                    };
                    if (item.hasChildFolder) {
                        rootNode.children.push(node);
                    }
                })
            }
            if (folderList.length == 0) {
                folderList = [rootNode];
            } else {
                checkChildren(folderList[0], rootNode);
            }
            var json = {
                code: 200,
                msg: '成功',
                data: folderList
            };
            if (folderList.length == 0) {
                json.msg = '查询无数据';
            }
            res.send(json);
        })
    } else {
        var json = {
            code: 200,
            msg: '无token',
        };
        res.send(json);
    }
});

// #region @note 获取文件树
// 查询rootNode是否含有child
function checkChildren(rootNode, child) {
    let result = false;
    if (rootNode.children !== []) {
        for (let i = 0; i < rootNode.children.length; i++) {
            if (rootNode.children[i].field !== child.field) {
                if (!['', null, undefined, 'null'].includes(rootNode.children[i].children)) {
                    checkChildren(rootNode.children[i], child);
                }
            } else {
                // 找到该child的位置,扩展该child
                rootNode.children[i] = child;
            }
        }
    }
}

/***
 * @description: @note 遍历读取文件
 * @param {*} path
 * @param {*} filesList
 * @param {*} isRecursive   是否递归读取 true/false 
 * @param {*} postfix       后缀,可以为空
 * @return {*}
 */
async function getFileListAPI(path, filesList, isRecursive, postfix, tenantName) {
    var filesList = [];
    let files = [] //fs.readdirSync(path); // 需要用到同步读取
    getSlides(path, tenantName, 20).then(apiRes => {
        if (!['', null, undefined, 'null'].includes(apiRes.items)) {
            apiRes.items.forEach((file) => {
                // 判断是否是目录，是就继续递归
                if (postfix !== "") {
                    if (file.includes(postfix)) {
                        filesList.push({
                            path: file.path,
                            fileName: file.displayName,
                            thumbnailUrl: getThumbnailUrl(file.path, global.tenantName),
                            labelUrl: getLabelUrl(file.path, global.tenantName),
                        });
                    }
                } else {
                    filesList.push({
                        path: file.path,
                        fileName: file,
                        thumbnailUrl: getThumbnailUrl(file.path, global.tenantName),
                    });
                }
            });
        }
        return filesList;
    })
}
// #endregion

function getArrayUnion(array1, array2) {
    array1.forEach(element => {
        array2.push(element);
    });
    return unique(array2);
}

function unique(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
            newArr.push(arr[i])
        }
    }
    return newArr;
}

/***
 * @description: @note 遍历读取文件
 * @param {*} path
 * @param {*} filesList
 * @param {*} isRecursive   是否递归读取 true/false 
 * @param {*} postfix       后缀,可以为空
 * @return {*}
 */
function getFileList(path, filesList, isRecursive, postfix, NATtraverse) {
    var filesList = [];
    let files = fs.readdirSync(path); // 需要用到同步读取
    files.forEach((file) => {
        let states = fs.statSync(path + "/" + file);
        // 判断是否是目录，是就继续递归
        if (states.isDirectory() && isRecursive) {
            getFileList(path + "/" + file, filesList, NATtraverse);
        } else {
            if (postfix !== "") {
                if (file.includes(postfix)) {
                    filesList.push({
                        path: path + "/" + file,
                        fileName: file,
                        thumbnailUrl: getThumbnailUrl(path + "/" + file, '', '', NATtraverse),
                        labelUrl: getLabelUrl(path + "/" + file, '', '', NATtraverse),
                    });
                }
            } else {
                filesList.push({
                    path: path + "/" + file,
                    fileName: file,
                    thumbnailUrl: getThumbnailUrl(path + "/" + file, '', '', NATtraverse)
                });
            }
        }
    });
    return filesList;
}
// #endregion

module.exports = {
    router_slideCenter
};