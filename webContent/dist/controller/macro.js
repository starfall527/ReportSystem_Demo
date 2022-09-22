/***
 * @Author cwx
 * @Description 常用函数
 * @Date 2022-03-17 09:25:58
 * @LastEditTime 2022-09-21 15:38:14
 * @FilePath \ReportSystem_Demo\webContent\dist\controller\macro.js
 */
layui.define(function(exports) {
    function urlReplaceIP(url, ip) {
        var url = url || "";
        try {
            if (url == "") {
                return url;
            }
            if (url.indexOf(ip) != -1) {
                return url; //没有此字段则退出
            }
            //截取ip前字段"http:"
            if (url.indexOf('//') == -1) {
                return url; //没有此字段则退出
            }
            var substr1 = url.substring(0, url.indexOf('//'));
            var substr2 = url.substring(url.indexOf('//') + 2, url.length);
            substr2 = substr2.substring(substr2.indexOf('/') + 1, substr2.length);
            var newUrl = substr1 + "//" + ip + "/" + substr2;
            return newUrl;
        } catch (exception) {
            alert("replace IP error");
        }
    }
    exports('macro', { urlReplaceIP });
});