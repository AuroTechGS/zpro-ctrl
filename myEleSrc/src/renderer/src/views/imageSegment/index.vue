<template>
  <div class="view-Page-two">
    <div class="left-project-files">
      <div class="tips-tab">
        <span>文件列表</span>
      </div>
      <ul data-simplebar>
        <li
          v-for="(item, index) in filesList"
          class="dir-files-item"
          @click="dirFilesClickFn(item)"
          :style="{ paddingLeft: item.type === 'dir' ? '6px' : '25px' }"
          v-show="item.isShow"
        >
          <div style="width: 100%">
            <i
              v-show="!item.showChirld && item.type === 'dir'"
              class="iconfont icon-youjiantou right-arrow-tre"
            ></i>
            <i
              v-show="item.showChirld && item.type === 'dir'"
              class="iconfont icon-xiajiantou right-arrow-tre"
            ></i>
            <i
              v-show="item.type === 'dir'"
              class="iconfont icon-wenjianjia my-icon-dir"
            ></i>
            <i v-show="item.type === 'png'" class="iconfont icon-tuxiang my-icon-png"></i>
            <span
              class="file-item-name"
              :style="{
                color:
                  (item.fileName == curShowPngObj.fileName &&
                    item.filePath === curShowPngObj.filePath) ||
                  item.fileName == curShowPngObj.parentNodeName
                    ? '#0dca73'
                    : 'white',
              }"
              >{{ item.fileName }}</span
            >
            <el-tag
              v-show="item.isEdit"
              effect="dark"
              type="success"
              size="small"
              style="float: right; margin-right: 6px"
              >{{ "已确认" }}</el-tag
            >
          </div>
        </li>
      </ul>
    </div>
    <div class="set-tools-box" v-show="isShowSegPng">
      <div
        class="seg-icon-base"
        :class="[activeToolStatus == 0 ? 'icon-seg-active' : '']"
      >
        <el-tooltip content="默认预览" placement="right" effect="light">
          <i class="iconfont icon-shubiaojiantou arrowDefaut" @click="toolsChange(0)"></i
        ></el-tooltip>
      </div>
      <div
        class="seg-icon-base"
        :class="[activeToolStatus == 1 ? 'icon-seg-active' : '']"
      >
        <el-tooltip content="打点" placement="right" effect="light">
          <i
            class="iconfont icon-chuangjianxianguizedian dorDefaut"
            @click="toolsChange(1)"
          ></i
        ></el-tooltip>
      </div>
      <div
        class="seg-icon-base"
        :class="[activeToolStatus == 2 ? 'icon-seg-active' : '']"
      >
        <el-tooltip content="根据标注点查找图层" placement="right" effect="light">
          <el-icon class="dorDefaut" @click="toolsChange(2)">
            <Search />
          </el-icon>
        </el-tooltip>
      </div>

      <div class="tooles-line-seg"></div>
      <div
        class="seg-icon-base-two"
        v-if="activeToolStatus == 1"
        :class="[pointStatus == 0 ? 'icon-seg-active-two' : '']"
      >
        <el-tooltip
          content="默认新增打点及所有图像拖拽移动"
          placement="right"
          effect="light"
        >
          <i
            class="iconfont icon-shubiaojiantou1 arrow-dor-icon"
            @click="editPointFn(0)"
          ></i>
        </el-tooltip>
      </div>
      <div
        class="seg-icon-base-two"
        v-if="activeToolStatus == 1"
        :class="[pointStatus == 1 ? 'icon-seg-active-two' : '']"
      >
        <el-tooltip content="选择两个点，在中间添加点" placement="right" effect="light">
          <i
            class="iconfont icon-xuxianjuxing dorDefaut-add-point"
            @click="editPointFn(1)"
          ></i>
        </el-tooltip>
      </div>
      <div
        class="seg-icon-base-two"
        v-if="activeToolStatus == 1"
        :class="[pointStatus == 3 ? 'icon-seg-active-two' : '']"
      >
        <el-tooltip content="选择单个点进行拖拽调整位置" placement="right" effect="light">
          <i
            class="iconfont icon-yidongjiantou arrow-dor-icon"
            @click="editPointFn(3)"
          ></i>
        </el-tooltip>
      </div>
      <div
        class="seg-icon-base-two"
        v-if="activeToolStatus == 1"
        :class="[pointStatus == 2 ? 'icon-seg-active-two' : '']"
      >
        <el-tooltip content="选择需要删除的点进行删除" placement="right" effect="light">
          <i
            class="iconfont icon-xiangpica dorDefaut-add-point"
            @click="editPointFn(2)"
          ></i>
        </el-tooltip>
      </div>
      <div class="tools-finsh-icon-box">
        <div class="tooles-line-seg"></div>
        <div class="seg-icon-base">
          <el-tooltip content="比例还原" placement="right" effect="light">
            <i class="iconfont icon-a-smlsicon_huanyuan dorDefaut" @click="reOrginFn"></i>
          </el-tooltip>
        </div>
        <div class="seg-icon-base">
          <el-tooltip content="完成当前图层本次操作" placement="right" effect="light">
            <i class="iconfont icon-done-all dorDefaut" @click="finshCurLayerFn"></i>
          </el-tooltip>
        </div>
        <div class="seg-icon-base-three" style="color: #606266; background-color: white">
          <el-tooltip content="确认/保存分割结果" placement="right" effect="light">
            <i class="iconfont icon-wancheng dorDefaut" @click="endEditMask"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="my-scale-box" v-show="isShowSegPng">
      <span>缩放({{ (stageScaleNum * 100).toFixed(0) + "%" }}):</span>
      <div class="sliders-box">
        <el-slider
          v-model="stageScaleNum"
          @input="scaleChangeFn"
          :format-tooltip="formatTooltip"
          :step="0.5"
          :min="1"
          :max="20"
        />
      </div>
    </div>
    <div class="right-seg-cas" ref="casImgBox">
      <div class="right-rect-box" ref="container" id="container"></div>
      <div class="right-seg-project-layer">
        <div class="tips-tab">
          <span>所有图层</span>
          <span class="to-dele-fw" @click="toDeleteFn()" v-if="allLayers.length"
            >批量删除</span
          >
          <!-- <span
            >全部预览：<el-switch
              v-model="isPreviewAllLayer"
              inline-prompt
              active-text="开启"
              inactive-text="关闭"
              @change="isPreviewAllLayerChangeFn"
          /></span> -->
        </div>
        <div class="layer-box" data-simplebar>
          <div
            v-for="(item, index) in allLayers"
            class="item-layer-card"
            :class="[curShowLayerIndex == index ? 'layer-right-active' : '']"
            @dblclick="dbLayerClFn(index)"
          >
            <div>{{ "名称：图层" + (index + 1) }}</div>
            <div class="item-btn-box">
              <el-button type="primary" round size="small" @click="dbLayerClFn(index)">{{
                curShowLayerIndex != index ? "编辑" : "取消编辑"
              }}</el-button>
              <el-button type="danger" round size="small" @click="deleteLayerFn(index)"
                >删除</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="centerDialogVisible"
      title="批量删除图层"
      width="500"
      align-center
    >
      <div style="padding: 10px">
        <span>请输入要删除图层的范围:</span>
        <div style="margin: 10px; margin-left: 18%">
          <el-input-number v-model="deleStartNum" :step="1" :min="1" :max="1000" />
          --
          <el-input-number v-model="deleEndNum" :step="1" :min="1" :max="1000" />
        </div>
        <div style="color: red; font-size: 12px; padding: 10px; height: 30px">
          {{ fwTips }}
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer" style="padding: 10px">
          <el-button size="small" @click="centerDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="confirmDelete"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="js">
