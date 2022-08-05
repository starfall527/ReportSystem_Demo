<!--
 * @Author: cwx
 * @Description: 
 * @Date: 2022-08-04 15:51:55
 * @LastEditTime: 2022-08-04 16:09:13
 * @FilePath: \ReportSystem_Demo\document\files.md
-->

# 目录结构

    .\document                      各种文档
    .\webContent\dist\controller    前端脚本
    .\webContent\dist\views         html文件
    .\webContent\json\menu.json     侧边菜单栏编辑

    .\Admin\Manager                 业务代码
    .\Admin\database                better-sqlite3数据库相关
    .\Admin\slideCenter             slideCenter相关

    .\dist                          部署文件夹
    .\dist\node.exe                 应用程序
    .\dist\uploadDir                报告/签名图/报告模板    
    .\dist\chrome-win               chrome依赖(puppeteer生成pdf需要)
    .\dist\webContent               前端文件


# 部署方法

    1.使用npm run pkg,在dist文件夹下生成exe文件
    2.将webContent前端文件复制到dist文件夹
    3.