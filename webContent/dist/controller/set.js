/***
 * @Author cwx
 * @Description 
 * @Date 2022-03-23 09:50:20
 * @LastEditTime 2022-06-15 18:07:49
 * @FilePath \ReportSystem_Demo\webContent\dist\controller\set.js
 */
/** layuiAdmin.pro-v1.4.0 LPPL License By https://www.layui.com/admin/ */
;
layui.define(["form", "upload", 'admin'], function(t) {
    var i = layui.$,
        e = layui.layer,
        n = (layui.laytpl, layui.setter, layui.view, layui.admin),
        admin = layui.admin,
        a = layui.form,
        s = layui.upload;
    i("body");
    a.render(), a.verify({
        nickname: function(t, i) {
            return new RegExp("^[a-zA-Z0-9_一-龥\\s·]+$").test(t) ? /(^\_)|(\__)|(\_+$)/.test(t) ? "用户名首尾不能出现下划线'_'" : /^\d+\d+\d$/.test(t) ? "用户名不能全为数字" : void 0 : "用户名不能有特殊字符"
        },
        pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        repass: function(t) {
            if (t !== i("#LAY_password").val()) return "两次密码输入不一致"
        }
    }), a.on("submit(set_website)", function(t) {
        return e.msg(JSON.stringify(t.field)), !1
    }), a.on("submit(set_system_email)", function(t) {
        return e.msg(JSON.stringify(t.field)), !1
    }), a.on("submit(setInfo)", function(t) { // 设置资料
        return e.msg(JSON.stringify(t.field)), !1
    });
    var r = i("#LAY_signSrc");

    var uploadInst = s.render({
        elem: "#LAY_signUpload",
        url: 'api/user/uploadSign',
        accept: 'images',
        method: 'get',
        acceptMime: 'image/*',
        headers: {},
        before: function() {
            this.headers.userid = layui.data('layuiAdmin').userID;
        },
        done: function(t) {
            200 == t.code ? r.val(t.url) : e.msg(t.msg)
        },
        error: function(err) { console.log(err); }
    });
    n.events.preview = function(t) {
        var i = r.val();
        e.photos({
            photos: {
                title: "查看图像",
                data: [{
                    src: i
                }]
            },
            shade: .01,
            closeBtn: 1,
            anim: 5
        })
    };
    a.on("submit(setPassword)", function(t) { // 设置密码
        return e.msg(JSON.stringify(t.field)), !1
    }), t("set", {});
});