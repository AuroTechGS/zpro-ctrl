const { parentPort } = require('worker_threads');
const cv = require("opencv.js");
const fs = require('fs');
const { createCanvas, loadImage } = require("canvas");

// 监听主线程发送的消息
parentPort.on('message', async (message) => {
    try {
        //  读取图片和mask
        if (message.msgInfo === 'read-mask-points') {
            let val = message.params
            let maskPath = val.imgPath.replace('images', val.isEdit ? 'new_box_new_masks' : 'box_new_masks')
            const image = await loadImage(maskPath);
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            const maskMat = cv.matFromImageData(imageData);
            cv.cvtColor(maskMat, maskMat, cv.COLOR_RGBA2GRAY); // 转换为灰度图
            const contours = new cv.MatVector();
            const hierarchy = new cv.Mat();
            cv.findContours(maskMat, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
            // let pointsList = [];
            // for (let i = 0; i < contours.size(); i++) {
            //     let contour = contours.get(i);
            //     let points = [];

            //     for (let j = 0; j < contour.rows; j++) {
            //         let x = contour.intAt(j, 0);
            //         let y = contour.intAt(j, 1);
            //         points.push({ x, y });
            //     }
            //     pointsList.push(points);
            // }
            let pointsList = [];
            for (let i = 0; i < contours.size(); i++) {
              let contour = contours.get(i);
              let approxCurve = new cv.Mat();
        
              let epsilon = 0.5; // **调整此值来减少点数**
              cv.approxPolyDP(contour, approxCurve, epsilon, true);
        
              let points = [];
              for (let j = 0; j < approxCurve.rows; j++) {
                let x = approxCurve.intAt(j, 0);
                let y = approxCurve.intAt(j, 1);
                points.push({ x, y });
              }
        
              pointsList.push(points);
              approxCurve.delete(); // 释放内存
            }

            contours.delete();
            hierarchy.delete();
            maskMat.delete();
            parentPort.postMessage({ msgBackInfo: 'read-mask-points', msgType: 'success', data: pointsList });
        }
        // 保存mask
        if (message.msgInfo === 'save-final-mask') {

        }
    } catch (error) {
        parentPort.postMessage({ msg: `Error: ${error.message}`, msgType: 'error' });
    }
});
