/***
 * @Author cwx
 * @Description 
 * @Date 2022-07-20 11:49:11
 * @LastEditTime 2022-08-02 14:07:32
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

var options = {
    hostname: '127.0.0.1',
    port: 9804,
    socket: `https://api.sc.trial.omnipath.cc`,
    NATtraverse: "",
    path: `/api/app/odm-slide/slide-uri`,
    headers: { 'Content-Type': 'text/json' }
};

async function sendHttpsRequest(url, options) {
    return new Promise((resolve, reject) => {
        var req = https.request(url, options, function(res) {
            res.on('data', (d) => {
                // console.log(d);
                if (options.returnBase64) {
                    resolve(d.toString('base64'));
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

// 获取公有云slideCenter的token
router_slideCenter.get('/getToken', function(req, res) {
    let data = req.query;
    if (![null, undefined, '', 'null'].includes(data.access_token)) {
        global.scToken = 'Bearer ' + data.access_token;
    }
    var json = {
        code: 200,
        msg: '成功',
    };
    res.send(json);
});

function loginKingMed() {
    let url = "https://rpdp-uat.kingmed.com.cn/dp/sa/login";
    let httpsOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        path: url,
        data: { username: 'testuser1', password: '123456' }
    };
    let postData = JSON.stringify(httpsOptions.data);
    sendHttpsPostRequest(url, httpsOptions, postData).then(apiRes => {
        console.log(apiRes)
    })
}
// loginKingMed();

async function testThumbnail() {
    let url = `${options.socket}/api/app/odm-slide/named-image?Path=/test/G21-0848.tron&TenantName=intemedic&ImageName=thumbnail`;
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

// 向金域上传切片
router_slideCenter.get('/uploadSlide', async function(req, res) {
    let data = req.query;
    let url = `${options.socket}/api/app/odm-slide/slide-uri?Path=${encodeURI(data.path)}&TenantName=${encodeURI(data.tenantName)}&IsReadOnly=${encodeURI(data.isReadOnly)}`;
    let httpsOptions = {
        headers: {
            authorization: global.scToken
        },
        path: url
    }
    let checkFlag = false;
    var slideUrl = '';
    await sendHttpsRequest(url, httpsOptions).then(apiRes => {
        slideUrl = 'https://auth.sc.trial.omnipath.cc' + apiRes + '&vendor-script=http://server/vendor-script.js';
    })

    url = `${options.socket}/api/app/odm-slide/named-image?Path=${encodeURI(data.path)}&TenantName=${encodeURI(data.tenantName)}&ImageName=thumbnail`;
    let thumbnail;
    httpsOptions.path = url;
    httpsOptions.returnBase64 = true;
    await sendHttpsRequest(url, httpsOptions).then(apiRes => {
        thumbnail = apiRes;
        console.log(thumbnail)
    })

    let kingMedUrl = 'https://rpdp-uat.kingmed.com.cn/dp/xzw/slide';
    let barcode = data.barcode;
    let postData = JSON.stringify({
        barcode: barcode,
        labelWithOverview: 'test',
        overview: thumbnail,
        url: slideUrl,
        scannerModel: 'NEO-5X',
        createDateTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
        vendor: 'intemedic',
        user: 'testuser1'
    });
    if (slideUrl != '') {
        sendHttpsPostRequest(kingMedUrl, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Content-Type': 'application/json',
                "Cookie": "JSESSIONID=D8839DBA2F9B36D8EA836DC7827D85DE"
            }
        }, postData).then(kingMedRes => {
            console.log(`kingMedRes`);
            console.log(kingMedRes);
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

});

// getSlideUrl('/test/G21-0848.tron', 'intemedic', false, 'advuser');

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
        // tableData = getFileListAPI(data.path, [], false, '.tron', 'intemedic');

        let postfix = '.tron';
        var filesList = [];
        getSlides(data.path, 'intemedic', 20).then(apiRes => {
            apiRes = JSON.parse(apiRes);
            if (!['', null, undefined, 'null'].includes(apiRes.items)) {
                apiRes.items.forEach((item) => {
                    // 判断是否是目录，是就继续递归
                    if (postfix !== "") {
                        if (item.path.includes(postfix)) {
                            filesList.push({
                                path: item.path,
                                fileName: item.displayName,
                                thumbnailUrl: getThumbnailUrl(item.path, 'intemedic'),
                                labelUrl: getLabelUrl(item.path, 'intemedic'),
                                tenantName: 'intemedic',
                                isReadOnly: false,
                            });
                        }
                    } else {
                        filesList.push({
                            path: item.path,
                            fileName: item.displayName,
                            thumbnailUrl: getThumbnailUrl(item.path, 'intemedic'),
                            tenantName: 'intemedic',
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
    sendHttpsRequest(url, httpsOptions).then(res => {
        console.log(res)
    })
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

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = Buffer.from(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

var folderList = [];

// @note 获取tree数据
router_slideCenter.get('/getFolders', function(req, res) {
    if (!['', null, undefined, 'null'].includes(global.scToken)) {
        getFolders(req.query.path, 'intemedic', 20).then(apiRes => {
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
                            thumbnailUrl: getThumbnailUrl(file.path, 'intemedic'),
                            labelUrl: getLabelUrl(file.path, 'intemedic'),
                        });
                    }
                } else {
                    filesList.push({
                        path: file.path,
                        fileName: file,
                        thumbnailUrl: getThumbnailUrl(file.path, 'intemedic'),
                    });
                }
            });
        }
        return filesList;
    })
}
// #endregion


/***
 * @description: 获取tree 格式与layui-tree的格式一致
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
async function getTree(path, tenantName, tree) {
    let folderList = [];
    getFolders(path, tenantName).then(apiRes => {
        if (apiRes !== undefined) {
            apiRes = JSON.parse(apiRes);
            apiRes.items.forEach(item => {
                if (!['', null, undefined, 'null'].includes(item.path)) {
                    let path = item.path.replace(/\\/g, '/');
                    if (path[path.length - 1] == '/') {
                        path = path.slice(0, path.length - 1); // 去掉最后一个/
                    }
                    if (item.hasChildFolder === true) {
                        let child = getFolders(path, tenantName); // todo 迭代还没做 晚点补上
                    }
                    folderList.push(item.path);
                }
            })
        }
        return folderList;
    })
}


/***
 * @description: 获取tree 格式与layui-tree的格式一致
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
function getTreeJson(path, treeJson) {
    let treeJsonList = [];

    for (let i = treeJson.length - 1; i >= 0; i--) {
        if (treeJson[i].includes(".intemedic")) {
            treeJson.splice(i, 1);
        }
    } // * 过滤掉slideCenter自己生成的文件夹(.intemedic)

    let rootFolder = '';
    if (treeJson.length > 0) {
        treeJson[treeJson.length - 1].lastIndexOf('/') > 0 ?
            rootFolder = treeJson[treeJson.length - 1].substring(0, treeJson[treeJson.length - 1].lastIndexOf('/')) :
            rootFolder = treeJson[treeJson.length - 1];
        if (rootFolder != '/') {
            treeJson.push(rootFolder);
        }
    } // * 将根目录添加到treeJson
    else {
        treeJsonList.push({
            path: path,
            pathArray: path === '/' ? ['/'] : path.split('/'),
            title: path === '/' ? '/' : path.split('/').pop(),
            pathLength: path === '/' ? 1 : path.split('/').length,
            children: [],
            field: path
        })
    }

    treeJson.forEach(element => {
        if (element[0] === '/') {
            element = '.' + element;
        }
        treeJsonList.push({
            path: element,
            pathArray: element === './' ? ['./'] : element.split('/'),
            title: element === './' ? '/' : element.split('/').pop(),
            pathLength: element === './' ? 1 : element.split('/').length,
            children: [],
            field: element
        })
    });
    let maxLength = 0,
        minLength = 0;
    treeJsonList.forEach(element => {
        maxLength = Math.max(maxLength, element.pathLength);
        minLength = Math.min(minLength, element.pathLength);
    });
    for (let i = maxLength; i >= minLength; i--) {
        (treeJsonList.filter(element => element.pathLength === i)).forEach(element => {
            treeJsonList.forEach(parent => {
                if (element.path.includes(parent.path) && parent.pathLength === i - 1) {
                    parent.children.push({
                        title: element.title,
                        children: element.children,
                        field: element.field
                    })
                }
            });
        });
    } // * 从最长的路径开始，将treeJsonList中所有的element.children按照父子关系更新
    if (treeJsonList.length > 0) {
        return [treeJsonList[treeJsonList.length - 1]]; // * 返回根节点即可
    } else {
        return treeJsonList;
    }
}


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