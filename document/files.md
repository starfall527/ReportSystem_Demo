<!--
 * @Author: cwx
 * @Description: 
 * @Date: 2022-08-10 11:06:22
 * @LastEditTime: 2022-08-24 11:12:01
 * @FilePath: \ReportSystem_Demo\document\files.md
-->
<!--
 * @Author: cwx
 * @Description: 关键文档说明
 * @Date: 2021-12-08 10:17:56
 * @LastEditTime: 2022-08-10 11:25:23
 * @FilePath: \ReportSystem_Demo\document\files.md
-->

# 目录结构
.\webContent\dist\controller            前端脚本
.\webContent\dist\views                 html文件
.\webContent\dist\views\kingMed.html    金域切片管理html文件
.\webContent\json\menu.json             菜单栏编辑
.\webContent\config.js                  layuiAdmin设置\三方组件引入

.\Admin\Manager                         业务代码
.\Admin\slideCenterCloud                slideCenter在线版相关代码
.\Admin\database                        better-sqlite3数据库相关

.\document\接口文档\index.html          apidoc接口文档
.\protect_process.bat                   守护进程,部署的时候可以设置开机启动

#### 开发目的
    该工具基于公有云版slideCenter开发,用于将sc的切片上传到金域病理系统中。

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