import 'v8-compile-cache';
import { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, shell, dialog } from 'electron';
import path, { join } from 'path';
import fs, { promises as prmFs } from 'fs';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../icon.png?asset';
const { Worker } = require('worker_threads');
const { spawn } = require('child_process');
let ffmpegPath = '';
const ftp = require('basic-ftp');
const cv = require("opencv.js");
const { createCanvas } = require("canvas");
import moment from 'moment';
// process.env.LD_LIBRARY_PATH = `${process.resourcesPath}/lib:${process.env.LD_LIBRARY_PATH}`;
// console.log("LD_LIBRARY_PATH set to:", process.env.LD_LIBRARY_PATH);

const sleep = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}


if (process.env.NODE_ENV === 'development') {
  ffmpegPath = require(path.resolve(__dirname, '../../depences/ffmpeg-static/index.js'))
} else {
  ffmpegPath = require(path.resolve(__dirname, '../../../depences/ffmpeg-static/index.js'))
}

let OBcPluseModel = null;
let thread_list = []

let mainWindow;
let appShow = true;

let waitDownMp4List = [];
let segImgWorker = null;

class AzCustomWindowMove {
  constructor() {
    this.isOpen = false;  // 是否开启拖拽
    this.win = null;  // 窗口对象
    this.winStartPosition = { x: 0, y: 0, width: 0, height: 0 };  // 窗口初始位置
    this.startPosition = { x: 0, y: 0 };  // 鼠标初始位置
    this.lastPosition = { x: 0, y: 0 };  // 上一帧的位置
  }

  init(win) {
    this.win = win;
  }

  start() {
    this.isOpen = true;
    // 获取当前窗口的偏移
    const [winX, winY] = this.win.getPosition();
    const [winWidth, winHeight] = this.win.getSize();
    this.winStartPosition.x = winX;
    this.winStartPosition.y = winY;
    this.winStartPosition.width = winWidth;
    this.winStartPosition.height = winHeight;

    // 获取当前鼠标位置
    const mouseStartPosition = screen.getCursorScreenPoint();
    this.startPosition.x = mouseStartPosition.x;
    this.startPosition.y = mouseStartPosition.y;
    this.move();
  }

  move() {
    if (!this.isOpen || !this.win || this.win.isDestroyed()) {
      return;
    }
    const cursorPosition = screen.getCursorScreenPoint();
    const dx = cursorPosition.x - this.startPosition.x;  // 鼠标在 X 轴的偏移
    const dy = cursorPosition.y - this.startPosition.y;  // 鼠标在 Y 轴的偏移

    const newX = this.winStartPosition.x + dx;
    const newY = this.winStartPosition.y + dy;

    this.win.setBounds({
      x: newX,
      y: newY,
      width: this.winStartPosition.width,
      height: this.winStartPosition.height,
    });

    this.lastPosition.x = cursorPosition.x;
    this.lastPosition.y = cursorPosition.y;
    if (this.isOpen) {
      setImmediate(() => this.move());
    }
  }

  end() {
    this.isOpen = false;
  }
}

let customWindowMove = new AzCustomWindowMove();
// 每隔1秒检查主进程是否有更新


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 1200,  // 设置最小宽度为 400
    minHeight: 760, // 设置最小高度为 300
    show: false,
    frame: false,       // 去掉默认的边框和标题栏
    backgroundColor: '#00000000',
    opacity: 1,  // 初始不透明度
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false, // 确保上下文隔离
      enableRemoteModule: false, // 确保安全性
      nodeIntegration: true, // 如果需要使用 Node.js 功能，可以开启 nodeIntegration
      devTools: process.env.NODE_ENV === 'development' ? true : false,  // 调试模式是否开启
      // devTools: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: false,  // 禁用 Web 安全检查
    }
  })
  // mainWindow.webContents.openDevTools();
  mainWindow.on('ready-to-show', () => {
    app.setAppUserModelId('com.yourcompany.yourapp');
    mainWindow.show();
  })

  // 底部菜单栏关闭触发事件  需关闭后台所有线程
  mainWindow.on('closed', () => {
    stopHLSStreams();
  })

  mainWindow.on('minimize', () => {
    appShow = false;
  });
  mainWindow.on('restore', () => {
    appShow = true;
  });
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  customWindowMove.init(mainWindow);  // 传入你的窗口对象
}


let worker = null
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})