import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar";
import { ref, onMounted, onUnmounted, nextTick, getCurrentInstance, reactive } from 'vue';
import { ElMessage } from "element-plus";
import Konva from "konva";
const globals = getCurrentInstance().appContext.config.globalProperties;
let activeToolStatus = ref(0);
import { sleep } from "../../assets/js/untils";


const formatTooltip = (val) => {
  return (val * 100).toFixed(0) + '%';
}
let filesList = ref([])
let stageScaleNum = ref(1);
let imgFirstscale = 0;

let img_shape = null;
let stage = null;
let layer = null;
let stageX = 0, stageY = 0;
let allLayers = ref([]);
let allLines = [];
let allCicles = [];
let canvasSize = 0;


let pointsList = [];
let line = null;
let circleList = [];
let curShowLayerIndex = ref(null)
let mapConfig = {
  zoom: 1, //当前放大的倍数
  zoomMin: 1,//最小
  zoomMax: 20,//最大
};

let centerDialogVisible = ref(false);


let scaleOffsetX = 0;
let scaleOffsetY = 0;

let deleStartNum = ref(1);
let deleEndNum = ref(1);

let curShowPngObj = reactive({});

let originalWidth = 0, originalHeight = 0;
let imgsMiddleX = 0, imgsMiddleY = 0;

let isEditLayer = false; // 判断当前图像是否被处理过  1、点被移动 2、删除过点 3、 新增过图层或减少过图层
let firstLayNum = 0;

let isPreviewAllLayer = ref(false);


let lastScale = 1;
let isShowSegPng = ref(false);
let isEdited = false;

let fwTips = ref('')

let imgWidth = 0;
let imgHeight = 0;

let curSetFrame = null;
let curFrameImgNum = 1;


onMounted(() => {
  window.electron.ipcRenderer.send("operationWindow", 'max');
  globals.$store.state.isFullScreen = true;
  globals.$store.state.isImagesSeg = true;
  nextTick(async () => {
    await sleep(500);
    stage = new Konva.Stage({
      container: "container",
      width: window.innerWidth - 550,
      height: window.innerHeight - 90,
    });
    canvasSize = window.innerHeight - 90;
    stageX = stage.x();
    stageY = stage.y();
    layer = new Konva.Layer();
    stage.add(layer);
    getFilesTree();
  })
})

let oneFramePngNum = 0;
// 获取文件列表
const getFilesTree = async () => {
  let res = await window.electron.ipcRenderer.invoke("getFrameOrginfilesApi");
  if (res.msgType === 'error') {
    return ElMessage.error('请检查是否存在文件夹【frame_dir】, 以及【frame_dir】文件夹下是否存待处理的图像桢文件夹');
  }
  if (res.msgType === 'success') {
    if (res.data.length === 0) {
      return ElMessage.error('请检查【frame_dir】文件夹下是否存待处理的图像桢文件夹');
    } else {
      let curFilesArr = []
      res.data.forEach(item => {
        let lev1 = {
          fileName: item.fileName,
          filePath: item.filePath,
          type: item.type,
          isEdit: item.isEdit,
          isShow: true,
          showChirld: false
        }
        curFilesArr.push(lev1)
        if (item.children) {
          oneFramePngNum = item.children.length
          item.children.forEach(uucm => {
            curFilesArr.push({
              fileName: uucm.fileName,
              filePath: uucm.filePath,
              type: uucm.type,
              isEdit: uucm.isEdit,
              showChirld: false,
              isShow: false,
              parentNodeName: item.fileName
            })
          })
        }
      });

      curFilesArr.forEach((item) => {
        if (item.type === 'dir') {
          let hasEditPng = curFilesArr.filter(iccm => !!iccm.isEdit && iccm.parentNodeName === item.fileName).length;
          if (hasEditPng === oneFramePngNum) {
            item.isEdit = true
          }
        }
      });
      filesList.value = curFilesArr;
      filesList.value.forEach(item => {
        item.showChirld = false
      });
      if (!filesList.value.length) return;
      let lastFrameEdit = res.lastFramePath;
      if (lastFrameEdit) {
        globals.$store.state.fullScreenloadingText = "正在打开上次编辑图像桢中，请稍等...";
        globals.$store.state.isFullScreenLoading = true;
        await sleep(1000);
        let dirIndex = filesList.value.findIndex(item => item.filePath === lastFrameEdit);
        let curFrameFile = filesList.value[dirIndex];
        curSetFrame = curFrameFile.fileName;
        filesList.value[dirIndex].showChirld = true;
        filesList.value.forEach(item => {
          if (item.parentNodeName === curSetFrame) {
            item.isShow = true
          }
        });
        let childrenList = filesList.value.filter(item => item.parentNodeName === curSetFrame && !item.isEdit)
        if (childrenList.length) {
          curFrameImgNum = oneFramePngNum - childrenList.length;
          dbSelectCurPng(childrenList[0])
        }
      }
    }
  }
}


const toDeleteFn = () => {
  if (!curShowPngObj.filePath) return;
  if (isEditLayer) {
    return ElMessage.error('请先确认完成当前正在编辑图层， 点击工具栏对勾图标')
  }
  fwTips.value = ''
  centerDialogVisible.value = true
}

