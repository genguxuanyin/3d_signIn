import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Register from './views/Register'
import Nofind from './views/404'
import Login from './views/Login'
import Home from './views/Home'
import MyActivity from './views/MyActivity'
import Activity from './views/Activity'
import ManageActivity from './views/manage/ManageActivity'
import ManageUser from './views/manage/ManageUser'
import ManageSignIn from './views/manage/ManageSignIn'
import ManageDanmaku from './views/manage/ManageDanmaku'
import ManageWin from './views/manage/ManageWin'
import ManageGame from './views/manage/ManageGame'
import ActivityHome from './views/activity/ActivityHome'
import SignIn from './views/mobile/SignIn'
import MHome from './views/mobile/MHome'
import Win from './views/mobile/Win'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '*',
      name: '/404',
      component: Nofind
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/activity/:id',
      component: Activity,
      children: [{
        path: '',
        name: 'activityHome',
        component: ActivityHome
      }]
    },
    {
      path: '/signIn/:id',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/mHome',
      name: 'mHome',
      component: MHome
    },
    {
      path: '/win',
      name: 'win',
      component: Win
    },
    {
      path: '/index',
      component: Index,
      children: [{
          path: '',
          component: Home
        },
        {
          path: '/home',
          name: 'home',
          component: Home
        },
        {
          path: '/myActivity',
          name: 'myActivity',
          component: MyActivity
        },
        {
          path: '/manageActivity',
          name: 'manageActivity',
          component: ManageActivity
        },
        {
          path: '/manageUser',
          name: 'manageUser',
          component: ManageUser
        },
        {
          path: '/manageSignIn',
          name: 'manageSignIn',
          component: ManageSignIn
        },
        {
          path: '/manageDanmaku',
          name: 'manageDanmaku',
          component: ManageDanmaku
        },
        {
          path: '/manageWin',
          name: 'manageWin',
          component: ManageWin
        },
        {
          path: '/manageGame',
          name: 'manageGame',
          component: ManageGame
        }
      ]
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  const isSignIn = localStorage.eleSignInToken ? true : false;
  if (to.path == "/login" || to.path == "/register" || to.path.startsWith("/signIn/")) {
    next();
  } else {
    isLogin || isSignIn ? next() : next("/login");
  }
})

export default router;