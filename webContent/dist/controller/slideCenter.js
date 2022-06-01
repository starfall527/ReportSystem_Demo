/***
 * @Author cwx
 * @Description 
 * @Date 2022-03-17 09:25:58
 * @LastEditTime 2022-05-31 12:00:29
 * @FilePath \ReportSystem_Demo\webContent\dist\controller\slideCenter.js
 */
layui.define(['tree', 'util', 'table'], function (exports) {
    var tree = layui.tree,
        layer = layui.layer,
        util = layui.util,
        $ = layui.$,
        admin = layui.admin,
        view = layui.view,
        table = layui.table;

    var path = '';
    var caseID = '';

    table.render({
        elem: '#slide-table-list',
        url: 'api/slideCenter/table', //使用后端数据
        height: 'full-320',
        response: {
            statusCode: 200
        },
        where: {
            path: path
        },
        cols: [
            [{
                    field: 'checkbox',
                    type: 'checkbox',
                    fixed: 'left'
                },
                {
                    field: 'fileName',
                    title: '切片名',
                    minWidth: 80
                }
                // , {
                //     title: "操作",
                //     width: 150,
                //     align: "center",
                //     fixed: "right",
                //     toolbar: "#table-toolbar"
                // }
            ]
        ],
        page: true,
        limit: 20,
    })
    // table.on('tool(table-toolbar)')


    function getData() {
        var data = [];
        $.ajax({
            url: "api/slideCenter/getFolders", //后台数据请求地址
            type: "get",
            async: false,
            success: function (result) {
                data = result.data;
            }
        });
        return data;
    }

    //基本演示
    tree.render({
        elem: '#tree',
        data: getData(),
        showCheckbox: false, //是否显示复选框

        id: 'tree',
        isJump: false, //是否允许点击节点时弹出新窗口跳转

        click: function (obj) {
            var data = obj.data; //获取当前点击的节点数据
            // layer.msg('状态：' + obj.state + `obj.field:${obj.data.field}`);
            layui.table.reload('slide-table-list', {
                where: {
                    path: obj.data.field
                },
            });
        }
    });

    $('.slide-table-list-btn .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    var active = {
        openSlide: function () { // * 打开选中切片
            var checkStatus = table.checkStatus('slide-table-list'),
                checkData = checkStatus.data[0];
            if (checkData === undefined) {
                return layer.msg('请选择数据');
            } else {
                layer.confirm('将打开选中切片，确定？', {
                    btn: ['确定', '取消']
                }, function (index) {
                    admin.req({
                        url: 'api/slideCenter/openSlide',
                        type: 'get',
                        contentType: 'application/json;charset=UTF-8',
                        data: checkData,
                        success: function (res) {
                            console.log(res)
                            layer.open({
                                type: 2,
                                title: res.fileName,
                                shade: false,
                                maxmin: true,
                                area: ['90%', '90%'],
                                content: res.data
                            }); // iframe弹窗
                        },
                        done: function (res) {}
                    })
                    layer.close(index);
                });
            }
        },
        getUrlQrcode: function () { // * 获取二维码
            var checkStatus = table.checkStatus('slide-table-list'),
                checkData = checkStatus.data[0];
            if (checkData === undefined) {
                return layer.msg('请选择数据');
            } else {
                admin.req({
                    url: 'api/slideCenter/openSlide',
                    type: 'get',
                    contentType: 'application/json;charset=UTF-8',
                    data: checkData,
                    success: function (res) {
                        layer.photos({
                            photos: {
                                "title": "", //相册标题
                                "id": 123, //相册id
                                "start": 0, //初始显示的图片序号，默认0
                                "data": [ //相册包含的图片，数组格式
                                    {
                                        "alt": "图片名",
                                        "pid": 666, //图片id
                                        "src": res.qrcodeName, //* 二维码文件名 固定放在upload文件夹就行 
                                        "thumb": "" //缩略图地址
                                    }
                                ]
                            } //json格式
                        });
                    },
                    done: function (res) {}
                })
            }
        },
        getUrl: function () { // * 复制url
            var checkStatus = table.checkStatus('slide-table-list'),
                checkData = checkStatus.data[0];
            if (checkData === undefined) {
                return layer.msg('请选择数据');
            } else {
                admin.req({
                    url: 'api/slideCenter/openSlide',
                    type: 'get',
                    contentType: 'application/json;charset=UTF-8',
                    data: checkData,
                    success: function (res) {
                        layer.alert(`${res.data}`, {
                            title: '切片url'
                        })
                    },
                    done: function (res) {}
                })
            }
        }
    }
    exports('slideCenter', {})

});