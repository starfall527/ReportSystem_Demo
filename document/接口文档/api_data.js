define({ "api": [
  {
    "type": "post",
    "url": "/api/user/delete",
    "title": "删除用户",
    "name": "DeleteStep",
    "group": "步骤管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectArray",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.id",
            "description": "<p>唯一标识</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.experimentID",
            "description": "<p>实验ID</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "步骤管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/user/role/delete",
    "title": "删除角色",
    "name": "DeleteStep",
    "group": "步骤管理",
    "version": "0.0.0",
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "步骤管理"
  },
  {
    "type": "post",
    "url": "/api/user/role/insert",
    "title": "新增角色",
    "name": "InsertRole",
    "group": "步骤管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "{}",
          "content": "{}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "步骤管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/user/insert",
    "title": "新增用户",
    "name": "InsertUser",
    "group": "步骤管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "{}",
          "content": "{}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "步骤管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/organization/insert",
    "title": "新增组织",
    "name": "InsertOrganization",
    "group": "玻片管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象,具体字段由表单决定</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/organization.js",
    "groupTitle": "玻片管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/user/update",
    "title": "更新用户数据",
    "name": "UpdateStep",
    "group": "用户管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.id",
            "description": "<p>唯一标识</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.field",
            "description": "<p>更新的键</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.value",
            "description": "<p>更新的键值</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "用户管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/user/expertTable",
    "title": "查询所有专家列表",
    "version": "0.0.1",
    "name": "expertTable",
    "group": "用户管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>返回数据个数</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "size": "...",
            "optional": false,
            "field": "data",
            "description": "<p>对象数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>唯一标识</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.role",
            "description": "<p>身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userName",
            "description": "<p>用户姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.organization",
            "description": "<p>组织名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.name",
            "description": "<p>登录名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.phone",
            "description": "<p>手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.password",
            "description": "<p>密码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.sign",
            "description": "<p>签名路径</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.info",
            "description": "<p>信息</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.subspecialty",
            "description": "<p>亚专科</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.authorization",
            "description": "<p>权限</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reportTitle",
            "description": "<p>报告标题</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.slideCenterIP",
            "description": "<p>slideCenterIP</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.NATtraverse",
            "description": "<p>内网穿透host</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.isExamined",
            "description": "<p>审核状态</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.date",
            "description": "<p>时间戳</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "用户管理"
  },
  {
    "type": "get",
    "url": "/api/user/getSessionData",
    "title": "session接口",
    "version": "0.0.1",
    "name": "getSessionData",
    "group": "用户管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userName",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n      \"code\": 200,\n      \"msg\": \"\",\n      \"data\": {\n          \"userName\": \"专家1\"\n      }\n  }",
          "type": "json"
        },
        {
          "title": "Fail-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n      \"code\": 200,\n      \"msg\": \"登录已过期\",\n      \"data\": {\n          \"userName\": \"专家1\"\n      }\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "用户管理"
  },
  {
    "type": "get",
    "url": "/api/user/getUserTable",
    "title": "查询所有用户列表",
    "version": "0.0.1",
    "name": "getUserTable",
    "group": "用户管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>返回数据个数</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "size": "...",
            "optional": false,
            "field": "data",
            "description": "<p>对象数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>唯一标识</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.role",
            "description": "<p>身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userName",
            "description": "<p>用户姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.organization",
            "description": "<p>组织名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.name",
            "description": "<p>登录名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.phone",
            "description": "<p>手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.password",
            "description": "<p>密码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.sign",
            "description": "<p>签名路径</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.info",
            "description": "<p>信息</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.subspecialty",
            "description": "<p>亚专科</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.authorization",
            "description": "<p>权限</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reportTitle",
            "description": "<p>报告标题</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.slideCenterIP",
            "description": "<p>slideCenterIP</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.NATtraverse",
            "description": "<p>内网穿透host</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.isExamined",
            "description": "<p>审核状态</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.date",
            "description": "<p>时间戳</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "用户管理"
  },
  {
    "type": "get",
    "url": "/api/user/login",
    "title": "登录接口",
    "version": "0.0.1",
    "name": "login",
    "group": "用户管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n      \"code\": 200,\n      \"msg\": \"登录成功\",\n      \"data\": { \"userID\": 1, \"userName\": \"工程师1\", \"access_token\": \"8dda2da20cba25291b4c83990d144e49\" }\n  }",
          "type": "json"
        },
        {
          "title": "401-Response:",
          "content": "HTTP/1.1 401 unauthorized\n  {\n      code: 401,\n      msg: '密码错误'\n  }",
          "type": "json"
        },
        {
          "title": "500-Response:",
          "content": "HTTP/1.1 500 Error\n  {\n      code: 500,\n      msg: '未找到用户'\n  }",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    },
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "用户管理"
  },
  {
    "type": "get",
    "url": "/api/user/logout",
    "title": "登出接口",
    "version": "0.0.1",
    "name": "logout",
    "group": "用户管理",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n      \"code\": 200,\n      \"msg\": \"\",\n  }",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    },
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "用户管理"
  },
  {
    "type": "get",
    "url": "/api/user/queryExpert",
    "title": "条件查询专家列表",
    "version": "0.0.1",
    "name": "queryExpert",
    "group": "用户管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>返回数据个数</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "size": "...",
            "optional": false,
            "field": "data",
            "description": "<p>对象数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>唯一标识</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.role",
            "description": "<p>身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userName",
            "description": "<p>用户姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.organization",
            "description": "<p>组织名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.name",
            "description": "<p>登录名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.phone",
            "description": "<p>手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.password",
            "description": "<p>密码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.sign",
            "description": "<p>签名路径</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.info",
            "description": "<p>信息</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.subspecialty",
            "description": "<p>亚专科</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.authorization",
            "description": "<p>权限</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reportTitle",
            "description": "<p>报告标题</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.slideCenterIP",
            "description": "<p>slideCenterIP</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.NATtraverse",
            "description": "<p>内网穿透host</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.isExamined",
            "description": "<p>审核状态</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.date",
            "description": "<p>时间戳</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "用户管理"
  },
  {
    "type": "post",
    "url": "/api/user/setPassword",
    "title": "更改密码",
    "name": "setPassword",
    "group": "用户管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.userID",
            "description": "<p>用户ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.oldPassword",
            "description": "<p>旧密码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.password",
            "description": "<p>新密码</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "用户管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/user/uploadSign",
    "title": "上传签名",
    "name": "uploadSign",
    "group": "用户管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userid",
            "description": "<p>用户名</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/userManager.js",
    "groupTitle": "用户管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/case/insert",
    "title": "新增病例数据",
    "name": "InsertCase",
    "group": "病例管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象,具体字段参考列表</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/caseManager.js",
    "groupTitle": "病例管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/user/cancelFigure",
    "title": "取消附图",
    "name": "cancelFigure",
    "group": "病例管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.id",
            "description": "<p>病例ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.type",
            "description": "<p>附图类型</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/caseManager.js",
    "groupTitle": "病例管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/case/delete",
    "title": "删除病例",
    "name": "deleteCase",
    "group": "病例管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象,具体字段由表单决定</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data.id",
            "description": "<p>病例id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/caseManager.js",
    "groupTitle": "病例管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/case/openReport",
    "title": "生成报告",
    "name": "openReport",
    "group": "病例管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reportPath",
            "description": "<p>报告路径</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/caseManager.js",
    "groupTitle": "病例管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/case/startConsultation",
    "title": "发起会诊",
    "name": "startConsultation",
    "group": "病例管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.pathologyNum",
            "description": "<p>病理号</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.patName",
            "description": "<p>病人姓名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.hosName",
            "description": "<p>医院名</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/caseManager.js",
    "groupTitle": "病例管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/api/case/table",
    "title": "查询病例",
    "version": "0.0.1",
    "name": "table",
    "group": "病例管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>返回数据个数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "size": "...",
            "optional": false,
            "field": "data",
            "description": "<p>对象数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>唯一标识</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.status",
            "description": "<p>病例状态</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.caseType",
            "description": "<p>病例类型</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.pathologyNum",
            "description": "<p>病理号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reportTitle",
            "description": "<p>报告标题</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.consultationNum",
            "description": "<p>会诊号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.patName",
            "description": "<p>病人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.patientInfo",
            "description": "<p>病人信息</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.gender",
            "description": "<p>性别</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.age",
            "description": "<p>年龄</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.nation",
            "description": "<p>病人民族</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.birthDate",
            "description": "<p>出生日期</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.IDNum",
            "description": "<p>身份证号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.patTel",
            "description": "<p>病人电话</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.familyTel",
            "description": "<p>家属电话</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.subspecialty",
            "description": "<p>亚专科</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.inspectionDate",
            "description": "<p>送检时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.unit",
            "description": "<p>送检单位</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.department",
            "description": "<p>送检科室</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.hosName",
            "description": "<p>医院名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.doctor",
            "description": "<p>医生名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.doctorTel",
            "description": "<p>医生电话</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.expert",
            "description": "<p>会诊专家</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.isGynecology",
            "description": "<p>是否妇科</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.lastMenses",
            "description": "<p>末次月经</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.isMenopause",
            "description": "<p>是否绝经</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.samplePart",
            "description": "<p>取样部位</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.clinicalData",
            "description": "<p>临床资料</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.clinicalDataFigure",
            "description": "<p>临床资料附图</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.imgCheck",
            "description": "<p>影像学检查</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.imgCheckFigure",
            "description": "<p>影像学检查附图</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.history",
            "description": "<p>病史</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.general",
            "description": "<p>大体所见</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.originDiagnosis",
            "description": "<p>原诊断意见</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.diagnosis",
            "description": "<p>诊断意见</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.isSatisfied",
            "description": "<p>标本是否满意</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.component",
            "description": "<p>细胞成分</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.unsatisfiedReason",
            "description": "<p>不满意理由</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.inflammation",
            "description": "<p>炎症</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reactChange",
            "description": "<p>反应性改变</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.squamousCell",
            "description": "<p>鳞状上皮细胞分析</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.glandularCell",
            "description": "<p>腺上皮细胞分析</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.otherAnalysis",
            "description": "<p>其它分析</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.note",
            "description": "<p>备注</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.slideUrl",
            "description": "<p>切片url json 对象数组</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.annotation",
            "description": "<p>报告用图</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reportPath",
            "description": "<p>报告路径</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.signPath",
            "description": "<p>签名图路径</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.freezeOrderDate",
            "description": "<p>冰冻预约时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.uploadDate",
            "description": "<p>上传时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.diagnoseDate",
            "description": "<p>诊断时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.confirmDate",
            "description": "<p>确认诊断时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.date",
            "description": "<p>时间戳</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    },
    "filename": "Admin/Manager/caseManager.js",
    "groupTitle": "病例管理"
  },
  {
    "type": "post",
    "url": "/api/case/table",
    "title": "查询病例筛选值",
    "version": "0.0.1",
    "name": "tableFilter",
    "group": "病例管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "...",
            "optional": false,
            "field": "data.status",
            "description": "<p>病例状态</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "...",
            "optional": false,
            "field": "data.caseType",
            "description": "<p>病例类型</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "...",
            "optional": false,
            "field": "data.subspecialty",
            "description": "<p>亚专科</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "...",
            "optional": false,
            "field": "data.expert",
            "description": "<p>专家</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>返回数据个数</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    },
    "filename": "Admin/Manager/caseManager.js",
    "groupTitle": "病例管理"
  },
  {
    "type": "post",
    "url": "/api/user/uploadFigure",
    "title": "上传附图",
    "name": "uploadFigure",
    "group": "病例管理",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>数据对象</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.id",
            "description": "<p>唯一标识</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.field",
            "description": "<p>更新的键</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.value",
            "description": "<p>更新的键值</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "{}",
          "content": "{}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "Admin/Manager/caseManager.js",
    "groupTitle": "病例管理",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      }
    }
  }
] });
