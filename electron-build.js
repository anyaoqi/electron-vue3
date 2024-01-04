const $config = require('./config/config.json')

/**
 * electron-builder打包配置
 * https://www.electron.build/configuration/configuration
 */
const config = {
  "$schema": "https://raw.githubusercontent.com/electron-userland/electron-builder/master/packages/app-builder-lib/scheme.json",
  "appId": "com.dataextractor.app",
  "productName": $config.title,
  "copyright":"海晟融创", //版权  信息
  "asar": true, // 是否把app文件夹压缩成app.asar
  "asarUnpack": [ // 解压到应用程序包的根目录下的文件，对外部可见
    // "**/file-to-unpack.ext"
  ],
  "directories": {
    "output": "release/${version}"
  },
  "publish": [
    {
      "provider": "generic",
      "url": "",
      "channel": "latest"
    }
  ],
  "files": [
    "dist-electron",
    "dist"
  ],
  "extraResources": [
    {
      // 拷贝静态文件到指定位置,否则打包之后出现找不到资源的问题.将整个resources目录拷贝到 发布的根目录下
      "from": "public",
      "to": "./assets"
    }
  ],
  "win": {
    "icon": "public/logo.png", // 设置 Windows 平台的图标路径
    "target": [
      {
        "target": "nsis",
        "arch": [
          "x64",
          // "ia32"
        ]
      }
    ],
    "artifactName": "${productName}_${version}.${ext}",
    // "requestedExecutionLevel": "requireAdministrator"
  },
  "nsis": {
    "oneClick": false,  // 是否一键安装
    "perMachine": true, 
    "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
    "allowToChangeInstallationDirectory": true, // 允许修改安装目录
    "deleteAppDataOnUninstall": false,
    "differentialPackage": false,
    "installerLanguages": [
      "zh_CN"
    ],
    "createDesktopShortcut": true, // 创建桌面图标
    "createStartMenuShortcut": true,// 创建开始菜单图标
    "shortcutName": "第三方零消数据抽取系统", // 图标名称
    "include": 'installer.nsh', // 包含的自定义nsis脚本
    "installerIcon": 'public/icon.ico', // 安装图标
    "uninstallerIcon": 'public/icon.ico', //卸载图标
    "installerHeaderIcon": 'public/icon.ico', // 安装时头部图标
  },
  // Linux 特定配置
  linux: {
    target: 'AppImage', // 打包目标，这里使用 AppImage，也可选其他目标
    category: "Utility", // 在应用菜单中显示的类别
    maintainer: "Hs",
    vendor: "Hs",
    executableName: "myapp", // 生成的可执行文件的名称
    desktop: { // 桌面文件相关配置
      name: "第三方零消数据抽取系统",
      comment: "第三方零消数据抽取系统 App",
      exec: "linux-${productName}-${version}-${arch}.${ext}", // 可执行文件的名称
      terminal: false, // 是否在终端中运行
      type: "Application", // 应用类型
      icon: "public/logo.png", // 你的图标路径
    },
    mimeTypes: [ // 关联的 MIME 类型
      "text/plain",
      "application/vnd.myapp.custom",
    ],
    artifactName: "linux-${productName}-${version}-${arch}.${ext}", // 生成的安装包文件名格式
  },
};

module.exports = config