const confirmDelete = () => {
  if (deleStartNum.value > deleEndNum.value) {
    fwTips.value = '范围输入错误，请重新输入'
    return;
  }
  if (deleEndNum.value > allCicles.length) {
    fwTips.value = '范围输入错误，请重新输入'
    return;
  }
  for (let i = deleEndNum.value - 1; i >= deleStartNum.value - 1; i--) {
    if (i === curShowLayerIndex.value) {
      curShowLayerIndex.value = null;
      allCicles.forEach((item) => {
        item.forEach(iccm => {
          iccm.setStroke("transparent");
        })
      })
      layer.batchDraw();//重绘
      line = null;
      circleList = [];
      pointsList = [];
    } else {
      if (curShowLayerIndex.value > i) {
        curShowLayerIndex.value = curShowLayerIndex.value - 1;
      }
    }
    allLayers.value.splice(i, 1);
    let needDeletLine = allLines.splice(i, 1);
    console.log(needDeletLine)
    needDeletLine.forEach(item => {
      !!item && item.destroy();
    })
    let needDeletCircles = allCicles.splice(i, 1);
    needDeletCircles.forEach(item => {
      item.forEach(iccm => {
        !!iccm && iccm.destroy();
      })
    })
  }
  dragAndDelAndAddPoint();
  layer.batchDraw();//重绘
  centerDialogVisible.value = false
}

// 选择显示图片
const dbSelectCurPng = (item) => {
  if (item.filePath === curShowPngObj.filePath) {
    return;
  }
  if (isEditLayer) {
    return ElMessage.error('请先完成当前图像分割， 再切换其他图像')
  }
  if (isEdited) {
    return ElMessage.error('请先确认或完成当前图像分割， 再切换其他图像')
  }
  if (curSetFrame === null) {
    curSetFrame = item.parentNodeName;
  }
  if (item.parentNodeName !== curSetFrame && curFrameImgNum < oneFramePngNum) {
    return ElMessage.error(`请先确认或完成当前桢【${curShowPngObj.parentNodeName}】所有图像分割， 再切换其他桢图像`)
  }
  if (item.parentNodeName !== curSetFrame && curFrameImgNum >= oneFramePngNum) {
    curFrameImgNum = 1;
    curSetFrame = item.parentNodeName;
  }
  if (allCicles.length) {
    allCicles.forEach(iccm => {
      iccm.forEach(item => {
        item.destroy();
      });
    })
  }
  if (allLines.length) {
    allLines.forEach(item => {
      item.destroy();
    });
  }
  isEdited = true;
  allCicles = [];
  allLines = [];
  allLayers.value = [];
  layer.batchDraw();
  globals.$store.state.fullScreenloadingText = "图像加载中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;

  firstLayNum = 0;
  for (let key in item) {
    curShowPngObj[key] = item[key];
  }
  isShowSegPng.value = true
  readImgsFn(curShowPngObj.filePath);
}
// 编辑工具选择
const toolsChange = async (val) => {
  if (isEditLayer) {
    return ElMessage.error('请先确认完成当前正在编辑图层， 点击工具栏对勾图标')
  }
  isPreviewAllLayer.value = false;
  activeToolStatus.value = val;

  stage.off("click");
  if (val == 0) {
    isPreviewAllLayerChangeFn(false);
    stage.container().style.cursor = "default";
    pointStatus.value = -1;
  }
  if (val == 1) {
    stage.container().style.cursor = "crosshair";
    pointStatus.value = 0;
    addImgsClicksFn();
  }
  if (val == 2) {
    stage.container().style.cursor = "crosshair";
    stage.off("click");
    pointStatus.value = -1;
    isPreviewAllLayerChangeFn(true);
    addImgsFindClicksFn();
  }
}
let pointStatus = ref(0);
// 图层添加、删除点 0、默认增加点及图像拖拽  1 添加  2 删除  3 点拖拽
const editPointFn = (type) => {
  pointStatus.value = type;
  stage.off('mousedown');
  stage.off('mousemove');
  stage.off('mouseup');
  stage.off("click");
  if (type == 0) {
    circleList.forEach((item, index) => {
      item.draggable(false);
    })
    stage.setAttrs({ draggable: true })
    addImgsClicksFn();
  }
  if (type == 1) {
    circleList.forEach((item, index) => {
      item.draggable(false);
    })
    stage.setAttrs({ draggable: false })
    rectImgsClicksFn(1);
  }
  if (type == 2) {
    circleList.forEach((item, index) => {
      item.draggable(false);
    })
    stage.setAttrs({ draggable: false })
    rectImgsClicksFn(2);
  }
  if (type == 3) {
    stage.setAttrs({ draggable: false })
    circleList.forEach((item, index) => {
      item.draggable(true);
    })
  }
}


const addImgsFindClicksFn = () => {
  stage.off("click");
  stage.on("click", (event) => {
    const pointerPos = stage.getPointerPosition();
    if (event.evt.button === 0) {
      let isClickCurLayerIndex = -1;
      if (allCicles.length) {
        for (let i = 0; i < allCicles.length; i++) {
          for(let k = 0; k < allCicles[i].length; k++) {
            if (allCicles[i][k].intersects(pointerPos)) {
              isClickCurLayerIndex = i;
              break;
            }
          }
          if (isClickCurLayerIndex !== -1) {
            break;
          }
        }
        if (isClickCurLayerIndex !== -1) {
          ElMessage({
            message: `点击标注点所在图层为：${isClickCurLayerIndex + 1}`,
            type: 'success',
            grouping: true,
            plain: true,
            showClose: true,
            offset: 90,
          })
        }
      }
    }
  })
}

const endEditMask = async () => {
  if (isEditLayer) {
    return ElMessage.error('请先确认完成当前正在编辑图层， 点击工具栏对勾图标')
  }
  stage.off("click"); // 移除所有 click 事件
  stage.off('mousedown');
  stage.off('mousemove');
  stage.off('mouseup');
  stage.off("wheel"); // 移除所有 click 事件
  if (!allLayers.value.length) {
    return ElMessage({
      message: '不存在图像分割图层, 不可进行保存',
      type: 'warning',
      grouping: true,
      plain: true,
      showClose: true,
      offset: 90,
    })
  }
  reOrginFn();
  let curArr = allLayers.value.map(layer =>
    layer.map(({ x, y }) => ({
      x: Math.round((x - imgsMiddleX) / imgFirstscale),
      y: Math.round((y - imgsMiddleY) / imgFirstscale)
    }))
  );
  curArr.forEach(item => {
    item[0].x = item[item.length - 1].x
    item[0].y = item[item.length - 1].y
  })
  let parentNode = filesList.value.filter(iccr => curShowPngObj.parentNodeName === iccr.fileName);
  let sendParams = {
    maskData: curArr,
    height: originalHeight,
    width: originalWidth,
    outImgPath: curShowPngObj.filePath,
    parentFilePath: parentNode[0].filePath,
    fileName: curShowPngObj.fileName
  }
  let res = await window.electron.ipcRenderer.invoke("saveMaskDataToPng", sendParams);
  if (res.msgType === 'success') {
    filesList.value.forEach(item => {
      if (item.fileName === curShowPngObj.fileName && item.parentNodeName === curShowPngObj.parentNodeName) {
        item.isEdit = true;
      }
    });
    let childHasEditNum = filesList.value.filter(item => item.parentNodeName === curShowPngObj.parentNodeName && item.isEdit).length
    if (childHasEditNum === oneFramePngNum) {
      filesList.value.forEach(item => {
        if (item.fileName === curShowPngObj.parentNodeName) {
          item.isEdit = true;
        }
      });
    }
    isEdited = false;
    if (curShowPngObj.parentNodeName === curSetFrame) {
      curFrameImgNum += 1;
    }
    ElMessage({
      message: '保存成功',
      type: 'success',
      grouping: true,
      plain: true,
      showClose: true,
      offset: 90,
    });
  } else {
    ElMessage({
      message: '操作失败',
      type: 'error',
      grouping: true,
      plain: true,
      showClose: true,
      offset: 90,
    });
  }
}

