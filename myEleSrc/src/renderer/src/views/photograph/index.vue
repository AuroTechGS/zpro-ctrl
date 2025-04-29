<template>
  <div class="view-Page-two">
    <!-- 相机列表设置 left -->
    <div class="left-box-capture" ref="leftCaptureBox" @mousedown="onMouseDown">
      <div class="capture-list">
        <div class="tips-tab">
          相机列表
          <div
            style="height: 100%; line-height: 30px; font-weight: blob; margin-right: 7px"
            v-if="captureTreeData.length"
          >
            同步状态:
            <span v-show="!syncStatus" style="display: inline-block; color: red"
              >同步中
              <el-icon class="is-loading" style="vertical-align: middle">
                <Loading /> </el-icon
            ></span>
            <span v-show="syncStatus" style="display: inline-block; color: #07c160"
              >已同步</span
            >
          </div>
        </div>
        <div class="list-box">
          <li class="cam-list-title">
            <span class="cam-list-sort">序号</span>
            <span class="cam-list-ip">IP</span>
            <span class="cam-list-status">状态</span>
          </li>
          <ul class="cam-list-ul" data-simplebar>
            <li class="cam-list-item" v-for="(item, index) in captureTreeData">
              <span
                class="cam-list-sort"
                :class="[item.isConnect ? 'capture-name-Connected' : '']"
                >{{ index + 1 }}</span
              >
              <span
                class="cam-list-ip"
                :class="[item.isConnect ? 'capture-name-Connected' : '']"
                >{{ item.ipAddr }}</span
              >
              <span
                class="cam-list-status"
                :class="[item.isConnect ? 'capture-name-Connected' : '']"
                >{{ item.isConnect ? "在线" : "离线" }}</span
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- 相机配置 -->
      <div class="capture-config">
        <div class="tips-tab">参数配置</div>
        <!-- 奥比相机配置项 -->
        <div
          class="my-config-box"
          v-show="
            globals.$store.state.currentCaptureType === globals.$store.state.captureType_2
          "
        >
          <div class="config-item" style="margin-right: 4%">
            <span>编码方式:</span>
            <el-select
              v-model="encCodeValue"
              :teleported="false"
              placeholder="请选择编码方式"
              size="small"
              @change="encCodeChangeFn"
              style="width: 67%"
              class="config-select-in"
            >
              <el-option
                v-for="item in encCodeOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="config-item" style="margin-right: 4%">
            <span>分辨率:</span>
            <el-select
              v-model="resolutionCam"
              :teleported="false"
              placeholder="请选择分辨率"
              size="small"
              @change="alignModelChangeFn"
              style="width: 67%"
              class="config-select-in"
            >
              <el-option
                v-for="item in alignModelOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="config-item" style="margin-right: 4%">
            <span>帧率:</span>
            <el-select
              v-model="fpsValue"
              :teleported="false"
              placeholder="请选择帧率"
              @change="camFpsChangeFn"
              size="small"
              style="width: 67%"
              class="config-select-in"
            >
              <el-option
                v-for="item in fpsOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="config-item" style="margin-right: 4%">
            <span>码率:</span>
            <el-select
              v-model="bitrateValue"
              :teleported="false"
              placeholder="请选择码率"
              size="small"
              @change="camBitrateChangeFn"
              style="width: 67%"
            >
              <el-option
                v-for="item in bitrateOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="config-item" style="margin-right: 4%">
            <span>曝光模式:</span>
            <el-select
              v-model="aeModelValue"
              :teleported="false"
              placeholder="请选择曝光模式"
              @change="aeTypeChangeFn"
              size="small"
              style="width: 67%"
            >
              <el-option
                v-for="item in aeModelOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="config-item" style="margin-right: 4%">
            <span>快门速度:</span>
            <el-select
              v-model="shutterValue"
              :teleported="false"
              placeholder="请选择快门速度"
              @change="camShutterChangeFn"
              size="small"
              style="width: 67%"
            >
              <el-option
                v-for="item in shutterOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="config-item" style="margin-right: 4%">
            <span>ISO:</span>
            <el-select
              v-model="isoValue"
              :teleported="false"
              @change="camISOChangeFn"
              placeholder="请选择曝光增益"
              size="small"
              style="width: 67%"
            >
              <el-option
                v-for="item in isoOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <!-- 其他相机配置项 -->
        <div
          class="my-config-box"
          v-show="
            globals.$store.state.currentCaptureType === globals.$store.state.captureType_1
          "
        ></div>
      </div>
    </div>
    <!-- 预览UI -->
    <div
      class="capture-videos-box"
      ref="rightCaptGatherBox"
      style="width: calc(100% - 580px)"
      @mousedown="onMouseDown"
    >
      <!-- 拍摄预览 -->
      <div class="capture-shows">
        <div class="tips-tab">拍摄预览</div>
        <div class="show-images-box" ref="showImgBox">
          <ul v-show="!isBigShowVideos" data-simplebar>
            <li
              v-for="(item, index) in videosList"
              class="show-item-box"
              :style="{ width: `${minBoxHeight}px`, height: `${minBoxHeight}px` }"
              :key="index"
              @dblclick="bigShowCurData(item)"
            >
              <canvas :id="'video' + index"></canvas>
            </li>
          </ul>
          <!-- 中间靠右放大拍摄UI -->
          <div
            class="capture-big-show"
            v-show="isBigShowVideos"
            v-loading="bigShowLoading"
            element-loading-text="Loading..."
            element-loading-background="rgba(122, 122, 122, 0.3)"
          >
            <div
              class="tips-tab"
              style="border: none; background-color: #313131; width: 100%"
            >
              <div style="width: 80%; display: inline-block">
                {{ curBigShowVideosObj.camIp }}
              </div>
              <Minus class="nav-close" style="padding: 0 2px" @click="bigShowcloseFn()" />
            </div>
            <ArrowLeftBold
              class="left-arrow"
              :class="[leftArrowDis ? 'left-disable' : '']"
              @click="leftShowArrowFn()"
            />
            <ArrowRightBold
              class="right-arrow"
              :class="[rightArrowDis ? 'right-disable' : '']"
              @click="rightShowArrowFn()"
            />
            <div
              class="video-show-Box"
              :style="{ height: `${bigBoxHeight}px`, width: `${bigBoxHeight}px` }"
            >
              <canvas ref="bigShowVideo" id="bigShowVideo"></canvas>
            </div>
          </div>
        </div>
      </div>
      <!-- 属性 -->
      <div class="capture-attribute">
        <div class="tips-tab">操作</div>
        <div class="top-button-zpro">
          <div class="zpro-set-btn" @click="captureZ2proFindFn">搜索设备</div>
          <div class="zpro-set-btn" @click="z2proRebootFn">重启相机</div>
          <div class="zpro-set-btn" @click="z2proFormattfFn">格式化TF卡</div>
          <div class="zpro-set-btn" @click="testPhotoFn">拍照测试</div>
          <div class="duizhun-fuzhu-switch">
            <span style="margin-right: 5px">对准辅助线: </span>
            <el-switch
              v-model="axiesAlign"
              inline-prompt
              @change="axiesAlignChangeFn"
              active-text="开启"
              inactive-text="关闭"
            />
          </div>
        </div>
        <div class="config-item">
          <span class="config-time-title" style="width: 75px; padding-right: 5px"
            >拍摄时间:</span
          >
          <el-select
            v-model="gatherTimeValue"
            :teleported="false"
            placeholder="请选择拍摄时间"
            size="small"
            style="width: 150px"
            class="config-select-in"
            @change="timeSelectFn"
          >
            <el-option
              v-for="item in gatherTimeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="config-item">
          <span class="config-time-title" style="width: 75px; padding-right: 5px"
            >下载路径:</span
          >
          <span style="color: rgb(235.9, 245.3, 255); font-size: 14px">{{
            z2proConfigJSON.z2proDownPath
          }}</span>
          <span class="config-time-title reset-down-path" @click="resetDownPathFn"
            >设置</span
          >
        </div>
        <div class="config-item">
          <span class="config-time-title" style="width: 75px; padding-right: 5px"
            >TF卡空间:</span
          >
          <span style="color: #409eff; font-size: 14px">{{
            "未使用: " + tfInfo.free + "MB，"
          }}</span>
          <span style="color: #409eff; font-size: 14px">{{
            "总空间: " + tfInfo.all + "MB"
          }}</span>
        </div>

        <div style="display: flex; margin-top: 5px; justify-content: center">
          <!-- 拍摄按钮 -->
          <span class="ps-tip-text">已拍摄时长:</span>
          <span class="ps-tip-text">{{ curTextTimeRecord }}</span>
          <div
            v-show="!isGather"
            class="starts-base start-Open"
            @click="setGatherStatusFn()"
          >
            开始拍摄
          </div>
          <div
            v-show="isGather"
            class="starts-base start-Open-two"
            @click="stopCapture()"
          >
            停止拍摄
          </div>
          <span class="ps-tip-text">剩余拍摄时长:</span>
          <div
            class="time-drop-gather"
            :class="[!isGather ? 'time-drop-gather' : 'time-drop-gather-two']"
          >
            {{ curTextTime }}
          </div>
        </div>
      </div>
    </div>
    <!-- 文件ui -->
    <div class="capture-files-box">
      <div class="tips-tab">项目文件</div>
      <div class="my-files-box">
        <li class="files-title">
          <span class="file-item-name">文件名称</span>
          <span class="file-item-time">拍摄时长</span>
          <span class="file-item-status">下载状态</span>
        </li>
        <!-- data-simplebar-auto-hide="false" -->
        <ul class="files-ul" data-simplebar v-show="filesList.length">
          <li
            class="files-item"
            v-for="(item, index) in filesList"
            @dblclick="openCurFile(item)"
            :key="index"
            @contextmenu.prevent="openMenuFn(item, $event)"
            :class="[item.fileName === projectFileObj.fileName ? 'menu-show-native' : '']"
          >
            <span class="file-item-name">{{ item.fileName }}</span>
            <span class="file-item-time">{{ item.shootTime }}</span>
            <span class="file-item-status">{{ item.downStatus }}</span>
          </li>
        </ul>
        <div v-show="!filesList.length" class="no-videoData-box">
          <span>暂无数据</span>
        </div>
      </div>
    </div>
    <div
      class="capture-set-item-menu"
      :style="{
        top: `${camItemMenusTop}px`,
        left: `${camItemMenusLeft}px`,
      }"
      v-show="camItemMenusShow"
    >
      <div @click="reDownLoadFn()">重新下载</div>
      <div @click="projectRmFn()">删除</div>
      <p>大小：{{ projectFileObj.fileSize + "MB" }}</p>
    </div>
  </div>
