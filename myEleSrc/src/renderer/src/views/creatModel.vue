<template>
  <div class="all-pages">
    <HeadBox
      style="z-index: 2100"
      @appClose="onAppCloseFn"
      @connectCapt="connectCaptureConfig"
    />
    <div class="view-Page">
      <!-- <ThreeBox></ThreeBox> -->
      <!-- 相机列表设置 left -->
      <div
        class="left-box-capture"
        ref="leftCaptureBox"
        :style="{ width: `${leftWidth}px`, minWidth: '85px' }"
        @mousedown="onMouseDown"
      >
        <div
          class="capture-list"
          v-show="true"
          :style="{ height: `${leftCaptureListHeight}px` }"
        >
          <div class="tips-tab">
            相机列表
            <!-- 全部连接或全部断开 -->
            <div
              v-if="false"
              class="tab-btns"
              @click="allOpenCaptureFn(allConnectOrCloseText)"
            >
              {{ allConnectOrCloseText }}
            </div>
          </div>
          <div class="list-box">
            <el-table
              ref="multipleTableRef"
              :data="captureTreeData"
              height="100%"
              style="width: 100%"
              class="capture-tables"
              :header-cell-style="{ padding: '3px 2px' }"
              :cell-style="{ padding: '3px 2px' }"
            >
              <el-table-column
                label="名称"
                show-overflow-tooltip
                align="center"
                min-width="40"
                v-if="
                  globals.$store.state.currentCaptureType ===
                  globals.$store.state.captureType_1
                "
              >
                <template #default="scope">
                  <span
                    class="capture-name"
                    :class="[scope.row.isConnect ? 'capture-name-Connected' : '']"
                    >{{ scope.row.sn }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                show-overflow-tooltip
                align="center"
                min-width="40"
                v-if="
                  globals.$store.state.currentCaptureType ===
                  globals.$store.state.captureType_2
                "
              >
                <template #default="scope">
                  <span
                    class="capture-name"
                    :class="[scope.row.isConnect ? 'capture-name-Connected' : '']"
                    @contextmenu="handleRightClick"
                    >{{ scope.row.sn }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="ip"
                v-if="
                  globals.$store.state.currentCaptureType ===
                  globals.$store.state.captureType_2
                "
                prop="ipAddr"
                show-overflow-tooltip
                align="center"
                min-width="40"
              >
                <template #default="scope">
                  <span
                    class="capture-name"
                    :class="[scope.row.isConnect ? 'capture-name-Connected' : '']"
                    @contextmenu="handleRightClick"
                    >{{ scope.row.ipAddr }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                v-if="
                  globals.$store.state.currentCaptureType ===
                  globals.$store.state.captureType_2
                "
                show-overflow-tooltip
                align="center"
                min-width="40"
              >
                <template #default="scope">
                  <span
                    class="capture-name"
                    :class="[scope.row.isConnect ? 'capture-name-Connected' : '']"
                    @contextmenu="handleRightClick"
                    >{{ scope.row.isConnect ? "在线" : "离线" }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                v-if="
                  globals.$store.state.currentCaptureType ===
                  globals.$store.state.captureType_1
                "
                prop="setting"
                show-overflow-tooltip
                label="操作"
                align="center"
                :width="captureTableSetWidth"
              >
                <template #default="scope">
                  <div
                    class="capture-tag-btn"
                    style="background-color: #919398"
                    v-show="!scope.row.isConnect"
                    @click="captureSetingFn(scope.row, true)"
                  >
                    连接
                  </div>
                  <div
                    class="capture-tag-btn"
                    style="background-color: #07c160"
                    v-show="scope.row.isConnect"
                    @click="captureSetingFn(scope.row, false)"
                  >
                    断开
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div
            class="capture-set-item-menu"
            :style="{
              top: `${camItemMenusTop}px`,
              left: `${camItemMenusLeft}px`,
            }"
            v-show="camItemMenusShow"
          >
            <div>设置IP</div>
            <div>其他设置</div>
          </div>
        </div>
        <!-- 相机配置 -->
        <div class="capture-config" :style="{ height: `${leftCaptureConfigHeight}px` }">
          <div class="tips-tab">参数配置</div>
          <!-- 奥比相机配置项 -->
          <div
            class="my-config-box"
            v-show="
              globals.$store.state.currentCaptureType ===
              globals.$store.state.captureType_1
            "
          >
            <div class="config-item">
              <span>对齐模式:</span>
              <el-select
                v-model="alignModelValue"
                :teleported="false"
                placeholder="请选择对齐模式"
                size="small"
                @change="alignModelChangeFn"
                style="width: 53%"
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
            <div class="config-item">
              <span>彩色图size:</span>
              <el-select
                v-model="colorSizeValue"
                :teleported="false"
                placeholder="请选择彩色图size"
                size="small"
                style="width: 53%"
                class="config-select-in"
              >
                <el-option
                  v-for="item in colorSizeOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="config-item">
              <span>深度图size:</span>
              <el-select
                v-model="depthSizeValue"
                :teleported="false"
                placeholder="请选择深度图size"
                size="small"
                style="width: 53%"
              >
                <el-option
                  v-for="item in depthSizeOpts"
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
              globals.$store.state.currentCaptureType ===
              globals.$store.state.captureType_1
            "
          ></div>
        </div>
        <div
          class="capture-reize-box"
          @mousedown="(ev) => onResizeStart(ev, 'left')"
        ></div>
      </div>
      <!-- 顶部录制设置 -->
      <div
        class="zpro-top-button-box"
        v-if="
          globals.$store.state.currentCaptureType === globals.$store.state.captureType_2
        "
        :style="{
          width: `calc(100% - ${leftWidth}px - ${rightWidth}px)`,
          left: `${leftWidth}px`,
        }"
      >
        <div class="top-button-zpro">
          <div class="zpro-set-btn" @click="captureZ2proFindFn">发现设备</div>
          <div class="zpro-set-btn" @click="z2proRebootFn">重启相机</div>
          <div class="zpro-set-btn">拍照测试</div>
          <div class="zpro-set-btn">格式化TF卡</div>
        </div>
      </div>
      <!-- 右侧UI -->
      <div
        class="capture-videos-box"
        ref="rightCaptGatherBox"
        :style="{ width: `${rightWidth}px`, minWidth: '85px' }"
        @mousedown="onMouseDown"
      >
        <!-- 数据采集 -->
        <div class="capture-shows" :style="{ height: `${rightCapGathShowHeight}px` }">
          <div class="tips-tab">数据采集</div>
          <!-- <video id="video-player" width="300" height="200" controls></video> -->
          <div class="show-images-box">
            <ul>
              <li
                v-for="(item, index) in videosList"
                class="show-item-box"
                :key="index"
                @dblclick="bigShowCurData(item)"
              >
                <canvas :id="'video' + index"></canvas>
              </li>
            </ul>
          </div>
        </div>
        <!-- 属性 -->
        <div
          class="capture-attribute"
          :style="{ height: `${rightCapAAttributeHeight}px` }"
        >
          <div class="tips-tab">操作</div>
        </div>
        <div
          class="capt-gather-resize-box"
          @mousedown="(ev) => onResizeStart(ev, 'right')"
        ></div>
      </div>
      <!-- 中间靠右放大采集UI -->
      <div
        class="capture-big-show"
        v-if="isBigShowVideos"
        :style="{ right: `${rightWidth}px`, 'z-index': '8000' }"
      >
        <div
          class="tips-tab"
          style="border: none; background-color: #313131; width: 100%"
        >
          <div style="width: 80%; display: inline-block">
            {{ curBigShowVideosObj.captureName }}
          </div>
          <Minus class="nav-close" style="padding: 0 2px" @click="bigShowcloseFn()" />
        </div>
        <div class="video-show-Box">
          <canvas id="bigShowVideo"></canvas>
        </div>
        <div class="cur-framt-info"></div>
      </div>
      <!-- 底部采集UI -->
      <div
        class="capture-setting-start"
        ref="bottomCaptGatherBox"
        v-show="globals.$store.state.isShowBottomGatherBox"
      >
        <div class="middle-btns-show">
          <div class="config-item">
            <span class="config-time-title" style="width: 75px; padding-right: 5px"
              >下载路径:</span
            >
            <span style="color: #409eff">famxx_casc</span>
            <span class="config-time-title reset-down-path" @click="resetDownPathFn"
              >重新设置</span
            >
            <span class="config-time-title">采集时间:</span>
            <el-select
              v-model="gatherTimeValue"
              :teleported="false"
              placeholder="请选择采集时间"
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
          <!-- 采集按钮 -->
          <div
            class="starts-base"
            :class="[!isGather ? 'start-Open' : 'start-Open-two']"
            @click="setGatherStatusFn(!isGather)"
          >
            {{ gatherText }}
          </div>
          <div
            class="time-drop-gather"
            :class="[!isGather ? 'time-drop-gather' : 'time-drop-gather-two']"
          >
            {{ curTextTime }}
          </div>
        </div>
      </div>
      <!-- 连接进度弹框 -->
      <OpenProcess :isShow="isOpenProcessDialog" @closeDialog="closeFn" />
      <!-- 确认关闭弹框 -->
      <CloseAppBox :isShow="isShowCloseAppDialog" @closeDialog="closeFn" />
      <transition name="loadingFade">
        <FullScreenLoad v-show="globals.$store.state.isFullScreenLoading" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, computed, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { sleep } from "../assets/js/untils";
import HeadBox from "../components/header.vue";
import CloseAppBox from "../components/closeAppBox.vue";
import OpenProcess from "../components/openProcess.vue";
import FullScreenLoad from "../components/loadingAllScreen.vue";
import ThreeBox from "./three3d.vue";
const globals = getCurrentInstance().appContext.config.globalProperties;

let leftWidth = ref(300);
let rightWidth = ref(396);
let isResizeBox = ref(false);
let startX = ref(0);

let rightCaptGatherBox = ref(null);
let leftCaptureBox = ref(null);
let bottomCaptGatherBox = ref(null);

let alignModelValue = ref(2);
let colorSizeValue = ref(2);
let depthSizeValue = ref(2);
let gatherTimeValue = ref(10000);

let curOnceGatherTime = ref(0);
let curBigShowVideosObj = reactive({});

let isBigShowVideos = ref(false);
let isOpenProcessDialog = ref(false);
let isShowCloseAppDialog = ref(false);
let camItemMenusShow = ref(false);

let startCaptNum = ref(0);

let alignModelOpts = reactive([
  { label: "D2C", value: 2 },
  { label: "不对齐", value: 0 },
]);

// 相机列表盒子高度
let leftCaptureListHeight = ref(0);
let leftCaptureConfigHeight = ref(0);
let rightCapGathShowHeight = ref(0);
let rightCapAAttributeHeight = ref(0);

let videosList = ref([]);
let noConfigCam = ref([]);

let isGather = ref(false);
let gatherText = ref("");
let z2proConfigJSON = null;

// 相机列表
let captureTreeData = ref([
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: true },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: false },
  { sn: "xxx", ipAddr: "192.168.1.1", isConnect: false },
]);
let timerPro = null;

