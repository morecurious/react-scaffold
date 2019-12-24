## react-scaffold
>  基于react + react-router +dva + es6 + less + antd的脚手架

##TODO
creat-react-app或者umi
代码分割

### 项目介绍
本项目是利用webpack搭建的搭建一个基于react + react-router +dva + es6 + less + antd用于中后台开发的脚手架,


### 功能实现
- [x] Es6/7
- [x] react/react-router/dva
- [x] less
- [x] dev-server
- [x] 模块热替换（HMR）
- [x] sourcemap
- [x] CSS代码分割
- [x] 代码分割(SplitChunksPlugin)
- [x] 浏览器缓存
- [x] tree shaking
- [x] DllPlugin
- [x] PWA
- [x] eslint
- [x] stylelint

Tree Shaking
Tree Shaking可以剔除掉一个文件中未被引用掉部分，并且只支持ES Modules模块的引入方式，不支持CommonJS的引入方式。原因：ES Modules是静态引入的方式，CommonJS是动态的引入方式，Tree Shaking只支持静态引入方式。
 如果在项目中使用类似 css-loader 并 import 一个 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除


### 快速开始
```javascript
npm install  // 依赖包安装
npm run dll   // dllplugin进行打包
npm run start // 开发模式启动项目
npm run build // 生产环境项目打包
npm run dev-build // 开发环境打包
```

### 其他配置