ipcMain.handle('ObInitMain', async (_e) => {
  let nodePath = process.env.NODE_ENV === 'development' ? '../../../node-addon-api/build/Release/addon.node' : '';
  OBcPluseModel = require(nodePath)
  try {
    let data = OBcPluseModel.loadConfigFile('D:/myProgram/newElectron-Cam/node-addon-api/src/config/OBsync.json')
    setTimeout(() => {
      customWindowMove.end();
    }, 50);
    if (data.status == -1) {
      return { msg: '读取或解析 JSON 时出错', msgType: 'error' };
    }
    if (data.status == -2) {
      return { msg: '相机配置出错，请检查相机链接', msgType: 'error' };
    }
    if (data.status == 1) {
      return { msg: data.data, msgType: 'success' };
    }
  } catch (error) {
    console.error('Failed to load @electron/fix-path:', error);
  }
});

ipcMain.handle('setAlignModel', async (_e, value) => {
  // let result = await myDll.func('void setOBAlignModel(int alignModel)');
  // try {
  //   result(value);
  //   return { msg: '设置成功', msgType: 'success' };
  // } catch (error) {
  //   return { msg: '设置失败', msgType: 'error' };
  // }
});


ipcMain.handle('eleApiOpenAllCam', async (_e) => {
  if (OBcPluseModel) {
    try {
      let data = await OBcPluseModel.openAllDeviceApi()
      setTimeout(() => {
        customWindowMove.end();
      }, 50);
      if (data.status != 1) {
        return { msg: '所有相机连接失败, 请检查相机是否正确连接', msgType: 'error' };
      } else {
        return { msg: data.data, msgType: 'success' };
      }
    } catch (error) {
      return { msg: '所有相机连接失败, 请检查相机是否正确连接', msgType: 'error' };
    }
  } else {
    return { msg: '模块加载错误', msgType: 'error' };
  }
});


ipcMain.handle('eleApiOpenSingleCam', async (_e, val) => {
  if (OBcPluseModel) {
    try {
      let isSuccess = await OBcPluseModel.openDeviceApi(val)
      setTimeout(() => {
        customWindowMove.end();
      }, 50);
      if (isSuccess) {
        return { msg: '连接成功', msgType: 'success' };
      } else {
        return { msg: '相机连接失败, 请检查相机是否正确连接', msgType: 'error' };
      }

    } catch (error) {
      return { msg: '相机连接失败, 请检查相机是否正确连接', msgType: 'error' };
    }
  } else {
    return { msg: '模块加载错误', msgType: 'error' };
  }
});


ipcMain.handle('eleApiStartCap', async (_e) => {
  if (OBcPluseModel) {
    try {
      let data = await OBcPluseModel.startCaptureApi()
      setTimeout(() => {
        customWindowMove.end();
      }, 50);
      if (data.status != 1) {
        return { msg: '相机连接错误, 请检查相机是否正确连接', msgType: 'error' };
      } else {
        return { msg: data.data, msgType: 'success' };
      }
    } catch (error) {
      return { msg: '相机连接错误, 请检查相机是否正确连接', msgType: 'error' };
    }
  } else {
    return { msg: '模块加载错误', msgType: 'error' };
  }
});

ipcMain.handle('eleApiCloseOBSingleCam', async (_e, val) => {
  if (OBcPluseModel) {
    try {
      let isSuccess = await OBcPluseModel.closeSingleDeviceApi(val)
      setTimeout(() => {
        customWindowMove.end();
      }, 50);
      if (isSuccess) {
        return { msg: '操作成功', msgType: 'success' };
      } else {
        return { msg: '相机关闭失败, 请检查相机是否正确连接', msgType: 'error' };
      }

    } catch (error) {
      return { msg: '相机关闭失败, 请检查相机是否正确连接', msgType: 'error' };
    }
  } else {
    return { msg: '模块加载错误', msgType: 'error' };
  }
})


ipcMain.handle('eleApiCloseOBAllCam', async (_e) => {
  if (OBcPluseModel) {
    try {
      let isSuccess = await OBcPluseModel.closeAllDeviceApi()
      if (isSuccess) {
        return { msg: '操作成功', msgType: 'success' };
      } else {
        return { msg: '相机关闭失败, 请检查相机是否正确连接', msgType: 'error' };
      }
    } catch (error) {
      return { msg: '相机关闭失败, 请检查相机是否正确连接', msgType: 'error' };
    }
  } else {
    return { msg: '模块加载错误', msgType: 'error' };
  }
})




ipcMain.handle('startCaptureApi', (_e, camNum) => {
  // let bufferSize = 500000;
  // let arr = []
  // for (let i = 0; i < camNum; i++) {
  //   let buf = Buffer.alloc(bufferSize)
  //   arr.push(buf);
  // }
  // let frameDataPointer = myDll.func('const char *getData(unsigned char **buffer, int bufferNum)');
  // let frameData = frameDataPointer(arr);
  // if (frameData && frameData.length > 1) {
  //   let cursize = frameData.slice(0, -1);
  //   let sizeList = cursize.split(',');
  //   if (sizeList.length === camNum) {
  //     arr.forEach((item, index) => {
  //       item = item.subarray(0, Number(sizeList[index]));
  //     });
  //   }
  // }
  // return { msg: '获取成功', msgType: 'success', data: { camName: 'cam1', arrarBuffer: arr } };
});