let rect = null; // 存储矩形和起始位置
let curpoint = null;
// 点击画矩形获取内部所有点
const rectImgsClicksFn = (editType) => {
  stage.on('mousedown', (event) => {
    if (event.evt.button !== 0) return;
    let startPos = stage.getPointerPosition();
    const scale = stage.scaleX();
    curpoint = {
      x: (startPos.x - stage.x()) / scale,
      y: (startPos.y - stage.y()) / scale,
    };
    // 创建矩形
    rect = new Konva.Rect({
      x: curpoint.x,
      y: curpoint.y,
      width: 1,
      height: 1,
      fill: 'rgba(0, 150, 255, 0.2)',
      stroke: 'blue',
      strokeWidth: 1 / stage.scaleX(),
      name: 'selection-rect'
    });
    layer.add(rect);
  });
  // **拖动鼠标，调整矩形大小**
  stage.on('mousemove', () => {
    if (!rect) return;
    let pos = stage.getPointerPosition();
    const scale = stage.scaleX();
    let curEndPos = {
      x: (pos.x - stage.x()) / scale,
      y: (pos.y - stage.y()) / scale,
    };
    rect.width(curEndPos.x - curpoint.x);
    rect.height(curEndPos.y - curpoint.y);
    layer.batchDraw();
  });

  // **松开鼠标，完成绘制并检测 `Circle`**
  stage.on('mouseup', () => {
    if (!rect) return;
    let selectedCircles = getCirclesInsideRect(rect);
    rect.destroy(); // 清除矩形
    layer.batchDraw();
    rect = null;
    curpoint = null;
    if (!selectedCircles.domAxies.length) {
      return ElMessage.error('未选中任何点');
    }
    const scale = stage.scaleX();
    if (editType === 1) {
      if (selectedCircles.domAxies.length === 2) {
        let findeIndex = circleList.findIndex(item => {
          return item.x() == selectedCircles.domList[0].x() && item.y() == selectedCircles.domList[0].y();
        })
        if (findeIndex === circleList.length - 1) {
          return ElMessage.error('请不要选择首尾相连的两个点，可以选择相邻的位置点进行拖拽调整');
        }
        let middPoint = {
          x: (selectedCircles.domAxies[0].x + selectedCircles.domAxies[1].x) / 2,
          y: (selectedCircles.domAxies[0].y + selectedCircles.domAxies[1].y) / 2,
        }
        // 判断是否是相邻两个点
        if (circleList[findeIndex + 1].x() === selectedCircles.domList[1].x() && circleList[findeIndex + 1].y() === selectedCircles.domList[1].y()) {
          pointsList.splice(findeIndex + 1, 0, middPoint);
          const circle = new Konva.Circle({
            x: middPoint.x,
            y: middPoint.y,
            stroke: "red", // 设置边框颜色
            strokeWidth: 2 / scale, // 设置边框宽度
            radius: 5 / scale, // 确保缩放时点的大小不变
            fill: "transparent", // 确保没有填充色
            draggable: false,
          });
          circleList.splice(findeIndex + 1, 0, circle);
          layer.add(circle);
          circle.on('dragmove', updateCircleDragFn);
          if (pointsList.length > 1) {
            if (line) {
              line.destroy(); // 先删除旧线
            }
            line = new Konva.Line({
              points: pointsList.flatMap(p => [p.x, p.y]), // 展开点数组为线段坐标
              stroke: "#06b025",
              strokeWidth: 2 / scale, // 线条宽度随缩放调整
              lineJoin: "round",
            });
            layer.add(line);
          }
          layer.batchDraw();
          isEditLayer = true;
        } else {
          return ElMessage.error('请选择存在连接的两个点');
        }
      }
    } else if (editType === 2) {
      selectedCircles.domList.forEach(ccm => {
        let findeIndex = circleList.findIndex(item => {
          return item.x() == ccm.x() && item.y() == ccm.y();
        })
        pointsList.splice(findeIndex, 1);
        let curCircleDe = circleList.splice(findeIndex, 1);
        curCircleDe.forEach(ittm => {
          ittm.destroy();
        });
      });
      if (pointsList.length > 1) {
        if (line) {
          line.destroy(); // 先删除旧线
        }
        line = new Konva.Line({
          points: pointsList.flatMap(p => [p.x, p.y]), // 展开点数组为线段坐标
          stroke: "#06b025",
          strokeWidth: 2 / scale, // 线条宽度随缩放调整
          lineJoin: "round",
        });
        layer.add(line);
      } else {
        if (line) {
          line.destroy(); // 先删除旧线
        }
      }
      dragAndDelAndAddPoint();
      layer.batchDraw();
      isEditLayer = true;
    }
  });

}

const updateCircleDragFn = (e) => {
  let findeIndex = circleList.findIndex(item => {
    return item.x() == e.target.x() && item.y() == e.target.y();
  })
  pointsList[findeIndex].x = circleList[findeIndex].x()
  pointsList[findeIndex].y = circleList[findeIndex].y()
  dragAndDelAndAddPoint();
  if (line) {
    line.destroy(); // 先删除旧线
  }
  line = new Konva.Line({
    points: pointsList.flatMap(p => [p.x, p.y]), // 展开点数组为线段坐标
    stroke: "#06b025",
    strokeWidth: 2 / stage.scaleX(), // 线条宽度随缩放调整
    lineJoin: "round",
  });
  layer.add(line);
  circleList.forEach(item => {
    item.moveToTop();
  })
  layer.batchDraw();
  isEditLayer = true;
}

