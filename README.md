# open-slim-mock



## 基于nodejs的用于开发调试的服务端程序

开发人员在调试app的时候可以启动本地环境的服务器，而不用后端人员协助，便于前后端分离，快速定位接口问题

## 背景

在公司app开发项目中，为了和不同水平的后端开发人员分工合作，我在业余时间用nodejs编写了一个http服务，用于将测试数据运行在本地的web服务中用于app测试，设计思想是小而精，使用txt文档作为数据源，可以随时添加新接口，经过一年的使用，证实提高了我们的开发效率。现在代码经过完全重构，代码更清晰，功能更强大，现在开业开源出来，同时也展示怎么实现一个自己的web框架。

## 特色

  1. ### 架构
  基于nodejs 标准库的http模块，没有采用其他笨重的web框架，更底层，更灵活。路由模仿Django，采用正则表达式分发请求到各个router再分发到各个Processor进行处理。使用者可以在router中注册自己需要的processor，对各个不同的请求进行处理，例如你要显示一个json，可以直接使用jsonProcessor，将josn的内容作为参数传入，也可以使用fileProcessor，将写有json字符串的文本地址，作为参数传入。
  
  2. ### 扩展性
  Processor是一个lamda表达式，使用者可以使用现有的Processor或者自己实现Processor，无限扩展
  现有的Processor：
  *  fileProcessor.js 拷贝文件类容作为文本输出
  *  jsonProcessor.js 将json自动转换为string再输出
  *  latencyProcessor.js 模拟网络延时
  *  proxyProcessor.js 反向代理远程服务器
  *  staticDirectoryProcessor.js 处理静态文件目录
  *  staticFileProcessor.js 处理单个静态文件
  *  stringProcessor.js 直接输出字符串
  
  上面的设计将每一个连接的处理交给一个特定的processor，实现了最小的颗粒话，便于我们灵活配置
  
  3. ### 反向代理
   使用nodejs的stream实现，相当于一个MITM代理，可以将来往的数据dump到console输出，快速定位问题，不用再代码中console输出

## 应用

1. clone 项目
2. 仿照SampleApp创建自己的路由，通常一个接口一个路由
3. 编辑serverconfig.json，注册自己的路由
4. 启动本地测试环境
- `npm run test` 或者 `yarn test`



# more
|Github|简书| 掘金|JCenter | dockerHub|
| -------------| ------------- |------------- |------------- |------------- |
| [Github](https://github.com/hotstu)| [简书](https://www.jianshu.com/u/ca2207af2001) | [掘金](https://juejin.im/user/5bee320651882516be2ebbfe) |[JCenter ](https://bintray.com/hglf/maven)      | [dockerHub](https://hub.docker.com/u/hglf)|



 TODO
 
 - [x] better router loader 
 - [x] load config from json
 - [ ] a manage panel user interface
 - [ ] websocket based control of server from manage panel
 - [ ] support api snapshot and save to local
 - [ ] database datasource support
 - [ ] handle memory leak when processor promise is not resolve & reject

