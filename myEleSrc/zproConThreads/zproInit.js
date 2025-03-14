const { parentPort } = require('worker_threads');

let zporCtrlObj = null;
let z2pro = null;


const sleep = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

// 监听主线程发送的消息
parentPort.on('message', async (message) => {
    try {
        //  初始化
        if (message.msgInfo === 'init_z2pro') {
            if (z2pro === null) {
                z2pro = require(message.params.path);
            }
            if (zporCtrlObj === null) {
                zporCtrlObj = new z2pro.ZproCtrl();
            }
            let res = await zporCtrlObj.initMyCamera(message.params.val, 24);
            if (res == 1) {
                let camList = zporCtrlObj.getCamList();
                zporCtrlObj.setSyncCam();
                // let obj1 = zporCtrlObj.getCaptParamsInfo();
                // console.log(obj1)
                parentPort.postMessage({ msgBackInfo: 'init_z2pro',  msg: '操作成功', msgType: 'success', data: camList });
            } else {
                parentPort.postMessage({ msgBackInfo: 'init_z2pro', msg: res, msgType: 'error' });
            }
        }
        // 发现设备
        if (message.msgInfo === 'refind_z2pro') {
            let res = await zporCtrlObj.initMyCamera(message.params.val, 24);
            if (res == 1) {
                let camList = zporCtrlObj.getCamList();
                zporCtrlObj.setSyncCam();
                // let obj1 = zporCtrlObj.getCaptParamsInfo();
                // console.log(obj1)

                parentPort.postMessage({ msgBackInfo: 'refind_z2pro',  msg: '操作成功', msgType: 'success', data: camList });
            } else {
                parentPort.postMessage({ msgBackInfo: 'refind_z2pro', msg: res, msgType: 'error' });
            }
        }
        //  相机重启
        if (message.msgInfo === 'z2pro_reboot') {
            let res = await zporCtrlObj.rebootCam();
            if (res == 0) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_reboot', msg: '操作成功', msgType: 'success' });
            }  else {
                parentPort.postMessage({ msgBackInfo: 'z2pro_reboot', msg: res, msgType: 'error' });
            }
        }
        // 拍照测试
        if (message.msgInfo === 'z2pro_snap_photo') {
            let res = await zporCtrlObj.startCamSnap();
            if (res == 0) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_snap_photo', msg: '操作成功', msgType: 'success' });
            }  else {
                parentPort.postMessage({ msgBackInfo: 'z2pro_snap_photo', msg: res, msgType: 'error' });
            }
        }
        // 格式化TF卡
        if (message.msgInfo === 'z2pro_format_tf') {
            let res = await zporCtrlObj.setCamFormatTf();
            await sleep(5000);
            if (res == 0) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_format_tf', msg: '操作成功', msgType: 'success' });
            }  else {
                parentPort.postMessage({ msgBackInfo: 'z2pro_format_tf', msg: res, msgType: 'error' });
            }
        }
        // 开始拍摄
        if (message.msgInfo === 'z2pro_strat_shoot') {
            let res = await zporCtrlObj.startCamshoot();
            if (res == 0) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_strat_shoot', msg: '操作成功', msgType: 'success' });
            }  else {
                parentPort.postMessage({ msgBackInfo: 'z2pro_strat_shoot', msg: res, msgType: 'error' });
            }
        }
        // 停止拍摄
        if (message.msgInfo === 'z2pro_end_shoot') {
            let res = await zporCtrlObj.endCamshoot();
            if (res && res.times) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_stop_shoot', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_stop_shoot', msg: 'error'})
            }
        }
        // 获取同步状态
        if (message.msgInfo === 'z2pro_syncst_get') {
            let res = await zporCtrlObj.getSyncStatusCam();
            if (res === 1) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_syncst_get', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_syncst_get', msg: 'error'})
            }
        }
        // 获取tf 卡同步信息
        if (message.msgInfo === 'z2pro_tf_case') {
            let res = await zporCtrlObj.getTfCaseInfo();
            if (res) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_tf_case', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_tf_case', msg: 'error'})
            }
        }
        // 设置相机分辨率
        if (message.msgInfo === 'z2pro_set_resoluton') {
            let res = await zporCtrlObj.setCamResolutionRate(message.params.resoluton);
            await sleep(15000);
            if (res === 1) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_set_resoluton', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_set_resoluton', msg: 'error'})
            }
        }
        // 设置相机分辨率
        if (message.msgInfo === 'z2pro_set_fps') {
            let res = await zporCtrlObj.setCamFrameRate(message.params.resoluton);
            await sleep(15000);
            if (res === 1) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_set_fps', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_set_fps', msg: 'error'})
            }
        }
        // 设置相机码率
        if (message.msgInfo === 'z2pro_set_bitrate') {
            let res = await zporCtrlObj.setCamsBit(message.params.resoluton);
            await sleep(15000);
            if (res === 1) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_set_bitrate', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_set_bitrate', msg: 'error'})
            }
        }
        // 设置编码方式
        if (message.msgInfo === 'z2pro_set_enc') {
            let res = await zporCtrlObj.setCamsEnc(message.params.resoluton);
            await sleep(15000);
            if (res === 1) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_set_enc', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_set_enc', msg: 'error'})
            }
        }
        // 设置曝光模式
        if (message.msgInfo === 'z2pro_set_aemode') {
            let res = await zporCtrlObj.setCamsAeMode(message.params.resoluton);
            if (res === 1) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_set_aemode', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_set_aemode', msg: 'error'})
            }
        }
        // 设置快门速度
        if (message.msgInfo === 'z2pro_set_shutter') {
            let res = await zporCtrlObj.setCamsShutter(message.params.resoluton);
            if (res === 1) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_set_shutter', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_set_shutter', msg: 'error'})
            }
        }
        // 设置ISO
        if (message.msgInfo === 'z2pro_set_iso') {
            let res = await zporCtrlObj.setCamsISO(message.params.resoluton);
            if (res === 1) {
                parentPort.postMessage({ msgBackInfo: 'z2pro_set_iso', msg: '操作成功', msgType: 'success', data: res });
            }  else {
                parentPort.postMessage({msgBackInfo: 'z2pro_set_iso', msg: 'error'})
            }
        }
    } catch (error) {
        parentPort.postMessage({ msg: `Error: ${error.message}`, msgType: 'error' });
    }
});
