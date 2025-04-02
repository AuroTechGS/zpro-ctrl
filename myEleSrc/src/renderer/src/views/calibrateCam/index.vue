<template>
  <div class="view-Page-two">
    <div class="source-info-box">
      <div class="title-select color-text">
        {{ globals.$store.state.curModuleObj.name }}
      </div>
      <span class="active-btns btn_danger" @click="selectStatus()">退出当前任务</span>
      <div class="cail_ck-val">
        标定参考值：<span style="color: #07c160">{{ 0 }}</span>
      </div>
      <div class="cailbrate_result_box">
        <span class="active-btns small-btn" @click="reCailbrateFn">重新标定</span>
        <span class="active-btns small-btn" @click="startSegFn">确认标定</span>
      </div>
    </div>
    <showPlay style="position: absolute; left: 0; top: 0" />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  computed,
  watch,
} from "vue";
import { ElMessage, ElNotification } from "element-plus";
import moment from "moment";
import { createWS, sendWs } from "../../assets/js/wsClient.js";
import { sleep } from "../../assets/js/untils";
import showPlay from "./showPly.vue";
import { addCailPly } from "../../assets/js/thressInit.js";

const globals = getCurrentInstance().appContext.config.globalProperties;
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
let frameCailNum = ref(1);
let curVideoObj = reactive({});
let firstType = 0;
let allFrameNum = 0;
let startTime = 0;

const wsMessage = computed(() => globals.$store.state.wsMessage);

watch(wsMessage, (newVal) => {
  if (newVal) {
    let val = JSON.parse(newVal);
    if (val.repType) {
      if (val.state === 400) {
        ElMessage({
          message: val.error,
          type: "error",
          grouping: true,
          plain: true,
          showClose: true,
          offset: 75,
        });
      }
      if (val.repType == "/startSplitVideoFrame" && val.state === 200) {
        if (val.data === "success") {
          globals.$store.state.fullScreenloadingText = "正在进行相机标定中， 请稍等...";
          frameCailNum.value = Number(startTime * 25) + 1;
          calibrateCamFn();
        }
      }
      if (val.repType == "/startCalibrateCamera" && val.state === 200) {
        if (val.msgType == "success") {
          globals.$store.state.isFullScreenLoading = false;
          addCailPly(val.data);
        } else {
          globals.$store.state.isFullScreenLoading = false;
          ElMessage({
            message: "标定失败，2秒后进行重新标定，请勿操作",
            type: "error",
            grouping: true,
            plain: true,
            showClose: true,
            offset: 75,
          });
          setTimeout(() => {
            globals.$store.state.isFullScreenLoading = true;
            globals.$store.state.fullScreenloadingText = "正在进行相机标定中， 请稍等...";
            frameCailNum.value = frameCailNum.value + 2;
            calibrateCamFn();
          }, 2000);
        }
      }
      if (val.repType == "/getCailPly" && val.state === 200) {
        globals.$store.state.isFullScreenLoading = false;
        addCailPly(val.data);
      }
      if (val.repType == "/startFrameSegment" && val.state === 200) {
        globals.$store.state.isFullScreenLoading = false;
        console.log(val);
      }
    }
    globals.$store.state.wsMessage = null;
  }
});

const selectStatus = () => {
  router.push("/index/sourceSelect");
};

