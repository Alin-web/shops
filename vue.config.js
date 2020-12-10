module.exports={
    // 自定义打包入口文件
    chainWebpack:config => {
        // 为build 编译模式 打包入口文件 
        config.when(process.env.NODE_ENV === 'production',config=>{
            config.entry('app').clear().add('./src/main-prod.js')
            // 通过 externals 加载外部 CDN 资源  配置如下
            config.set('externals', {
                vue: 'Vue',
               'vue-router': 'router',
               axios: 'axios',
               lodash: '_',
               echarts: 'echarts',
               nprogress: 'NProgress',
               'vue-quill-editor': 'VueQuillEditor'
            })
            // 首页内容定制
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        // 开发模式入口打包文件
        config.when(process.env.NODE_ENV === 'development',config=>{
            config.entry('app').clear().add('./src/main-dev.js')
            // 首页内容定制
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
        
    }
}