/** layuiAdmin.pro-v1.4.0 LPPL License By https://www.layui.com/admin/ */ ;
layui.define(["table", "form", "admin", 'upload'], function(e) {
    var $ = layui.$,
        i = (layui.$, layui.admin),
        admin = layui.admin,
        t = layui.view,
        table = layui.table,
        r = layui.form,
        upload = layui.upload;

    var uploadInst = upload.render({
        elem: '#uploadSignBtn',
        url: 'api/user/uploadSign',
        accept: 'images',
        method: 'post',
        acceptMime: 'image/*',
        done: function() {
            setTimeout(() => {
                table.reload("LAY-user-manage");
            }, 300);
        } // 刷新表格签名图 需要后台返回的路径加上随机数
    });

    table.render({
        elem: "#LAY-user-manage",
        url: "api/user/userTable",
        cols: [
            [{
                type: "checkbox",
                fixed: "left"
            }, {
                field: "id",
                width: 100,
                title: "ID",
                sort: !0
            }, {
                field: "userName",
                title: "用户名",
                minWidth: 100
            }, {
                field: "avatar",
                title: "头像",
                width: 100,
                templet: "#imgTpl",
                hide: true
            }, {
                field: "sign",
                title: "签名图",
                minWidth: 150,
                templet: "#signTpl",
                hide: false
            }, {
                field: "phone",
                title: "手机"
            }, {
                field: "email",
                title: "邮箱",
                hide: true
            }, {
                field: "sex",
                width: 80,
                title: "性别",
                hide: true
            }, {
                field: "date",
                title: "注册时间",
                sort: true
            }, {
                title: "操作",
                width: 240,
                align: "center",
                fixed: "right",
                toolbar: "#table-userList"
            }]
        ],
        response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        },
        page: true,
        limit: 30,
        height: 'full-280',
        text: "对不起，加载出现异常！",
        done: function() {
            $(".layui-table-main tr").each(function(index, val) {
                $(".layui-table-fixed").each(function() {
                    $($(this).find(".layui-table-body tbody tr")[index]).height($(val).height())
                })
            });
            $(".layui-table-header tr").each(function(index, val) {
                $(".layui-table-fixed").each(function() {
                    $($(this).find(".layui-table-header thead tr")[index]).height($(val).height())
                })
            });
            // 解决checkBox和行高度不一致的问题
        }
    });
    table.on("tool(LAY-user-manage)", function(e) {
        var data = e.data;
        if ("del" === e.event) {
            layer.confirm('将删除用户,确定？', function(index) {
                e.del(); // 删除对应行（tr）的DOM结构，并更新缓存
                admin.req({
                    url: 'api/user/delete',
                    type: 'get',
                    contentType: 'application/json;charset=UTF-8',
                    data: data,
                    success: function(res) {
                        layer.msg('删除成功')
                    },
                    done: function(res) {}
                })
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if ("uploadSign" === e.event) {
            //上传头像
            uploadInst.reload({
                headers: { userid: data.id }
            }); // 重载upload实例的上传参数
            $('#uploadSignBtn').click();
        }

        // "del" === e.event ? layer.prompt({
        //     formType: 1,
        //     title: "敏感操作，请验证口令"
        // }, function (i, t) {
        //     layer.close(t), layer.confirm("真的删除行么", function (i) {
        //         e.del(), layer.close(i)
        //     })
        // }) : "edit" === e.event && i.popup({
        //     title: "编辑用户",
        //     area: ["500px", "450px"],
        //     id: "LAY-popup-user-add",
        //     success: function (e, i) {
        //         t(this.id).render("user/user/userForm", data).done(function () {
        //             r.render(null, "layuiadmin-form-useradmin"), r.on("submit(LAY-user-front-submit)", function (e) {
        //                 e.field;
        //                 layui.table.reload("LAY-user-manage"), layer.close(i)
        //             })
        //         })
        //     }
        // })
    });
    table.render({
        elem: "#LAY-user-back-manage",
        // url: "./json/useradmin/mangadmin.json",
        url: "api/user/adminTable",
        cols: [
            [{
                type: "checkbox",
                fixed: "left"
            }, {
                field: "id",
                width: 80,
                title: "ID",
                sort: true
            }, {
                field: "name",
                title: "用户名"
            }, {
                field: "phone",
                title: "手机"
            }, {
                field: "email",
                title: "邮箱",
                hide: true
            }, {
                field: "role",
                title: "角色"
            }, {
                field: "date",
                title: "加入时间",
                sort: true,
                hide: true
            }, {
                field: "check",
                title: "审核状态",
                templet: "#buttonTpl",
                minWidth: 80,
                align: "center"
            }, {
                title: "操作",
                width: 150,
                align: "center",
                fixed: "right",
                toolbar: "#table-useradmin-admin"
            }]
        ],
        response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        },
        text: "对不起，加载出现异常！"
    });
    table.on("tool(LAY-user-back-manage)", function(e) {
        var data = e.data;
        "del" === e.event ? layer.prompt({
            formType: 1,
            title: "敏感操作，请验证口令"
        }, function(i, t) {
            layer.close(t), layer.confirm("确定删除此管理员？", function(i) {
                console.log(e), e.del(), layer.close(i)
            })
        }) : "edit" === e.event && i.popup({
            title: "编辑管理员",
            area: ["420px", "450px"],
            id: "LAY-popup-user-add",
            success: function(e, i) {
                t(this.id).render("user/administrators/adminForm", data).done(function() {
                    r.render(null, "layuiadmin-form-admin"), r.on("submit(LAY-user-back-submit)", function(e) {
                        e.field;
                        layui.table.reload("LAY-user-back-manage"), layer.close(i)
                    })
                })
            }
        })
    });
    table.render({
        elem: "#LAY-user-back-role",
        // url: "./json/useradmin/role.json",
        url: "api/user/roleTable",
        height: 'full-280',
        cols: [
            [{
                type: "checkbox",
                fixed: "left"
            }, {
                field: "id",
                width: 80,
                title: "ID",
                sort: !0
            }, {
                field: "role",
                title: "角色名"
            }, {
                field: "authorization",
                title: "拥有权限"
            }, {
                field: "description",
                title: "具体描述"
            }, {
                title: "操作",
                width: 150,
                align: "center",
                fixed: "right",
                toolbar: "#table-useradmin-admin"
            }]
        ],
        response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        },
        text: "对不起，加载出现异常！"
    });
    table.on("tool(LAY-user-back-role)", function(e) {
        var data = e.data;
        "del" === e.event ? layer.confirm("确定删除此角色？", function(i) {
            e.del(), layer.close(i)
        }) : "edit" === e.event && i.popup({
            title: "添加新角色",
            area: ["500px", "480px"],
            id: "LAY-popup-user-add",
            success: function(e, i) {
                t(this.id).render("user/administrators/roleForm", data).done(function() {
                    r.render(null, "layuiadmin-form-role"), r.on("submit(LAY-user-role-submit)", function(e) {
                        console.log(e.field)
                        // layui.table.reload("LAY-user-back-role"), layer.close(i)
                    })
                })
            }
        })
    }), e("useradmin", {})
});