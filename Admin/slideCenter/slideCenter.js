// /***
//  * @Author cwx
//  * @Description slideCenter的API
//  * @Date 2022-03-16 17:58:33
//  * @LastEditTime 2022-03-23 14:11:51
//  * @FilePath \IHC_layuiAdmin_Demo\Admin\slideCenter\slideCenter.js
//  */

const express = require("express");
const router_slideCenter = express.Router();
const fs = require('fs');
var http = require("http");
const logger = require('log4js').getLogger();
const base64 = require('js-base64');

var options = {
    hostname: 'localhost',
    port: 9804,
    path: `/api/app/odm-slide/slide-uri`,
    headers: {
        'Content-Type': 'text/json'
    }
}

async function sendRequest(path) {
    var options = {
        hostname: 'localhost',
        port: 9804,
        path: path,
        headers: {
            'Content-Type': 'text/json'
        }
    }
    return new Promise((resolve, reject) => {
        var req = http.request(options, function (res) {
            res.setEncoding("utf-8");
            res.on("data", function (chunk) {
                resolve(chunk.toString());
            });
        });
        req.on("error", function (err) {
            console.log(err.message);
            reject(err.message);
        });
        req.end();
    }).catch(err => {
        console.error(err);
    })
}

/***
 * @description: @note 遍历读取文件
 * @param {*} path
 * @param {*} filesList
 * @param {*} isRecursive   是否递归读取 true/false 
 * @param {*} postfix       后缀,可以为空
 * @return {*}
 */
function getFileList(path, filesList, isRecursive, postfix) {
    var filesList = [];
    let files = fs.readdirSync(path); // 需要用到同步读取
    files.forEach((file) => {
        let states = fs.statSync(path + "/" + file);
        // 判断是否是目录，是就继续递归
        if (states.isDirectory() && isRecursive) {
            getFileList(path + "/" + file, filesList);
        } else {
            if (postfix !== "") {
                if (file.includes(postfix)) {
                    filesList.push({
                        path: path + "/" + file,
                        fileName: file,
                        thumbnailUrl: getThumbnailUrl(path + "/" + file),
                        labelUrl: getLabelUrl(path + "/" + file),
                    });
                }
            } else {
                filesList.push({
                    path: path + "/" + file,
                    fileName: file,
                    thumbnailUrl: getThumbnailUrl(path + "/" + file)
                });
            }
        }
    });
    return filesList;
}

/***
 * @description: @note 遍历读取文件
 * @param {*} path
 * @param {*} filesList
 * @param {*} mode      是否递归读取 recursive 
 * @param {*} postfix   后缀,可以为空
 * @return {*}
 */
function getFolderList(path, filesList, mode, postfix) {
    var filesList = [];
    let files = fs.readdirSync(path); // 需要用到同步读取
    files.forEach((file) => {
        let states = fs.statSync(path + "/" + file);
        // 判断是否是目录，是就继续递归
        if (states.isDirectory() && mode === "recursive") {
            getFolderList(path + "/" + file, filesList);
        } else {
            if (postfix !== "") {
                if (file.includes(postfix)) {
                    filesList.push(file);
                }
            } else {
                filesList.push(file);
            }

        }
    });
    return filesList;
}

/***
 * @description: 获取tree 格式与layui-tree的格式一致
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
function getTree(path, tree) {
    let files = fs.readdirSync(path); // 需要用到同步读取
    files.forEach((file) => {
        let states = fs.statSync(path + "/" + file);
        // 判断是否是目录，是就继续递归
        if (states.isDirectory()) {
            tree = getTree(path + "/" + file, tree)
            tree.push(path + "/" + file);
        }
    });
    unique(tree);
    return tree;
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
 * @description: 获取当前分页数据
 * @param {array} sqlData   sql操作后获得的数据
 * @param {*} page      页码
 * @param {*} limit     每页显示数据条数
 * @return {*}
 * @TODO 先取所有数据,再截取分页数据,资源大概会有一点点点浪费(小问题)
 */
function getPageData(sqlData, page, limit) {
    let data;
    if (sqlData === undefined) {
        return [];
    }
    if (page != undefined || limit != undefined) {
        let start = (page - 1) * limit,
            end = page * limit;
        data = sqlData.slice(start, end);
    } else {
        data = sqlData;
    }
    return data;
}