</template>

<script setup>
import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar";
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  computed,
  nextTick,
  onUnmounted,
} from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { sleep } from "../../assets/js/untils";
import moment from "moment";
const globals = getCurrentInstance().appContext.config.globalProperties;

let leftWidth = ref(285);
let rightCaptGatherBox = ref(null);
let leftCaptureBox = ref(null);
let showImgBox = ref(null);

let resolutionCam = ref(3);
let fpsValue = ref(25);
let bitrateValue = ref(50);
let gatherTimeValue = ref(10000);

let curOnceGatherTime = ref(0);
let curHasShootTime = ref(0);

let curBigShowVideosObj = reactive({});
let isBigShowVideos = ref(false);
let isOpenProcessDialog = ref(false);
let camItemMenusShow = ref(false);

let projectFileObj = reactive({});

let startCaptNum = ref(0);
let tfInfo = reactive({
  free: 0,
  all: 0,
});

let encCodeValue = ref(2);

let encCodeOpts = reactive([
  { label: "h264", value: 1 },
  { label: "h265", value: 2 },
]);

let alignModelOpts = reactive([
  { label: "2k", value: 2 },
  { label: "4k", value: 3 },
]);

let leftArrowDis = ref(false);
let rightArrowDis = ref(false);

let videosList = ref([]);

let filesList = ref([]);

let isGather = ref(false);

let z2proConfigJSON = reactive({});

// 相机列表
let captureTreeData = ref([]);

let timerPro = null;

let myTimers = null;
let fpsOpts = reactive([
  { label: "25", value: 25 },
  { label: "50", value: 50 },
]);

// 深度图尺寸配置
let bitrateOpts = reactive([
  { label: "20(Mbps)", value: 20 },
  { label: "30(Mbps)", value: 30 },
  { label: "40(Mbps)", value: 40 },
  { label: "50(Mbps)", value: 50 },
  { label: "60(Mbps)", value: 60 },
  { label: "70(Mbps)", value: 70 },
  { label: "80(Mbps)", value: 80 },
  { label: "90(Mbps)", value: 90 },
  { label: "100(Mbps)", value: 100 },
  { label: "120(Mbps)", value: 120 },
  { label: "140(Mbps)", value: 140 },
  { label: "160(Mbps)", value: 160 },
  { label: "180(Mbps)", value: 180 },
  { label: "200(Mbps)", value: 200 },
]);

let aeModelOpts = reactive([
  { label: "自动", value: 1 },
  { label: "手动", value: 2 },
]);

let aeModelValue = ref(2);
let shutterValue = ref(75);
let isoValue = ref(100);

let axiesAlign = ref(false);

let shutterOpts = reactive([
  { label: "1/25", value: 25 },
  { label: "1/30", value: 30 },
  { label: "1/50", value: 50 },
  { label: "1/60", value: 50 },
  { label: "1/75", value: 75 },
  { label: "1/100", value: 100 },
  { label: "1/120", value: 120 },
  { label: "1/150", value: 150 },
  { label: "1/180", value: 180 },
  { label: "1/200", value: 200 },
  { label: "1/300", value: 300 },
  { label: "1/400", value: 400 },
  { label: "1/500", value: 500 },
  { label: "1/600", value: 600 },
  { label: "1/700", value: 700 },
  { label: "1/800", value: 800 },
  { label: "1/900", value: 900 },
  { label: "1/1000", value: 1000 },
]);

let isoOpts = reactive([
  { label: "100", value: 100 },
  { label: "200", value: 200 },
  { label: "400", value: 400 },
  { label: "600", value: 600 },
  { label: "800", value: 800 },
  { label: "1000", value: 1000 },
  { label: "1200", value: 1200 },
  { label: "1400", value: 1400 },
  { label: "1600", value: 1600 },
  { label: "1800", value: 1800 },
  { label: "2000", value: 2000 },
  { label: "2500", value: 2500 },
  { label: "3200", value: 3200 },
  { label: "6400", value: 6400 },
]);

let bigShowLoading = ref(false);

let onLineCamList = [];

// canvas 存储器
let canvasAllList = [];
let canvasTwo = null;
let ctxTwo = null;

// 右下角同步提示dom
let syncTips = null;

// 获取同步状态定时器
let camSyncTimer = null;
// 同步状态
let syncStatus = ref(false);

