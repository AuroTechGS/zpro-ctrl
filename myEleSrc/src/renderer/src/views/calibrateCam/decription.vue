<template>
  <el-dialog
    :model-value="props.isShow"
    title="请输入要分割的目标物"
    width="600"
    height="42%"
    align-center
    @open="open"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="open-process">
      <el-input
        v-model="describeValue"
        style="width: 100%"
        placeholder="Please input"
        clearable
      />
    </div>
    <div class="my_dialog_footer_box" style="background-color: #cdd0d6">
      <el-button size="small" @click="handleClose" plain>取消</el-button>
      <el-button size="small" type="primary" @click="confirmFn">确认</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
const globals = getCurrentInstance().appContext.config.globalProperties;
let describeValue = ref("");
const props = defineProps({
  isShow: Boolean,
});
// 触发父组件事件方法
const emit = defineEmits(["closeDialog", "descritpCon"]);

// 关闭弹窗
const handleClose = () => {
  emit("closeDialog");
};
const confirmFn = () => {
  if (describeValue.value.trim().length === 0) {
    return ElMessage({
      message: "请输入分割目标描述",
      type: "error",
      grouping: true,
      plain: true,
      showClose: true,
      offset: 75,
    });
  }
  emit("descritpCon", describeValue.value.trim());
};
const open = () => {
  describeValue.value = "";
};
</script>

<style scoped lang="scss">
.open-process {
  width: 100%;
  height: 100%;
  padding: 70px 10px 60px;
  background-color: #cdd0d6;
}
</style>
