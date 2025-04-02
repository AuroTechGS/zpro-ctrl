// wsClient.js
import store from '../../store/index.js'
import { ElMessage } from "element-plus";


let socket = null
let url = "ws:192.168.31.251:9978"
// let url = "ws:127.0.0.1:9978"
let reconnectTimer = null
let heartbeatTimer = null
let reconnectAttempts = 0

export const CAMERANUM = 24

const MAX_RECONNECT_ATTEMPTS = 5
const HEARTBEAT_INTERVAL = 20000
const RECONNECT_INTERVAL = 5000

export function createWS() {
    if (socket && socket.readyState !== WebSocket.CLOSED) return socket
    socket = new WebSocket(url)
    socket.onopen = () => {
        console.log("[WS] 连接成功")
        store.state.fullScreenloadingText = '连接成功';
        store.state.isFullScreenLoading = false;
        reconnectAttempts = 0
        sendWs({
            reqType: "firstCon"
        })
        startHeartbeat()
    }
    socket.onmessage = (event) => {
        try {
            store.commit('setWSMessage', event.data)
        } catch (e) {
            console.warn("[WS] 消息解析失败", e)
        }
    }

    socket.onclose = () => {
        console.warn("[WS] 连接关闭")
        stopHeartbeat()
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++
            console.log(`网络连接中断, 第 ${reconnectAttempts} 次重连尝试...`)
            store.state.fullScreenloadingText = `网络连接中断, 第 ${reconnectAttempts} 次重连尝试...`;
            store.state.isFullScreenLoading = true;
            reconnectTimer = setTimeout(() => {
                createWS()
            }, RECONNECT_INTERVAL)
        } else {
            store.state.fullScreenloadingText = `超过最大重连次数 (${MAX_RECONNECT_ATTEMPTS})，停止尝试， 请检查网络。`;
            store.state.isFullScreenLoading = false;
            ElMessage({
                message: `超过最大重连次数 (${MAX_RECONNECT_ATTEMPTS})，停止尝试， 请检查网络。`,
                type: "error",
                grouping: true,
                plain: true,
                showClose: true,
                offset: 75,
            });
        }
    }


    socket.onerror = (err) => {
        console.error("[WS] 错误", err)
        socket.close()
    }
    return socket
}

export function sendWs(data) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
            JSON.stringify({
                user_id: store.state.user_id,
                message: data,
            })
        )
    } else {
        console.warn("[WS] 连接未就绪，消息未发送")
    }
}

function startHeartbeat() {
    stopHeartbeat()
    heartbeatTimer = setInterval(() => {
        sendWs({ reqType: "__ping__" })
    }, HEARTBEAT_INTERVAL)
}

function stopHeartbeat() {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer)
        heartbeatTimer = null
    }
}