// 生命周期钩子
onMounted(async () => {
  createWS();
  for (let key in globals.$store.state.curModuleObj) {
    curVideoObj[key] = globals.$store.state.curModuleObj[key];
  }

  globals.$store.state.isFullScreenLoading = true;
  let params = route.query || {};
  firstType = params.type;
  startTime = params.startTime;
  if (params.others == 0) {
    globals.$store.state.fullScreenloadingText = "正在视频分割处理中， 请稍等...";
    sendWs({
      reqType: "/startSplitVideoFrame",
      sourcePath: globals.$store.state.curModuleObj.full_path,
      type: params.type,
      startTime: params.startTime,
      endTime: params.endTime,
      sourceName: globals.$store.state.curModuleObj.name,
    });
  }
  if (params.others == 1) {
    globals.$store.state.fullScreenloadingText = "正在进行相机标定中， 请稍等...";
    frameCailNum.value = Number(startTime * 25) + 1;
    calibrateCamFn();
  }
  if (params.others == 2) {
    frameCailNum.value = params.cailNum;
    globals.$store.state.fullScreenloadingText = "开始加载标定结果， 请稍等...";
    globals.$store.state.isFullScreenLoading = false;
    sendWs({
      reqType: "/getCailPly",
      sourcePath: curVideoObj.full_path,
      sourceName: curVideoObj.name,
      frameNum: frameCailNum.value,
    });
  }
  if (firstType == 0) {
    allFrameNum = 1000;
  }
  if (firstType == 1) {
    allFrameNum = (params.endTime - params.startTime) * 25;
  }
});

onUnmounted(() => {});

// 重新标定
const reCailbrateFn = () => {
  frameCailNum.value = frameCailNum.value + 2;
  calibrateCamFn();
};

const startSegFn = () => {
  globals.$store.state.isFullScreenLoading = true;
  globals.$store.state.fullScreenloadingText = "目标分割处理中， 请稍等...";
  sendWs({
    reqType: "/startFrameSegment",
    sourcePath: curVideoObj.full_path,
    frameNum: frameCailNum.value,
    allFrameNum: allFrameNum,
    sourceName: globals.$store.state.curModuleObj.name,
    type: firstType,
    description: "a man",
    startTime: startTime,
  });
};

// 开始标定
const calibrateCamFn = () => {
  sendWs({
    reqType: "/startCalibrateCamera",
    sourcePath: curVideoObj.full_path,
    sourceName: curVideoObj.name,
    frameNum: frameCailNum.value,
  });
};
</script>

<style lang="scss" scoped>
.no-select-params {
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.mid-box {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 150;
}

.no-wrap-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.top-btns-menu {
  color: white;
  padding: 5px 53px 0;
  margin-bottom: 15px;
  @extend .no-select-params;
  @extend .no-wrap-text;

  span {
    display: inline-block;
    color: white;
    padding: 3px 12px 6px;
    background-color: #575656;
    cursor: pointer;
    border-right: 1px solid #737272;
  }

  span:nth-child(1) {
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
  }

  span:last-child {
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
    border-right: none;
  }
}

.title-select {
  color: white;
  width: 100%;
  text-align: center;
  margin: 10px 0;
  letter-spacing: 2px;
  @extend .no-select-params;
  @extend .no-wrap-text;
}

.color-text {
  font-size: 22px;
  font-family: Verdana, Geneva, STCaiyun, sans-serif;
  background-image: -webkit-linear-gradient(#ecedee 0%, #6a6c80 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-filter: drop-shadow(2px 2px 12px #7feee8);
}

.active-btns {
  display: inline-block;
  color: white;
  padding: 3px 10px 6px;
  cursor: pointer;
  border-radius: 3px;
  border-right: 1px solid #737272;
  @extend .no-select-params;
  @extend .no-wrap-text;
  background-color: #219da6;
  &:hover {
    opacity: 0.7;
  }
}

.source-info-box {
  position: absolute;
  left: 0;
  top: 0;
  height: 170px;
  width: 300px;
  border-right: 1px solid #219da6;
  border-bottom: 1px solid #219da6;
  background-color: rgba(49, 49, 49, 0.7);
  z-index: 150;
}
.cailbrate_result_box {
  width: 100%;
  margin-top: 10px;
}
.btn_danger {
  background-color: red !important;
  margin-left: 90px;
}
.cailbrate_result_box {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
}
.cail_ck-val {
  margin-top: 15px;
  padding-left: 10px;
  color: white;
}
.small-btn {
  font-size: 12px;
  padding-bottom: 3px;
}
</style>
