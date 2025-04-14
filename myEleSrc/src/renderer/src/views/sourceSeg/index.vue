<template>
  <div class="view-Page-two">
    <div class="left-project-files">
      <div class="tips-tab">
        <span>文件列表</span>
      </div>
      <ul data-simplebar>
        <li
          v-for="(item, index) in filesList"
          class="dir-files-item"
          @click="dirFilesClickFn(item)"
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
              ·
              ··
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
            <el-tag
              v-show="item.isEdit"
              effect="dark"
              type="success"
              size="small"
              style="float: right; margin-right: 6px"
              >{{ "已确认" }}</el-tag
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

let filesList = ref([]);

const dirFilesClickFn = (val) => {};
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
  width: 250px;
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
</style>