function getCirclesInsideRect(rect) {
  let rectBox = rect.getClientRect(); // 获取矩形的边界框

  let insideCircles = circleList.filter(circle => {
    let circleBox = circle.getClientRect();
    return Konva.Util.haveIntersection(rectBox, circleBox);
  });

  return {
    domList: insideCircles,
    domAxies: insideCircles.map(circle => ({ x: circle.x(), y: circle.y() }))
  };
}

// 完成当前图层处理
const finshCurLayerFn = () => {
  activeToolStatus.value = 0;
  pointStatus.value = 0;
  stage.off('mousedown');
  stage.off('mousemove');
  stage.off('mouseup');
  stage.off("click"); // 移除所有 click 事件
  circleList.forEach(item => {
    item.setStroke("transparent");
  })
  if (curShowLayerIndex.value === null) {
    if (pointsList.length > 2) {
      allLayers.value.push(pointsList);
      allCicles.push(circleList);
      allLines.push(line);
    }
  } else {
    if (pointsList.length > 2) {
      allLines.splice(curShowLayerIndex.value, 1);
      allCicles.splice(curShowLayerIndex.value, 1);
      allLayers.value.splice(curShowLayerIndex.value, 1);
      allLines.splice(curShowLayerIndex.value, 0, line);
      allCicles.splice(curShowLayerIndex.value, 0, circleList);
      allLayers.value.splice(curShowLayerIndex.value, 0, pointsList)
    } else {
      allLines.splice(curShowLayerIndex.value, 1);
      allCicles.splice(curShowLayerIndex.value, 1);
      allLayers.value.splice(curShowLayerIndex.value, 1);
    }
  }
  pointsList = [];
  circleList = [];
  line = null;
  curShowLayerIndex.value = null;
  stage.container().style.cursor = "default";
  stage.setAttrs({ draggable: true });
  isEditLayer = false;
}

const deleteLayerFn = (index) => {
  if (isEditLayer) {
    return ElMessage.error('请先确认完成当前正在编辑图层， 点击工具栏对勾图标')
  }
  stage.off("click"); // 移除所有 click 事件
  globals
    .$confirm("请再次确认是否删除选中图层？图层一经删除无法恢复，请您谨慎操作", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      if (index === curShowLayerIndex.value) {
        curShowLayerIndex.value = null;
        allCicles.forEach((item, itemIndex) => {
          item.forEach(iccm => {
            iccm.setStroke("transparent");
          })
        })
        layer.batchDraw();//重绘
        line = null;
        circleList = [];
        pointsList = [];
      } else {
        if (curShowLayerIndex.value > index) {
          curShowLayerIndex.value = curShowLayerIndex.value - 1;
        }
      }
      allLayers.value.splice(index, 1);
      let needDeletLine = allLines.splice(index, 1);
      needDeletLine.forEach(item => {
        item.destroy();
      })
      let needDeletCircles = allCicles.splice(index, 1);
      needDeletCircles.forEach(item => {
        item.forEach(iccm => {
          iccm.destroy();
        })
      })
      dragAndDelAndAddPoint();
      layer.batchDraw();//重绘
      ElMessage.success("删除成功");
    }).catch(() => {
      ElMessage.info("已取消删除")
    })
}


const dirFilesClickFn = (item) => {
  if (item.type === 'dir') {
    item.showChirld = !item.showChirld
    filesList.value.forEach(uucm => {
      if (uucm.parentNodeName && uucm.parentNodeName === item.fileName) {
        uucm.isShow = !uucm.isShow
      }
    });
  }
  if (item.type === 'png') {
    dbSelectCurPng(item)
  }
}

const isPreviewAllLayerChangeFn = (val, type = 2) => {
  if (isEditLayer && type !== 1 && (activeToolStatus.value === 1)) {
    return ElMessage.error('请先确认完成当前正在编辑图层， 点击工具栏对勾图标')
  }
  if (val) {
    allCicles.forEach((item) => {
      item.forEach(iccm => {
        iccm.setStroke("red");
      })
    })
  }
  if (!val) {
    allCicles.forEach((item) => {
      item.forEach(iccm => {
        iccm.setStroke("transparent");
      })
    })
  }
  curShowLayerIndex.value = null;
}

