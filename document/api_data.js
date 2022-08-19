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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limits[i]",
            "description": "<p>权限 on/off</p>"
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
    "url": "/api/user/insert",
    "title": "新增用户",
    "name": "InsertUser",
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
            "type": "Object",
            "optional": false,
            "field": "data.userName",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data.password",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data.phone",
            "description": "<p>手机</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data.organization",
            "description": "<p>组织</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data.role",
            "description": "<p>角色</p>"
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
    "type": "post",
    "url": "/api/user/setPassword",
    "title": "更改密码",
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
            "description": "<p>数据对象,具体字段由表单决定</p>"
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
    "url": "/api/case/chooseExpert",
    "title": "选择专家",
    "name": "chooseExpert",
    "group": "病例管理",
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
    "url": "/api/case/chooseExpert",
    "title": "选择切片",
    "name": "chooseExpert",
    "group": "病例管理",
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
    "url": "/api/case/chooseExpert",
    "title": "选择报告用图",
    "name": "chooseExpert",
    "group": "病例管理",
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
    "title": "新增玻片数据",
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
  }
] });
