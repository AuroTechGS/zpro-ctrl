<template>
    <el-dialog :model-value="props.isShow" title="正在连接中，请勿进行其他操作" width="500" height="32%" align-center @open="open"
        :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="open-process">
            <el-progress :percentage="globals.$store.state.camConnectPerset" :stroke-width="20" status="success" striped striped-flow
                :duration="30" :text-inside="true" color="#454A5D" />
        </div>
        <div class="my_dialog_footer_box" style="background-color: #CDD0D6;">
            <el-button size="small" @click="handleClose" plain>取消</el-button>
        </div>
    </el-dialog>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue'
const globals = getCurrentInstance().appContext.config.globalProperties

const props = defineProps({
    isShow: Boolean,
})
// 触发父组件事件方法
const emit = defineEmits(['search', 'closeDialog'])

// 关闭弹窗
const handleClose = () => {
    globals.$store.state.camConnectProcess = false
    emit('closeDialog')
    globals.$store.state.camConnectPerset = 0
}
let timerProcess = null;
const open = () => {
    timerProcess = setInterval(() => {
        if(globals.$store.state.camConnectProcess) {
            clearInterval(timerProcess)
            timerProcess = null;
            handleClose()
        }
    }, 500)
}
</script>

<style scoped lang="scss">
.open-process {
    width: 100%;
    height: 100%;
    padding: 40px 10px 25px;
    background-color: #CDD0D6;
}
</style>