import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './assets/css/public.scss'
import ElementPlus from 'element-plus'// element
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import store from './store'

const app = createApp(App)


// 防止修改sessionStorage
window.addEventListener('storage', (e) => {
    sessionStorage.setItem(e.key, e.oldValue)
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store).use(router).use(ElementPlus, { locale: zhCn }).mount('#app')
