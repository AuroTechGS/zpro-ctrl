const bytenode = require('bytenode');
const fs = require('fs');

// 需要加密的文件
const files = ['./zproConThreads/zproInit.js', './zproConThreads/zproDown.js', './zproConThreads/segImages.js'];
const outputFiles = ['./zproConThreadsCtrl/index.jsc', './zproConThreadsDown/index.jsc', './zproSegMaskThreads/index.jsc']
files.forEach((file, index) => {
    bytenode.compileFile({
        filename: file,
        output: outputFiles[index]
    });
    let jsCodePath = '';
    let dirName = '';
    if (index === 0) {
        jsCodePath = 'zproInit.js'
        dirName = 'zproConThreadsCtrl'
    }
    if (index === 1) {
        jsCodePath = 'zproDown.js'
        dirName = 'zproConThreadsDown'
    }
    if (index === 2) {
        jsCodePath = 'segImages.js'
        dirName = 'zproSegMaskThreads'
    }
    let writeContext = `"use strict";\nrequire('bytenode');\nrequire('./index.jsc');`
    fs.writeFileSync(`./${dirName}/index.js`, writeContext, 'utf8');
});

console.log('code successful end!!!!');
process.exit(0);