onMounted(async () => {
  initDomHeight();
  timeSelectFn();
  window.addEventListener("resize", initDomHeight);
  document.addEventListener("click", clickHandler);
  connectCaptureConfig();
  window.electron.ipcRenderer.on("down-video-process", (event, message) => {
    console.log("down-video-process", message);
    let curOnlineCamNum = captureTreeData.value.filter((item) => item.isConnect).length;
    let stepProcess = 100 / curOnlineCamNum;
    if (message.msgType === "success" && curOnlineCamNum > 0) {
      filesList.value.forEach((item) => {
        if (item.filePath === message.msg.downPath) {
          if (message.msg.downNum === curOnlineCamNum) {
            item.downStatus = "100%";
            window.electron.ipcRenderer.send("downVideoAllSuccess", {
              downDownFull: true,
              filePath: item.filePath,
            });
          } else {
            item.downStatus =
              (Number(stepProcess) * message.msg.downNum).toFixed(2) + "%";
          }
        }
      });
    }
  });
  window.electron.ipcRenderer.on("rtsp-close-cam", (event, message) => {
    if (message.camIp) {
      ElMessage({
        message: `${message.camIp} 相机已断开连接，请检查该相机连接状况`,
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
      let canvasIndex = videosList.value.findIndex((item) => item.camIp == message.camIp);
      videosList.value.splice(canvasIndex, 1);
      let camIndex = captureTreeData.value.findIndex(
        (item) => item.ipAddr == message.camIp
      );
      captureTreeData.value.splice(camIndex, 1);
    }
  });
});

const clickHandler = () => {
  camItemMenusShow.value = false;
};

onUnmounted(() => {
  window.removeEventListener("resize", initDomHeight);
  document.removeEventListener("click", clickHandler);
});

// 项目文件右键
const openMenuFn = (item, event) => {
  for (let key in item) {
    projectFileObj[key] = item[key];
  }
  camItemMenusShow.value = true;
  camItemMenusLeft.value =
    window.innerWidth <= event.clientX + 125
      ? window.innerWidth - 110 - (window.innerWidth - event.clientX)
      : event.clientX + 5;
  camItemMenusTop.value =
    window.innerHeight <= event.clientY + 80 ? event.clientY - 110 : event.clientY - 35;
};

//  更新右侧项目文件列表
const getFileListFn = async (e) => {
  let ress = await window.electron.ipcRenderer.invoke("getVideofilesApi", e);
  if (ress.msgType === "success") {
    ress.data.sort((a, b) => {
      return Date.parse(b.fileCreatedTime) - Date.parse(a.fileCreatedTime);
    });
    filesList.value = ress.data;
  }
};

const updataConfigJsonfn = async () => {
  let eleDataCapListMgs = await window.electron.ipcRenderer.invoke("readCaptureJsonCon");
  if (!eleDataCapListMgs.message) {
    ElMessage({
      message: "请检查相机配置文件, 是否存在",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
    globals.$store.state.isFullScreenLoading = false;
    return;
  }
  for (let key in eleDataCapListMgs.data) {
    z2proConfigJSON[key] = eleDataCapListMgs.data[key];
  }
};

const testPhotoFn = () => {
  window.electron.ipcRenderer.send(
    "z2progetSnapPhotoApi",
    captureTreeData.value.map((item) => item.ipAddr)
  );
};

const getCamSyncStatus = () => {
  camSyncTimer = setInterval(() => {
    window.electron.ipcRenderer.send("getZ2proSyncStatusApi");
  }, 1000 * 8);
  window.electron.ipcRenderer.on("worker-sync-status", (event, message) => {
    if (message.msgType === "success") {
      if (message.data === 1) {
        syncStatus.value = true;
        syncTips.close();
        syncTips = null;
        window.electron.ipcRenderer.removeAllListeners("worker-sync-status");
        if (camSyncTimer) {
          clearInterval(camSyncTimer);
        }
      }
    }
  });
};

// 重新下载失败文件
const reDownLoadFn = () => {
  if (!projectFileObj.filePath) return;
  if (!captureTreeData.value.length) {
    return ElMessage({
      message: "没有连接到相机，不可进行此操作",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
  let onlineCams = captureTreeData.value.filter((itcm) => itcm.isConnect);
  if (!onlineCams.length) {
    return ElMessage({
      message: "相机在线数量为0，不可进行此操作",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
  let obj = {};
  for (let key in projectFileObj) {
    obj[key] = projectFileObj[key];
  }
  window.electron.ipcRenderer.send("reDownProjectFilesApi", {
    lastProjectObj: obj,
    ipValList: onlineCams.map((item) => item.ipAddr),
  });
};

// 删除选择项目文件
const projectRmFn = () => {
  if (!projectFileObj.filePath) return;
  globals
    .$confirm("请再次确认是否删除选中项目？数据一经删除无法恢复，请您谨慎操作", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(() => {
      globals.$store.state.fullScreenloadingText = "项目正在删除中，请稍等...";
      globals.$store.state.isFullScreenLoading = true;

      let obj = {
        rmPath: projectFileObj.filePath,
      };
      window.electron.ipcRenderer.send("rmProjectFilesApi", obj);
      window.electron.ipcRenderer.once("project-rm-back", async (e, msg) => {
        globals.$store.state.isFullScreenLoading = false;
        await sleep(1000);
        if (msg.msgType === "success") {
          ElMessage({
            message: "删除成功",
            type: "success",
            grouping: true,
            plain: true,
            showClose: true,
            offset: 75,
          });
        } else {
          ElMessage({
            message: "删除失败，请重试",
            type: "error",
            grouping: true,
            plain: true,
            showClose: true,
            offset: 75,
          });
        }
        getFileListFn(z2proConfigJSON.z2proDownPath);
      });
    })
    .catch(() => {
      ElMessage({
        message: "已取消",
        type: "info",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    });
};

// 获取tf卡信息
const getTFInfoFn = () => {
  window.electron.ipcRenderer.send("getZ2protfInfoApi");
  window.electron.ipcRenderer.once("worker-tf-info", (event, message) => {
    if (message.msgType === "success") {
      tfInfo.free = message.data.camSpacefree;
      tfInfo.all = message.data.amSpaceAll;
    }
  });
};

let minBoxHeight = ref(0);
let bigBoxHeight = ref(0);

const initDomHeight = () => {
  nextTick(() => {
    minBoxHeight.value =
      Number((showImgBox.value.getBoundingClientRect().height / 4).toFixed(2)) - 8;
    bigBoxHeight.value = Number(showImgBox.value.getBoundingClientRect().height - 30);
  });
};

// z2proRebootFn 重启相机
const z2proRebootFn = async () => {
  globals.$store.state.fullScreenloadingText = "相机重启中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;
  isBigShowVideos.value = false;
  syncStatus.value = true;
  if (syncTips) {
    syncTips.close();
    syncTips = null;
  }
  if (camSyncTimer) {
    clearInterval(camSyncTimer);
  }
  if (captureTreeData.value.length) {
    captureTreeData.value.forEach((item) => {
      window.electron.ipcRenderer.removeAllListeners(`rtsp-message-${item.ipAddr}`);
    });
  }
  captureTreeData.value = [];
  videosList.value = [];
  canvasAllList = [];
  await window.electron.ipcRenderer.invoke("stopZ2proAllRtspApi");
  await window.electron.ipcRenderer.send("z2proRebootApi");
  window.electron.ipcRenderer.once("worker-reboot", async (event, message) => {
    if (message.msgType === "error") {
      ElMessage({
        message: "操作失败",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
      globals.$store.state.isFullScreenLoading = false;
      return;
    } else {
      globals.$store.state.fullScreenloadingText = "相机重启中，请稍等...";
      await sleep(10000);
      globals.$store.state.fullScreenloadingText = "已重启成功,相机搜索中，请稍等...";
      initZ2proDataAndCamzList();
    }
  });
};

// 点击相机配置
const connectCaptureConfig = async () => {
  if (globals.$store.state.currentCaptureType === globals.$store.state.captureType_2) {
    globals.$store.state.fullScreenloadingText = "相机搜索中，请稍等...";
    globals.$store.state.isFullScreenLoading = true;
    globals.$store.state.currentCaptureType = globals.$store.state.captureType_2;
    initZ2proDataAndCamzList();
  }
};

// z2pro
const initZ2proDataAndCamzList = async () => {
  let eleDataCapListMgs = await window.electron.ipcRenderer.invoke("readCaptureJsonCon");
  if (!eleDataCapListMgs.message) {
    ElMessage({
      message: "请检查相机配置文件, 是否存在",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
    globals.$store.state.isFullScreenLoading = false;
    return;
  }
  for (let key in eleDataCapListMgs.data) {
    z2proConfigJSON[key] = eleDataCapListMgs.data[key];
  }
  captureTreeData.value = [];
  getFileListFn(z2proConfigJSON.z2proDownPath);
  await window.electron.ipcRenderer.send("z2proInitEleApi", {
    ipAddr: z2proConfigJSON.ipAddr,
    camNum: z2proConfigJSON.camNum,
  });
  window.electron.ipcRenderer.once("worker-message", (event, message) => {
    if (message.msgType === "error") {
      ElMessage({
        message: "请检查相机连接是否正常",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
      globals.$store.state.isFullScreenLoading = false;
      return;
    }
    if (message.msgType === "success" && message.data.camList.length === 0) {
      ElMessage({
        message: "相机已初始化,检测到相机数量为0,请检查相机连接是否正常",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
      globals.$store.state.isFullScreenLoading = false;
      return;
    }
    if (message.msgType === "success" && message.data.camList.length > 0) {
      message.data.camList.forEach((item, index) => {
        (item.sort = index + 1),
          (item.isConnect = item.onlineStatus === 1 ? true : false);
      });
      resolutionCam.value = message.data.camInfo.resolution; // 分辨率
      fpsValue.value = message.data.camInfo.fps; // 帧率
      bitrateValue.value = message.data.camInfo.bitrate; // 码率
      shutterValue.value = message.data.camInfo.shutter; // 快门速度
      aeModelValue.value = message.data.camInfo.aeMode; // 曝光模式
      encCodeValue.value = message.data.camInfo.encType; // 编码格式
      isoValue.value = message.data.camInfo.iso; // 曝光增益

      captureTreeData.value = message.data.camList;
      onLineCamList = message.data.camList.filter((item) => item.onlineStatus === 1);
      globals.$store.state.isFullScreenLoading = false;
      getTFInfoFn(); // 获取TF卡信息
      startZ2proCapture(); // 开始预览
    }
  });
};
let showBox = [];
// 预览
const startZ2proCapture = async () => {
  if (!captureTreeData.value.length) return;
  let onlineCam = captureTreeData.value.filter((item) => item.isConnect);
  if (!onlineCam.length) return;
  syncStatus.value = false;
  if (syncTips) {
    syncTips.close();
    syncTips = null;
  }
  syncTips = ElNotification.error({
    title: "警告",
    message: "相机同步中，预计1-5分钟, 未同步不可拍摄，以相机列表右上角同步状态为准",
    position: "bottom-right",
    offset: 19,
    duration: 0,
  });
  getCamSyncStatus();
  let arr = onlineCam.map((item) => item.ipAddr);
  let res = await window.electron.ipcRenderer.invoke("startZ2proCaptureApi", arr);
  videosList.value = [];
  onlineCam.forEach((item) => {
    videosList.value.push({
      camIp: item.ipAddr,
      sort: item.sort,
      status: item.onlineStatus,
    });
    showBox.push(null);
  });
  if (res.msgType === "success") {
    arr.forEach((item, index) => {
      window.electron.ipcRenderer.on(`rtsp-message-${item}`, (event, message) => {
        for (let i = 0; i < videosList.value.length; i++) {
          if (message.camIp === videosList.value[i].camIp) {
            const blob = new Blob([message.data], { type: "image/jpeg" });
            if (isBigShowVideos.value) {
              bigShowLoading.value = false;
              updateSingleVideoStream(blob);
            } else {
              updateVideoStream(i, blob);
            }
            break;
          }
        }
      });
    });
  }
};

const captureZ2proFindFn = async () => {
  globals.$store.state.fullScreenloadingText = "相机检索中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;
  isBigShowVideos.value = false;
  if (captureTreeData.value.length) {
    captureTreeData.value.forEach((item) => {
      window.electron.ipcRenderer.removeAllListeners(`rtsp-message-${item.ipAddr}`);
    });
  }
  await window.electron.ipcRenderer.invoke("stopZ2proAllRtspApi");
  if (z2proConfigJSON) {
    window.electron.ipcRenderer.send("z2proRefindEleApi", {
      ipAddr: z2proConfigJSON.ipAddr,
      camNum: z2proConfigJSON.camNum,
    });
    window.electron.ipcRenderer.once("worker-refind", (event, message) => {
      if (message.msgType === "error") {
        ElMessage({
          message: "请检查相机连接是否正常",
          type: "error",
          grouping: true,
          plain: true,
          showClose: true,
          offset: 75,
        });
        globals.$store.state.isFullScreenLoading = false;
        return;
      }
      if (message.msgType === "success" && message.data.camList.length === 0) {
        ElMessage({
          message: "相机已初始化,检测到相机数量为0,请检查相机连接是否正常",
          type: "error",
          grouping: true,
          plain: true,
          showClose: true,
          offset: 75,
        });
        globals.$store.state.isFullScreenLoading = false;
        return;
      }
      if (message.msgType === "success" && message.data.camList.length > 0) {
        message.data.camList.forEach((item, index) => {
          (item.sort = index + 1),
            (item.isConnect = item.onlineStatus === 1 ? true : false);
        });
        resolutionCam.value = message.data.camInfo.resolution; // 分辨率
        fpsValue.value = message.data.camInfo.fps; // 帧率
        bitrateValue.value = message.data.camInfo.bitrate; // 码率
        shutterValue.value = message.data.camInfo.shutter; // 快门速度
        aeModelValue.value = message.data.camInfo.aeMode; // 曝光模式
        encCodeValue.value = message.data.camInfo.encType; // 编码格式
        isoValue.value = message.data.camInfo.iso; // 曝光增益
        captureTreeData.value = message.data.camList;
        onLineCamList = message.data.camList.filter((item) => item.onlineStatus === 1);
        globals.$store.state.isFullScreenLoading = false;
        startZ2proCapture();
      }
    });
  } else {
    globals.$store.state.isFullScreenLoading = false;
  }
};

const z2proFormattfFn = async () => {
  if (!captureTreeData.value.length) {
    return ElMessage({
      message: "相机连接数量为0， 不可进行此操作",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
  let onLineCams = captureTreeData.value.filter((item) => item.isConnect);
  if (!onLineCams.length) {
    return ElMessage({
      message: "相机在线数量为0， 不可进行此操作",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
  globals
    .$confirm(
      "请再次确认是否格式化相机TF卡？相机一经格式化后，原有未下载本地数据无法恢复，请您谨慎操作",
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
    .then(async () => {
      globals.$store.state.fullScreenloadingText = "TF 格式化中，请稍等...";
      globals.$store.state.isFullScreenLoading = true;
      await window.electron.ipcRenderer.send("z2proFormattfApi");
      window.electron.ipcRenderer.once("worker-format", (event, message) => {
        globals.$store.state.isFullScreenLoading = false;
        if (message.sgType === "success") {
          ElMessage({
            message: "TF格式化成功",
            type: "success",
            grouping: true,
            plain: true,
            showClose: true,
            offset: 75,
          });
        } else {
          ElMessage({
            message: "TF 格式化失败",
            type: "error",
            grouping: true,
            plain: true,
            showClose: true,
            offset: 75,
          });
        }
      });
      getTFInfoFn();
    })
    .catch(() => {
      ElMessage({
        message: "删除失败，请重试",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    });
};

// 下载最后一次拍摄视频
const downLoadsVideo = async (pathInfo) => {
  let arr = captureTreeData.value.filter((item) => item.isConnect);
  await window.electron.ipcRenderer.send("z2proDownMp4EleApi", {
    camList: arr.map((item) => item.ipAddr),
    pathInfo: pathInfo,
    downPath: z2proConfigJSON.z2proDownPath,
  });
  window.electron.ipcRenderer.once("down-video-mkdir", (event, message) => {
    if (message.msgType === "success") {
      let pathName = message.msg.split("\\");
      let cfileName = pathName[pathName.length - 1];
      filesList.value.unshift({
        fileName: cfileName,
        filePath: message.msg,
        fileCreatedTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        shootTime: pathInfo.formatTime,
        downStatus: "0.00%",
      });
    }
  });
};
// 设置编码方式
const encCodeChangeFn = async (val) => {
  if (val === z2proConfigJSON.necType) return;
  globals.$store.state.fullScreenloadingText = "录像编码设置中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;
  await window.electron.ipcRenderer.send("setEncTypeApi", val);
  window.electron.ipcRenderer.once("worker-enc", async (event, message) => {
    globals.$store.state.isFullScreenLoading = false;
    await sleep(1000);
    if (message.msgType === "success") {
      z2proConfigJSON.necType = val;
      ElMessage({
        message: "操作成功",
        type: "success",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    } else {
      encCodeValue.value = z2proConfigJSON.necType;
      ElMessage({
        message: "设置失败, 请稍等15秒后再重试",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    }
  });
};

// 设置分辨率 change
const alignModelChangeFn = async (val) => {
  if (val === z2proConfigJSON.resolutionCam) return;
  globals.$store.state.fullScreenloadingText = "相机分辨率设置中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;
  await window.electron.ipcRenderer.send("setCamResolutonApi", val);
  window.electron.ipcRenderer.once("worker-resoluton", async (event, message) => {
    globals.$store.state.isFullScreenLoading = false;
    await sleep(1000);
    if (message.msgType === "success") {
      z2proConfigJSON.resolutionCam = val;
      ElMessage({
        message: "操作成功",
        type: "success",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    } else {
      resolutionCam.value = z2proConfigJSON.resolutionCam;
      ElMessage({
        message: "设置失败, 请稍等15秒后再重试",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    }
  });
};

// 曝光模式
const aeTypeChangeFn = async (val) => {
  if (val === z2proConfigJSON.aeMode) return;
  await window.electron.ipcRenderer.send("setCamAeModelApi", val);
  window.electron.ipcRenderer.once("worker-aemode", async (event, message) => {
    if (message.msgType === "success") {
      z2proConfigJSON.aeMode = val;
    } else {
      aeModelValue.value = z2proConfigJSON.aeMode;
      ElMessage({
        message: "设置失败, 请稍等15秒后再重试",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    }
  });
};

//  设置帧率  change
const camFpsChangeFn = async (val) => {
  if (val === z2proConfigJSON.fpsValue) return;
  globals.$store.state.fullScreenloadingText = "相机帧率设置中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;
  await window.electron.ipcRenderer.send("setCamFpsApi", val);
  window.electron.ipcRenderer.once("worker-fps", async (event, message) => {
    globals.$store.state.isFullScreenLoading = false;
    await sleep(1000);
    if (message.msgType === "success") {
      z2proConfigJSON.fps = val;
      ElMessage({
        message: "操作成功",
        type: "success",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    } else {
      fpsValue.value = z2proConfigJSON.fps;
      ElMessage({
        message: "设置失败, 请稍等15秒后再重试",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    }
  });
};
// 设置码率 change
const camBitrateChangeFn = async (val) => {
  if (val === z2proConfigJSON.bitrate) return;
  globals.$store.state.fullScreenloadingText = "相机帧率设置中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;
  await window.electron.ipcRenderer.send("setCamBitRateApi", val);
  window.electron.ipcRenderer.once("worker-bitrate", async (event, message) => {
    globals.$store.state.isFullScreenLoading = false;
    await sleep(1000);
    if (message.msgType === "success") {
      z2proConfigJSON.bitrate = val;
      ElMessage({
        message: "操作成功",
        type: "success",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    } else {
      bitrateValue.value = z2proConfigJSON.bitrate;
      ElMessage({
        message: "设置失败, 请稍等15秒后再重试",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    }
  });
};
// 快门速度
const camShutterChangeFn = async (val) => {
  if (val === z2proConfigJSON.shutter) return;
  await window.electron.ipcRenderer.send("setCamShutterApi", val);
  window.electron.ipcRenderer.once("worker-shutter", async (event, message) => {
    if (message.msgType === "success") {
      z2proConfigJSON.shutter = val;
    } else {
      shutterValue.value = z2proConfigJSON.shutter;
      ElMessage({
        message: "设置失败, 请稍等15秒后再重试",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    }
  });
};

// ISO
const camISOChangeFn = async (val) => {
  if (val === z2proConfigJSON.ISOValue) return;
  await window.electron.ipcRenderer.send("setCamISOApi", val);
  window.electron.ipcRenderer.once("worker-iso", async (event, message) => {
    if (message.msgType === "success") {
      z2proConfigJSON.ISOValue = val;
      ElMessage({
        message: "操作成功",
        type: "success",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    } else {
      isoValue.value = z2proConfigJSON.ISOValue;
      ElMessage({
        message: "设置失败, 请稍等15秒后再重试",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
    }
  });
};

// 防止默认的拖动行为
const onMouseDown = (event) => {
  event.preventDefault();
};

// 计算相机表单中 操作栏宽度
const captureTableSetWidth = computed(() => {
  if (leftWidth.value <= 160) {
    return 70;
  } else {
    return 110;
  }
});

//  所有预览
const updateVideoStream = async (index, blob) => {
  if (!canvasAllList[index]) {
    const canvas = document.getElementById("video" + index);
    canvasAllList[index] = {
      box: canvas,
      ctx: canvas.getContext("2d"),
    };
  }
  try {
    // 创建新的 ImageBitmap
    let imageBitmapAll = await createImageBitmap(blob);
    let dx, dy, dw, dh, imgRatio, canvasRatio;
    canvasRatio = canvasAllList[index].box.width / canvasAllList[index].box.height;
    imgRatio = imageBitmapAll.width / imageBitmapAll.height;
    if (imgRatio <= canvasRatio) {
      dw = imgRatio * canvasAllList[index].box.width;
      dh = canvasAllList[index].box.height;
      dx = (canvasAllList[index].box.width - dw) / 2;
      dy = 0;
    } else {
      dw = canvasAllList[index].box.width;
      dh = dw / imgRatio;
      dx = 0;
      dy = (canvasAllList[index].box.height - dh) / 2;
    }
    requestAnimationFrame(() => {
      canvasAllList[index].ctx.drawImage(imageBitmapAll, dx, dy, dw, dh);
    });
  } catch (error) {}
};

let imageBitmap = null;
// 单个预览渲染
const updateSingleVideoStream = async (blob) => {
  try {
    let dx, dy, dw, dh, imgRatio, canvasRatio;
    canvasRatio = canvasTwo.width / canvasTwo.height;
    imageBitmap = await createImageBitmap(blob);
    imgRatio = imageBitmap.width / imageBitmap.height;
    if (imgRatio <= canvasRatio) {
      dw = imgRatio * canvasTwo.width;
      dh = canvasTwo.height;
      dx = (canvasTwo.width - dw) / 2;
      dy = 0;
    } else {
      dw = canvasTwo.width;
      dh = dw / imgRatio;
      dx = 0;
      dy = (canvasTwo.height - dh) / 2;
    }
    requestAnimationFrame(() => {
      ctxTwo.drawImage(imageBitmap, dx, dy, dw, dh);
      if (axiesAlign.value) {
        ctxTwo.strokeStyle = "#ff0000";
        ctxTwo.lineWidth = 2;
        ctxTwo.strokeRect(dx + dw / 4, dy + dh / 4, dw / 2, dh / 2);
        console;
        ctxTwo.beginPath();
        ctxTwo.moveTo(dx + dw / 2, dy);
        ctxTwo.lineTo(dx + dw / 2, dh);
        ctxTwo.stroke();

        ctxTwo.beginPath();
        ctxTwo.moveTo(dx, dh / 2);
        ctxTwo.lineTo(dx + dw, dh / 2);
        ctxTwo.stroke();
      }
    });
  } catch (error) {}
};

const axiesAlignChangeFn = (val) => {
  if (isBigShowVideos.value === false) {
    return ElMessage({
      message: "只在单个相机预览时有效",
      type: "warning",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
};

// 格式化剩余时间并显示
const curTextTime = computed(() => {
  if (curOnceGatherTime.value === 0) {
    return "00 : 00 : 00";
  } else {
    let hours = Math.floor(curOnceGatherTime.value / 3600000);
    let minutes = Math.floor((curOnceGatherTime.value % 3600000) / 60000);
    let seconds = Math.floor((curOnceGatherTime.value % 60000) / 1000);
    return (
      (hours < 10 ? "0" + hours : hours) +
      " : " +
      (minutes < 10 ? "0" + minutes : minutes) +
      " : " +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }
});
// 格式化已录制时间
const curTextTimeRecord = computed(() => {
  if (curHasShootTime.value === 0) {
    return "00 : 00 : 00";
  } else {
    let hours = Math.floor(curHasShootTime.value / 3600000);
    let minutes = Math.floor((curHasShootTime.value % 3600000) / 60000);
    let seconds = Math.floor((curHasShootTime.value % 60000) / 1000);
    return (
      (hours < 10 ? "0" + hours : hours) +
      " : " +
      (minutes < 10 ? "0" + minutes : minutes) +
      " : " +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }
});

// 上一个相机预览
const leftShowArrowFn = () => {
  rightArrowDis.value = false;
  let onlineCamArr = captureTreeData.value.filter((item) => item.isConnect);
  if (onlineCamArr.length) {
    let lastObj = {};
    if (curBigShowVideosObj.camIp === onlineCamArr[0].ipAddr) {
      return;
    }
    for (let i = 0; i < onlineCamArr.length; i++) {
      if (onlineCamArr[i].ipAddr === curBigShowVideosObj.camIp) {
        lastObj = {
          camIp: onlineCamArr[i - 1].ipAddr,
          status: onlineCamArr[i - 1].onlineStatus,
          sort: onlineCamArr[i - 1].sort,
        };
        if (i - 1 === 0) {
          leftArrowDis.value = true;
        }
        break;
      }
    }
    bigShowCurData(lastObj);
  }
};

// 下一个相机预览
const rightShowArrowFn = () => {
  leftArrowDis.value = false;
  let onlineCamArr = captureTreeData.value.filter((item) => item.isConnect);
  if (onlineCamArr.length) {
    let lastObj = {};
    if (curBigShowVideosObj.camIp === onlineCamArr[onlineCamArr.length - 1].ipAddr) {
      return;
    }

    for (let i = 0; i < onlineCamArr.length; i++) {
      if (onlineCamArr[i].ipAddr === curBigShowVideosObj.camIp) {
        lastObj = {
          camIp: onlineCamArr[i + 1].ipAddr,

          status: onlineCamArr[i + 1].onlineStatus,
          sort: onlineCamArr[i + 1].sort,
        };
        if (i + 1 === onlineCamArr.length - 1) {
          rightArrowDis.value = true;
        }
        break;
      }
    }
    bigShowCurData(lastObj);
  }
};

// 双击显示最大图
const bigShowCurData = async (item) => {
  let stopAllShow = await window.electron.ipcRenderer.invoke("stopZ2proAllRtspApi");
  isBigShowVideos.value = true;
  if (canvasTwo) {
    ctxTwo.clearRect(0, 0, canvasTwo.width, canvasTwo.height); // 清空画布
  }
  if (stopAllShow.msgType === "success") {
    await sleep(100);
    if (canvasTwo === null) {
      canvasTwo = document.getElementById("bigShowVideo");
      ctxTwo = canvasTwo.getContext("2d");
      canvasTwo.width = 1280;
      canvasTwo.height = 1280;
    }
    if (canvasTwo) {
      ctxTwo.clearRect(0, 0, canvasTwo.width, canvasTwo.height); // 清空画布
    }
    bigShowLoading.value = true;

    if (item.sort === 1) {
      leftArrowDis.value = true;
    }
    let onlineArr = captureTreeData.value.filter((itcm) => itcm.isConnect);
    if (item.sort === onlineArr.length) {
      rightArrowDis.value = true;
    }
    for (let key in item) {
      curBigShowVideosObj[key] = item[key];
    }
    await window.electron.ipcRenderer.invoke(
      "startZ2proSingleCam",
      curBigShowVideosObj.camIp
    );
  } else {
    ElMessage({
      message: "操作失败",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
};

//  关闭最大显示

const bigShowcloseFn = async () => {
  isBigShowVideos.value = false;
  if (!captureTreeData.value.length) return;
  let onlineCam = captureTreeData.value.filter((item) => item.isConnect);
  if (!onlineCam.length) return;
  let arr = onlineCam.map((item) => item.ipAddr);
  let res = await window.electron.ipcRenderer.invoke("startZ2proCaptureApi", arr);
};

// zpro开始拍摄事件
const setGatherStatusFn = async () => {
  if (!syncStatus) {
    return ElMessage({
      message: "相机未同步，不容许拍摄，请等待同步后再拍摄",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
  isGather.value = true;
  let isExistOpenCapture = captureTreeData.value.filter((item) => item.isConnect);
  if (!isExistOpenCapture.length) {
    ElMessage({
      message: "请先确认在线相机数量至少为一台",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
    isGather.value = false;
    return;
  }
  await window.electron.ipcRenderer.send("z2proStartShootApi");
  window.electron.ipcRenderer.once("worker-startShoot", (err, message) => {
    if (message.msgType === "success") {
      myTimers = setInterval(() => {
        if (curOnceGatherTime.value > 0) {
          curOnceGatherTime.value = curOnceGatherTime.value - 1000;
          curHasShootTime.value = curHasShootTime.value + 1000;
        } else {
          isGather.value = false;
          stopCapture();
        }
      }, 1000);
    } else {
      ElMessage({
        message: "拍摄操作失败",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 75,
      });
      isGather.value = false;
    }
  });
};

const formatTimeFn = (curtimes) => {
  let hours = Math.floor(curtimes / 3600000);
  let minutes = Math.floor((curtimes % 3600000) / 60000);
  let seconds = Math.floor((curtimes % 60000) / 1000);
  return (
    (hours < 10 ? "0" + hours : hours) +
    " : " +
    (minutes < 10 ? "0" + minutes : minutes) +
    " : " +
    (seconds < 10 ? "0" + seconds : seconds)
  );
};

// 停止拍摄
const stopCapture = async () => {
  timeSelectFn();
  if (myTimers) {
    clearInterval(myTimers);
    myTimers = null;
  }
  curHasShootTime.value = 0;
  await window.electron.ipcRenderer.send("stopZ2proAllCaptureApi");
  isGather.value = false;
  window.electron.ipcRenderer.once("worker-endShoot", (err, message) => {
    if (message.msgType === "success") {
      message.data.formatTime = formatTimeFn(Number(message.data.times) * 1000);
      downLoadsVideo(message.data);
    }
  });
  await sleep(1000);
  getTFInfoFn();
};
// 拍摄时间更改时间
const timeSelectFn = (val) => {
  curOnceGatherTime.value = gatherTimeValue.value ? gatherTimeValue.value : 0;
};
let gatherTimeOpts = reactive([
  { label: "10秒", value: 10 * 1000 },
  { label: "30秒", value: 30 * 1000 },
  { label: "1分钟", value: 1 * 60 * 1000 },
  { label: "3分钟", value: 3 * 60 * 1000 },
  { label: "10分钟", value: 10 * 60 * 1000 },
  { label: "30分钟", value: 30 * 60 * 1000 },
  { label: "1小时", value: 1 * 60 * 60 * 1000 },
  { label: "2小时", value: 2 * 60 * 60 * 1000 },
  { label: "6小时", value: 6 * 60 * 60 * 1000 },
  { label: "10小时", value: 10 * 60 * 60 * 1000 },
  { label: "24小时", value: 24 * 60 * 60 * 1000 },
]);

let camItemMenusTop = ref(0);
let camItemMenusLeft = ref(0);

const resetDownPathFn = async () => {
  let res = await window.electron.ipcRenderer.invoke("openFolderPicker");
  if (res.msg && res.msg.trim() === "未选择文件夹") {
    return ElMessage({
      message: "已取消",
      type: "info",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
  if (res.msgType === "success") {
    updataConfigJsonfn();
    getFileListFn(res.msg);
  } else {
    ElMessage({
      message: "下载路径选择失败",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
};

const openCurFile = (item) => {
  window.electron.ipcRenderer.send("openVideoCurFile", item.filePath);
};
</script>

<style scoped lang="scss">
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

.all-pages {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #fff;
  overflow: hidden;
}

.set-left-menus {
  height: 100%;
  width: 175px;
  position: relative;

  .top-infos {
    height: 16%;

    width: 100%;
    position: relative;

    .soft-info {
      height: 30%;
      width: 100%;

      h3 {
        position: absolute;
        font-size: 1.4em;
        left: 15px;
        top: 17px;
      }

      h3:nth-child(1) {
        color: transparent;
        -webkit-text-stroke: 1px white;
      }

      h3:nth-child(2) {
        color: skyblue;
        animation: animates 4s ease-in-out infinite;
      }

      @keyframes animates {
        0%,
        100% {
          -webkit-clip-path: polygon(
            0 51%,
            18% 72%,
            46% 73%,
            65% 60%,
            82% 67%,
            100% 46%,
            99% 98%,
            0% 99%
          );
          clip-path: polygon(
            0 51%,
            18% 72%,
            46% 73%,
            65% 60%,
            82% 67%,
            100% 46%,
            99% 98%,
            0% 99%
          );
        }

        50% {
          -webkit-clip-path: polygon(
            0 55%,
            16% 37%,
            35% 53%,
            60% 40%,
            80% 57%,
            100% 46%,
            99% 98%,
            0% 99%
          );
          clip-path: polygon(
            0 55%,
            16% 37%,
            35% 53%,
            60% 40%,
            80% 57%,
            100% 46%,
            99% 98%,
            0% 99%
          );
        }
      }
    }

    .verson-box {
      position: absolute;
      color: white;
      font-size: 18px;
      font-weight: 600;
      display: inline-block;
      top: 45px;
      left: 45px;
    }
  }
}

.menus-seting {
  height: 35px;
  width: 100%;
  position: absolute;
  top: 0;
  background-color: #181818;
  padding: 5px 8px;
}

.left-box-capture {
  height: 100%;
  width: 285px;
  min-width: 130px;
  position: absolute;
  left: 0;
  top: 0;
  background-color: #313131;
  border-right: 1px solid #108085;

  .capture-list {
    width: 100%;
    border-bottom: 1px solid #108085;
    overflow: hidden;
    height: 55%;

    .list-box {
      height: calc(100% - 27px);

      width: 100%;
      overflow: hidden;

      .cam-list-title {
        height: 32px;
        line-height: 32px;
        background-color: #414142;
        font-weight: 600;
        color: white;
      }

      .cam-list-ul {
        height: calc(100% - 27px);
        overflow: auto;
        width: 100%;
        color: white;
      }

      li {
        width: 100%;
        border-bottom: 1px solid #313131;
        font-size: 14px;
        user-select: none;
        cursor: default;

        span {
          display: inline-block;
          border-right: 1px solid #313131;
        }
      }

      .cam-list-item {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        background-color: #504f4f;

        &:hover {
          background-color: #1f1f1f;
        }
      }

      .cam-list-sort {
        text-align: center;
        width: 15%;
        overflow: hidden;
        /* 防止内容溢出 */
        text-overflow: ellipsis;
        /* 使用省略号表示超出部分 */
        white-space: nowrap;
        /* 防止内容换行 */
      }

      .cam-list-ip {
        text-align: center;
        width: 60%;

        overflow: hidden;
        /* 防止内容溢出 */
        text-overflow: ellipsis;
        /* 使用省略号表示超出部分 */
        white-space: nowrap;
        /* 防止内容换行 */
      }

      .cam-list-status {
        text-align: center;
        width: 25%;
        overflow: hidden;
        /* 防止内容溢出 */
        text-overflow: ellipsis;
        /* 使用省略号表示超出部分 */
        white-space: nowrap;
        /* 防止内容换行 */
      }
    }

    .capture-tables {
      background-color: #313131;
      overflow: auto;

      .capture-name {
        color: #d4d7de;
        cursor: default;
      }
    }
  }

  .capture-config {
    border-top: 1px solid #108085;
    height: 45%;
    width: 100%;
  }
}

.capture-name-Connected {
  color: #07c160;
  font-weight: 600;
}

.my-config-box {
  height: auto;
  padding-top: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 90%;
  margin: 0 6% 0 4%;

  .config-item {
    margin: 4px 0;
    height: 24px;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;
    @extend .no-select-params;

    span {
      color: white;
      font-size: 14px;
      display: inline-block;
      width: 29%;
      max-width: 94px;
      height: 100%;
      line-height: 24px;
      // background-color: #4A4A4B;
      // border-radius: 6px;
      text-align: end;
      padding-right: 8px;
      margin-right: 4px;
      @extend .no-wrap-text;
    }
  }
}

.capture-videos-box {
  height: 100%;
  position: absolute;
  top: 0;
  left: 285px;

  background-color: #313131;

  .capture-shows {
    width: 100%;
    height: calc(100% - 200px);
    border-bottom: 1px solid #108085;

    .show-images-box {
      height: calc(100% - 30px);
      width: 100%;
      padding-bottom: 2px;

      ul {
        height: 100%;
        width: 100%;
        overflow: auto;

        .show-item-box {
          position: relative;
          float: left;
          height: 172px;
          width: 172px;
          margin: 3.5px 7.5px;
          background-color: #1f2941;
          border: 1px solid #108085;

          canvas {
            width: 100%;

            height: 100%;
            @extend .no-select-params;
          }

          .show-item-mask-info {
            position: absolute;
            bottom: 0px;
            width: 100%;
            height: 30%;
            overflow: hidden;
            background-color: rgba(0, 0, 0, 0.3);

            &:hover {
              background-color: rgba(0, 0, 0, 0.6);
            }

            p {
              transform: scale(0.65);
              display: inline-block;
              width: 140%;
              height: 20px;
              line-height: 20px;
              color: red;
              position: relative;
              left: -15px;
              top: -5px;
            }
          }
        }

        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          // background-color: transparent;
          background-color: #dcdfe6;
          border-radius: 8px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #747679;
          border-radius: 8px;
          // background: rgb(110, 151, 196);
        }
      }
    }
  }

  .capture-attribute {
    width: 100%;
    height: 200px;

    .top-button-zpro {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      color: white;

      margin-top: 3px;

      .duizhun-fuzhu-switch {
        font-size: 12px;
        margin-left: 10px;
        display: flex;
        align-items: center;
        line-height: 15px;
        @extend .no-select-params;
      }

      .zpro-set-btn {
        font-size: 12px;
        padding: 5px 8px;
        margin: 5px 0;
        margin-left: 10px;
        background-color: #4a4a4b;
        display: flex;
        align-items: center;
        line-height: 15px;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
}

.capture-files-box {
  width: 295px;
  position: absolute;

  right: 0;
  top: 0;
  height: 100%;
  border-left: 1px solid #108085;

  .my-files-box {
    height: calc(100% - 35px);
    color: white;

    .no-videoData-box {
      height: calc(100% - 40px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #8b8787;
    }

    .files-ul {
      height: calc(100% - 27px);
      overflow: auto;
      width: 100%;
    }

    li {
      width: 100%;
      border-bottom: 1px solid #313131;
      font-size: 14px;
      user-select: none;
      cursor: default;

      span {
        display: inline-block;
        border-right: 1px solid #313131;
      }
    }

    .files-title {
      height: 32px;
      line-height: 32px;
      background-color: #414142;
      font-weight: 600;
    }

    .files-item {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      background-color: #504f4f;

      &:hover {
        background-color: #1f1f1f;
      }
    }

    .menu-show-native {
      background-color: #1f1f1f;
    }

    .file-item-name {
      text-align: center;
      width: 50%;
      overflow: hidden;
      /* 防止内容溢出 */
      text-overflow: ellipsis;
      /* 使用省略号表示超出部分 */
      white-space: nowrap;
      /* 防止内容换行 */
    }

    .file-item-time,
    .file-item-status {
      text-align: center;
      width: 25%;
      overflow: hidden;
      /* 防止内容溢出 */
      text-overflow: ellipsis;
      /* 使用省略号表示超出部分 */
      white-space: nowrap;
      /* 防止内容换行 */
    }
  }
}

.capture-setting-start {
  background-color: #313131;
  height: 35px;
  width: 100%;
  border-top: 1px solid #108085;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  @extend .no-select-params;

  .middle-btns-show {
    font-family: cursive;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: white;
    padding-right: 15px;

    .start-time-config {
      width: 250px;
      height: 100%;
    }
  }
}

.tips-tab {
  position: relative;
  font-size: 14px;
  height: 30px;
  color: white;
  padding-left: 6px;
  border-bottom: 1px solid #108085;
  user-select: none;
  -webkit-user-select: none;
  display: flex;

  align-items: center;
  justify-content: space-between;
  @extend .no-wrap-text;
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-border: 0px solid var(--el-table-border-color);
  /**这里改成0了 */
  --el-table-text-color: white;
  /**文字颜色 */
  --el-table-header-text-color: rgb(238, 241, 243);
  /**表头文字颜色 */
  --el-table-row-hover-bg-color: #303133;
  /**行悬浮颜色 */
  --el-table-current-row-bg-color: rgb(0, 161, 48);
  /**当前行颜色 */
  --el-table-header-bg-color: #4a4a4b;
  /**表头背景颜色, 透明度为0 */
  --el-table-fixed-box-shadow: var(--el-box-shadow-light);
  --el-table-bg-color: #606266;
  /**表格背景颜色, 透明度为0 */
  --el-table-tr-bg-color: #5d5d5e;
  /**表格行的背景颜色, 透明度为0 */
  --el-table-expanded-cell-bg-color: var(--el-fill-color-blank);
  --el-table-fixed-left-column: inset 10px 0 10px -10px rgba(0, 0, 0, 0.15);
  --el-table-fixed-right-column: inset -10px 0 10px -10px rgba(0, 0, 0, 0.15);
  --el-table-index: var(--el-index-normal);

  /**表格的背景颜色, 透明度为0 */
  box-sizing: border-box;
  color: var(--el-table-text-color);
  font-size: 14px;
  height: -moz-fit-content;
  height: fit-content;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
  border-bottom: none;

  .el-table__inner-wrapper::before {
    background-color: transparent;
  }
}

:deep(.el-select) {
  --el-select-disabled-color: var(--el-disabled-text-color);
  --el-select-disabled-border: var(--el-disabled-border-color);
  --el-select-font-size: var(--el-font-size-base);
  --el-select-close-hover-color: var(--el-text-color-secondary);
  --el-select-input-color: white;
  --el-select-multiple-input-color: var(--el-text-color-regular);
  --el-select-input-focus-border-color: var(--el-color-primary);
  --el-select-input-font-size: 14px;
  --el-select-width: 100%;
  display: inline-block;

  position: relative;
  vertical-align: middle;
  width: var(--el-select-width);
  text-indent: 0.5rem;

  .el-select__wrapper {
    background-color: #4a4a4b;
    border: none;
    box-shadow: none;
  }

  .el-select__input {
    cursor: pointer;
  }

  .el-select__wrapper.is-focused {
    border: none;
    box-shadow: none;
  }

  .el-popper.is-light {
    border: none;
  }

  .el-select__placeholder {
    color: white;
  }

  .el-select-dropdown {
    background-color: #606266 !important;

    color: white;
  }

  .el-popper__arrow::before {
    background: #606266 !important;
    border: none;
  }

  // 下拉框内容背景色
  .el-select-dropdown__item.selected,
  .el-select-dropdown__item:hover,
  .el-select-dropdown__item.hover {
    color: #fff;
    background: #797a7b;
  }

  .el-select-dropdown__item.is-selected {
    color: #abcdfb;
  }

  .el-select-dropdown__item.is-hovering {
    background: #797a7b;
  }

  .el-select-dropdown__item {
    color: white;
  }
}

:deep(.el-dropdown) {
  .el-dropdown-menu {
    background-color: rgba(38, 38, 39, 0.9);
    padding: 1px 1px;
  }

  .el-dropdown__popper .el-dropdown-menu {
    background-color: rgba(38, 38, 39, 0.9);
  }

  .el-dropdown-menu__item:not(.is-disabled):focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #797a7b;
    color: white;
    padding: 4px 16px;
  }

  .el-dropdown-menu__item {
    color: white;
    padding: 4px 16px;
    font-size: 12px;
  }

  .el-popper.is-light,
  .el-popper.is-light > .el-popper__arrow:before {
    background-color: rgba(38, 38, 39, 0.9);
    border: none;

    box-shadow: none;
  }
}

:deep(.el-table) {
  .el-checkbox__input.is-checked .el-checkbox__inner:after {
    border-color: var(--el-checkbox-checked-icon-color);
    border-width: 2px;
    transform: rotate(45deg) scaleY(1);
  }
}

// ::v-deep(.el-input__inner) {
//   background-color: #11373d !important;
//   text-indent: 40px;
//   border-radius: 5px !important;
//   color: #fff;
//   height: 100%;
//   padding: 0 !important;
// }

// ::v-deep(.el-input__wrapper) {
//   background-color: #11373d !important;
//   border-radius: 5px !important;
//   box-shadow: none !important;
//   padding: 0 !important;
// }

// ::v-deep(.el-input__inner) {
//   -webkit-text-fill-color: #f0f0f0; //文字颜色
//   caret-color: #fff; //光标颜色
//   box-shadow: inset 0 0 0 1000px #212b38 !important; //背景颜色
// }

.starts-base {
  height: 28px;
  width: 100px;
  margin: 0 20px;
  border-radius: 50px;
  font-size: 14px;
  line-height: 25px;
  text-align: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  border: 1px solid #3b7e84;
}

.starts-base:after {
  content: "";
  display: block;
  position: relative;
  left: 0;
  top: -26px;
  height: 28px;

  width: 100px;
  opacity: 0;
  transition: all 0.7s;
  box-shadow: 0 0 10px 14px #65c8ec;
  border-radius: 4em;
}

.starts-base:active:after {
  opacity: 1;
  transition: 0s;
  box-shadow: 0 0 0 0 #65c8ec;
}

.starts-base:active {
  top: 1px;
}

.start-Open {
  background-color: #1b4d81;
  background-color: #4a4a4b;

  &:hover {
    transition-duration: 0.1s;
    opacity: 0.7;
  }
}

.start-Open-two {
  background-color: red;

  &:hover {
    opacity: 0.7;
    transition-duration: 0.1s;
  }
}

.time-drop-gather {
  width: 110px;
  height: 24px;
  padding: 0;
  margin: 4px 2px;
  color: white;
  font-weight: 600;
  line-height: 24px;
  border-radius: 5px;
}

.time-drop-gather-two {
  width: 110px;
  height: 24px;
  padding: 0;
  margin: 4px 2px;
  color: white;
  font-weight: 600;
  line-height: 24px;
  border-radius: 5px;

  -webkit-text-stroke-width: 1px;
  /* 描边宽度 */
  -webkit-text-stroke-color: red;
  /* 描边颜色 */
}

.ps-tip-text {
  color: white;
  height: 24px;
  display: inline-block;
  line-height: 24px;
  margin: 4px 4px;
}

.capture-tag-btn {
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  display: inline-block;
  padding: 0px 7px;
  border-radius: 5px;

  &:hover {
    opacity: 0.8;
  }
}

.tab-btns {
  background-color: #606266;
  border-radius: 4px;
  color: white;
  height: 20px;
  width: 42%;
  max-width: 65px;
  font-size: 12px;
  margin: 2px 3%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  @extend .no-wrap-text;

  &:hover {
    opacity: 0.7;
  }
}

.capture-big-show {
  width: 100%;
  height: calc(100% + 2px);
  background-color: #404041;
  // background-color: #1f2941;
  position: relative;
  top: 0px;
  overflow: hidden;

  .video-show-Box {
    height: calc(100% - 30px);
    position: absolute;
    left: 18%;

    canvas {
      width: 100%;
      height: 100%;
    }
  }

  .left-arrow,
  .right-arrow {
    font-size: 26px;
    width: 35px;
    height: 60px;
    color: rgb(165, 163, 163);
    background-color: rgba(204, 204, 204, 0.25);
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }

  .left-arrow {
    position: absolute;
    left: 15px;
    top: 46%;
  }

  .right-arrow {
    position: absolute;
    right: 15px;
    top: 46%;
  }

  .left-disable,
  .right-disable {
    cursor: no-drop;
  }

  .cur-framt-info {
    height: 20%;
    width: 100%;
    background-color: #4a4a4b;
    padding: 5px 0;

    p {
      color: white;
      font-size: 14px;
      padding: 0 15px;

      span {
        display: inline-block;
        margin: 0 10px;
      }
    }
  }
}

.nav-close {
  height: 20px;
  width: 20px;
  margin: 5px 8px 5px 4px;
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
  color: white;
  float: right;
  background-color: rgba(221, 223, 229, 0.3);
  color: white;

  &:hover {
    opacity: 0.8;
  }
}

.config-time-title {
  color: white;
  font-size: 14px;
  display: inline-block;
  width: 84px;
  height: 24px;
  border-radius: 6px;
  line-height: 22px;
  text-align: end;
  padding-right: 8px;
  margin-right: 4px;
  width: 90px;

  padding-right: 15px;
}

.capture-reize-box {
  height: 100%;
  width: 5px;
  background-color: transparent !important;
  position: absolute;
  right: -3px;
  top: 0;

  &:hover {
    cursor: e-resize;
  }
}

// .capt-gather-resize-box {
//   height: 100%;
//   width: 5px;
//   background-color: transparent !important;
//   position: absolute;
//   left: -3px;
//   top: 0;

//   &:hover {
//     cursor: e-resize;
//   }
// }

.loadingFade-enter-active,
.loadingFade-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.reset-down-path {
  width: 50px;
  font-size: 14px;
  padding: 0;
  margin: 5.5px;
  text-align: center;
  background-color: #4a4a4b;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

.capture-set-item-menu {
  position: absolute;
  left: 0;
  top: 0;
  width: 110px;
  padding: 2px;
  /* border: #606266; */
  border: 1px solid #606266;
  background-color: white;

  border-radius: 3px;
  font-size: 12px;
  // color: white;
  display: flex;
  flex-wrap: wrap;
  z-index: 30000;

  div {
    width: 100%;
    cursor: pointer;
    margin: 1px 0;
    padding: 2px 0;
    padding-left: 6px;

    &:hover {
      opacity: 0.9;
      border-radius: 3px;
      color: white;
      background-color: #434347;
    }
  }

  p {
    display: inline-block;
    width: 100%;
    cursor: default;
    margin: 1px 0;
    padding: 2px 0;
    padding-left: 6px;
  }
}
</style>

<style>
.el-overlay-dialog,
.el-overlay {
  top: 35px;
  left: 0;
  right: 0;
  z-index: 4000 !important;
}

.el-dialog {
  --el-dialog-padding-primary: 0 !important;
  --el-dialog-bg-color: white !important;
  background-color: white !important;
  z-index: 4000 !important;
}

.el-dialog__header.show-close {
  height: 30px;
  line-height: 30px;
  background-color: #7d6060;
  padding: 0 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.el-dialog__headerbtn {
  height: 30px;
  width: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-dialog__headerbtn .el-dialog__close {
  height: 22px;
  width: 22px;
  color: white;
}

.el-dialog__headerbtn .el-dialog__close:hover {
  background-color: #59595b;
  color: white;
  border-radius: 5px;
}

.el-dialog__headerbtn:focus .el-dialog__close,
.el-dialog__headerbtn:hover .el-dialog__close {
  color: white;
}

.el-dialog__title {
  color: white;
  font-size: 14px;
}

.el-dropdown:focus {
  outline: none;
}
</style>
