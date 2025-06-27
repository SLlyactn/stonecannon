import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";

Vue.use(VueRouter)

const routes = [





  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue')
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import('../views/front/Front'),
    children: [
      { path: 'person', name: '个人信息', component: () => import('../views/front/Person.vue')},
      {
        path: 'home',
        name: 'FrontHome',
        component: () => import('../views/front/Home.vue')
      },
      {
        path: 'postManager',
        name: 'PostManager',
        component: () => import('../views/front/PostManager.vue')
      },
      {
        path: 'feedManagement',
        name: 'FeedManagement',
        component: () => import('../views/front/FeedManagement.vue')
      },
      {
        path: 'postdraft',
        name: 'PostDraft',
        component: () => import('../views/front/PostDraft.vue')
      },


    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 重置路由
export const resetRouter = () => {
  router.matcher = new VueRouter({
    mode: 'history',
    routes
  })
}

// 注意：刷新页面会导致页面路由重置
export const setRoutes = () => {


}

// 每次刷新页面都要重新设置路由，否则路由就会被重置
setRoutes()

router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称
  store.commit("setPath")
  if (!to.matched.length) {
    const menus = localStorage.getItem("menus")
    if (!menus) {
      next("/login")
    } else {
      next("/404")
    }
  } else {
    next()
  }
})

export default router
