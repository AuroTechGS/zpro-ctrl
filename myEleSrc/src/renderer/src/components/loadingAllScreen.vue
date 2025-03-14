<template>
  <div class="loading-all-screen">
    <div class="mid-box">
      <div class="icon-box">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
      </div>
      <div class="text-box">
        {{ globals.$store.state.fullScreenloadingText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const globals = getCurrentInstance().appContext.config.globalProperties;
import { Loading } from "@element-plus/icons-vue";
</script>

<style lang="scss" scope>
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

.loading-all-screen {
  height: 100%;
  width: 100%;
  z-index: 2100;
  position: absolute !important;
  top: 0;
  left: 0;
  // background-color: #ccc;
  background-color: rgba(149, 149, 149, 0.7);
  // opacity: 0.3;
  display: flex;
  justify-content: center;
  align-items: center;
  @extend .no-select-params;
  @extend .no-wrap-text;
  .mid-box {
    height: 80px;
    width: 600px;
    margin-top: -50px;
    .icon-box {
      height: 70%;
      width: 50%;
      margin-left: 25%;
      font-size: 40px;
      font-weight: bold;
      color: #00afff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .text-box {
      height: 30%;
      width: 100%;
      color: #00afff;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
  }
}
</style>
