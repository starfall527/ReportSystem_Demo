/***
 * @Author cwx
 * @Description 
 * @Date 2021-12-28 11:34:16
 * @LastEditTime 2022-05-11 17:51:08
 * @FilePath \ReportSystem_Demo\dist\webContent\index.js
 */

layui.config({
    base: '/dist/' //指定 layuiAdmin 项目路径
        ,
    version: '1.4.0'
}).extend({
    slideCenter: 'slideCenter'
}).use('index', function () {
    var layer = layui.layer,
        admin = layui.admin;
    layer.ready(function () {
        // admin.popup({
        //     content: '单页面专业版默认未开启“多标签”功能，实际运用时，你可以自定义是否开启'
        //     ,area: '300px'
        //     ,shade: false
        // });
    });
});