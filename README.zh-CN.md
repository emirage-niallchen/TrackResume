# TrackResume！！！

[English](README.md) | [中文](README.zh-CN.md)
<!-- 横幅与徽章 -->
![条幅](./public/Track-Resume.svg)

>基于 Next.js、Prisma 和 TailwindCSS 构建的个人简历网站，包括首页展示、附件展览与管理和配套的后台管理系统，持续追踪跟进职业发展！



## 内容列表
<!-- 一个目录，追踪所有的二级标题 -->
- 🎨 首页自定义信息展示
- 📱 响应式设计
- 🖼️ 项目展示，含markdown页面上传
- 📍 履历展示
- 📄 技术栈展示
- 🔐 管理后台
- 🔐 私有化部署

<!-- ## 背景 -->


## 技术栈

- **框架：** Next.js 14 、react 18.0.0
- **数据库：** MySQL + Prisma ORM
- **样式：** TailwindCSS + shadcn/ui

## 安装
提供2种安装方式，源码部署，docker部署
### docker安装
1. 创建一个新目录并进入：
```bash
mkdir -p track-resume && cd track-resume
```

2. 创建docker-compose.yml文件：
```bash
vim docker-compose.yml  # 或使用任何文本编辑器
```

3. 复制以下内容或pull项目后，使用项目的docker-compose.yml文件，并修改环境变量：
```yaml
version: '3.8'

services:
  app:
    image: niallchen/track-resume:latest
    container_name: TrackResume
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      MYSQL_DATABASE_URL: mysql://user:password@ip:port/cv_dev?connection_limit=5&connect_timeout=60&acquire_timeout=60&timeout=60&pool_timeout=60
      JWT_SECRET: f14w5er468ergwd486jh31gh3e5t4h863yr431fv165tr4uj86r
      NEXTAUTH_URL: http://localhost:3000 
      NEXTAUTH_SECRET: rwgq5ret6746f4e6ew7t684d6wq464fd6a74tg867
      NEXT_TELEMETRY_DISABLED: 1
    volumes:
      - ./public/uploads:/app/public/uploads
      - ./public/project:/app/public/project
```

4. 赋予对应权限：
```bash
chmod 775 ./public/uploads ./public/project
```

5. 启动容器：
```bash
docker-compose up -d
```


### 源码安装
1. 克隆仓库：
```bash
git clone <仓库地址>
```

2. 进入项目目录：
```bash
cd TrackResume
```

3. 安装依赖：
```bash
npm install
```

4. 配置数据库：
- 修改根目录下 `.env.example` 文件，为`.env`添加数据库连接信息
```
DATABASE_URL="mysql://用户名:密码@ip:port/数据库名"
```

5. 初始化数据库：
```bash
npx prisma db push
```


6. 构建生产版本：
```bash
npm run build
```

7. 启动生产服务器：
```bash
npm run start
```

## 详细信息及用法
请参考使用文档
https://cv-doc.artithm.com/

## 开源协议
The MIT License

Copyright (c) 2025 emirage-niallchen

## 联系方式
- 邮箱：[admin@artithm.com]