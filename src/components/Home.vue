<template>
    <el-container class="Home">
        <!-- 头部 -->
        <el-header class="header">
            <div class="img">
                <img src="../assets/logo.png" alt="">
            <span>Vue电商后台管理系统</span>
            </div>
            <el-button type="success" @click="Log_out">退出登录</el-button>
        </el-header>
        <el-container>
            <!-- 左侧 -->
            <el-aside :width="iscollapse ? '65px':'200px'" class="left">
                <!-- 点击折叠 -->
                <div class="change" @click="changes">|   |   |</div>
                 <!-- el-menu 里面嵌套菜单 -->
                <el-menu background-color="#373d41" text-color="#fff" active-text-color="#409EFF"
                    unique-opened :collapse-transition='false' :collapse="iscollapse"  router :default-active='paths'>
                    <!-- el-submenu 一级菜单 index 属性一定要有 -->
                    <el-submenu :index="item.id+''"  v-for="item in menulist.data" :key="item.id">
                       <!--  template  的标签 的slot属性值设置为title  是一级菜单的内容模板 -->
                        <template slot="title">
                            <!-- 批量导入icon图标 -->
                            <i :class="icons[item.id]" class="icon"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- el-menu-item 是最低级菜单项 -->
                        <el-menu-item :index="'/'+it.path+''" v-for="it in item.children" :key="it.id" @click="savepath('/'+it.path+'')">
                            <i class="el-icon-menu"></i>
                            <span>{{ it.authName }}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>       
            </el-aside>
            <!-- 主题内容区域 -->
            <el-main class="content">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单数据
            menulist:[ ],
            iscollapse:false,
            // 矢量图
            icons:{
                125: "iconfont icon-user",
                103: "iconfont icon-tijikongjian",
                101: "iconfont icon-shangpin",
                102: "iconfont icon-danju",
                145: "iconfont icon-baobiao",
            },
            // 动态绑定 更新path路径 高亮问题
            paths:''
        }
    },
    created(){
        // 一般可以在created函数中调用ajax获取页面初始化所需的数据。
        this.getmenulist()
        // 写入生命周期函数 在页面刚加载的时候就重新赋值 防止因刷新而没高亮
        this.paths = window.sessionStorage.getItem('path')
    },
    methods:{
        Log_out(){
            // 清空当前页面的token
            window.sessionStorage.clear()
            // 通过编程式导航进行页面跳转 
            this.$router.push('/Login')
        },
        // 请求左侧菜单数据
        async getmenulist(){
            // this.$http.get('menus') 请求到的是 Promise 对象 用 async await 方法简化promise 对象
            // 用解构的方法 简化获取到的对象
            const {data:array } = await this.$http.get('menus')
            // 对请求判断一下
            if(array.meta.status !== 200) return console.log('数据获取失败')
            console.log('数据获取成功');
            console.log(array);
            // 把获取到的数据挂载到data中
            this.menulist = array
        },
        // 点击进行左侧菜单栏是否折叠
        changes(){
            this.iscollapse=!this.iscollapse
        },
        // savepath 每次点击左侧菜单栏 把 二级菜单的path属性值 保存到sessionSttoage 中
        savepath(path){
            // 保存到sessionSttoage 中
            window.sessionStorage.setItem('path',path)
            // 更新data中的paths
            this.paths = path
        }
    }
}
</script>

<style lang="less" scoped>
// 让盒子撑满全屏
.Home{
    height: 100%;
    user-select: none;
}
// 头部
.header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.img{
    display: flex;
    align-items: center;
}
.img img{
      width: 65px;
      height: 65px;
}
// 左侧
.left {
    background-color: #373d41;
}
// 折叠
.change{
    background-color: #4A5064;
    display: flex;
    justify-content: center;
    align-items: center;
}
// 重写menu的css 解决边框线突出问题
.el-menu{
    border: none;
}
.icon {
    margin-right: 20px;
}
// 主题内容区域
.content {
    background-color: #fff;
}
</style>
