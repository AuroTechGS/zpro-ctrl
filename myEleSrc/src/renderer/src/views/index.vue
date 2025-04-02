<template>
  <div class="all-pages">
    <HeadBox style="z-index: 2100" @appClose="onAppCloseFn" />
    <div class="view-Page">
      <transition name="loadingFade">
        <FullScreenLoad v-show="globals.$store.state.isFullScreenLoading" />
      </transition>
      <router-view />
    </div>
    <!-- 底部拍摄UI -->
    <div class="capture-setting-start">
      <div class="middle-btns-show">
        <span style="margin-right: 15px">技术支持-奥凯空间影像</span>
        <!-- <span style="margin-right: 15px">联系方式：0455-2564</span> -->
        <span>版本号：v1.0.1</span>
      </div>
    </div>
    <!-- 确认关闭弹框 -->
    <CloseAppBox :isShow="isShowCloseAppDialog" @closeDialog="closeFn" />
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import HeadBox from "../components/header.vue";
import CloseAppBox from "../components/closeAppBox.vue";
import FullScreenLoad from "../components/loadingAllScreen.vue";
let isShowCloseAppDialog = ref(false);
const globals = getCurrentInstance().appContext.config.globalProperties;
onMounted(() => {});
const onAppCloseFn = () => {
  isShowCloseAppDialog.value = true;
};
const closeFn = () => {
  isShowCloseAppDialog.value = false;
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
  height: calc(100% - 70px);
  background-color: #313131;
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
</style>

<style>
.el-notification.right {
  right: 1px !important;
}

/* 定义 SimpleBar 滚动条 */
.simplebar-scrollbar {
  width: 10px;
  /* 滚动条宽度 */
}

/* 滚动条滑块的颜色（拖动部分） */
.simplebar-scrollbar:before {
  background-color: #747679;
  /* 滚动条滑块的背景色 */
  border-radius: 8px;
  /* 滚动条滑块的圆角 */
}

/* 滚动条轨道的颜色 */
.simplebar-track {
  /* background: rgba(0, 0, 0, 0.3); 滚动条轨道的背景色 */
  background-color: transparent;
  border-radius: 8px;
}

.el-overlay-dialog,
.el-overlay {
  top: 35px;
  left: 0;
  right: 0;
  z-index: 2001 !important;
}

.el-dialog {
  --el-dialog-padding-primary: 0 !important;
  --el-dialog-bg-color: white !important;
  background-color: white !important;
  z-index: 2001 !important;
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
