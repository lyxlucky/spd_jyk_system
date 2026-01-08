# 环境部署说明

## 快速开始

现在你可以使用以下命令来快速构建不同环境的项目：

### 开发环境
```bash
npm run dev
```

### 生产环境构建

#### 测试环境
```bash
npm run build:test      # 线上测试环境
```

#### 北京环境
```bash
npm run build:bjww     # 北京外网
npm run build:bjnw     # 北京内网
npm run build:bjnwhttps # 北京内网HTTPS
```

#### 北大环境
```bash
npm run build:bdww     # 北大外网
npm run build:bdnw     # 北大内网
```

#### 龙华妇幼环境
```bash
npm run build:lhfyww   # 龙华妇幼外网
npm run build:lhfynw   # 龙华妇幼内网
```

#### 华南医院环境
```bash
npm run build:hnww     # 华南医院外网
npm run build:hnnw     # 华南医院内网
```

#### 萨米医院环境
```bash
npm run build:smww     # 萨米医院外网
npm run build:smnw     # 萨米医院内网
```

#### 汕头肿瘤环境
```bash
npm run build:stzlww   # 汕头肿瘤外网
npm run build:stzlnw   # 汕头肿瘤内网
```

#### 中心医院环境
```bash
npm run build:zxww     # 中心医院外网
npm run build:zxnw     # 中心医院内网
```

#### 龙岗医院环境
```bash
npm run build:lgww     # 龙岗医院外网
```

#### 市二医院环境
```bash
npm run build:se2bb    # 市二本部
npm run build:se2bbww  # 市二本部外网
npm run build:dpyq     # 大鹏院区
npm run build:lhyq     # 龙华院区
```

## 环境配置说明

每个环境都有对应的 `.env.{环境名}` 配置文件，包含：
- `VUE_APP_API_BASE_URL`: API接口地址
- `VUE_APP_BASE_URL`: 项目部署路径
- `VUE_APP_ENV`: 环境标识
- `VUE_APP_TARGET`: 代理目标地址

构建后的文件会输出到对应的目录：
- 外网环境：`jyk` 目录
- 内网环境：`jyknw` 目录
- 本地开发：`dist` 目录

## 注意事项

1. 不再需要手动修改任何配置文件
2. 每个环境的配置都是独立的
3. 开发时默认使用本地环境配置
4. 构建时会自动使用对应环境的配置
