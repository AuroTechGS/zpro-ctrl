<template>
  <div class="view-Page-two">
    <div class="mid-box">
      <div class="title-select color-text">请选择要重建的项目文件</div>
      <div class="top-btns-menu">
        <span :class="[fileStatus == 0 ? 'active-btns' : '']" @click="selectStatus(0)"
          >全部</span
        >
        <span :class="[fileStatus == 1 ? 'active-btns' : '']" @click="selectStatus(1)"
          >进行中</span
        >
        <span
          class="last-span"
          :class="[fileStatus == 2 ? 'active-btns' : '']"
          @click="selectStatus(2)"
          >已完成</span
        >
        <div class="refrush-box" title="刷新">
          <i class="iconfont icon-shuaxin" @click="refrushFn"></i>
        </div>
      </div>
      <div class="source-list-box">
        <ul>
          <li class="source-item" v-for="(item, index) in sourceList" :key="index">
            <div class="item-name single-text-overflow">{{ item.name }}</div>
            <div style="font-size: 14px; margin: 5px 0">{{ item.creatDate }}</div>
            <div class="item-more">
              <i class="iconfont icon-gengduo dorDefaut" @click="moreFn(1)"></i>
            </div>
            <div class="item-btns">
              <el-button
                type="primary"
                v-if="item.runStatus == 0"
                plain
                style="padding: 5px 10px 5px 5px"
              >
                <i class="iconfont icon-kaishi" style="margin-right: 3px"></i>
                <span style="vertical-align: middle" @click="startItemFile(item)"
                  >开始</span
                >
              </el-button>
              <el-button
                type="primary"
                v-if="item.runStatus == 1"
                plain
                style="padding: 5px"
              >
                <i class="iconfont icon-kaishi1" style="margin-right: 2px"></i>
                <span style="vertical-align: middle" @click="continue_lastFn(item)"
                  >继续</span
                >
              </el-button>
              <el-button
                type="primary"
                v-if="item.runStatus == 1 || item.runStatus == 2"
                plain
                style="padding: 5px"
              >
                <i class="iconfont icon-kaishi" style="margin-right: 3px"></i>
                <span style="vertical-align: middle" @click="startItemFile(item)"
                  >重新开始</span
                >
              </el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <el-dialog
    :model-value="videoSelectShow"
    :title="'文件名：' + curVideoObj.name"
    width="84%"
    style="height: 80vh"
    align-center
    center
    @open="open"
    :before-close="dialogCloseFn"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="select-box">
      <div class="left-video-show">
        <video
          v-if="videoSelectShow"
          id="video"
          controls
          muted
          playsinline
          :poster="coverPngBase64"
          style="width: 100%; height: 100%"
        ></video>
        <span class="video-play-btn" v-show="isFirstOpen" @click="videoPlayFn">
          <i class="iconfont icon-kaishi" style="margin-right: 3px"></i>
        </span>
      </div>
      <div class="right-time-select">
        <div
          style="
            width: 100%;
            margin: 10px 0;
            text-align: center;
            font-size: 18px;
            color: #409eff;
            font-weight: 600;
          "
        >
          请选择时间范围后进行下一步
        </div>
        <div style="margin-top: 20px">
          <span>视频时长：</span>
          <span>{{ allTimes }}</span>
          <span style="padding-left: 10px">（{{ curShowVideoTime }}秒）</span>
        </div>
        <div style="margin-top: 15px">
          <span>选择范围：</span>
          <el-select
            v-model="selectType"
            :teleported="false"
            placeholder="请选择类型"
            size="small"
            style="width: calc(100% - 90px)"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div v-show="selectType === 1" style="margin-top: 15px">时间范围(单位：秒):</div>
        <div style="margin: 10px 0; display: flex" v-show="selectType === 1">
          <span style="display: inline-block; text-indent: 1rem">开始时间：</span>
          <span style="width: calc(100% - 106px); display: inline-block">
            <el-input-number
              size="small"
              v-model="startTime"
              style="width: 100%"
              :min="0"
              :max="100"
            />
          </span>
        </div>
        <div style="margin: 10px 0; display: flex" v-show="selectType === 1">
          <span style="display: inline-block; text-indent: 1rem">结束时间：</span>
          <span style="width: calc(100% - 106px); display: inline-block">
            <el-input-number
              size="small"
              v-model="endTime"
              style="width: 100%"
              :min="1"
              :max="100"
            />
          </span>
        </div>
        <div class="video-show-btns">
          <el-button type="primary" round @click="startSplitVideo()">确定</el-button>
          <el-button round @click="dialogCloseFn">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
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
const globals = getCurrentInstance().appContext.config.globalProperties;
import { useRouter } from "vue-router";
import { debounce } from "lodash";

const router = useRouter();

let sourceList = ref([]);
let fileStatus = ref(0);
let bufferQueue = [];
let isAppending = false;
let isFirstOpen = ref(false);
let selectType = ref(0);
let loadFramed = null;

let typeOptions = reactive([
  { label: "全部", value: 0 },
  { label: "自定义时间范围", value: 1 },
]);

let videoSelectShow = ref(false);
let sourceBuffer = null;
let mediaSource = null;

