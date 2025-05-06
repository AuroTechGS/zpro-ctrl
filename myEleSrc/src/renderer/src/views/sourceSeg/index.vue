<template>
  <div class="view-Page-two">
    <div class="left-project-files">
      <div class="tips-tab">
        <span>数据帧</span>
      </div>
      <ul data-simplebar>
        <li
          v-for="(item, index) in filesList"
          class="dir-files-item"
          :key="index"
          @click="dirFilesClickFn(item, index)"
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
          </div>
        </li>
      </ul>
    </div>
    <div class="right-seg-cas">
      <div class="right-rect-box" ref="casImgBox">
        <div class="tips-tab">
          <span>分割效果</span>
        </div>
        <canvas ref="container" id="container" :width="cavWid" :height="cavHei"></canvas>
      </div>
      <div class="right-seg-project-layer">
        <div class="title-select color-text">
          {{ globals.$store.state.curModuleObj.name }}
        </div>
        <div class="cailbrate_result_box" style="margin-top: 15px">
          <span class="active-btns small-btn" @click="segmentSingleFrameFn"
            >重新分割</span
          >
        </div>
        <div class="cailbrate_result_box">
          <span
            class="active-btns small-btn"
            style="background-color: red !important"
            @click="selectStatus()"
            >退出当前任务</span
          >
          <span class="active-btns small-btn" @click="inputDesciptFn">下一步</span>
        </div>
      </div>
    </div>
    <openProcess
      :isShow="showProcBox"
      :processVal="trainProcess"
      :curTitle="processTitle"
      @closeDialog="proDialogCloseFn"
    />
  </div>
</template>

<script setup lang="js">
import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar";
import openProcess from "./openProcess.vue";
import { ref, onMounted, onUnmounted, nextTick, getCurrentInstance, reactive, computed, watch } from 'vue';
import { createWS, sendWs } from "../../assets/js/wsClient.js";
import { ElMessage } from "element-plus";
const globals = getCurrentInstance().appContext.config.globalProperties;

import { sleep } from "../../assets/js/untils";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
let filesList = ref([])
let curShowPngObj = reactive({});
let orignList = []
let container = ref(null)
let casImgBox = ref(null)
let cavWid = ref(0)
let cavHei = ref(0)
let showProcBox = ref(false)
let processTitle = ref('正在进行生成中，请稍等...')

let trainProcess = ref(0)

let manPng = ref('')
let maskPng = ref('')

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
      if (val.repType == "/getFrameSourcefile" && val.state === 200) {
        let curList = val.data.sort((a, b) => a.fileName.localeCompare(b.fileName))
        curList.forEach(item => {
          item.isShow = true
          item.isEdit = item.isEdit
          item.showChirld = false
          item.level = 1
        })
        orignList = curList
        filesList.value = curList
      }
      if (val.repType == "/getSingleFramefile" && val.state === 200) {
        console.log(val)
        manPng.value = val.data[0]
        maskPng.value = val.data[1]
        writePhoto(manPng.value, 1)
        writePhoto(maskPng.value, 0)
      }
      if (val.repType == "/resetSegFrame" && val.state === 200) {
        console.log(val)
        dbSelectCurPng(curShowPngObj)
      }
    }
  }
})

const proDialogCloseFn = () => {
  sendWs({
    reqType: "/endStaticTrain",
    sourcePath: globals.$store.state.curModuleObj.full_path,
    sourceName: globals.$store.state.curModuleObj.name,
  });
  showProcBox.value = false
}

const selectStatus = () => {
  router.push("/index/sourceSelect");
};

const inputDesciptFn = () => {
  showProcBox.value = true;
  sendWs({
    reqType: "/startStaticTrain",
    sourcePath: globals.$store.state.curModuleObj.full_path,
    sourceName: globals.$store.state.curModuleObj.name,
  });
}

