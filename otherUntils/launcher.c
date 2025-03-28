#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    // 获取可执行文件路径（当前目录）
    const char *libPath = "./resources/lib";
    const char *appBinary = "./lidar3ds";  // 你的 Electron 可执行文件名
    // 设置 LD_LIBRARY_PATH
    setenv("LD_LIBRARY_PATH", libPath, 1);
    // 启动 Electron 应用
    int result = execv(appBinary, argv);
    perror("execv failed");
    return 1;
}
