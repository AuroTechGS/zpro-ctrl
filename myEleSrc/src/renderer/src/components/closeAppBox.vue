<template>
  <div v-if="props.isShow" class="exit-bkg">
    <div class="exit-box">
      <div class="exit-top-tip">
        <span>退出提示</span>
        <Close class="nav-close" @click="handleClose" />
      </div>
      <div class="open-process"><span class="icon-xxxc">!</span> 是否确认退出应用？</div>
      <div class="my_dialog_footer_box" style="background-color: #cdd0d6">
        <el-button size="small" type="danger" @click="confirmClose">确认</el-button>
        <el-button size="small" @click="handleClose" plain>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Close } from "@element-plus/icons-vue";
const props = defineProps({
  isShow: Boolean,
});
// 关闭弹窗
const handleClose = () => {
  emit("closeDialog");
};

// 触发父组件事件方法
const emit = defineEmits(["closeDialog"]);

const confirmClose = () => {
  window.electron.ipcRenderer.send("operationWindow", "close");
};
</script>

<style scoped lang="scss">
.open-process {
  height: 100%;
  width: 100%;
  padding: 25px 10px 5px;
  background-color: #cdd0d6;
  color: red;
  font-weight: 600;
}
.exit-box {
  position: relative;
  top: -30px;
  width: 35%;
  height: 10%;
  background-color: white;
  border-radius: 5px;
  // border: 1px solid #ccc;
}
.exit-bkg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(48, 49, 51, 0.6);
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.exit-top-tip {
  padding: 3px 6px;
  background-color: #786161;
  color: white;
  // border-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: relative;
}

.nav-close {
  position: absolute;
  right: 6px;
  font-size: 14px;
  height: 20px;
  width: 20px;
  padding: 1.6px;
  cursor: pointer;
  border-radius: 3px;
  &:hover {
    background-color: #1f1f1f;
  }
}
.icon-xxxc {
  display: inline-block;
  background-color: red;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 0px;
}
</style>