let canvas = null
onMounted(() => {
  let params = route.query || {};

  nextTick(async () => {
    createWS();
    await sleep(500);
    window.addEventListener("resize", initDomHeight);
    canvas = container.value
    cavHei.value = Math.floor(casImgBox.value.getBoundingClientRect().height - 30)
    cavWid.value = Math.floor(casImgBox.value.getBoundingClientRect().width)
    getFilesTree();
  })
})


const writePhoto = (base64Image, type) => {
  const ctx = canvas.getContext('2d')
  // 创建 Image 对象进行加载
  const img = new Image()

  // 当图片加载完成时，按原比例缩放画到 canvas 上
  img.onload = () => {
    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight)
    // 计算居中显示时，图片左上角的坐标
    const x = (canvasWidth - imgWidth * scale) / 2
    const y = (canvasHeight - imgHeight * scale) / 2
    if (type === 1) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    }
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
  }

  // 触发加载
  img.src = base64Image
}


// 获取文件列表
const getFilesTree = async () => {
  sendWs({
    reqType: "/getFrameSourcefile",
    sourcePath: globals.$store.state.curModuleObj.full_path,
    sourceName: globals.$store.state.curModuleObj.name,
  });
}

// 选择显示图片
const dbSelectCurPng = (item) => {
  for (let key in item) {
    curShowPngObj[key] = item[key]
  }
  sendWs({
    reqType: "/getSingleFramefile",
    sourcePath: globals.$store.state.curModuleObj.full_path,
    sourceName: globals.$store.state.curModuleObj.name,
    curSingleFramePath: item.filePath
  });
}

// 重新分割单独桢
const segmentSingleFrameFn = () => {
  let frameNum = Number(curShowPngObj.fileName.slice(-9, -4))
  sendWs({
    reqType: "/resetSegFrame",
    sourcePath: globals.$store.state.curModuleObj.full_path,
    sourceName: globals.$store.state.curModuleObj.name,
    frameNum: frameNum
  });
}

const dirFilesClickFn = (item, dirIndex) => {
  if (item.type === 'dir') {
    item.showChirld = !item.showChirld
    if (item.showChirld) {
      let childrenList = item.children
      childrenList.forEach(itccm => {
        itccm.isShow = true
        itccm.parentNodeName = item.fileName
      })
      childrenList.sort((a, b) => a.fileName.localeCompare(b.fileName))
      filesList.value.splice(dirIndex + 1, 0, ...childrenList)
    } else {
      let chidrenList = filesList.value.filter(iccm => iccm.parentNodeName === item.fileName)
      if (chidrenList.length) {
        filesList.value.splice(dirIndex + 1, chidrenList.length)
      }
    }
  }
  if (item.type === 'png') {
    dbSelectCurPng(item)
  }
}

const initDomHeight = () => {
  cavHei.value = Math.floor(casImgBox.value.getBoundingClientRect().height - 30)
  cavWid.value = Math.floor(casImgBox.value.getBoundingClientRect().width)
  if (manPng.value.length && manPng.value.length) {
    writePhoto(manPng.value, 1)
    writePhoto(maskPng.value, 0)
  }
}
onUnmounted(() => {
  window.removeEventListener("resize", initDomHeight);
});
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
  width: 210px;
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
  width: calc(100% - 210px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #313131;
  color: white;

  .right-rect-box {
    width: calc(100% - 280px);
    height: 100%;

    img {
      height: 100%;
      width: auto;
      margin-left: 50px;
    }
  }

  .right-seg-project-layer {
    height: 100%;
    width: 280px;
    border-left: 1px solid #108085;
    padding-top: 10px;
  }
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

.title-select {
  color: white;
  width: 100%;
  text-align: center;
  margin: 10px 0;
  letter-spacing: 2px;
  @extend .no-select-params;
}

.color-text {
  font-size: 24px;
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

.cailbrate_result_box {
  width: 100%;
  margin-top: 15px;
  display: flex;
  justify-content: space-around;
  padding: 0;
}
</style>