let startTime = ref(0);
let endTime = ref(1);
let curShowVideoTime = ref(0);
let coverPngBase64 = ref("");
let curReadyVideoPath = "";

let curVideoObj = reactive({});

const wsMessage = computed(() => globals.$store.state.wsMessage);

let allTimes = computed(() => {
  let totalSeconds = curShowVideoTime.value;
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
});

const uint8Hand = async (blob) => {
  let buffers = await blob.arrayBuffer();
  bufferQueue.push(buffers);
  appendNextBuffer();
};

watch(wsMessage, (newVal) => {
  if (newVal) {
    if (newVal instanceof Blob) {
      if (videoSelectShow.value && sourceBuffer && mediaSource) {
        loadFramed = 1;
        uint8Hand(newVal);
      }
    } else {
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
        if (val.repType == "/getAllSourcefile" && val.state === 200) {
          dealFiles(val.data);
          globals.$store.state.isFullScreenLoading = false;
        }
        if (val.repType == "/getselectCover" && val.state === 200) {
          curShowVideoTime.value = Math.floor(val.data.allTime);
          coverPngBase64.value = val.data.coverPng;
          curReadyVideoPath = val.data.videoPath;
        }
        if (val.repType == "/getselectVideo" && val.state === 200) {
          if (val.isDone && val.isDone === "end") {
            loadFramed = null;
            let setTimer = setInterval(() => {
              if (!bufferQueue.length && sourceBuffer && !sourceBuffer.updating) {
                mediaSource.endOfStream();
                clearInterval(setTimer);
              }
              if (sourceBuffer === null) {
                clearInterval(setTimer);
              }
            }, 2000);
          }
        }
        if (val.repType == "/getLastRunTask" && val.state === 200) {
          console.log(val);
          globals.$store.state.curModuleObj = curVideoObj;
          if (val.data.length == 1) {
            if (val.data[0].start_frame_time !== null) {
              selectType.value = 1;
              startTime.value = Number(val.data[0].start_frame_time);
              endTime.value = Number(val.data[0].end_frame_time);
            } else {
              selectType.value = 0;
            }
            router.push(
              `/index/calibrateCam?sourname=${curVideoObj.name}&type=${selectType.value}&startTime=${startTime.value}&endTime=${endTime.value}&others=1`
            );
          }
          if (val.data.length == 2) {
            if (val.data[0].start_frame_time !== null) {
              selectType.value = 1;
              startTime.value = Number(val.data[0].start_frame_time);
              endTime.value = Number(val.data[0].end_frame_time);
            } else {
              selectType.value = 0;
            }
            if (Number(val.data[1].status) == 0) {
              router.push(
                `/index/calibrateCam?sourname=${curVideoObj.name}&type=${selectType.value}&startTime=${startTime.value}&endTime=${endTime.value}&others=1`
              );
            } else {
              let cailNum = Number(val.data[1].cailbrate_frame_num);
              router.push(
                `/index/calibrateCam?sourname=${curVideoObj.name}&type=${selectType.value}&startTime=${startTime.value}&endTime=${endTime.value}&others=2&cailNum=${cailNum}`
              );
            }
          }
        }
      }
    }
    // 处理完可以清空
    globals.$store.state.wsMessage = null;
  }
});

// 生命周期钩子
onMounted(async () => {
  createWS();
  globals.$store.state.fullScreenloadingText = "正在获取我的资源中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;
  await sleep(1000);
  sendWs({ reqType: "/getAllSourcefile" });
});

onUnmounted(() => {});

const refrushFn = async () => {
  globals.$store.state.fullScreenloadingText = "正在获取我的资源中，请稍等...";
  globals.$store.state.isFullScreenLoading = true;
  await sleep(1000);
  sendWs({ reqType: "/getAllSourcefile" });
};

const videoPlayFn = () => {
  if (!curReadyVideoPath.length) return;
  isFirstOpen.value = false;
  sendWs({
    reqType: "/getselectVideo",
    sourcePath: curReadyVideoPath,
  });
  mediaSource = new MediaSource();
  const video = document.querySelector("video");
  video.src = URL.createObjectURL(mediaSource);
  video.onerror = () => {
    console.error("🎥 Video 播放错误：", video.error);
    switch (video.error.code) {
      case 1:
        console.error("MEDIA_ERR_ABORTED：用户终止请求");
        break;
      case 2:
        console.error("MEDIA_ERR_NETWORK：网络错误");
        break;
      case 3:
        console.error("MEDIA_ERR_DECODE：解码失败，数据格式错误！");
        break;
      case 4:
        console.error("MEDIA_ERR_SRC_NOT_SUPPORTED：媒体格式不支持");
        break;
      default:
        console.error("未知错误");
    }
  };
  mediaSource.addEventListener(
    "sourceopen",
    () => {
      mediaSource.duration = curShowVideoTime.value;
    },
    { once: true }
  );
  mediaSource.addEventListener("sourceopen", () => {
    const mime = 'video/mp4; codecs="avc1.42E01E"'; // h264
    sourceBuffer = mediaSource.addSourceBuffer(mime);
    sourceBuffer.addEventListener("updateend", () => {
      isAppending = false;
      appendNextBuffer();
    });
    video.play();
  });
};

