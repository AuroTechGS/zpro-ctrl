import { createStore } from 'vuex'

export default createStore({
  state: {
    isFullScreen: false,
    currentCaptureType: 'Z2PRO', // 相机类型
    camConnectProcess: false,
    captureType_1: 'Orbbie',
    captureType_2: 'Z2PRO',
    isFullScreenLoading: false,  // 全屏加载状态
    fullScreenloadingText: '', // 全屏加载文字
    camConnectPerset: 0,
    isShowBottomGatherBox: true,
    isImagesSeg: false, // 强制全屏分割图像
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
