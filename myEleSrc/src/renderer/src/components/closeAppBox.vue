<template>
  <el-dialog
    :model-value="props.isShow"
    title="退出提示"
    width="400"
    height="30%"
    align-center
    @open="open"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="open-process">是否确认退出应用？</div>
    <div class="my_dialog_footer_box" style="background-color: #cdd0d6">
      <el-button size="small" type="danger" @click="confirmClose">确认</el-button>
      <el-button size="small" @click="handleClose" plain>取消</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
const props = defineProps({
  isShow: Boolean,
});
// 关闭弹窗
const handleClose = () => {
  emit("closeDialog");
};

// 触发父组件事件方法
const emit = defineEmits(["closeDialog"]);
const open = () => {};

const confirmClose = () => {
  window.electron.ipcRenderer.send("operationWindow", "close");
};
</script>

<style scoped lang="scss">
.open-process {
  //   color: white;
  height: 100%;
  width: 100%;
  padding: 25px 10px 5px;
  background-color: #cdd0d6;
  color: red;
  font-weight: 600;
}
</style>