const startSplitVideo = debounce(() => {
  if (startTime.value >= endTime.value || endTime.value > curShowVideoTime.value) {
    return ElMessage({
      message: "开始时间不得大于结束时间， 并且结束时间不能大于视频总时长",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
  if (loadFramed === 1) {
    sendWs({
      reqType: "/cancelVideoFrame",
      sourcePath: curReadyVideoPath,
    });
  }
  globals.$store.state.curModuleObj = curVideoObj;
  router.push(
    `/index/calibrateCam?sourname=${curVideoObj.name}&type=${selectType.value}&startTime=${startTime.value}&endTime=${endTime.value}&others=0`
  );
}, 1000);

const open = () => {};

const appendNextBuffer = () => {
  if (!sourceBuffer || isAppending || bufferQueue.length === 0) return;
  const buffer = bufferQueue.shift();
  sourceBuffer.appendBuffer(buffer);
  isAppending = true;
};

const dealFiles = (data) => {
  data.forEach((item) => {
    item.creatDate = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss");
  });
  sourceList.value = data;
  console.log(sourceList.value);
};

// 开始分割
const startItemFile = (val) => {
  videoSelectShow.value = true;
  selectType.value = 0;
  isFirstOpen.value = true;
  curShowVideoTime.value = 0;
  loadFramed = null;
  curReadyVideoPath = "";
  for (let key in val) {
    curVideoObj[key] = val[key];
  }
  sendWs({
    reqType: "/getselectCover",
    sourcePath: val.full_path,
  });
};

// 继续上次操作
const continue_lastFn = (val) => {
  for (let key in val) {
    curVideoObj[key] = val[key];
  }
  sendWs({
    reqType: "/getLastRunTask",
    sourcePath: val.full_path,
    sourceName: val.name,
  });
};

// 关闭弹框
const dialogCloseFn = () => {
  videoSelectShow.value = false;
  mediaSource = null;
  sourceBuffer = null;
  coverPngBase64.value = "";
  if (loadFramed === 1) {
    sendWs({
      reqType: "/cancelVideoFrame",
      sourcePath: curReadyVideoPath,
    });
  }
};

const selectStatus = (val) => {
  fileStatus.value = val;
};

const moreFn = () => {};
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
    padding: 3px 12px 6px;
    background-color: #575656;
    cursor: pointer;
    border-right: 1px solid #737272;
  }

  span:nth-child(1) {
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
  }

  .last-span {
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
  font-size: 36px;
  font-family: Verdana, Geneva, STCaiyun, sans-serif;
  background-image: -webkit-linear-gradient(#ecedee 0%, #6a6c80 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-filter: drop-shadow(2px 2px 12px #7feee8);
}

.source-list-box {
  height: calc(100% - 113px);
  width: 100%;
  padding: 0 35px;

  ul {
    width: 100%;
    max-height: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    align-items: flex-start;
    justify-content: flex-start;

    &::-webkit-scrollbar {
      width: 7px;
      height: 7px;
      background-color: transparent;
      border-radius: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #747679;
      border-radius: 7px;
      // background: rgb(110, 151, 196);
    }

    .source-item {
      position: relative;
      height: 160px;
      width: 236px;
      margin: 0 17px 36px;
      background-color: white;
      border-radius: 12px;
      padding: 8px 6px;
      filter: drop-shadow(1px 2px 6px rgb(167, 238, 240));

      .item-name {
        width: calc(100% - 22px);
        font-size: 20px;
        font-weight: 600;
        color: #1c8593;
      }

      .item-more {
        width: 30px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: rgba(151, 145, 145, 0.2);
          border-radius: 4px;
        }

        .dorDefaut {
          font-size: 28px;
          color: rgb(15, 119, 121);
        }
      }

      .item-btns {
        position: absolute;
        bottom: 20px;
        left: 15px;
      }

      &:hover {
        // transform: scale(1.05, 1.05);
      }
    }
  }
}

.active-btns {
  background-color: #219da6 !important;
}

.select-box {
  height: calc(80vh - 30px);
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-between;

  .left-video-show {
    width: 72%;
    height: 100%;
    background-color: black;
    border-radius: 5px;
    padding: 20px 3px;
    position: relative;
  }

  .right-time-select {
    width: 27%;
    height: 100%;
    background-color: #f6f5f5;
    border-radius: 5px;
    padding: 8px 5px;
    position: relative;

    .video-show-btns {
      position: absolute;
      bottom: 30px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}

.video-play-btn {
  font-size: 28px;
  position: absolute;
  bottom: 52px;
  left: 14px;
  color: white;
  cursor: pointer;

  i {
    font-size: 24px !important;
  }

  &:hover {
    opacity: 0.8;
  }
}
.refrush-box {
  // display: inline-block;
  float: right;
  font-size: 24px;
  width: 28px;
  height: 28px;
  color: rgb(41, 185, 41);
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  i {
    font-size: 22px !important;
    &::before {
      font-size: 22px !important;
    }
  }
}
</style>
