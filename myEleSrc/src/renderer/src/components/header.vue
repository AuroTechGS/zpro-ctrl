<template>
    <div class="head-box" @mousedown="mdfn" @mouseup="mufn">
        <div class="nav-left">
            <img class="ico-img" src="../assets/images/icoimg.png" alt=""></img>
            <div class="menus-seting">
                <!-- <div class="top-button-set" :class="[tabStatus === 0 ? 'top-button-active' : '']"
                    @mousedown.stop="stopDefaut" @mouseup.stop="stopDefaut" @click="captureOtherFn">
                    <VideoCamera style="width: 1.2em; height: 1.2em; margin-right: 4px;" />
                    拍摄
                </div> -->
                <!-- <el-dropdown placement="bottom-start" trigger="click" :teleported="false" @mousedown.stop="stopDefaut"
                    @mouseup.stop="stopDefaut" :disabled="globals.$store.state.isFullScreenLoading">
                    <div class="top-button-set">
                        <VideoCamera style="width: 1.2em; height: 1.2em; margin-right: 4px;" />
                        相机
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="captureOtherFn"><span class="capture-select-icon"><Select
                                        v-show="globals.$store.state.currentCaptureType === globals.$store.state.captureType_2"
                                        style="width: 1em; height: 1em;" /></span>
                                <span style="margin-right:10px;">Z2PRO相机</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
</el-dropdown> -->

                <div class="top-button-set" :class="[tabStatus === 1 ? 'top-button-active' : '']"
                    @mousedown.stop="stopDefaut" @mouseup.stop="stopDefaut" @click="imgSegFn">
                    <Crop style="width: 1em; height: 1em; margin-right: 4px;margin-top: 2px;" />
                    分割
                </div>
                <!-- <el-dropdown placement="bottom-start" trigger="click" :teleported="false" @mousedown.stop="stopDefaut"
                    @mouseup.stop="stopDefaut" :disabled="globals.$store.state.isFullScreenLoading">
                    <div class="top-button-set">
                        <Edit style="width: 1em; height: 1em; margin-right: 4px;margin-top: 2px;" />
                        帮助
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>版本信息</el-dropdown-item>
                        </el-dropdown-menu>
                        <el-dropdown-menu>
                            <el-dropdown-item>使用手册</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown> -->
            </div>
        </div>
        <div class="nav-right">
            <Setting class="nav-close" title="设置" @mousedown.stop="stopDefaut" @mouseup.stop="stopDefaut" />
            <Minus class="nav-close" style="padding: 0 2px;" @mousedown.stop="stopDefaut" @mouseup.stop="stopDefaut"
                @click="appSetingFn('min')" />
            <FullScreen v-if="!globals.$store.state.isFullScreen" class="nav-close" @mousedown.stop="stopDefaut"
                @mouseup.stop="stopDefaut" @click="appSetingFn('max')" />
            <CopyDocument v-if="globals.$store.state.isFullScreen" class="nav-close"
                :class="[globals.$store.state.isImagesSeg ? 'isSegImgs-noMax' : '']" @mousedown.stop="stopDefaut"
                @mouseup.stop="stopDefaut" @click="appSetingFn('restoreDown')" />
            <Close class="nav-close close-hover" @mousedown.stop="stopDefaut" @mouseup.stop="stopDefaut"
                @click="appSetingFn('close')" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router';
import {
    Edit,
    VideoCamera,
    Crop,
    Select
} from '@element-plus/icons-vue'

let appName = ref('')
let tabStatus = ref(1)

const router = useRouter();


const globals = getCurrentInstance().appContext.config.globalProperties
onMounted(() => {
    appName.value = process.env.productName
})

// 触发父组件事件方法
const emit = defineEmits(['photoGraphfn', 'connectAllCapt', 'appClose'])
// 拍摄
const captureOtherFn = () => {
    if (globals.$store.state.isFullScreenLoading) return;
    router.push({ path: '/index/pthotoGrap', query: { id: 123 } });
    tabStatus.value = 0;
}