// #region layui-tree格式的数据,参考用
// data = [{
//     title: '一级1',
//     id: 1,
//     field: 'name1',
//     checked: true,
//     spread: true,
//     children: [{
//         title: '二级1-1 可允许跳转',
//         id: 3,
//         field: 'name11',
//         href: 'https://www.layui.com/'
//     }]
// }, {
//     title: '一级2',
//     id: 2,
//     field: '',
//     spread: true,
//     children: [{
//         title: '二级2-1',
//         id: 5,
//         field: '',
//         spread: true
//     }, {
//         title: '二级2-2',
//         id: 6,
//         field: ''
//     }]
// }]
// #endregion

/***
 * @description: 获取tree 格式与layui-tree的格式一致
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
function getTreeJson(path, tree) {
    let treeJson = getTree(path, tree);
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
        treeJson.push(rootFolder);
    } // * 将根目录添加到treeJson
    else {
        treeJsonList.push({
            path: path,
            pathArray: path.split('/'),
            title: path.split('/').pop(),
            pathLength: path.split('/').length,
            children: [],
            field: path
        })
    }

    treeJson.forEach(element => {
        treeJsonList.push({
            path: element,
            pathArray: element.split('/'),
            title: element.split('/').pop(),
            pathLength: element.split('/').length,
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

function unique(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
            newArr.push(arr[i])
        }
    }
    return newArr;
}

// #region @note router处理

/***
 * @description: 获取玻片uri
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
async function getSlideUri(path, tenantName, isReadOnly) {
    options.path = `/api/app/odm-slide/slide-uri?Path=${encodeURI(path)}&TenantName=${encodeURI(tenantName)}&IsReadOnly=${encodeURI(isReadOnly)}`;
    let uri = await sendRequest(options.path);
    return uri;
}

/***
 * @description: 获取标注数据
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
async function getAnnotations(path, tenantName) {
    options.path = `/api/app/odm-slide/annotations?Path=${encodeURI(path)}&TenantName=${encodeURI(tenantName)}`;
    let uri = await sendRequest(options.path);
    return uri;
}

/***
 * @description: 获取标注数据图像
 * @param {*} path
 * @param {*} tenantName
 * @param {*} AnnotationId
 * @return {*} uri
 */
function getAnnotationImage(path, tenantName, AnnotationId) {
    options.path = `/api/app/odm-slide/annotation-image?Path=${encodeURI(path)}&TenantName=${encodeURI(tenantName)}&AnnotationId=${encodeURI(AnnotationId)}`;
    // let uri = sendRequest(options.path); // 需要获取二进制的时候,再用async和await
    let uri = `http://127.0.0.1:${options.port}${options.path}` // * 只传地址给前端 table只能以http://127.0.0.1开头 localhost不行
    return uri;
}

/***
 * @description: 获取切片缩略图
 * @param {*} path
 * @param {*} tenantName
 * @return {*} uri
 */
function getThumbnailUrl(path, tenantName, imageName) {
    imageName = 'thumbnail';
    options.path = `/api/app/odm-slide/named-image?Path=${encodeURI(path)}&TenantName=${encodeURI(tenantName)}&ImageName=${encodeURI(imageName)}`;
    // let uri = sendRequest(options.path); // 需要获取二进制的时候,再用async和await
    let uri = `http://127.0.0.1:${options.port}${options.path}` // * 只传地址给前端 table只能以http://127.0.0.1开头 localhost不行
    return uri;
}

/***
 * @description: 获取切片标签图
 * @param {*} path
 * @param {*} tenantName
 * @return {*} uri
 */
function getLabelUrl(path, tenantName, imageName) {
    imageName = 'label';
    options.path = `/api/app/odm-slide/named-image?Path=${encodeURI(path)}&TenantName=${encodeURI(tenantName)}&ImageName=${encodeURI(imageName)}`;
    // let uri = sendRequest(options.path); // 需要获取二进制的时候,再用async和await
    let uri = `http://127.0.0.1:${options.port}${options.path}` // * 只传地址给前端 table只能以http://127.0.0.1开头 localhost不行
    return uri;
}

/***
 * @description: 获取文件夹列表  接口返回的数据有误
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
async function getFolders(path) {
    path = `Path=${encodeURI(path)}`
    options.path = `/api/app/odm-slide/folders?${path}IsRecursive=true`;
    let result = await sendRequest(options.path);
    return result;
}

/***
 * @description: 获取文件夹信息
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
async function getFolder(path) {
    options.path = `/api/app/odm-slide/folder?Path=${encodeURI(path)}`;
    let result = await sendRequest(options.path);
    return result;
}

/***
 * @description: 获取文件夹下切片列表
 * @param {*} path
 * @param {*} tenantName
 * @return {*}
 */
