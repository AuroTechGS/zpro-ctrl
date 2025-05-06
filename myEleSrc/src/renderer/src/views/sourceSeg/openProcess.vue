<template>
  <el-dialog
    :model-value="props.isShow"
    :title="curTitle"
    width="500"
    height="32%"
    align-center
    @open="open"
    :before-close="handleClose"
    :close-on-press-escape="false"
  >
    <div class="open-process">
      <el-progress
        :percentage="processVal"
        :stroke-width="20"
        status="success"
        striped
        striped-flow
        :duration="30"
        :text-inside="true"
        color="#454A5D"
      />
    </div>
    <div class="my_dialog_footer_box" style="background-color: #cdd0d6">
      <el-button size="small" @click="handleClose" plain>取消</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
const globals = getCurrentInstance().appContext.config.globalProperties;

const props = defineProps({
  isShow: Boolean,
  processVal: Number,
  curTitle: String,
});
// 触发父组件事件方法
const emit = defineEmits(["closeDialog"]);

// 关闭弹窗
const handleClose = () => {
  emit("closeDialog");
};
const open = () => {};
</script>

<style scoped lang="scss">
.open-process {
  width: 100%;
  height: 100%;
  padding: 40px 10px 25px;
  background-color: #cdd0d6;
}
</style>
