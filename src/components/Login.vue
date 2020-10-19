<template>
  <div class="login">
    <div class="login_box">
        <!-- login图标 -->
        <div class="img">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- form表单  动态绑定model 方便后面获取整个form表格对象 rules 表单验证规则-->
        <el-form  ref="formref" label-width="60px" class="form_login" :model="form" :rules="rules">
            <el-form-item label="账号" prop="username">
                <el-input type="text" prefix-icon="iconfont icon-user"  v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item class="buts">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 登录页面的input的数据绑定
            form:{
                username:'admin',
                password:'123456'
            },
            // rules 表单验证规则
            rules:{
                username:[  
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 16   , message: '长度在 3 到 16 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // 点击重置按钮 进行表单重置
        reset(){
            this.$refs.formref.resetFields()
        },
        // 点击登录按钮对表单进行预校验 看是否符合表单验证规则  表单的实例对象调用validate 方法 进行预校验
        // validate 返回的是一个回调函数 函数的第一个形参是布尔值 一般命名valid  符合表单验证规则的话 返回true 不符合返回false
        login(){
             this.$refs.formref.validate(async valid=>{
                if(!valid) return  
                // this.$http.post('login', this.form) 返回的是一个promise 对象 如果是promis对象的话可以用 async 和await 来进行简化
                const {data : results } = await this.$http.post('login', this.form)
                // console.log(results)
                if(results.meta.status !== 200) return this.$message.error('登录失败')
                this.$message.success('登录成功')
                // 把请求成功返回的对象的token属性值 保存到sessionStorage 中
                // 项目中除了登录之外的的其他API接口 必须在登录之后才能访问 设置路由守卫进行权限限定
                // token 只应该在当前打开网页生效  所以将token 保存在sessionStorage 中
                // 编程式导航跳转到后台主页 路由地址式 /home
                window.sessionStorage.setItem('token',results.data.token)
                // 通过编程式导航进行页面跳转
                this.$router.push('/home')
             })
        }
    }
}
</script>

<style lang="less" scoped>
.login {
    height: 100%;
    background-color: #2b4b6b;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate( -50%,-50% );
    border-radius: 3px;
}
.img {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
}
// 表单区域
.form_login {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
}
// 按钮
.buts {
    display: flex;
    justify-content: flex-end;
}
</style>