async function getSlides(path) {
    options.path = `/api/app/odm-slide/slides?Path=${encodeURI(path)}&IsRecursive=true`;
    let result = await sendRequest(options.path);
    return result;
}

router_slideCenter.get('/getFolders', function (req, res) {
    getFolder('./').then(apiRes => {
        let folderList = [];
        if (apiRes !== undefined) {
            apiRes = JSON.parse(apiRes);
            let path = apiRes.path.replace(/\\/g, '/');
            if (path[path.length - 1] == '/') {
                path = path.slice(0, path.length - 1); // 去掉最后一个/
            }
            folderList = getTreeJson(path, []);
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
});


// 点击左侧文件夹列表,右侧显示文件夹下切片(table就行,搭配工具栏生成二维码)
router_slideCenter.get('/getSlides', function (req, res) {
    getSlides(``, '', false).then(apiRes => {
        var json = {
            code: 200,
            msg: '成功',
            data: apiRes
        };
        if (apiRes.length == 0) {
            json.msg = '查询无数据';
        }
        res.send(json);
    })
});

// 获取切片url
router_slideCenter.post('/getSlideUrl', function (req, res) {
    let data = req.body.data;
    let filePath = data.filePath;

    getSlideUri(filePath, '', false).then(res => {
        var json = {
            code: 200,
            msg: '成功',
            data: res,
            path: filePath,
        };
        if (res.length == 0) {
            json.msg = '查询无数据';
        }
        res.send(json);
    })
});

router_slideCenter.get('/table', function (req, res) {
    let data = req.query;
    let tableData = [];
    if (data.path !== '') {
        tableData = getFileList(data.path, [], false, '.tron')
    }
    let pageData = getPageData(tableData, req.query.page, req.query.limit);
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
});

// 获取切片的标注数据图
router_slideCenter.get('/annotationTable', function (req, res) { // getAnnotationImgs annotationTable
    let data = req.query.data;
    let tableData = [];
    let checkFlag = false;
    data.forEach(annotationPath => {
        getAnnotations(annotationPath, '').then(annoRes => {
            let annotations = JSON.parse(annoRes);
            annotations.forEach(element => {
                element.annotationUrl = getAnnotationImage(annotationPath, '', element.id);
                tableData.push(element);
                if (element.id === annotations[annotations.length - 1].id) {
                    if (annotationPath === data[data.length - 1]) {
                        checkFlag = true;
                    }
                };
            });
        });
    });

    let check = setInterval(() => {
        let timeout = 0;
        if (checkFlag) {
            let pageData = getPageData(tableData, req.query.page, req.query.limit);
            var json = {
                code: 200,
                msg: '成功',
                data: pageData,
                count: tableData.length
            };
            if (res.length == 0) {
                json.msg = '查询无数据';
            }
            clearInterval(check);
            res.send(json);
        } else {
            timeout += 200;
        }
        if (timeout > 2000) {
            clearInterval(check);
            res.send({
                code: 500,
                msg: '无切片标注数据/slideCenter未连接'
            });
        }
    }, 200);
});

const qrImage = require('qr-image');
const path = require('path');
// * 获取切片信息 关键接口
router_slideCenter.get('/openSlide', function (req, res) {
    let data = req.query;
    getSlideUri(data.path, '', false).then(apiRes => {
        let qrcodeName = ' slideQrcode.png'
        let qrImgPath = path.join(process.cwd(), `/upload/slideQrcode.png`);
        // 生成二维码文件流
        var qrcodeImg = qrImage.image(apiRes, {
            ec_level: "M",
            type: "png"
        });
        // 创建可以写入流，当有pipe它的时候就会生成一个userStr.png的文件
        var img = fs.createWriteStream(qrImgPath);
        // 将生成的二维码流pipe进入刚刚创建的可写入流，并生成文件
        qrcodeImg.pipe(img).on('finish', function () {
            var json = {
                code: 200,
                msg: '成功',
                data: apiRes,
                path: data.path,
                thumbnail: getThumbnailUrl(data.path),
                label: getLabelUrl(data.path),
                fileName: data.fileName,
                qrcodeName: qrcodeName
            };
            if (res.length == 0) {
                json.msg = '查询无数据';
            }
            res.send(json);
        });
    })
});
// #endregion

module.exports = {
    router_slideCenter,
    getFolderList,
    getFileList,
    getTree
}