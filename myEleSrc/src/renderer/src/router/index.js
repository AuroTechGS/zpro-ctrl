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
      // { path: '/index/pthotoGrap', component: () => import('../views/photograph/index.vue') },
      { path: '/index/imgSegment', component: () => import('../views/imageSegment/index.vue') },
      { path: '/index/sourceSelect', component: () => import('../views/sourceSelect/index.vue') },
    ]
   },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router