/***
 * @Author cwx
 * @Description 
 * @Date 2022-03-17 09:25:58
 * @LastEditTime 2022-05-25 17:08:23
 * @FilePath \ReportSystem_Demo\webContent\dist\controller\caseAdmin.js
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
        elem: '#case-table',
        url: 'api/case/table', //使用后端数据
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
                    field: 'pathologyNum',
                    title: '病理号',
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
                }, {
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

    $('.case-table-btn .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


    var active = {
        getUrl: function () { // * 复制url
            var checkStatus = table.checkStatus('case-table'),
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