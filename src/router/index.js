import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入login组件
import Login from '../components/Login.vue'
// 导入 home  组件
import Home from '../components/Home.vue'
// 导入welcome 组件
import Welcome from '../components/Welcome.vue'
// 导入users 组件
import Users from '../components/user/users.vue'
//导入rights组件
import Rights from '../components/power/Rights.vue'
// 导入roles 组件
import Roles from '../components/power/Roles.vue'
// 导入goodslist 组件
import Goodes from '../components/goods/Goods.vue'
// 导入 categories 组件
import Categories from '../components/goods/Categories.vue'
// 导入 params 组件
import Params from '../components/goods/Params.vue'
Vue.use(VueRouter)

const routes = [
  // 重定向 如果用户访问的是/ 路径直接跳转到 /login 路径
  { path: '/', redirect: '/login' },
  { path: '/Login', component: Login },
  // 配置home 页面路由规则
  { path: '/Home',
   component: Home,
   // 在home 页面进行路由重定向 如果在home 组件中 直接定向到 子组件welcome
   redirect:'/Welcome',
   children:[
    { path: '/Welcome',component: Welcome },
    // 添加子路由 users
    { path: '/users',component: Users },
    // 添加子路由 rights
    { path: '/Rights',component: Rights },
    // 添加子路由 roles
    { path: '/Roles',component: Roles },
    // 添加子路由goodslist
    { path: '/Goods',component: Goodes },
    // 添加子路由goodslist
    { path: '/Categories',component: Categories },
    // 添加子路由goodslist
    { path: '/Params',component: Params }
  ]}
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
