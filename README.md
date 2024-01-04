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
* 本地数据库：[sqlite](http://www.sqlite.net.cn/index.html)
* 版本更新：[electron-updater](https://www.electron.build/configuration/configuration)
* 日志：[electron-log](https://github.com/megahertz/electron-log)
* 工具库：[vueuse](https://www.vueusejs.com/)

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
* **electron-builder.json5** 打包配置
* **tsconfig.json** TypeScript配置

## 位置

* 日志位置：C:\Users\\username\AppData\Roaming\data-supermarket\logs
* sqlite数据库：C:\Users\\username\AppData\Roaming\data-supermarket\database.db

## 项目命令

#### 启动：npm run dev

开发环境启动项目

#### 打包：npm run build

生产环境打包项目

#### 预览：npm run preview

打包后在浏览器中预览查看项目

## sqlite本地数据库表

* ds_comparison_store => 门店对照关系表
* ds_comparison_goods => 商品对照关系表
* ds_extraction => 数据抽取对照字段表
* ds_extraction_list =>数据抽取分类表

**烟草信息同步**

* ds_store_list  => 烟草门店表
* ds_goods_list  => 烟草商品表

**商超数据抽取**

* ds_store => 门店信息抽取
* ds_supplier  => 供应商信息抽取
* ds_notb_category => 非烟商品类别抽取
* ds_notb_goods =>  非烟商品信息抽取
* ds_tb_goods => 卷烟商品信息抽取
* ds_member_info => 会员信息抽取
* ds_retail_order => 零售订单信息抽取
* ds_in_order => 入库单信息抽取
* ds_loss_order => 损溢单信息抽取
* ds_out_order => 其他出入库单信息抽取
* ds_day_invoicing => 日结进销存信息抽取
