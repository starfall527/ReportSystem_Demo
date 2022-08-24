/***
 * @Author cwx
 * @Description 
 * @Date 2021-12-28 11:34:16
 * @LastEditTime 2022-06-09 10:07:52
 * @FilePath \ReportSystem_Demo\webContent\index.js
 */

layui.config({
    base: '/dist/' //指定 layuiAdmin 项目路径
        ,
    version: '1.4.0'
}).extend({        
    soulTable: '../lib/extend/soulTable/ext/soulTable',
    tableChild: '../lib/extend/soulTable/ext/tableChild',
    tableMerge: '../lib/extend/soulTable/ext/tableMerge',
    tableFilter: '../lib/extend/soulTable/ext/tableFilter',
    excel: '../lib/extend/soulTable/ext/excel',    
    cardTable: '../lib/extend/cardTable/cardTable',    
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