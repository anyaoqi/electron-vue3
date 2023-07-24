# 衡阳烟草POS系统

## 项目描述

商超数据对接，包含数据抽取、数据对照等功能，将商超数据库中的数据抽取到本地数据库，然后再通过接口上传到烟草服务器

## 技术框架

### **基础框架：[electron-vite-vue](https://github.com/electron-vite/electron-vite-vue)**

    官网地址：https://electron-vite.github.io/

    github地址：https://github.com/electron-vite/electron-vite-vue

### 技术栈

* [Vue3](https://cn.vuejs.org/)
* [Vue-router](https://router.vuejs.org/zh/)
* [Pinia](https://pinia.vuejs.org/zh/getting-started.html)
* [Axios](https://www.axios-http.cn/)
* [Sqlite3](https://github.com/TryGhost/node-sqlite3)
* [Vite](https://cn.vitejs.dev/)
* [Electron](https://www.electronjs.org/zh/docs/latest/)
* [Sass](https://www.sass.hk/)
* [TypeScript](https://www.tslang.cn/index.html)

### 其他技术

* 字体图标：[font-awesome](https://fontawesome.dashgame.com/)
* UI框架：[Element-plus](https://element-plus.org/zh-CN/component/button.html)
* mysql插件: [mysql2](https://github.com/sidorares/node-mysql2/tree/master/documentation/zh-cn)

## 目录介绍

* **electron** 主进程
  * electron\database 数据库相关
  * electron\events  事件处理
  * electron\preload.ts  预加载文件
  * electron\main.ts  主进程入口
* **src** 渲染进程
  * src\layout  布局
  * src\pages  页面
  * src\components 公共组件
  * src\router  路由
  * src\pinia  状态管理
  * src\styles  全局样式
  * src\types   类型管理
  * src\apis  接口
  * src\utils  常用工具
* **config** 全局配置
* **public** 静态资源
* **release** Electron打包输出
* **dist** Vue打包输出
* **vite.config.ts** Vite配置

## 项目命令

#### 启动：npm run dev

开发环境启动项目

#### 打包：npm run build

生产环境打包项目

#### 预览：npm run preview

打包后在浏览器中预览查看项目
