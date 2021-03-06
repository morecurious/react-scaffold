const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const plugins = [
  new WebpackBar(), // webpack打包进度条
  new FriendlyErrorsWebpackPlugin(), // 能够更好在终端看到webapck运行的警告和错误
  new HtmlWebpackPlugin({ template: 'src/index.html' }), // 向dist文件中自动添加模版html
  new CleanWebpackPlugin({
    root: path.resolve(__dirname, '../dist'),
    verbose: true, // 将log写到 console.
    dry: false // 不要删除任何东西，主要用于测试.
  }), // 打包后先清除dist文件，先于HtmlWebpackPlugin运行// 打包后先清除dist文件，先于HtmlWebpackPlugin运行
  // happypack
  new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      //如何处理  用法和loader 的配置一样
      loaders: [{
          loader: 'babel-loader?cacheDirectory=true',
      }],
      //共享进程池threadPool: HappyThreadPool 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
  }),
]

const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
files.forEach(file => {
  if (/.*\.dll.js/.test(file)) {
    plugins.push(
      new AddAssetHtmlWebpackPlugin({
        // 将dll.js文件自动引入html
        filepath: path.resolve(__dirname, '../dll', file)
      })
    )
  }
  if (/.*\.manifest.json/.test(file)) {
    plugins.push(
      new webpack.DllReferencePlugin({
        // 当打包第三方库时，会去manifest.json文件中寻找映射关系，如果找到了那么就直接从全局变量(即打包文件)中拿过来用就行，不用再进行第三方库的分析，以此优化打包速度
        manifest: path.resolve(__dirname, '../dll', file)
      })
    )
  }
})

const commonConfig = {
  resolve: {
    extensions: ['.js', '.jsx'], // 当通过import child from './child/child'形式引入文件时，会先去寻找.js为后缀当文件，再去寻找.jsx为后缀的文件
    mainFiles: ['index', 'view'] // 如果是直接引用一个文件夹，那么回去直接找index开头的文件，如果不存在再去找view开头的文件
    // alias: {
    //     home: path.resolve(__dirname, '../src/home') // 配置别名可以加快webpack查找模块的速度, 引入home其实是引入../src/home
    // }
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 注意这里要写正确，不然useBuiltIns不起作用
        exclude: /node_modules/, // 排除node_modules中的代码
        use: [
          {
            loader: "happypack/loader?id=happyBabel" // 只是babel和webpack之间的桥梁，并不会将代码转译
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]', // placeholder 占位符
            outputPath: 'images/', // 打包文件名
            limit: 204800 // 小于200kb则打包到js文件里，大于则使用file-loader的打包方式打包到imgages里
          }
        }
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:5].min.[ext]', // 和上面同理
            outputPath: 'fonts/',
            limit: 5000
          }
        }
      }
    ]
  }, // 让 webpack 能够去处理那些非 JavaScript 文件

  plugins, // 插件
  performance: {
    hints: false //展示性能提示  默认设置为 "warning"
  },
  output: {
    publicPath: '/',
    filename: 'bundle.js', // 打包后文件名称
    path: path.resolve(__dirname, '../dist') // 打包后文件夹存放路径
  }
}

module.exports = commonConfig
