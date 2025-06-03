# zpro-ctrl

z2pro 相机录制控制[electron-app]

### 1、相机sdk: 在c++ 中调用并实现抛出接口，由node-gyp编译为 node第三方插件。
  node-zprocam-api为相机sdk插件文件目录, 在该路径下安装及编译shell 为：
    npm install;
    node-gyp rebuild;
### 2、页面UI： 由vue3全家桶，通过electron调用第一步抛出的接口来调用。
  （1）myEleSrc文件目录是前端页面和事件实现相关代码，在该路径下安装及运行shell 为：
    npm install;
    npm run dev;
  （2）打包windows版本shell为(输出文件包在dist目录下)：
    npm install;
    npm run build:win;
### 3、关于加密使用了bytenode 将相关js文件 编码为node二进制文件，调用逻辑都在node二进制文件中，提升破译难度。
    加密相关文件为：myEleSrc -> zproConfig.js, 主要完成调用相机接口、下载视频子进程代码文件的加密。

### 4、建模功能：需要在后端已有建模环境代码中运行DataPipeline -> serves ->  main.py， 这是一个后端的websocket 服务。 
  已完成：选择数据源、选择建模开始及截至时间、进行标定、输入分割目标物进行分割、静态建模。
  未完成部分：建模标定前端渲染、动态建模、导出建模结果。

  



