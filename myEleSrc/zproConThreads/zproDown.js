const { parentPort } = require('worker_threads');
const async = require('async');
const ftp = require('basic-ftp');
const fs = require('fs');

const path = require("path")

let downNum = 0;
let processTimer = null;

async function downloadFile(downInfo, fileName) {
    const client = new ftp.Client();
    try {
        await client.access({
            host: downInfo.host,
            user: downInfo.user,
            password: downInfo.pwd,
        });
        await client.cd('/mp4');
        await client.downloadTo(`${downInfo.outUrl}/${downInfo.host}.mp4`, fileName);
        console.log(`Downloaded complete: ${downInfo.outUrl}/${downInfo.host}.mp4`);
    } catch (err) {
        console.error('FTP download error:', err);
    } finally {
        client.close();
    }
}


// 监听主线程发送的消息
parentPort.on('message', async (message) => {
    try {
        if (message.msgInfo === 'down-mp4') {
            if (message.params.ipValList.length) {
                let dirPath = message.params.downPath;
                let videoPath = path.join(dirPath, 'original');
                if (!fs.existsSync(videoPath)) {
                    fs.mkdirSync(videoPath, { recursive: true });
                    let obj = {
                        times: message.params.pathInfo.formatTime,
                        orginFileName: message.params.pathInfo.fileName,
                        downDownFull: false
                    }
                    // 将对象转为 JSON 字符串并写入文件
                    fs.writeFileSync(`${dirPath}/view_config.json`, JSON.stringify(obj, null, 2), 'utf8');
                    console.log('created files  success');
                    parentPort.postMessage({ msgBackInfo: 'down-mp4', msgType: 'success', msg: 'mkdir', data: dirPath });
                }

                message.params.ipValList.forEach(item => {
                    item.outUrl = videoPath
                })
                let arrTwo = [...message.params.ipValList]
                downNum = 0;
                async.parallelLimit(arrTwo.map((task) => {
                    return async () => {
                        await downloadFile(task, message.params.pathInfo.fileName);
                        downNum++;
                    };
                }), 2, (err, results) => {
                    if (err) {
                        console.error('Download error:', err);
                    } else {
                        console.log('All downloads complete.');
                    }
                })
                if (processTimer !== null) {
                    clearInterval(processTimer);
                }
                processTimer = setInterval(() => {
                    parentPort.postMessage({ msgBackInfo: 'down-mp4', msgType: 'success', msg: 'process', data: { downNum: downNum, downPath: dirPath } });
                    if (downNum === arrTwo.length) {
                        clearInterval(processTimer);
                    }
                }, 500)
            }
        }
        if (message.msgInfo === 're-down-mp4') {
            if (message.params.ipValList.length) {
                let downPath = message.params.pathInfo.filePath;
                let videoPath = path.join(downPath, 'original');
                message.params.ipValList.forEach(item => {
                    item.outUrl = videoPath
                })
                let arrTwo = [...message.params.ipValList]
                downNum = 0;
                async.parallelLimit(arrTwo.map((task) => {
                    return async () => {
                        await downloadFile(task, message.params.pathInfo.orginFileName);
                        downNum++;
                    };
                }), 2, (err, results) => {
                    if (err) {
                        console.error('Download error:', err);
                    } else {
                        console.log('All downloads complete.');
                    }
                })
                if (processTimer !== null) {
                    clearInterval(processTimer);
                }
                processTimer = setInterval(() => {
                    parentPort.postMessage({ msgBackInfo: 'down-mp4', msgType: 'success', msg: 'process', data: { downNum: downNum, downPath: downPath } });
                    if (downNum === arrTwo.length) {
                        clearInterval(processTimer);
                    }
                }, 500)
            }
        }
    } catch (error) {
        parentPort.postMessage({ msg: `Error: ${error.message}`, msgType: 'error' });
    }
});