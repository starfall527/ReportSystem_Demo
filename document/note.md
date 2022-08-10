<!--
 * @Author: cwx
 * @Description:
 * @Date: 2022-06-10 16:13:43
 * @LastEditTime: 2022-08-10 10:58:50
 * @FilePath: \ReportSystem_Demo\document\note.md
-->

### slideCenter ODM使用
使用slideCenter ODM版本 220415版
使用代理后连接不上服务: 关闭安全软件,重装ODM

生产部署问题
目前采用的是pkg把程序打包成exe,再编写bat脚本守护进程
服务器部署时,需要在防火墙设置里新建入站规则,开放9804端口

1.puppeteer注意事项
打包时需在根目录添加chrome-win文件夹(版本号取决于puppeteer,一般用node_modules/puppeteer/.local-chromium内的chrome-win文件夹),包含chrome.exe,在config.json内配置路径指向chrome.exe
程序中launch
https://blog.csdn.net/qq_31254489/article/details/118864759
https://blog.csdn.net/cainiao1412/article/details/123459685


slideCenter 公有云服务 API 开发用账号
https://web.sc.trial.omnipath.cc/
组织:intemedic
用户:user / advuser
密码:abcdef
user 是普通用户，advuser 是高级用户