import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let kejianrouter = new Router({
  routes: [{
    path: '/',
    name: 'layout',
    redirect:'/login',
    component: () => import('./components/Layout.vue'),
    children: [{
      path: '/home',
      name: 'home',
      component: () => import('./views/home/Home.vue')
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('./views/list/List.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('./views/list/components/Result.vue'),
    },
    {
      path: '/addTask',
      name: 'addTask',
      component: () => import('./views/list/components/AddTask.vue'),
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/login/Login.vue')
  },
  ]
})


// 判断是否需要登录权限 以及是否登录
kejianrouter.beforeEach((to, from, next) => {
  // 判断是否需要登录权限
  if (to.matched.some(res => res.meta.requireAuth)) {
    // 判断是否登录
    if (sessionStorage.getItem('token')) {
      next()
    } else {
      // 没登录则跳转到登录界面
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default kejianrouter