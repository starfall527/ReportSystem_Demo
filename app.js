/***
 * @Author cwx
 * @Description 
 * @Date 2021-10-21 17:26:04
 * @LastEditTime 2022-06-15 11:32:06
 * @FilePath \ReportSystem_Demo\app.js
 */
const express = require("express");
const app = express();
const path = require("path");

const log4js = require('log4js');
const configParams = require('./Admin/config').readConfigFile();
var loggerParams = {
    appenders: ["dateFileOut", "consoleOut"],
    level: "info"
} // * 默认的logger配置
if (Object.keys(configParams).includes("loggerParams")) {
    loggerParams = configParams.loggerParams;
}
// log4js 配置
log4js.configure({
    appenders: {
        fileOut: {
            type: "file",
            filename: "debugger.log",
            maxLogSize: 1024 * 1024 * 50 //日志大小限制50M
        },
        dateFileOut: {
            type: "dateFile",
            filename: "./Logs/dateLog", //日志路径
            pattern: "yyyy-MM-dd.log", //时间样式
            alwaysIncludePattern: true,
            maxLogSize: 1024 * 1024 * 50, //日志大小限制50M 
        },
        userLog: {
            type: "dateFile",
            filename: "./Logs/user/userLog", //日志路径
            pattern: "yyyy-MM-dd.log", //时间样式
            alwaysIncludePattern: true,
            maxLogSize: 1024 * 1024 * 50, //日志大小限制50M 
        },
        consoleOut: {
            type: "console"
        },
    },
    categories: loggerParams
});


global.session = [];

process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});

const slideCenter = require('./Admin/slideCenter/slideCenter');
const userManager = require('./Admin/Manager/userManager');
const caseManager = require('./Admin/Manager/caseManager');

app.use(express.static(path.join(process.cwd(), 'webContent'), {
    index: "index.html"
})); //静态资源

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.use('/api/slideCenter', slideCenter.router_slideCenter);
app.use('/api/user', userManager.router_user);
app.use('/api/case', caseManager.router_case);

app.listen(9000, function () {
    console.log("the server is started!!!");
});

app.use(express.static(path.join(process.cwd(), '/upload')));

Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds() //秒 
    };
    if (/(y+)/.test(fmt)){ //根据y的长度来截取年
	fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
};