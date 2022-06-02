layui.use(['admin', 'form', 'laydate', 'view', 'xmSelect'], function () {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        view = layui.view,
        form = layui.form,
        xmSelect = layui.xmSelect;
    setter = layui.setter;

    xmSelect.render({
        el: '#demo1',
        data: [{
            name: '张三',
            value: 1
        },{
            name: '张三',
            value: 1
        }]
    })
    element.render('collapse');

    var router = layui.router();
    var slideUrl = '';
    var caseData = {};
    var caseStatus = "诊断完成";
    // @note 初始化报告
    admin.req({
        url: 'api/case/query',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({
            data: {
                id: router.search.caseID
            }
        }),
        success: function (res) { // 查询到病例数据,设置各种监听,以及html文本
            if (res.count > 0) {
                console.log(JSON.stringify(res.data[0]));
                caseData = res.data[0];
                document.getElementById("name").innerHTML += caseData.patName;
                document.getElementById("gender").innerHTML += caseData.gender;
                document.getElementById("age").innerHTML += caseData.age;
                document.getElementById("pathologyNum").innerHTML += caseData.pathologyNum;
                document.getElementById("hosName").innerHTML += caseData.hosName;
                document.getElementById("uploadDate").innerHTML += caseData.date;
                document.getElementById("general").innerHTML = caseData.general;
                document.getElementById("unit").innerHTML += caseData.unit;
                document.getElementById("samplePart").innerHTML = caseData.samplePart;

                document.getElementById("report-unit").innerHTML += caseData.unit;
                document.getElementById("report-doctor").innerHTML += caseData.doctor;
                document.getElementById("report-pathologyNum").innerHTML += caseData
                    .pathologyNum;
                document.getElementById("report-patName").innerHTML += caseData.patName;
                document.getElementById("report-uploadDate").innerHTML += caseData.date;
                document.getElementById("expert-label").innerHTML += layui.data('layuiAdmin')
                    .userName;

                slideUrl = JSON.parse(caseData.slideUrl);

                // document.getElementById("appendix").innerHTML = `<div class=\"layui-col-md2 layui-col-sm4\">
                //     <div class=\"slide-container\">
                //         <a href=\"javascript:;\">
                //             <script type=\"text\/html\" template><img src=\"{{ layui.setter.base }}style\/res\/template\/portrait.png\"><\/script>
                //         <\/a>
                //     <\/div>
                // <\/div>`

                // @note 查看切片
                $('#openSlide').on('click', function () {
                    layer.open({
                        type: 2,
                        title: '切片',
                        shade: false,
                        maxmin: true,
                        area: ['90%', '90%'],
                        content: slideUrl[0].slideUrl
                    }); // iframe弹窗
                });

                // @note 表格提交
                form.on('submit(form-report)', function (data) {
                    data.field.status = caseStatus;
                    admin.req({
                        url: 'api/case/update',
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        data: JSON.stringify({
                            data: data.field,
                            caseID: caseData.id
                        }),
                        success: function (res) {
                            if (caseStatus === "专家退回") {
                                layer.msg("退回成功,将返回列表");
                            } else if (caseStatus === "诊断完成") {
                                layer.msg('提交成功,将返回病例列表');
                            }
                            setTimeout(() => {
                                window.location.href =
                                    `./#/case/caseExpert`;
                            }, 2000);
                        },
                        done: function (res) {}
                    })
                    return false;
                });

                // @note 表格提交
                form.on('submit(chooseReportImg)', function (data) {
                    admin.popup({
                        title: '选择报告用图',
                        area: ['800px', '600px'], // 为防止窗口变形,设置弹窗宽度至少为400px
                        id: 'popup-chooseReportImg',
                        success: function (layero, index) {
                            view(this.id).render(
                                'case/annotationList', {
                                    path: {
                                        path: slideUrl[0].path
                                    }
                                }).done(function () {})
                        }
                    })
                });
            } else {
                layer.alert("查询不到病例,将返回列表");
                window.location.href = `./#/case/caseExpert`;
            }
        },
        done: function (res) {}
    })

    // @note 按钮监听
    $('.operation-btn .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    var active = {
        returnReport: function () {
            caseStatus = '专家退回';
        },
        chooseReportImg: function () { // * 复制url
            var checkStatus = table.checkStatus('slide-table-list'),
                checkData = checkStatus.data[0];
            if (checkData === undefined) {
                return layer.msg('请选择数据');
            } else {
                admin.popup({
                    title: '选择报告用图',
                    area: ['800px', '600px'], // 为防止窗口变形,设置弹窗宽度至少为400px
                    id: 'popup-chooseReportImg',
                    success: function (layero, index) {
                        view(this.id).render(
                            'case/annotationList', {
                                path: checkData
                            }).done(function () {})
                    }
                })
            }
        }
    }
});