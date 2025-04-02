import { createMemoryHistory, createRouter } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/index',
    name: ''
  },
  // { path: '/login', component: () => import('../views/login.vue') },
  { path: '/index', component: () => import('../views/index.vue'), redirect: '/index/sourceSelect',
    children: [
      // { path: '/index/pthotoGrap', component: () => import('../views/photograph/index.vue') }, // 录像
      { path: '/index/imgSegment', component: () => import('../views/imageSegment/index.vue') },  // 分割工具
      { path: '/index/sourceSelect', component: () => import('../views/sourceSelect/index.vue') }, // 建模数据源选择
      { path: '/index/calibrateCam', component: () => import('../views/calibrateCam/index.vue') }, // 视频分割及相机标定
    ]
   },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router