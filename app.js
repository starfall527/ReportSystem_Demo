/***
 * @Author cwx
 * @Description 
 * @Date 2021-10-21 17:26:04
 * @LastEditTime 2022-03-23 14:09:02
 * @FilePath \IHC_layuiAdmin_Demo\app.js
 */
const express = require("express");
const app = express();
const path = require("path");


process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});

const slideCenter = require('./Admin/slideCenter/slideCenter');
app.use(express.static(path.join(process.cwd(), 'webContent'), {
    index: "index.html"
})); //静态资源

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.use('/api/slideCenter', slideCenter.router_slideCenter);

app.listen(3000, function () {
    console.log("the server is started!!!");
});

app.use(express.static(path.join(process.cwd(), '/upload')));