// 还原
const reOrginFn = () => {
  lastScale = 1;
  stage.scale({ x: 1, y: 1 });
  layer.children.forEach((node) => {
    if (node.className === "Circle") {
      node.radius(5 / stage.scaleX());
      node.strokeWidth(2 / stage.scaleX());
    }
    if (node.className === "Line") {
      node.strokeWidth(2 / stage.scaleX());
    }
  });
  mapConfig.zoom = 1;
  stageScaleNum.value = 1;
  stage.position({ x: 0, y: 0 })
  layer.batchDraw();//重绘
}
// 滚动缩放
const addZoomEvent = () => {
  stage.off("wheel");
  stage.on("wheel", (e) => {
    e.evt.preventDefault();
    var min = 1; // 缩小最小的比例
    var step = 0.5; // 每次缩放的比例
    if (e.evt.wheelDelta) {
      scaleOffsetX = e.evt.offsetX; //鼠标在视口中的位置，距离x,y的坐标
      scaleOffsetY = e.evt.offsetY;
      if (e.evt.wheelDelta > 0) { // 放大
        if (mapConfig.zoom >= mapConfig.zoomMax) {
          return;
        }
        mapConfig.zoom = mapConfig.zoom + step;
        stageScaleNum.value = mapConfig.zoom;
        stageX = Math.abs(stageX) / (mapConfig.zoom - step) * mapConfig.zoom + (scaleOffsetX / (mapConfig.zoom - step) * mapConfig.zoom - scaleOffsetX);
        stageY = Math.abs(stageY) / (mapConfig.zoom - step) * mapConfig.zoom + (scaleOffsetY / (mapConfig.zoom - step) * mapConfig.zoom - scaleOffsetY);
        //计算偏移量
        stage.scaleX(stage.scaleX() + step);
        stage.scaleY(stage.scaleY() + step);
        stage.setAttrs({
          x: -stageX,
          y: -stageY
        })
        //设置xy的移动距离
      } else {// 缩小
        if (mapConfig.zoom <= mapConfig.zoomMin) {
          return;
        }
        mapConfig.zoom = mapConfig.zoom - step;
        stageScaleNum.value = mapConfig.zoom;
        stageX = Math.abs(stageX) / (mapConfig.zoom + step) * mapConfig.zoom + (scaleOffsetX / (mapConfig.zoom + step) * mapConfig.zoom - scaleOffsetX);
        stageY = Math.abs(stageY) / (mapConfig.zoom + step) * mapConfig.zoom + (scaleOffsetY / (mapConfig.zoom + step) * mapConfig.zoom - scaleOffsetY);
        if (stage.scaleX() > min && stage.scaleY() > min) {
          stage.scaleX(stage.scaleX() - step);
          stage.scaleY(stage.scaleY() - step);
          stage.setAttrs({ x: -stageX, y: -stageY })
        }
      }
      //保证图片在视口中不会有留白
      if (stage.x() > 0) {
        stage.setAttrs({ x: 0 })
        stageX = 0
      } else if (stage.x() < -(canvasSize * mapConfig.zoom - canvasSize)) {
        stage.setAttrs({ x: -(canvasSize * mapConfig.zoom - canvasSize) })
        stageX = - (canvasSize * mapConfig.zoom - canvasSize)
      }
      if (stage.y() > 0) {
        stage.setAttrs({ y: 0 })
        stageY = 0
      } else if (stage.y() < -(canvasSize * mapConfig.zoom - canvasSize)) {
        stage.setAttrs({ y: -(canvasSize * mapConfig.zoom - canvasSize) })
        stageY = - (canvasSize * mapConfig.zoom - canvasSize)
      }
    }
    if (mapConfig.zoom > 1) {
      //当放大倍数大于1时鼠标可以拖动
      if (pointStatus.value === 1 || pointStatus.value === 3 || pointStatus.value === 2) {
      } else {
        stage.setAttrs({ draggable: true })
        stage.on('dragmove', (event) => {
          //鼠标拖动
          stageX = stage.x();
          stageY = stage.y();
          if (stage.x() > 0) {
            stage.setAttrs({ x: 0 })
            stageX = 0
          }
          if (stage.x() < -(canvasSize * mapConfig.zoom - canvasSize)) {
            stage.setAttrs({ x: -(canvasSize * mapConfig.zoom - canvasSize) })
            stageX = -(canvasSize * mapConfig.zoom - canvasSize)
          }
          if (stage.y() > 0) {
            stage.setAttrs({ y: 0 })
            stageY = 0
          }
          if (stage.y() < -(canvasSize * mapConfig.zoom - canvasSize)) {
            stage.setAttrs({ y: -(canvasSize * mapConfig.zoom - canvasSize) })
            stageY = -(canvasSize * mapConfig.zoom - canvasSize)
          }
        })
      }
    } else {
      //当放大倍数等于1时鼠标不可以拖动
      stage.setAttrs({ draggable: false })
    }
    layer.children.forEach((node) => {
      if (node.className === "Circle") {
        node.radius(5 / stage.scaleX());
        node.strokeWidth(2 / stage.scaleX());
      }
      if (node.className === "Line") {
        node.strokeWidth(2 / stage.scaleX());
      }
    });
    layer.batchDraw();//重绘
  })
}

let pinkMask = null;

//  新增点、删除点、拖动点 操作都更新蒙版
const dragAndDelAndAddPoint = () => {
  if (curShowLayerIndex.value === null) {
    let curSomeArr = allLayers.value.map(layer =>
      layer.map(({ x, y }) => ({
        x: Math.round(x),
        y: Math.round(y),
      }))
    );
    if (pointsList.length > 2) {
      let curPoints = pointsList.map(item => {
        return {
          x: Math.round(item.x),
          y: Math.round(item.y),
        }
      })
      curSomeArr.push(curPoints);
      getPinkMask(curSomeArr);
    } else {
      getPinkMask(curSomeArr);
    }
  } else {
    let arr = allLayers.value
      .map((item, index) =>
        index !== curShowLayerIndex.value
          ? item.map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) }))
          : null
      ).filter(layer => layer !== null);
    if (pointsList.length > 2) {
      let curPoints = pointsList.map(item => {
        return {
          x: Math.round(item.x),
          y: Math.round(item.y),
        }
      })
      arr.splice(curShowLayerIndex.value, 0, curPoints)
    }
    getPinkMask(arr)
  }
}

const getPinkMask = async (curArr) => {
  let obj = {
    pointsList: curArr,
    width: originalWidth,
    height: originalHeight
  }
  let res = await window.electron.ipcRenderer.invoke("getPinkMaskBuffer", obj);
  let imgBlob = new Blob([res.data], { type: "image/png" });
  const imgURL = URL.createObjectURL(imgBlob);
  let imageObj = new Image();
  imageObj.src = imgURL;
  imageObj.onload = function () {
    if (pinkMask) {
      pinkMask.destroy();
    }
    pinkMask = new Konva.Image({
      image: imageObj,
      width: imageObj.width,
      height: imageObj.height,
      x: 0,
      y: 0,
      listening: false,
    });
    layer.add(pinkMask);
    layer.batchDraw();
  }
}

