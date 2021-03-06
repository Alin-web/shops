import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
// 导入login组件
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')

// 导入 home  组件
//import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')

// 导入welcome 组件
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// 导入users 组件
// import Users from '../components/user/users.vue'
//导入rights组件
// import Rights from '../components/power/Rights.vue'
// 导入roles 组件
// import Roles from '../components/power/Roles.vue'

// 路由懒加载
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')




// 导入 categories 组件
//import Categories from '../components/goods/Categories.vue'
// 导入 params 组件
//import Params from '../components/goods/Params.vue'

const Categories = () => import(/* webpackChunkName: "Categories_Params" */ '../components/goods/Categories.vue')
const Params = () => import(/* webpackChunkName: "Categories_Params" */ '../components/goods/Params.vue')

// 导入goodslist 组件
//  import Goodes from '../components/goods/Goods.vue'
// 导入添加商品组件
// import Add from '../components/goods/Add.vue'
const Goodes = () => import(/* webpackChunkName: "Goodes_Add" */ '../components/goods/Goods.vue')
const Add = () => import(/* webpackChunkName: "Goodes_Add" */ '../components/goods/Add.vue')

// 导入 订单列表组件  order
//import Order from '../components/order/Order.vue'
// 导入 reporte 数据报表组件
//import Repotr from '../components/report/Report.vue'
const Order = () => import(/* webpackChunkName: "Order_Repotr" */ '../components/order/Order.vue')
const Repotr = () => import(/* webpackChunkName: "Order_Repotr" */ '../components/report/Report.vue')
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
    { path: '/Params',component: Params },
    // 导入子路由 add 添加商品路由组件
    { path: '/Goods/Add',component: Add },
    // 导入子路由 Order 添加订单列表组件
    { path: '/orders',component: Order },
    // 导入子路由 Order 添加订单列表组件
    { path: '/reports',component: Repotr }
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