ipcMain.handle('stopCaptureApi', async (_e) => {
  if (OBcPluseModel) {
    try {
      let isSuccess = await OBcPluseModel.stopCaptureApi()
      if (isSuccess) {
        return { msg: '操作成功', msgType: 'success' };
      } else {
        return { msg: '操作失败, 请检查相机是否正确连接', msgType: 'error' };
      }
    } catch (error) {
      return { msg: '操作失败, 请检查相机是否正确连接', msgType: 'error' };
    }
  } else {
    return { msg: '模块加载错误', msgType: 'error' };
  }
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


// 通信监听
ipcMain.handle("Main_Window_Operate", (event, type) => {
  if (type === 'mouse_d') {
    customWindowMove.start()
  }
  if (type === 'mouse_u') {
    customWindowMove.end()
  }
  return 1
})



/** 接收渲染进程 操作窗口 的通知  关闭、最大化、最小化、最大化还原
 * @param {Object} event
 * @param {String} operationType 操作类型
 */
ipcMain.on('operationWindow', (event, operationType) => {
  if (!mainWindow) return;
  appShow = true;
  switch (operationType) {
    case 'max'://窗口 最大化
      mainWindow.maximize();
      break;
    case 'restoreDown'://窗口 向下还原
      mainWindow.unmaximize();
      break;
    case 'min'://窗口 最小化
      appShow = false
      mainWindow.minimize();
      break;
    case 'close'://窗口 关闭
      stopHLSStreams();
      mainWindow.close();
  }
});

let camIpList = []
let downWorker = null


let nodeZ2PROPath = ''
if (process.env.NODE_ENV === 'development') {
  nodeZ2PROPath = path.resolve(__dirname, '../../../node-zprocam-api/build/Release/addonZpro.node');
} else {
  nodeZ2PROPath = path.resolve(__dirname, '../../../w64_ctrl_node/addonZpro.node');
}


let z2proConfigPath = ''
if (process.env.NODE_ENV === 'development') {
  z2proConfigPath = path.resolve(__dirname, '../../../node-zprocam-api/build/Release/z2proConfig.json');
} else {
  z2proConfigPath = path.resolve(__dirname, "../../../w64_ctrl_node/z2proConfig.json");
}


let moviesDownPath = ''
if (process.env.NODE_ENV === 'development') {
  moviesDownPath = path.resolve(__dirname, '../../zproConThreads/zproDown.js');
} else {
  moviesDownPath = path.resolve(__dirname, '../../zproConThreadsCtrl/index.js');
}

let camCtrlPath = ''
if (process.env.NODE_ENV === 'development') {
  camCtrlPath = path.resolve(__dirname, '../../zproConThreads/zproInit.js');
} else {
  camCtrlPath = path.resolve(__dirname, '../../zproConThreadsCtrl/index.js');
}

let segImgsPath = ''
if (process.env.NODE_ENV === 'development') {
  segImgsPath = path.resolve(__dirname, '../../zproConThreads/segImages.js');
} else {
  segImgsPath = path.resolve(__dirname, '../../zproSegMaskThreads/index.js');
}



//  创建z2pro 控制子线程 
function createdThreads() {
  worker = new Worker(camCtrlPath);
  worker.on('message', (message) => {
    // 初始化及搜索
    if (message.msgBackInfo === 'init_z2pro') {
      mainWindow.webContents.send('worker-message', message);
    }
    //设备重启
    if (message.msgBackInfo === 'z2pro_reboot') {
      mainWindow.webContents.send('worker-reboot', message);
    }
    // 重新搜索设备
    if (message.msgBackInfo === 'refind_z2pro') {
      mainWindow.webContents.send('worker-refind', message);
    }
    // 测试拍照
    if (message.msgBackInfo === 'z2pro_snap_photo') {
      if (camIpList.length) {
        let downPath = ''
        let curTime = moment().format('YYYY-MM-DD_HH-mm-ss')
        if (process.env.NODE_ENV === 'development') {
          downPath = path.resolve(__dirname, `../../testPhoto/${curTime}`)
        } else {
          downPath = path.resolve(__dirname, `../testPhoto/${curTime}`)
        }
        if (!fs.existsSync(downPath)) {
          fs.mkdirSync(downPath, { recursive: true });
        }
        downPhotoNum = 0;
        camIpList.forEach(item => {
          downloadPhoto(item, downPath);
        })
      }
    }
    // 格式化tf
    if (message.msgBackInfo === 'z2pro_format_tf') {
      mainWindow.webContents.send('worker-format', message);
    }
    // 开始拍摄
    if (message.msgBackInfo === 'z2pro_strat_shoot') {
      mainWindow.webContents.send('worker-startShoot', message);
    }
    // 结束拍摄 
    if (message.msgBackInfo === 'z2pro_stop_shoot') {
      mainWindow.webContents.send('worker-endShoot', message);
    }
    // 同步状态结果
    if (message.msgBackInfo === 'z2pro_syncst_get') {
      mainWindow.webContents.send('worker-sync-status', message);
    }
    // 获取tf卡信息
    if (message.msgBackInfo === 'z2pro_tf_case') {
      mainWindow.webContents.send('worker-tf-info', message);
    }
    // 分辨率
    if (message.msgBackInfo === 'z2pro_set_resoluton') {
      mainWindow.webContents.send('worker-resoluton', message);
    }
    // 帧率
    if (message.msgBackInfo === 'z2pro_set_fps') {
      mainWindow.webContents.send('worker-fps', message);
    }
    // 码率
    if (message.msgBackInfo === 'z2pro_set_bitrate') {
      mainWindow.webContents.send('worker-bitrate', message);
    }
    // 快门速度
    if (message.msgBackInfo === 'z2pro_set_shutter') {
      mainWindow.webContents.send('worker-shutter', message);
    }
    // iso
    if (message.msgBackInfo === 'z2pro_set_iso') {
      mainWindow.webContents.send('worker-iso', message);
    }
    // enc
    if (message.msgBackInfo === 'z2pro_set_enc') {
      mainWindow.webContents.send('worker-enc', message);
    }
    // ae
    if (message.msgBackInfo === 'z2pro_set_aemode') {
      mainWindow.webContents.send('worker-aemode', message);
    }
  });
}


//  创建z2pro 下载子线程 
function createdDownThreads() {
  downWorker = new Worker(moviesDownPath);
  downWorker.on('message', (message) => {
    if (message.msgBackInfo === 'down-mp4') {
      if (message.msgType === 'success') {
        if (message.msg === 'mkdir') {
          mainWindow.webContents.send('down-video-mkdir', { msg: message.data, msgType: 'success' });
        }
        if (message.msg === 'process') {
          mainWindow.webContents.send('down-video-process', { msg: message.data, msgType: 'success' });
        }
      }
    }
  });
  downWorker.on('error', (error) => {
    mainWindow.webContents.send('down-error-message', { msg: '相机操作错误', msgType: 'error' });
  });
}

//  创建z2pro 下载子线程 
function createdSegImgThreads() {
  segImgWorker = new Worker(segImgsPath);
  segImgWorker.on('message', (message) => {
    if (message.msgBackInfo === 'read-mask-points') {
      mainWindow.webContents.send('segwork-get-points', message);
    }
  });
  segImgWorker.on('error', (error) => {
    mainWindow.webContents.send('down-error-message', { msg: '操作错误', msgType: 'error' });
  });
}


// 读取相机配置JSON及相机列表   z2pro相机
ipcMain.handle('readCaptureJsonCon', async (event) => {
  let JSONData = {
    message: false,
    data: null
  }
  try {
    // 读取文件内容
    const data = await prmFs.readFile(z2proConfigPath, 'utf-8');
    // 解析为 JSON 对象
    const jsonData = JSON.parse(data);
    JSONData.message = true
    JSONData.data = jsonData
  } catch (error) {
    JSONData.message = false
    if (error.code === 'ENOENT') {
      JSONData.data = '文件不存在'
    } else {
      JSONData.data = '读取或解析 JSON 时出错'
    }
  }
  return JSONData
})

ipcMain.on('z2proDownMp4EleApi', async (event, val) => {
  try {
    if (downWorker === null) {
      createdDownThreads();
    }
    let downPath = val.downPath.indexOf('\\') === -1 ? path.resolve(__dirname, `../../${val.downPath}`) : val.downPath;
    let curTime = moment().format('YYYY-MM-DD_HH-mm-ss');
    let fileName = curTime.replaceAll('-', '').replace('_', '')
    let dirPath = path.join(downPath, `/${fileName}`);

    let arr = []
    val.camList.forEach(item => {
      arr.push({
        host: item,
        user: 'ftp',
        pwd: 'panodux'
      })
    })
    
    let messageParams = {
      msgInfo: 'down-mp4',
      params: {
        ipValList: arr,
        pathInfo: val.pathInfo,
        downPath: dirPath,
      }
    }
    downWorker.postMessage(messageParams);
  } catch (error) {
    console.log(`Failed to load @electron/fix-path:${error}`)
  }
})

ipcMain.on('z2proInitEleApi', async (event, val) => {
  try {
    if (worker === null) {
      createdThreads();
    }
    let messageParams = {
      msgInfo: 'init_z2pro',
      params: {
        path: nodeZ2PROPath,
        val: val
      }
    }
    worker.postMessage(messageParams);
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

ipcMain.on('z2proRefindEleApi', async (event, val) => {
  try {
    let messageParams = {
      msgInfo: 'refind_z2pro',
      params: {
        val: val
      }
    }
    worker.postMessage(messageParams);
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})


ipcMain.on('z2proRebootApi', async (event, val) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_reboot',
        params: {}
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

ipcMain.on('z2progetSnapPhotoApi', async (event, val) => {
  try {
    if (worker) {
      camIpList = val
      let messageParams = {
        msgInfo: 'z2pro_snap_photo',
        params: {}
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})



ipcMain.on('z2proFormattfApi', async (event) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_format_tf',
        params: {}
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})


ipcMain.on('z2proStartShootApi', async (event) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_strat_shoot',
        params: {}
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

ipcMain.on('stopZ2proAllCaptureApi', async (event) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_end_shoot',
        params: {}
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})



// 启动 RTSP 流转化为 jpg
function startHLSStreams(cameras, width, height, frameRate) {
  thread_list = []
  let arr = [...cameras]
  arr.forEach((item, index) => {
    // FFmpeg 命令参数
    const ffmpegArgs = [
      '-rtsp_transport', 'udp',          // 保留：强制 UDP 传输降低延迟
      '-threads', '1',
      '-i', `rtsp://${item}/sub_preview`,
      '-vf', `scale=${width}:${height},fps=${frameRate}`, // 保留：调整分辨率
      '-r', frameRate,
      '-f', 'mjpeg',  // 修改：使用 mjpeg 流格式
      '-pix_fmt', 'yuvj420p',
      '-huffman', 'default',
      '-skip_threshold', '0',
      '-skip_factor', '0',
      '-skip_exp', '0',
      '-error_rate', '0',
      '-rc_init_cplx', '0',
      '-rc_buf_aggressivity', '1',
      '-force_duplicated_matrix', true,
      '-q:v', frameRate === '25' ? '6' : '30', // 保留：质量参数（值越小质量越高）
      '-an',                             // 保留：禁用音频
      '-fflags', 'nobuffer',             // 保留：禁用输入缓冲
      '-flush_packets', '1',             // 保留：强制实时处理包
      '-probesize', '32',            // 调整探测大小，降低延迟
      '-update', '1',                    // 保留：强制每帧更新
      '-analyzeduration', '0',           // 保留：降低初始分析时间
      'pipe:1'
    ];

    // 使用 ffmpeg 转换 RTSP 流
    const ffmpeg = spawn(ffmpegPath, ffmpegArgs);
    // 启动 FFmpeg
    thread_list.push(ffmpeg)
    ffmpeg.stdout.on('data', (data) => {
      if (appShow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(`rtsp-message-${item}`, {
          camIp: item,
          data: data
        });
      }
    });
    ffmpeg.stderr.on('data', (data) => {
    });
    ffmpeg.on('close', (code) => {
      // mainWindow.webContents.send(`rtsp-close-cam`, {
      //   camIp: item,
      // });
    });
  });
}


let downPhotoNum = 0;
// 下载测试拍照
async function downloadPhoto(ipAddr, downPath) {
  const client = new ftp.Client();
  try {
    // 连接到 FTP 服务器
    await client.access({
      host: ipAddr,
      user: 'ftp',
      password: 'panodux',
      secure: false
    });
    await client.cd('/jpg');
    await client.downloadTo(`${downPath}/${ipAddr}.jpg`, `snap_1.jpg`);
    downPhotoNum++;
    console.log('Photo downloaded successfully!');
    if (downPhotoNum === camIpList.length) {
      shell.openPath(downPath)
    }
  } catch (err) {
    console.error('Error downloading photo:', err);
  } finally {
    // 关闭连接
    client.close();
  }
}


// 断开预览子进程 rtsp流
function stopHLSStreams() {
  if (thread_list.length === 0) {
    return;
  }
  thread_list.forEach(item => {
    item.kill();
  });
}

// 开始全部预览
ipcMain.handle('startZ2proCaptureApi', async (event, val) => {
  try {
    stopHLSStreams();
    startHLSStreams(val, 240, 426, 8);
    return { msg: '操作成功', msgType: 'success' };
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})


// 停止预览
ipcMain.handle('stopZ2proAllRtspApi', async (event) => {
  try {
    stopHLSStreams();
    return { msg: '操作成功', msgType: 'success' };
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

// 开始单个预览
ipcMain.handle('startZ2proSingleCam', async (event, val) => {
  try {
    stopHLSStreams();
    startHLSStreams([val], 720, 1280, '25');
    return { msg: '操作成功', msgType: 'success' };
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

// 获取相机同步结果
ipcMain.on('getZ2proSyncStatusApi', async (event) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_syncst_get',
        params: {}
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

// 双击打开文件夹
ipcMain.on('openVideoCurFile', async (event, val) => {
  try {
    shell.openPath(val);
  } catch (error) {
    console.log(`Failed to load @electron/fix-path:${error}`)
  }
})


// 获取tf卡信息
ipcMain.on('getZ2protfInfoApi', async (event) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_tf_case',
        params: {}
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})
// 设置相机分辨率
ipcMain.on('setCamResolutonApi', async (event, val) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_set_resoluton',
        params: {
          resoluton: val
        }
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

// 设置相机帧率
ipcMain.on('setCamFpsApi', async (event, val) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_set_fps',
        params: {
          resoluton: val
        }
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

// 设置相机码率
ipcMain.on('setCamBitRateApi', async (event, val) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_set_bitrate',
        params: {
          resoluton: val
        }
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

// 设置快门速度
ipcMain.on('setCamShutterApi', async (event, val) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_set_shutter',
        params: {
          resoluton: val
        }
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})
// 设置ISO
ipcMain.on('setCamISOApi', async (event, val) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_set_iso',
        params: {
          resoluton: val
        }
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

// 设置编码方式
ipcMain.on('setEncTypeApi', async (event, val) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_set_enc',
        params: {
          resoluton: val
        }
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})

// 设置曝光模式
ipcMain.on('setCamAeModelApi', async (event, val) => {
  try {
    if (worker) {
      let messageParams = {
        msgInfo: 'z2pro_set_aemode',
        params: {
          resoluton: val
        }
      }
      worker.postMessage(messageParams);
    }
  } catch (error) {
    return `Failed to load @electron/fix-path:${error}`
  }
})




//  选择下载路径  及更改json 下载配置
ipcMain.handle('openFolderPicker', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']  // 只允许选择文件夹
  });

  if (!result.canceled) {
    // 读取文件内容
    const data = await prmFs.readFile(z2proConfigPath, 'utf-8');
    // 解析为 JSON 对象
    const jsonData = JSON.parse(data);
    jsonData.z2proDownPath = result.filePaths[0]
    fs.writeFileSync(z2proConfigPath, JSON.stringify(jsonData, null, 2));
    // 返回选择的文件夹路径
    return {
      msgType: 'success',
      msg: result.filePaths[0]
    }
  }
  return {
    msgType: 'error',
    msg: '未选择文件夹'
  }
})


// 一次视频完整下载成功
ipcMain.on('downVideoAllSuccess', async (event, val) => {
  let jsonPath = path.join(val.filePath, `/view_config.json`);
  if (fs.existsSync(jsonPath)) {
    // 读取文件内容
    const data = await prmFs.readFile(jsonPath, 'utf-8');
    // 解析为 JSON 对象
    const jsonData = JSON.parse(data);
    jsonData.downDownFull = val.downDownFull
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  }
})

// 更新json 配置
ipcMain.handle('updateJsonConfig', (event, val) => {
  try {
    fs.writeFileSync(z2proConfigPath, JSON.stringify(val, null, 2));
    return {
      msgType: 'success',
      msg: "操作成功"
    }
  } catch (err) {
    return `Failed to load @electron/fix-path:${error}`
  }
})


// 项目文件删除
ipcMain.on('rmProjectFilesApi', (event, val) => {
  try {
    fs.rm(val.rmPath, { recursive: true, force: true }, (err) => {
      if (err) {
        mainWindow.webContents.send('project-rm-back', {
          msgType: 'error'
        });
      } else {
        mainWindow.webContents.send('project-rm-back', {
          msgType: 'success'
        });
      }
    });
  } catch (err) {
    console.log(err)
  }
})

ipcMain.on('reDownProjectFilesApi', (event, val) => {
  try {
    if (downWorker === null) {
      createdDownThreads();
    }
    let arr = []
    val.ipValList.forEach(item => {
      arr.push({
        host: item,
        user: 'ftp',
        pwd: 'panodux'
      })
    })
    let messageParams = {
      msgInfo: 're-down-mp4',
      params: {
        ipValList: arr,
        pathInfo: val.lastProjectObj
      }
    }
    console.log(messageParams)
    downWorker.postMessage(messageParams);
  } catch (err) {
    console.log(err)
  }
})

// 获取视频文件列表
ipcMain.handle('getVideofilesApi', async (event, val) => {
  let folderPath = val.indexOf('\\') === -1 ? path.resolve(__dirname, `../../${val}`) : val;
  let filsList = []
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log('files has created:', folderPath);
    }
    let files = fs.readdirSync(folderPath);
    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(folderPath, files[i]);
      let jsonPath = path.join(folderPath, `/${files[i]}/view_config.json`);
      let times = ''
      let downStatus = ''
      let orginFileName = ''
      if (fs.existsSync(jsonPath)) {
        // 读取文件内容
        const data = await prmFs.readFile(jsonPath, 'utf-8');
        // 解析为 JSON 对象
        const jsonData = JSON.parse(data);
        times = jsonData.times ? jsonData.times : ''
        downStatus = jsonData.downDownFull ? '100%' : '失败'
        orginFileName = jsonData.orginFileName ? jsonData.orginFileName : ''
      }
      const stats = fs.statSync(filePath);
      // 检查是否为文件夹
      if (stats.isDirectory()) {
        filsList.push({
          fileName: files[i],
          filePath: filePath,
          shootTime: times,
          downStatus: downStatus,
          orginFileName: orginFileName,
          fileSize: Number((getFolderSize(filePath) / (1024 * 1024)).toFixed(2)),
          fileCreatedTime: moment(stats.birthtime).format('YYYY-MM-DD HH:mm:ss')
        })
      }
    }
    return {
      msgType: 'success',
      data: filsList
    }
  } catch (error) {
    return {
      msgType: 'error',
      data: error
    }
  }
})


// 递归遍历所有子文件大小
function getFolderSize(folderPath) {
  let totalSize = 0;
  // 获取文件夹内容
  const files = fs.readdirSync(folderPath);
  // 遍历文件夹内容
  files.forEach(file => {
    const fullPath = path.join(folderPath, file);
    const stats = fs.statSync(fullPath);

    // 如果是文件，累加文件大小
    if (stats.isFile()) {
      totalSize += stats.size;
    }
    // 如果是文件夹，递归计算文件夹大小
    else if (stats.isDirectory()) {
      totalSize += getFolderSize(fullPath); // 递归调用
    }
  });

  return totalSize;
}


let lastFrameSet = null;

// 获取数据帧文件夹列表
ipcMain.handle('getFrameOrginfilesApi', async (event) => {
  let folderPath = ''
  if  (process.env.NODE_ENV === 'development') {
    folderPath = path.resolve(__dirname, '../../frame_dir');
  } else {
    folderPath = path.resolve(__dirname, '../../../../frame_dir')
  }
  let filsList = []
  try {
    if (!fs.existsSync(folderPath)) {
      return {
        msgType: 'error',
        data: '分割文件夹不存在，请确认是否已移入分割数据'
      }
    }
    let files = fs.readdirSync(folderPath);
    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(folderPath, files[i]);
      const stats = fs.statSync(filePath);
      // 检查是否为文件夹
      if (stats.isDirectory()) {
        let editJsonPath = path.join(filePath, '/maskEdit.json');
        let editNameList = [];
        if (fs.existsSync(editJsonPath)) {
          // 读取文件内容
          const data = await prmFs.readFile(editJsonPath, 'utf-8');
          // 解析为 JSON 对象
            const jsonData = JSON.parse(data);
            editNameList = jsonData.editList;
        }
        filsList.push({
          fileName: files[i],
          filePath: filePath,
          type: 'dir',
          isEdit: false,
          children: getCurDirPng(filePath, editNameList)
        })
      }
    }
    return {
      msgType: 'success',
      data: filsList,
      lastFramePath: lastFrameSet
    }
  } catch (error) {
    return {
      msgType: 'error',
      data: error
    }
  }
})

const getCurDirPng = (dirPath, editNameList) => {
  let pngFilsList = [];
  let files = fs.readdirSync(dirPath);
  for (let i = 0; i < files.length; i++) {
    if (files[i] === 'images') {
      const filePath = path.join(dirPath, files[i]);
      let pngFiles = fs.readdirSync(filePath);
      pngFiles.forEach(uucm => {
        if (uucm.indexOf('.png') !== -1) {
          let isEdit = false;
          if (editNameList.length) {
            if (editNameList.indexOf(uucm) >= 0) {
              isEdit = true;
            }
          }
          let obj = {
            fileName: uucm,
            filePath: path.join(filePath, uucm),
            type: 'png',
            isEdit: isEdit
          }
          pngFilsList.push(obj)
        }
      })
      if (pngFiles.length !== editNameList.length && editNameList.length !== 0) {
        lastFrameSet = dirPath
      }
      break;
    }
  }
  return pngFilsList
}

// 获取原图像
ipcMain.handle('readImgsFilesApi', (event, val) => {
  try {
    const buffer = fs.readFileSync(val.imgPath);
    return {
      msgType: 'success',
      data: buffer
    }
  } catch (error) {
    return {
      msgType: 'error',
      data: error
    }
  }
})
// 保存新mask数据
ipcMain.handle('saveMaskDataToPng', async (event, val) => {
  try {
    let maskPath = val.outImgPath.replace('images', 'new_box_new_masks');
    let newMaskPath = path.join(val.parentFilePath, 'new_box_new_masks');
    if (!fs.existsSync(newMaskPath)) {
      fs.mkdirSync(newMaskPath, { recursive: true });
    }
    let editJsonPath = path.join(val.parentFilePath, '/maskEdit.json');
    let editMaskNameList = [];
    if (fs.existsSync(editJsonPath)) {
      // 读取文件内容
      const data = await prmFs.readFile(editJsonPath, 'utf-8');
      // 解析为 JSON 对象
        const jsonData = JSON.parse(data);
        editMaskNameList = jsonData.editList;
        let isExistIndex = editMaskNameList.findIndex(iccm => iccm === val.fileName)
        if (isExistIndex === -1) {
          editMaskNameList.push(val.fileName)
        }
    } else {
      editMaskNameList.push(val.fileName)
    }
    let obj = {
      editList: editMaskNameList
    }
    fs.writeFileSync(editJsonPath, JSON.stringify(obj, null, 2), 'utf8');
    await sleep(500);
    generateBinaryImage( val.maskData, val.width, val.height, maskPath);
    return {
      msgType: 'success',
      msg: '操作成功'
    }
  } catch (error) {
    return {
      msgType: 'error',
      msg: error
    }
  }
});

// 读取二值图 获取 原标注点组
ipcMain.on('getImgDataPoints', async (event, val) => {
  try {
    if (segImgWorker === null) {
      createdSegImgThreads();
    }
    let messageParams = {
      msgInfo: 'read-mask-points',
      params: val
    }
    segImgWorker.postMessage(messageParams);
  } catch (error) {
    console.log(error)
  }
})


ipcMain.handle('getPinkMaskBuffer', async (event, val) => {
  try {
    let mask = new cv.Mat.zeros(val.height, val.width, cv.CV_8UC1);

    let contours = new cv.MatVector();
    let pointsList = val.pointsList;
    pointsList.forEach(points => {
      let pts = new cv.Mat(points.length, 1, cv.CV_32SC2);
      for (let i = 0; i < points.length; i++) {
        pts.intPtr(i, 0)[0] = points[i].x;
        pts.intPtr(i, 0)[1] = points[i].y;
      }
      contours.push_back(pts);
      pts.delete();
    });
    cv.drawContours(mask, contours, -1, new cv.Scalar(255), cv.FILLED);
    let canvas = createCanvas(val.width, val.height);
    let ctx = canvas.getContext("2d");
    let imageData = ctx.createImageData(val.width, val.height);
    let data = mask.data;
    for (let i = 0; i < data.length; i++) {
      if (data[i] === 255) {
        // **填充粉色（半透明）**
        imageData.data[i * 4] = 255; // R
        imageData.data[i * 4 + 1] = 105; // G
        imageData.data[i * 4 + 2] = 180; // B
        imageData.data[i * 4 + 3] = 80; // A (半透明)
      } else {
        // **完全透明**
        imageData.data[i * 4] = 0;
        imageData.data[i * 4 + 1] = 0;
        imageData.data[i * 4 + 2] = 0;
        imageData.data[i * 4 + 3] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    mask.delete();
    contours.delete();
    return {
      msgType: 'success',
      data: canvas.toBuffer("image/png")
    }
  } catch (error) {
    return {
      msgType: 'success',
      data: error
    }
  }
})


function generateBinaryImage(pointsList, width, height, outputPath) {
  let mask = new cv.Mat.zeros(height, width, cv.CV_8UC1);
  let contours = new cv.MatVector();
  pointsList.forEach(points => {
    let pts = new cv.Mat(points.length, 1, cv.CV_32SC2);
    for (let i = 0; i < points.length; i++) {
      pts.intPtr(i, 0)[0] = points[i].x;
      pts.intPtr(i, 0)[1] = points[i].y;
    }
    contours.push_back(pts);
    pts.delete();
  });
  cv.drawContours(mask, contours, -1, new cv.Scalar(255), cv.FILLED);
  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext("2d");
  let imageData = ctx.createImageData(width, height);
  let data = mask.data;
  for (let i = 0; i < data.length; i++) {
    imageData.data[i * 4] = data[i]; // R
    imageData.data[i * 4 + 1] = data[i]; // G
    imageData.data[i * 4 + 2] = data[i]; // B
    imageData.data[i * 4 + 3] = 255; // Alpha
  }
  ctx.putImageData(imageData, 0, 0);
  fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));
}





