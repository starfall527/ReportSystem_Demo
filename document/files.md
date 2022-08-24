<!--
 * @Author: cwx
 * @Description: 关键文档说明
 * @Date: 2021-12-08 10:17:56
 * @LastEditTime: 2022-08-24 14:18:15
 * @FilePath: \ReportSystem_Demo\document\files.md
-->

# 目录结构

 | 路径                                         | 用途                     |
 | -------------------------------------------- | ------------------------ |
 | .\webContent\dist\controller                 | 前端脚本                 |
 | .\webContent\dist\views                      | html文件                 |
 | .\webContent\dist\views\case\caseUpload.html | 病例管理 上传端          |
 | .\webContent\dist\views\case\caseExpert.html | 病例管理 专家端          |
 | .\webContent\dist\views\case\caseForm.html   | 病例管理 新建病例        |
 | .\webContent\dist\views\case\caseReport.html | 病例管理 诊断病例        |
 | .\webContent\dist\views\case\slideTable.html | 病例管理 查看切片        |
 | .\webContent\dist\views\user\user\list.html  | 用户管理 用户列表        |
 | .\webContent\json\menu.json                  | 菜单栏编辑               |
 | .\Admin\Manager                              | 业务代码                 |
 | .\Admin\Manager\caseManager.js               | 病例管理后端             |
 | .\Admin\Manager\userManager.js               | 用户管理后端             |
 | .\Admin\Manager\organization.js              | 组织管理后端             |
 | .\Admin\slideCenter\slideCenter.js           | slideCenter离线版后端    |
 | .\Admin\database                             | better-sqlite3数据库相关 |
 | .\Admin\serial                               | 串口通信相关             |
 | .\Admin\setting.js                           | 系统设置                 |
 | .\app.js                                     | 应用启动文件             |
 | .\chrome-win                                 | chrome依赖               |
 | .\chrome-win                                 | chrome依赖               |
 
.\webContent\dist\controller    前端脚本
.\webContent\dist\views         html文件
.\webContent\json\menu.json     菜单栏编辑
.\webContent\config.js          layuiAdmin设置\三方组件引入

.\Admin\Manager                 业务代码
.\Admin\Manager\slideCenter     slideCenter相关代码
.\Admin\database                better-sqlite3数据库相关

.\document\接口文档\index.html  apidoc接口文档
.\upload                        上传相关的文件夹,包括电子签名\报告模板\报告附图\报告文件
.\protect_process.bat           守护进程,部署的时候可以设置开机启动

#### 项目使用
    1.node app.js 启动服务
    2.打开浏览器,输入127.0.0.1:9000进入界面

##### bat文件设置开机启动
https://wenku.baidu.com/view/5efd48dacbd376eeaeaad1f34693daef5ef713be.html

#### pkg打包程序为可执行文件
命令行执行 npm run pkg 即可

    package.json配置打包

    "pkg": {
        "scripts": [
            "Admin/**/*.js",
            "Admin/**/**/*.js",
            "Admin/*.js",
            "webContent/**/**/*.js",
            "webContent/**/*.js",
            "webContent/*.js"
        ],
        "assets": [
            "webContent/views/**/*",
            "webContent/layui/**/*",
            "webContent/json/**/*",
            "webContent/*",
            "webContent/**/**/**/*",
            "webContent/**/**/**/**/*",
            "node_modules/better-sqlite3/build/Release/better_sqlite3.node",
            "node_modules/opencv4nodejs/build/Release/opencv4nodejs.node"
        ],
        "targets": [
            "node12-win-x64"
        ],
        "outputPath": "dist/"
    },

如果项目使用到二进制文件.node时，pkg是默认不会打包的，必须在assets项添加对应文件，否则打包好的exe会闪退

打包后的exe读取的相对路径'./'可能不正确，最好在代码中使用process.cwd()代替

#### 代码中使用的一些vscode插件
    better comments         注释
    inline bookmarks        书签
    koroFileHeader          函数注释


#### 一些layui相关的资料
    https://layuion.com/        layui官网镜像站
    https://gitee.com/layui/layui/issues    gitee issues
    https://blog.csdn.net/liuyalu_/article/details/106146304  layuiAdmin知识点
    https://dev.layuion.com/extend/page/2/   layui第三方组件平台
    https://gitee.com/layui-extension/layui-card-table   layui-cardTable控件
    https://blog.csdn.net/weixin_33506815/article/details/118207601 laytpl介绍