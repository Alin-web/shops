import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入阿里巴巴矢量图标
import './assets/fonts/iconfont.css'
// 导入插件vue-table-with-tree-grid 
import TreeTable from 'vue-table-with-tree-grid'
// 导入插件 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入插件 nprogress 
import NProgress from 'nprogress'

// 导入axios 请求包
import axios from 'axios' 
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 配置axios 请求拦截器  config 是请求对象
axios.interceptors.request.use(config => {
  // 在request 请求拦截其中展示进度条
  NProgress.start()
  // 根据要求 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
  config.headers.Authorization=window.sessionStorage.getItem('token')
  // 必须return config  语法要求
  return config
})
// 在response 响应拦截器外隐藏进度条
axios.interceptors.response.use(config => {
  // 在拦截其中展示进度条
  NProgress.done()
  // 必须return config  语法要求
  return config
})

// 把包挂载到vue的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 将富文本编辑器注册为全局可用
Vue.use(VueQuillEditor, /* { default global options } */)
// 注册插件 vue-table-with-tree-grid
// 过滤器
Vue.filter('dataFormat',function(d){
  const dt = new Date(d)
  // 年
  const y = dt.getFullYear()
  // 月
  const m =( dt.getMonth() +1+'').padStart(2,'0')
  // 日
  const dd =( dt.getDate()+'').padStart(2,'0')
  // 时
  const h = ( dt.getHours()+'').padStart(2,'0')
  //分
  const f = ( dt.getMinutes()+'').padStart(2,'0')
  // 秒
  const s = ( dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${dd} ${h}:${f}:${s}`
})
Vue.component('tree-table',TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