// 拖拽缩放
const scaleChangeFn = (val) => {
  if (val === 1) {
    stage.setAttrs({ draggable: false });
    reOrginFn();
  } else {
    if (scaleOffsetX === 0 && scaleOffsetY === 0) {
      scaleOffsetX = imgsMiddleX;
      scaleOffsetY = imgsMiddleY;
    }
    if (pointStatus.value === 1 || pointStatus.value === 3) {
    } else {
      stage.setAttrs({ draggable: true })
    }
    if (val - lastScale >= 0) {
      let step = val - lastScale;
      if (mapConfig.zoom + step >= 20) {
        step = 20 - mapConfig.zoom
      }
      mapConfig.zoom = mapConfig.zoom + step;
      stageX = Math.abs(stageX) / (mapConfig.zoom - step) * mapConfig.zoom + (scaleOffsetX / (mapConfig.zoom - step) * mapConfig.zoom - scaleOffsetX);
      stageY = Math.abs(stageY) / (mapConfig.zoom - step) * mapConfig.zoom + (scaleOffsetY / (mapConfig.zoom - step) * mapConfig.zoom - scaleOffsetY);
      stage.scaleX(stage.scaleX() + step);
      stage.scaleY(stage.scaleY() + step);
    } else {
      let step = lastScale - val;
      if (stage.scaleX() - step < 0) {
        step = 0;
      }
      mapConfig.zoom = mapConfig.zoom - step;
      stageX = Math.abs(stageX) / (mapConfig.zoom + step) * mapConfig.zoom + (scaleOffsetX / (mapConfig.zoom + step) * mapConfig.zoom - scaleOffsetX);
      stageY = Math.abs(stageY) / (mapConfig.zoom + step) * mapConfig.zoom + (scaleOffsetY / (mapConfig.zoom + step) * mapConfig.zoom - scaleOffsetY);
      stage.scaleX(stage.scaleX() - step);
      stage.scaleY(stage.scaleY() - step);
    }

    lastScale = val;
    stage.setAttrs({
      x: - stageX,
      y: - stageY
    });
    if (stage.x() > 0) {
      stage.setAttrs({ x: 0 })
      stageX = 0
    } else if (stage.x() < -(canvasSize * mapConfig.zoom - canvasSize)) {
      stage.setAttrs({ x: -(canvasSize * mapConfig.zoom - canvasSize) })
      stageX = - (canvasSize * mapConfig.zoom - canvasSize)
    }
    if (stage.y() > 0) {
      stage.setAttrs({ y: 0 })
      stageY = 0
    } else if (stage.y() < -(canvasSize * mapConfig.zoom - canvasSize)) {
      stage.setAttrs({ y: -(canvasSize * mapConfig.zoom - canvasSize) })
      stageY = - (canvasSize * mapConfig.zoom - canvasSize)
    }
    layer.children.forEach((node) => {
      if (node.className === "Circle") {
        node.radius(5 / stage.scaleX());
        node.strokeWidth(2 / stage.scaleX());
      }
      if (node.className === "Line") {
        node.strokeWidth(2 / stage.scaleX());
      }
    });
    layer.batchDraw();//重绘
  }
}
const addImgsClicksFn = () => {
  stage.off("click");
  stage.on("click", (event) => {
    const pointerPos = stage.getPointerPosition();
    const scale = stage.scaleX();
    isEditLayer = true;
    if (event.evt.button === 0) {
      let isClickCurLayerCircle = false;
      let circlePoint = null;
      if (circleList.length) {
        for (let i = 0; i < circleList.length; i++) {
          if (circleList[i].intersects(pointerPos)) {
            isClickCurLayerCircle = true;
            circlePoint = { x: circleList[i].attrs.x, y: circleList[i].attrs.y }
            break;
          }
        }
      }
      let point = {}
      if (isClickCurLayerCircle) {
        point = circlePoint;
      } else {
        point = {
          x: (pointerPos.x - stage.x()) / scale,
          y: (pointerPos.y - stage.y()) / scale,
        };
      }
      pointsList.push(point);
      const circle = new Konva.Circle({
        x: point.x,
        y: point.y,
        stroke: "red", // 设置边框颜色
        strokeWidth: 2 / scale, // 设置边框宽度
        radius: 5 / scale, // 确保缩放时点的大小不变
        fill: "transparent", // 确保没有填充色
        draggable: false,
      });
      circleList.push(circle)
      layer.add(circle);
      circle.on('dragmove', updateCircleDragFn);
      dragAndDelAndAddPoint();
    }
    // if (event.evt.button === 2) {
    //   if (pointsList.length) {
    //     pointsList.pop();
    //     let curDeleCircle = circleList.pop();
    //     curDeleCircle.destroy();
    //   }
    //   if (!pointsList.length) {
    //     isEditLayer = false;
    //   }
    // }
    if (pointsList.length > 1) {
      if (line) {
        line.destroy(); // 先删除旧线
      }
      line = new Konva.Line({
        points: pointsList.flatMap(p => [p.x, p.y]), // 展开点数组为线段坐标
        stroke: "#06b025",
        strokeWidth: 2 / scale, // 线条宽度随缩放调整
        lineJoin: "round",
      });
      layer.add(line);
    } else {
      if (line) {
        line.destroy(); // 先删除旧线
      }
    }
    layer.draw(); // 重新绘制
  })
}

onUnmounted(() => {
  globals.$store.state.isImagesSeg = true;
});


