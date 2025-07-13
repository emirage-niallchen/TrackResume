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
- 🔐私有化部署

<!-- ## 背景 -->


## 技术栈

- **框架：** Next.js 14 、react 18.0.0
- **数据库：** MySQL + Prisma ORM
- **样式：** TailwindCSS
- **认证：** NextAuth.js

## 安装
提供2种安装方式，源码部署，docker部署
### 源码安装
1. 克隆仓库：
```bash
git clone <仓库地址>
```
2. 安装依赖：
```bash
npm install
```
3. 初始化数据库：
```bash
npx prisma db push
```

4. 启动开发服务器：
```bash
npm run dev
```

## 用法

## ToDo List
// todo 支持页面上传视频简历;确定支持上传；确定支持播放，确定视频图标

-放到dockerHub上面的。

//todo 邮箱等信息，从数据库获取

## 开源协议

MIT 协议 - 查看 LICENSE 文件了解详情

## 联系方式

- 邮箱：[admin@artithm.com]

需要增强数据库安全性，使用ssl-连接数据库

