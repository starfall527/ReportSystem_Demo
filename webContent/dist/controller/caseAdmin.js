/***
 * @Author cwx
 * @Description 
 * @Date 2022-03-17 09:25:58
 * @LastEditTime 2022-05-17 16:27:58
 * @FilePath \ReportSystem_Demo\webContent\dist\controller\case.js
 */
layui.define(['tree', 'util', 'table'], function (exports) {
    var tree = layui.tree,
        layer = layui.layer,
        util = layui.util,
        $ = layui.$,
        admin = layui.admin,
        view = layui.view,
        table = layui.table;

    let path = '';

    table.render({
        elem: '#case-table-list',
        url: //'./json/demo/experimentData.js', //使用假数据
            'api/case/table', //使用后端数据
        height: 'full-320',
        response: {
            statusCode: 200
        },
        where: {
            path: path
        },
        cols: [
            [{
                    field: 'radio',
                    type: 'radio',
                    fixed: 'left'
                },
                {
                    field: 'fileName',
                    title: '切片名',
                    minWidth: 120
                }, {
                    field: 'status',
                    title: '状态',
                    minWidth: 120
                }, {
                    field: 'patientInfo',
                    title: '病人信息',
                    minWidth: 120
                }, {
                    field: 'hosName',
                    title: '医院名',
                    minWidth: 120
                },{
                    field: 'subspecialty',
                    title: '亚专科',
                    minWidth: 120
                }, {
                    field: 'date',
                    title: '上传时间',
                    minWidth: 120
                }, {
                    title: "操作",
                    width: 150,
                    align: "center",
                    fixed: "right",
                    toolbar: "#table-toolbar"
                }
            ]
        ],
        page: true,
        limit: 20,
    });

    function getData() {
        var data = [];
        $.ajax({
            url: "api/case/getFolders", //后台数据请求地址
            type: "get",
            async: false,
            success: function (result) {
                console.log(result)
                data = result.data;
            }
        });
        return data;
    }

    $('.case-table-list-btn .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


    var active = {
        getUrlQrcode: function () { // * 获取二维码
            var checkStatus = table.checkStatus('case-table-list'),
                checkData = checkStatus.data[0];
            if (checkData === undefined) {
                return layer.msg('请选择数据');
            } else {
                admin.req({
                    url: 'api/case/opencase',
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
            var checkStatus = table.checkStatus('case-table-list'),
                checkData = checkStatus.data[0];
            if (checkData === undefined) {
                return layer.msg('请选择数据');
            } else {
                admin.req({
                    url: 'api/case/opencase',
                    type: 'get',
                    contentType: 'application/json;charset=UTF-8',
                    data: checkData,
                    success: function (res) {
                        layer.alert(`切片url:${res.data}`)
                    },
                    done: function (res) {}
                })
            }
        }
    }

    exports('caseAdmin', {})
});