const readImgsFn = async (imgPath) => {
  let eleDataCapListMgs = await window.electron.ipcRenderer.invoke("readImgsFilesApi", { imgPath: imgPath });
  if (eleDataCapListMgs && eleDataCapListMgs.msgType === 'success') {
    let imgBlob = new Blob([eleDataCapListMgs.data], { type: "image/png" });
    const imgURL = URL.createObjectURL(imgBlob);
    let imageObj = new Image();
    imageObj.src = imgURL;
    imageObj.onload = function () {
      const stageWidth = stage.width();
      const stageHeight = stage.height();
      // 原始图像尺寸
      originalWidth = imageObj.width;
      originalHeight = imageObj.height;
      imgFirstscale = Math.min(stageWidth / originalWidth, stageHeight / originalHeight);
      imgWidth = originalWidth * imgFirstscale;
      imgHeight = originalHeight * imgFirstscale;
      // 计算居中位置
      imgsMiddleX = Math.round((stageWidth - imgWidth) / 2);
      imgsMiddleY = Math.round((stageHeight - imgHeight) / 2);
      if (img_shape) {
        img_shape.destroy();
      }
      img_shape = new Konva.Image({
        image: imageObj,
        width: imgWidth,
        height: imgHeight,
        x: imgsMiddleX,
        y: imgsMiddleY,
        listening: false,
      });
      layer.add(img_shape);
      activeToolStatus.value = 0;
      getPointsFn();
      addZoomEvent();
    };
  } else {
    ElMessage({
      message: '加载图像失败',
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
    globals.$store.state.isFullScreenLoading = false;
  }
}

const dbLayerClFn = (index) => {
  if (curShowLayerIndex.value === index && isEditLayer) {
    return ElMessage.error('选择图层正在编辑，无需再次点击')
  }
  if (isEditLayer) {
    return ElMessage.error('请先完成当前图层编辑， 点击工具栏对勾图标')
  }
  stage.off('mousedown');
  stage.off('mousemove');
  stage.off('mouseup');
  stage.off("click"); // 移除所有 click 事件
  isPreviewAllLayer.value = false;
  pointStatus.value = 0;
  activeToolStatus.value = 0;
  stage.container().style.cursor = "default";
  isEditLayer = false;
  if (curShowLayerIndex.value === index) {
    curShowLayerIndex.value = null;
    allCicles.forEach((item, itemIndex) => {
      item.forEach(iccm => {
        iccm.setStroke("transparent");
      })
    })
    layer.batchDraw();//重绘
    line = null;
    circleList = [];
    pointsList = [];
  } else {
    curShowLayerIndex.value = index;
    allCicles.forEach((item, itemIndex) => {
      item.forEach(iccm => {
        if (itemIndex === curShowLayerIndex.value) {
          iccm.setStroke("red");
        }
        if (itemIndex !== curShowLayerIndex.value) {
          iccm.setStroke("transparent");
        }
      })
    });
    layer.batchDraw();//重绘
    line = allLines[curShowLayerIndex.value];
    circleList = allCicles[curShowLayerIndex.value];
    pointsList = [...allLayers.value[curShowLayerIndex.value]];
  }
}



const writePointAndline = (pointParam, scale, type, layerIndex) => {
  const point = {
    x: pointParam.x,
    y: pointParam.y,
  };
  pointsList.push(point);
  const circle = new Konva.Circle({
    x: point.x,
    y: point.y,
    stroke: type == 0 ? "transparent" : "red", // 设置边框颜色
    strokeWidth: 2 / scale, // 设置边框宽度
    radius: 5 / scale, // 确保缩放时点的大小不变
    fill: "transparent", // 确保没有填充色
    draggable: false,
    name: `circle-${layerIndex}`
  });
  layer.add(circle);
  circle.on('dragmove', updateCircleDragFn);
  circleList.push(circle);
  if (pointsList.length > 1) {
    if (line) {
      line.destroy(); // 先删除旧线
    }
    line = new Konva.Line({
      points: pointsList.flatMap(p => [p.x, p.y]), // 展开点数组为线段坐标
      stroke: "#06b025",
      strokeWidth: 2 / scale, // 线条宽度随缩放调整
      lineJoin: "round",
    });
    layer.add(line);
  }
}

// 获取mask  点
const getPointsFn = async () => {
  await window.electron.ipcRenderer.send("getImgDataPoints", { imgPath: curShowPngObj.filePath, isEdit: curShowPngObj.isEdit });
  window.electron.ipcRenderer.once("segwork-get-points", async (e, msg) => {
    if (msg.msgType === 'success') {
      allLines = [];
      allCicles = [];
      allLayers.value = [];
      let curCesallLayers = msg.data;
      if (!curCesallLayers.length) return;
      const scale = stage.scaleX();
      firstLayNum = curCesallLayers.length;
      curCesallLayers.forEach((item, layerIndex) => {
        pointsList = [];
        circleList = [];
        line = null;
        item.forEach(iuum => {
          let points = { x: iuum.x * imgFirstscale + imgsMiddleX, y: iuum.y * imgFirstscale + imgsMiddleY };
          writePointAndline(points, scale, 0, layerIndex)
        });
        allLines.push(line);
        allCicles.push(circleList);
        allLayers.value.push(pointsList);
      });
      await sleep(1000);
      let curArrs = allLayers.value.map(layer =>
        layer.map(({ x, y }) => ({
          x: Math.round(x),
          y: Math.round(y),
        }))
      );
      getPinkMask(curArrs);
      layer.batchDraw(); // 重新绘制
      pointsList = [];
      circleList = [];
      line = null;
    } else {
      ElMessage({
        message: '加载图像失败',
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    }
    globals.$store.state.isFullScreenLoading = false;
  })
}
</script>

<style lang="scss" scoped>
.no-select-params {
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.no-wrap-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.left-project-files {
  width: 250px;
  height: 100%;
  border-right: 1px solid #108085;

  ul {
    overflow: auto;
    height: calc(100% - 35px);
    width: 100%;

    .dir-files-item {
      height: 30px;
      width: 100%;
      border-bottom: 1px solid white;
      display: flex;
      align-items: center;
      cursor: pointer;
      @extend .no-wrap-text;
      @extend .no-select-params;
      background-color: #504f4f;

      &:hover {
        background-color: #1f1f1f;
      }

      .file-item-name {
        color: white;
        font-size: 14px;
      }
    }
  }
}

.right-seg-cas {
  box-shadow: var(--el-box-shadow-dark);
  width: calc(100% - 250px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background-color: rgb(120, 119, 119);
  background-color: #313131;
  color: white;

  .right-rect-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 250px);
    height: 100%;
    margin-left: 52px;
  }

  .right-seg-project-layer {
    height: 100%;
    width: 250px;
    // background-color: #ebeef5;
    border-left: 1px solid #108085;
  }
}

.set-tools-box {
  position: absolute;
  left: 250px;
  top: 15%;
  height: 70%;
  width: 50px;
  border-radius: 8px;
  background-color: rgba(102, 202, 194, 1);
  padding: 7px 2px;
}

.my-scale-box {
  width: 280px;
  height: 40px;
  padding: 0 8px 0 3px;
  position: absolute;
  left: 250px;
  bottom: 0;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 1);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: nowrap;

  span {
    display: inline-block;
    width: 110px;
  }

  .sliders-box {
    width: calc(100% - 110px);
    padding: 0 5px;
  }
}

.seg-icon-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: white;
  margin: 6px 3px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: #409eff;
  }
}

.seg-icon-base-three {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  margin: 6px 3px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}

.seg-icon-base-two {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: white;
  margin: 6px 3px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgb(210, 48, 48);
    color: white;
  }
}

.icon-seg-active {
  background-color: white;
  color: #409eff;
}

.icon-seg-active-two {
  background-color: rgb(210, 48, 48);
  color: white;
}

.arrowDefaut {
  font-size: 38px;
}

.dorDefaut {
  font-size: 32px;
}

.dorDefaut-add-point {
  font-size: 28px;
}

.arrow-dor-icon {
  font-size: 28px;
}

.tips-tab {
  position: relative;
  font-size: 14px;
  height: 35px;
  padding: 0 6px;
  color: white;
  border-bottom: 1px solid #108085;
  user-select: none;
  -webkit-user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @extend .no-wrap-text;
  @extend .no-select-params;
}

.layer-box {
  height: calc(100% - 35px);
  overflow-y: auto;
}

.item-layer-card {
  width: 92%;
  margin-left: 4%;
  margin-top: 12px;
  padding: 6px 8px !important;
  border-radius: 6px;
  background-color: white;
  color: black;
  @extend .no-wrap-text;
  @extend .no-select-params;

  &:hover {
    background-color: #67c23a;
  }

  .item-btn-box {
    margin: 4px 0;
    display: flex;
    justify-content: space-between;
  }
}

.layer-right-active {
  background-color: #67c23a;
  color: black;
}

.tooles-line-seg {
  width: 90%;
  margin: 10px 5% 10px;
  height: 1px;
  border-radius: 3px;
  border: 2px solid white;
}

.tools-finsh-icon-box {
  position: absolute;
  bottom: 0;
}

.right-arrow-tre {
  color: white;
}

.my-icon-dir {
  color: #ffd45c;
  margin: 0 3px;
}

.my-icon-png {
  color: rgb(242, 159, 187);
  margin: 0 5px;
}

.to-dele-fw {
  font-size: 12px;
  background-color: #737272;
  border-radius: 3px;
  padding: 3px 6px;
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>
