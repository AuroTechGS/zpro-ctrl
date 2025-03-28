// wsClient.js
import store from '../../store/index.js'
import { ElMessage } from "element-plus";


let socket = null
let url = "ws:192.168.31.251:9978"
let reconnectTimer = null
let heartbeatTimer = null
let reconnectAttempts = 0


const MAX_RECONNECT_ATTEMPTS = 6
const HEARTBEAT_INTERVAL = 20000
const RECONNECT_INTERVAL = 3000

export function createWS() {
    if (socket && socket.readyState !== WebSocket.CLOSED) return socket
    socket = new WebSocket(url)

    socket.onopen = () => {
        console.log("[WS] 连接成功")
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
            console.log(`[WS] 第 ${reconnectAttempts} 次重连尝试...`)
            reconnectTimer = setTimeout(() => {
                createWS(url)
            }, RECONNECT_INTERVAL)
        } else {
            ElMessage({
                message: `超过最大重连次数 (${MAX_RECONNECT_ATTEMPTS})，停止尝试。`,
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