const imgSegFn = () => {
    if (globals.$store.state.isFullScreenLoading) return;
    router.push({ path: '/index/imgSegment', query: { id: 123 } });
    tabStatus.value = 1;
}
const appSetingFn = (type) => {
    if (type === 'close') {
        emit('appClose')
    } else {
        if (type === 'max') {
            globals.$store.state.isFullScreen = true
        }
        if (type === 'restoreDown') {
            if (globals.$store.state.isImagesSeg) return;
            globals.$store.state.isFullScreen = false
        }
        window.electron.ipcRenderer.send("operationWindow", type);
    }
}

const stopDefaut = (event) => {
    event.preventDefault();
    event.stopPropagation();  // 阻止事件冒泡
}

const mdfn = (e) => {
    if (globals.$store.state.isFullScreen) return
    window.electron.ipcRenderer.invoke("Main_Window_Operate", 'mouse_d');
}

const mufn = (e) => {
    if (globals.$store.state.isFullScreen) return
    window.electron.ipcRenderer.invoke("Main_Window_Operate", 'mouse_u');
}
</script>


<style lang="scss" scoped>
.head-box {
    height: 35px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    background-color: #1f1f1f;

    .nav-left {
        height: 100%;
        width: calc(100% - 122px);
        position: relative;
        top: 0;
        background-repeat: no-repeat;
        color: white;

        .ico-img {
            padding: 3px;
            height: 32px;
            width: 32px;
            margin-left: 6px;
            user-select: none;
            pointer-events: none;
        }
    }

    .nav-right {
        width: 122px;
        height: 100%;
    }

    .nav-app-name {
        position: absolute;
        top: 0;
        font-weight: 600;
        font-size: 22px;
        display: inline-block;
        margin-right: 20px;
        margin: 0 0 0 5px;
        height: 100%;
        line-height: 30px;
    }

    .nav-close {
        height: 20px;
        width: 20px;
        margin: 7px 4px 5px 4px;
        border-radius: 4px;
        padding: 2px;
        cursor: pointer;
        color: white;

        &:hover {
            background-color: rgba(221, 223, 229, .3);
            color: white;
        }
    }

    .isSegImgs-noMax {
        color: #515252;
        &:hover {
            color: #515252;
            cursor: no-drop;
            background-color: transparent;
        }
    }
}

.menus-seting {
    height: 35px;
    width: calc(100% - 36px);
    position: absolute;
    top: 0;
    left: 36px;
    padding-left: 5px;
    display: flex;
    align-items: center;
}

:deep(.el-dropdown) {
    .el-dropdown-menu {
        // background-color: rgba(38, 38, 39, 0.9);
        background-color: #1f1f1f;
        // padding: 1px 1px;
        border: 1px solid #474747;
    }

    .el-dropdown__popper .el-dropdown-menu {
        background-color: #1f1f1f;
    }

    .el-dropdown-menu__item:not(.is-disabled):focus,
    .el-dropdown-menu__item:not(.is-disabled):hover {
        background-color: #797A7B;
        color: white;
        padding: 4px 16px;
    }

    .el-dropdown-menu__item {
        color: white;
        padding: 2px 16px;
        font-size: 12px;
        margin: 2px 5px;
        border-radius: 3px;
    }

    .el-popper.is-light,
    .el-popper.is-light>.el-popper__arrow:before {
        background-color: #1f1f1f;
    }

    .el-popper__arrow {
        display: none;
    }

    .el-popper.is-pure {
        padding: 0;
        inset: 26px auto auto 0px !important;
    }
}

.top-button-set {
    font-size: 13px;
    margin-left: 4px;
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 5px;
    cursor: pointer;
    color: #9d9d9d;

    &:hover {
        background-color: #2D2E2E;
        color: white;
    }
}

.top-button-active {
    background-color: #2D2E2E;
    color: white;
}

.capture-select-icon {
    position: relative;
    left: -8px;
    top: 2px;
    width: 10px;
}

.close-hover:hover {
    background-color: red !important;
}
</style>
