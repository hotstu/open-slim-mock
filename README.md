# open-slim-mock(under constructing...)



## 基于nodejs的用于开发调试的服务端程序

开发人员在调试app的时候可以启动本地环境的服务器，而不用后端人员协助，便于前后端分离

## 特色

  1. ### 架构
  基于nodejs 标准库的http模块，没有采用其他笨重的web框架，更底层，更灵活
  路由模仿Django，采用正则表达式分发请求到各个router再分发到各个Processor进行处理
  使用者可以在router中注册自己需要的processor，对各个不同的请求进行处理
  
  2. ### 扩展性
  Processor是一个lamda表达式，使用者可以使用现有的Processor或者自己实现Processor，无限扩展
  现有的Processor：
  *  fileProcessor.js 拷贝文件类容作为文本输出
  *  jsonProcessor.js 将json自动转换为string再输出
  *  latencyProcessor.js 模拟网络延时
  *  proxyProcessor.js 反向代理远程服务器
  *  staticDirectoryProcessor.js 处理静态文件目录
  *  staticFileProcessor.js 处理单个静态文件
  * stringProcessor.js 直接输出字符串
  
  3. ### 反向代理
   

## 应用

 启动本地测试环境
- `npm run test` 或者 `yarn test`





 TODO
 
 - [x] better router loader 
 - [x] load config from json
 - [ ] a manage panel user interface
 - [ ] websocket based control of server from manage panel
 - [ ] support api snapshot and save to local
