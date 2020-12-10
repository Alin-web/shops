const prodPlugins = []
// 获得编译模式
// process.env.NODE_ENV 能得到当前选择的编译模式  build 编译模式的值为 production
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 通过展开运算符的方式启用该插件
    ...prodPlugins,
    // 路由懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
  
}