let myTimers = null;

let captureTimer = null;
let colorSizeOpts = reactive([
  { label: "3840x2160", value: 0 },
  { label: "2560x1440", value: 1 },
  { label: "1920x1080", value: 2 },
  { label: "1280x720", value: 3 },
  { label: "1280x960", value: 4 },
]);

// 深度图尺寸配置
let depthSizeOpts = reactive([
  { label: "WFOV unbinned 1024x1024", value: 0 },
  { label: "WFOV binned 512x512", value: 1 },
  { label: "NFOV unbinned 640x576", value: 2 },
  { label: "NFOV binned 320x288", value: 3 },
]);

onMounted(async () => {
  initDomHeight();
  timeSelectFn();
  sleep(1000);
  gatherText.value = isGather.value ? "停止采集" : "开始采集";
  window.addEventListener("resize", () => {
    nextTick(() => {
      initDomHeight();
    });
  });

  document.addEventListener("click", () => {
    camItemMenusShow.value = false;
  });
});

const initDomHeight = () => {
  nextTick(() => {
    let bottomGatherBoxHeight = bottomCaptGatherBox.value.getBoundingClientRect().height; // 底部采集UI高度
    leftCaptureListHeight.value = (window.innerHeight - 35 - bottomGatherBoxHeight) * 0.5;
    leftCaptureConfigHeight.value =
      (window.innerHeight - 35 - bottomGatherBoxHeight) * 0.5;
    rightCapGathShowHeight.value =
      (window.innerHeight - 35 - bottomGatherBoxHeight) * 0.6;
    rightCapAAttributeHeight.value =
      (window.innerHeight - 35 - bottomGatherBoxHeight) * 0.4;
  });
};
// z2proRebootFn 重启相机
const z2proRebootFn = async () => {
  await window.electron.ipcRenderer.send("z2proRebootApi");
  window.electron.ipcRenderer.once("worker-reboot", (event, message) => {
    if (message.msgType === "error") {
      ElMessage({
        message: "操作失败",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
      globals.$store.state.isFullScreenLoading = false;
      return;
    }
  });
};
// 点击相机配置
const connectCaptureConfig = async () => {
  if (globals.$store.state.currentCaptureType === globals.$store.state.captureType_1) {
    let eleDataCapListMgs = await window.electron.ipcRenderer.invoke(
      "readCaptureJsonCon",
      1
    );
    if (!eleDataCapListMgs.message) {
      ElMessage({
        message: "请检查相机配置文件OBsync, 是否配置正确",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
      globals.$store.state.isFullScreenLoading = false;
      return;
    }
    captureTreeData.value = eleDataCapListMgs.data.captureList;
    let serveCapListMgs = await window.electron.ipcRenderer.invoke("ObInitMain");
    if (serveCapListMgs.msgType !== "success") {
      ElMessage({
        message: serveCapListMgs.msg,
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
      globals.$store.state.isFullScreenLoading = false;
      globals.$store.state.currentCaptureType = null;
      captureTreeData.value = [];
      return;
    } else {
      if (serveCapListMgs.msg.length > 2) {
        let successCamNamList = serveCapListMgs.msg;
        let noConfigList = captureTreeData.value.filter(
          (item) => !successCamNamList.includes(item)
        );
        if (noExistList.length) {
          ElMessage({
            message: `${noConfigList.join(
              ","
            )}相机配置失败，请检查这部分相机是否正确连接！`,
            type: "error",
            grouping: true,
            plain: true,
            showClose: true,
            offset: 90,
          });
          noConfigCam.value = [...noConfigList];
          let finalCamList = [];
          successCamNamList.forEach((item) => {
            captureTreeData.value.forEach((itum) => {
              if (item === itum.sn) {
                finalCamList.push(itum);
              }
            });
          });
          captureTreeData.value = finalCamList;
        }
      }
    }
    globals.$store.state.isFullScreenLoading = false;
  }
  if (globals.$store.state.currentCaptureType === globals.$store.state.captureType_2) {
    initZ2proDataAndCamzList();
  }
};

const captureZ2proFindFn = async () => {
  globals.$store.state.fullScreenloadingText = "Z2PRO相机重新发现中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;
  if (z2proConfigJSON) {
    window.electron.ipcRenderer.send("z2proRefindEleApi", z2proConfigJSON.ipAddr);
    window.electron.ipcRenderer.once("worker-refind", (event, message) => {
      console.log(2222);
      if (message.msgType === "error") {
        ElMessage({
          message: "请检查相机连接是否正常",
          type: "error",
          grouping: true,
          plain: true,
          showClose: true,
          offset: 90,
        });
        globals.$store.state.isFullScreenLoading = false;
        return;
      }
      if (message.msgType === "success" && message.data.length === 0) {
        ElMessage({
          message: "相机已初始化,检测到相机数量为0,请检查相机连接是否正常",
          type: "error",
          grouping: true,
          plain: true,
          showClose: true,
          offset: 90,
        });
        globals.$store.state.isFullScreenLoading = false;
        return;
      }
    });
  } else {
    globals.$store.state.isFullScreenLoading = false;
  }
};

// z2pro
const initZ2proDataAndCamzList = async () => {
  let eleDataCapListMgs = await window.electron.ipcRenderer.invoke(
    "readCaptureJsonCon",
    2
  );
  captureTreeData.value = [];
  if (!eleDataCapListMgs.message) {
    ElMessage({
      message: "请检查相机配置文件, 是否配置正确",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 90,
    });

    globals.$store.state.isFullScreenLoading = false;
    globals.$store.state.currentCaptureType = null;
    return;
  }
  z2proConfigJSON = eleDataCapListMgs.data;
  await window.electron.ipcRenderer.send("z2proInitEleApi", z2proConfigJSON.ipAddr);
  window.electron.ipcRenderer.once("worker-message", (event, message) => {
    if (message.msgType === "error") {
      ElMessage({
        message: "请检查相机连接是否正常",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
      globals.$store.state.isFullScreenLoading = false;
      return;
    }
    if (message.msgType === "success" && message.data.length === 0) {
      ElMessage({
        message: "相机已初始化,检测到相机数量为0,请检查相机连接是否正常",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
      globals.$store.state.isFullScreenLoading = false;
      return;
    }
  });
};

const onAppCloseFn = () => {
  isShowCloseAppDialog.value = true;
};

const onResizeStart = (event, type) => {
  event.preventDefault(); // 防止选中内容
  isResizeBox.value = true;
  startX.value = event.clientX;
  // 添加鼠标移动和释放事件
  if (type === "left") {
    document.addEventListener("mousemove", throttledMouseMoveLeft);
    document.addEventListener("mouseup", onLeftResizeEnd);
  }
  if (type === "right") {
    document.addEventListener("mousemove", throttledMouseMoveRight);
    document.addEventListener("mouseup", onRightResizeEnd);
  }
};

const throttledMouseMoveLeft = (event) => {
  requestAnimationFrame(() => {
    if (isResizeBox.value) {
      // 计算新的宽度和高度
      const dx = event.clientX - startX.value;
      let rightBoxInfo = rightCaptGatherBox.value.getBoundingClientRect();
      if ((dx >= 0 && Math.floor(rightBoxInfo.left) - 30 >= leftWidth.value) || dx < 0) {
        leftWidth.value = Math.max(85, leftWidth.value + dx);
      }
      // 更新起始位置
      startX.value = event.clientX;
    }
  });
};

const alignModelChangeFn = async (val) => {
  // alignModelValue.value = val
  let alignModelValue = await window.electron.ipcRenderer.invoke("setAlignModel", val);
  if (alignModelValue.msgType !== "success") {
    ElMessage({
      message: "设置失败",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 90,
    });
  }
};

const throttledMouseMoveRight = (event) => {
  requestAnimationFrame(() => {
    if (isResizeBox.value) {
      // 计算新的宽度和高度
      const dx = event.clientX - startX.value;
      let rightBoxInfo = rightCaptGatherBox.value.getBoundingClientRect();
      let leftBoxInfo = leftCaptureBox.value.getBoundingClientRect();
      if (
        (dx < 0 && Math.floor(leftBoxInfo.right) + 30 <= rightBoxInfo.left) ||
        dx >= 0
      ) {
        rightWidth.value = Math.max(85, rightWidth.value - dx);
      }
      startX.value = event.clientX;
    }
  });
};

// 拖动结束
const onLeftResizeEnd = (event) => {
  isResizeBox.value = false;
  // 移除事件监听
  document.removeEventListener("mousemove", throttledMouseMoveLeft);
  document.removeEventListener("mouseup", onLeftResizeEnd);
};
// 拖动结束
const onRightResizeEnd = (event) => {
  isResizeBox.value = false;
  // 移除事件监听
  document.removeEventListener("mousemove", throttledMouseMoveRight);
  document.removeEventListener("mouseup", onRightResizeEnd);
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

const updateVideoStream = (index, imageUrl) => {
  const canvas = document.getElementById("video" + index);
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = imageUrl;
  let dx, dy, dw, dh, imgRatio, canvasRatio;
  canvasRatio = canvas.width / canvas.height;
  img.onload = () => {
    imgRatio = img.width / img.height;
    if (imgRatio <= canvasRatio) {
      dw = imgRatio * canvas.width;
      dh = canvas.height;
      dx = (canvas.width - dw) / 2;
      dy = 0;
    } else {
      dw = canvas.width;
      dh = dw / imgRatio;
      dx = 0;
      dy = (canvas.height - dh) / 2;
    }
    // 清除上一次绘制的内容
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(() => {
      ctx.drawImage(img, dx, dy, dw, dh);
      URL.revokeObjectURL(imageUrl); // 释放对象 URL 资源
    });
  };
  if (isBigShowVideos.value) {
    const canvasTwo = document.getElementById("bigShowVideo");
    const ctxTwo = canvasTwo.getContext("2d");
    const imgTwo = new Image();
    imgTwo.src = imageUrl;
    let dx, dy, dw, dh, imgRatio, canvasRatio;
    canvasRatio = canvasTwo.width / canvasTwo.height;
    imgTwo.onload = () => {
      imgRatio = imgTwo.width / imgTwo.height;
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
      // 清除上一次绘制的内容
      ctxTwo.clearRect(0, 0, canvasTwo.width, canvasTwo.height);
      requestAnimationFrame(() => {
        ctxTwo.drawImage(imgTwo, dx, dy, dw, dh);
        URL.revokeObjectURL(imageUrl); // 释放对象 URL 资源
      });
    };
  }
};

// 计算剩余时间并显示
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

const allConnectOrCloseText = computed(() => {
  return startCaptNum.value === 0 ? "全部连接" : "全部断开";
});

const closeFn = () => {
  isOpenProcessDialog.value = false;
  isShowCloseAppDialog.value = false;
};

// 单个相机连接或关闭
// row: 当前行数据
// val: 0 关闭 1 连接
const captureSetingFn = async (row, val) => {
  if (val === true) {
    let message = await window.electron.ipcRenderer.invoke("eleApiOpenSingleCam", row.sn);
    if (message.msgType === "error") {
      ElMessage({
        message: message.msg,
        type: "info",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
      return;
    }
    startCaptNum.value = captureTreeData.value.filter((item) => item.isConnect).length;
    return;
  } else {
    let message = await window.electron.ipcRenderer.invoke(
      "eleApiCloseOBSingleCam",
      row.sn
    );
  }
};

// 双击显示最大图
const bigShowCurData = (item) => {
  isBigShowVideos.value = true;
  for (let key in item) {
    curBigShowVideosObj[key] = item[key];
  }
};

//  关闭最大显示
const bigShowcloseFn = () => {
  isBigShowVideos.value = false;
};

// 采集事件
const setGatherStatusFn = async (val) => {
  // MyModule().then((Module) => {
  //   // console.log(Module)
  //   let obj = new Module.MyClass(2);
  //   obj.getInfo(obj)
  //   console.log(obj.getValue())

  // }).catch((err) => {

  // });
  startZ2proCapture();

  // isGather.value = val
  // if (isGather.value) {
  //   if (globals.$store.state.currentCaptureType === globals.$store.state.captureType_1) {
  //     startCapture();
  //   }
  //   if (globals.$store.state.currentCaptureType === globals.$store.state.captureType_2) {
  //     startZ2proCapture();
  //   }
  // } else {
  //   stopCapture();
  // }
  // gatherText.value = isGather.value ? '停止采集' : '开始采集'
};

const startZ2proCapture = async () => {
  videosList.value = [];
  let res = await window.electron.ipcRenderer.invoke("startZ2proCaptureApi");

  if (res.msgType === "success") {
    videosList.value = [
      { camName: "camera1", url: "" },
      { camName: "camera2", url: "" },
      { camName: "camera3", url: "" },
      { camName: "camera4", url: "" },
    ];
    let m = 0;
    window.electron.ipcRenderer.on("rtsp-message", (event, message) => {
      sleep(1000);
      for (let i = 0; i < videosList.value.length; i++) {
        if (message.camIp === videosList.value[i].camName) {
          const blob = new Blob([message.data], { type: "image/jpeg" });
          const videoURL = URL.createObjectURL(blob);
          m++;
          updateVideoStream(i, videoURL);
          console.log(m);
        }
      }
    });
    // sleep(6000);
    // console.log(res)
    // const video = document.getElementById('video-player');
    // const hls = new Hls({
    //   maxBufferLength: 3, // 最大缓存时长为 3 秒
    //   maxBufferSize: 100 * 1024, // 最大缓存大小为 100MB
    //   maxBufferHole: 0.1, // 最大缓存空洞为 0.1 秒
    //   liveSyncDurationCount: 3 // 直播同步时长计数
    // });
    // const hlsStreamUrl = 'file://D:/myProgram/newElectron-Cam/myEleSrc/hls_streams/camera1/index.m3u8';
    // if (Hls.isSupported()) {
    //   hls.loadSource(hlsStreamUrl);
    //   hls.attachMedia(video);
    //   hls.on(Hls.Events.MANIFEST_PARSED, () => {
    //     video.play();
    //   });
    // } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    //   video.src = hlsStreamUrl;
    //   video.addEventListener('loadedmetadata', () => {
    //     video.play();
    //   });
    // }
  }
};

// 开始采集
const startCapture = () => {
  videosList.value = [];
  let isExistOpenCapture = captureTreeData.value.filter((item) => item.isConnect);
  if (!isExistOpenCapture.length) {
    ElMessage({
      message: "请先连接相机后再进行采集",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 90,
    });
    isGather.value = false;
    return;
  }
  window.electron.ipcRenderer
    .invoke("eleApiStartCap")
    .then((res) => {
      if (res.msgType === "success") {
        if (res.msg.length) {
          res.msg.forEach((item) => {
            videosList.value.push({ captureName: item, url: "" });
          });
        }
      }
    })
    .catch(() => {
      ElMessage({
        message: "采集失败",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
    });

  captureTimer = setInterval(async () => {
    let res = await window.electron.ipcRenderer.invoke(
      "startCaptureApi",
      isExistOpenCapture.length
    );
    if (res && res.msgType === "success") {
      for (let i = 0; i < res.data.arrarBuffer.length; i++) {
        const blob = new Blob([res.data.arrarBuffer[i]], { type: "image/jpeg" });
        const videoURL = URL.createObjectURL(blob);
        updateVideoStream(i, videoURL);
      }
    }
  }, 30);
  myTimers = setInterval(() => {
    if (curOnceGatherTime.value > 0) {
      curOnceGatherTime.value = curOnceGatherTime.value - 1000;
    } else {
      isGather.value = false;
      gatherText.value = isGather.value ? "停止采集" : "开始采集";
      stopCapture();
    }
  }, 1000);
};

// 停止采集
const stopCapture = async () => {
  timeSelectFn();
  if (myTimers) {
    clearInterval(myTimers);
    myTimers = null;
  }
  if (captureTimer) {
    clearInterval(captureTimer);
    captureTimer = null;
  }
  let res = await window.electron.ipcRenderer.invoke("stopCaptureApi");
};
// 采集时间更改时间
const timeSelectFn = (val) => {
  curOnceGatherTime.value = gatherTimeValue.value ? gatherTimeValue.value : 0;
};

// 连接所有相机 或断开所有连接
const allOpenCaptureFn = (valText) => {
  if (valText === "全部连接") {
    allCamConnectFn();
  } else {
    allCloseCaptureFn();
  }
};
const allCamConnectFn = async () => {
  if (!captureTreeData.value.length) {
    ElMessage({
      message: "请先添加相机后再操作",
      type: "info",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 90,
    });
    return;
  }
  isOpenProcessDialog.value = true;
  globals.$store.state.camConnectProcess = false;
  globals.$store.state.camConnectPerset = 0;
  let startTime = 0;
  // 检查连接是否超时
  timerPro = setInterval(() => {
    startTime++;
    globals.$store.state.camConnectPerset = Math.floor(
      globals.$store.state.camConnectPerset + 1.2
    );
    if (startTime >= 100) {
      if (timerPro) {
        clearInterval(timerPro);
        timerPro = null;
      }
      isOpenProcessDialog.value = false;
      ElMessage({
        message: "相机连接超时， 请检查设备",
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
      return;
    }
  }, 500);
  if (globals.$store.state.currentCaptureType === globals.$store.state.captureType_1) {
    let message = await window.electron.ipcRenderer.invoke("eleApiOpenAllCam");
    if (message.msgType === "error") {
      ElMessage({
        message: message.msg,
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
      isOpenProcessDialog.value = false;
      if (timerPro) {
        clearInterval(timerPro);
        timerPro = null;
      }
      return;
    } else {
      if (message.msg.length > 2) {
        let successCamNamList = message.msg.split(",").pop();
        let noExistList = captureTreeData.value.filter(
          (item) => !successCamNamList.includes(item)
        );
        if (noExistList.length) {
          ElMessage({
            message: `${noExistList.join(
              ","
            )}相机连接失败，请检查这部分相机是否正确连接！`,
            type: "error",
            grouping: true,
            plain: true,
            showClose: true,
            offset: 90,
          });
        }
        captureTreeData.value.forEach((item) => {
          item.isConnect = successCamNamList.includes(item.sn);
        });
        globals.$store.state.camConnectPerset = 100;
      }
      isOpenProcessDialog.value = false;
      if (timerPro) {
        clearInterval(timerPro);
        timerPro = null;
      }
    }
  }
  startCaptNum.value = captureTreeData.value.filter((item) => item.isConnect).length;
};

const allCloseCaptureFn = async () => {
  if (globals.$store.state.currentCaptureType === globals.$store.state.captureType_1) {
    let message = await window.electron.ipcRenderer.invoke("eleApiCloseOBAllCam");
    if (message.msgType === "error") {
      ElMessage({
        message: message.msg,
        type: "error",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
      return;
    } else {
      captureTreeData.value.forEach((item) => {
        item.isConnect = false;
      });
      ElMessage({
        message: message.msg,
        type: "success",
        grouping: true,
        plain: true,
        showClose: true,
        offset: 90,
      });
    }
  }
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
const handleRightClick = (event) => {
  camItemMenusShow.value = true;
  if (event) {
    camItemMenusTop.value = event.clientY - 35;
    camItemMenusLeft.value = event.clientX + 5;
  }
};

const resetDownPathFn = async () => {
  let res = await window.electron.ipcRenderer.invoke("openFolderPicker");
  console.log(res.msg);
  if (res.msg && res.msg.trim() === "未选择文件夹") {
    return ElMessage({
      message: "已取消",
      type: "info",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 90,
    });
  }
  if (res.msgType === "success") {
    // console.log(z2proConfigJSON);
  } else {
    ElMessage({
      message: "下载路径选择失败",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 90,
    });
  }
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

.view-Page {
  position: relative;
  width: 100%;
  height: calc(100% - 35px);
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
  height: auto;
  width: 20%;
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

    .list-box {
      height: calc(100% - 27px);
      width: 100%;
      overflow: hidden;
    }

    .capture-tables {
      background-color: #313131;
      overflow: auto;

      .capture-name {
        color: #d4d7de;
        cursor: default;
      }

      .capture-name-Connected {
        color: #07c160;
        font-weight: 600;
      }
    }
  }

  .capture-config {
    border-top: 1px solid #108085;
    // height: 34%;
    width: 100%;
  }
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
      width: 45%;
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
  height: auto;
  width: 200px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #313131;
  // border-left: 1px solid #108085;

  .capture-shows {
    width: 100%;
    height: 60%;
    border-bottom: 1px solid #108085;

    .show-images-box {
      height: calc(100% - 30px);
      width: calc(100% - 1px);
      margin-left: 1px;
      padding-bottom: 2px;

      ul {
        height: 100%;
        width: 100%;
        overflow: auto;

        .show-item-box {
          position: relative;
          float: left;
          width: 72px;
          height: 64px;
          margin: 0;
          padding: 0;
          padding: 5px;
          margin: 3px;
          background-image: url("../assets/images/mybox-border.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;

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
    height: 40%;
    width: calc(100% - 2px);
  }
}

.capture-setting-start {
  background-color: #313131;
  height: 40px;
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
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

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
  --el-table-tr-bg-color: #595a5b;
  /**表格行的背景颜色, 透明度为0 */
  --el-table-expanded-cell-bg-color: var(--el-fill-color-blank);
  --el-table-fixed-left-column: inset 10px 0 10px -10px rgba(0, 0, 0, 0.15);
  --el-table-fixed-right-column: inset -10px 0 10px -10px rgba(0, 0, 0, 0.15);
  --el-table-index: var(--el-index-normal);
  background-color: #545659;
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

  .el-select__wrapper {
    background-color: #4a4a4b;
    border: none;
    box-shadow: none;
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
  text-align: center;
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
  text-align: center;
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
  height: 400px;
  width: 400px;
  background-color: #404041;
  border-radius: 8px;
  position: absolute;
  top: 0px;
  border: 1px solid #108085;
  overflow: hidden;

  .video-show-Box {
    height: 75%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    canvas {
      width: 100%;
      height: 100%;
    }
  }

  .cur-framt-info {
    height: 17.3%;
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

  &:hover {
    background-color: rgba(221, 223, 229, 0.3);
    color: white;
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

.capt-gather-resize-box {
  height: 100%;
  width: 5px;
  background-color: transparent !important;
  position: absolute;
  left: -3px;
  top: 0;

  &:hover {
    cursor: e-resize;
  }
}

.loadingFade-enter-active,
.loadingFade-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.reset-down-path {
  width: 70px;
  font-size: 14px;
  border: 1px solid #3b7e84;
  padding: 0;
  margin: 8px;
  text-align: center;
  background-color: #4a4a4b;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
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
  background-color: #1f1f1f;
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

.zpro-top-button-box {
  position: absolute;
  top: 0;
  height: 30px;
  /* border: 1px solid #ccc; */
  background-color: #313131;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;

  .top-button-zpro {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 5px;

    .zpro-set-btn {
      font-size: 12px;
      padding: 4px 6px;
      margin-left: 10px;
      background-color: #606266;
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

.capture-set-item-menu {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  padding: 2px;
  /* border: #606266; */
  border: 1px solid #606266;
  background-color: #1f1f1f;
  border-radius: 3px;
  font-size: 12px;
  color: white;
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
      background-color: #434347;
    }
  }
}
</style>
