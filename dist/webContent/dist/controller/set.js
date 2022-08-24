/***
 * @Author cwx
 * @Description 
 * @Date 2022-03-23 09:50:20
 * @LastEditTime 2022-07-12 17:43:47
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
        title: [/^[\S]{0,12}$/, "标题字数需小于12，且不能出现空格"],
        repass: function(t) {
            if (t !== i("#LAY_password").val()) return "两次密码输入不一致"
        },
        ip: function(ip) {
            var reg = /^(d{1,2}|1dd|2[0-4]d|25[0-5]).(d{1,2}|1dd|2[0-4]d|25[0-5]).(d{1,2}|1dd|2[0-4]d|25[0-5]).(d{1,2}|1dd|2[0-4]d|25[0-5])$/
            if(!reg.test(ip)){return "请输入有效的ip地址"}
        }
    }), a.on("submit(set_website)", function(t) {
        return e.msg(JSON.stringify(t.field)), !1
    }), a.on("submit(set_system_email)", function(t) {
        return e.msg(JSON.stringify(t.field)), !1
    }), a.on("submit(setInfo)", function(t) { // 设置资料
        // return e.msg(JSON.stringify(t.field)), !1        
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
        done: function(res) {
            if (200 == res.code) { e.msg('上传签名成功') } else { e.msg('上传签名失败') }
            let randomUrl = res.url += '?' + Math.floor(Math.random() * 100 + 1); // * 给前台的数据url加上随机数,浏览器才会更新图片
            document.getElementById("preview").setAttribute('value', randomUrl);
        },
        error: function(err) { console.log(err); }
    });
    n.events.preview = function(t) {
        var i = document.getElementById("preview").getAttribute('value');
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
    a.on("submit(setPassword)", function(data) { // 设置密码
        data.field.userID = layui.data('layuiAdmin').userID;
        admin.req({
            url: 'api/user/setPassword',
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({
                data: data.field
            }),
            success: function(res) {
                if (res.code == 200) {
                    layer.msg('修改成功')
                }
            },
        });
    }), t("set", {});
});