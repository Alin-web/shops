<template>
    <div class="users">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="card">
            <!-- 搜索与添加区域 -->  
            <!-- 分割栏组件  gutter 控制两个el-col 之间的间距 值为数字  -->
            <el-row :gutter="50" class="input_search">
                <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域  把获取到的数据进行渲染 stripe 开启隔行变色  border 开启边框线-->
            <el-table :data="userList" border  stripe >
                <!-- 添加索引列 -->
                <el-table-column type="index" label="排序"  width="100px"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <!-- {{scope.row.mg_state}}  change	 事件 监听switch状态发生变化时的回调函数 传参 当前行-->
                        <el-switch  v-model="scope.row.mg_state" @change="switch_change(scope.row)"> </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="success" icon="el-icon-edit" @click="alterBut(scope.row.id)">修改</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip content="分配角色" placement="top" :enterable='false'>
                            <el-button type="warning" icon="el-icon-setting" @click="allocationRoles(scope.row)">分配角色</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
                <el-pagination
                @size-change="pagesizes"
                @current-change="pagenums"          
                :current-page="queryinfo.pagenum"  
                :page-sizes="[1, 2, 3, 4]"
                :page-size="queryinfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
            <!-- 添加用户对话框  visible.sync 显示和隐藏 bool 值  class="input_dialog"  margin值-->
            <el-dialog  title="添加用户" :visible.sync="dialogVisible" width="50%" @close='addClose'>
                <!-- 内容主题 -->
                <el-form :model="addForm" :rules="addrules" ref="addref" label-width="100px">
                    <el-form-item label="用户名" prop="username" class="input_dialog">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" class="input_dialog">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email" class="input_dialog">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile" class="input_dialog">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCheck">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 点击修改按钮  弹出的 的对话框 -->
            <el-dialog title="修改用户信息" :visible.sync="AlterBut" width="50%" @close="AlterButClose" >
                    <!-- 内容主题区域 -->
                    <el-form :model="AlterButData" :rules="addrules" ref="AlterButRef" label-width="100px">
                        <el-form-item label="用户名" class="input_dialog">
                            <el-input v-model="AlterButData.username" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email" class="input_dialog">
                            <el-input v-model="AlterButData.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="mobile" class="input_dialog">
                            <el-input v-model="AlterButData.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="AlterBut = false">取 消</el-button>
                        <el-button type="primary" @click="AlterButSure">确 定</el-button>
                    </span>
            </el-dialog>
            <!-- 点击分配角色按钮 弹出的提示组件 -->
            <el-dialog title="分配权限" :visible.sync="showBut" width="50%" @close='rolesClose'>
               <p>当前用户: {{userInfo.username}}</p>
               <p>当前角色: {{userInfo.role_name}}</p>
               <p>分配新角色:
                    <el-select v-model="selectRolesId" placeholder="请选择">
                        <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
               </p>
                <span slot="footer" class="dialog-footer"> 
                    <el-button @click="showBut = false">取 消</el-button>
                    <el-button type="primary" @click="showButSure">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        // 自定义校验规则
        // 自定义邮箱验证规则
        var checkEmail = (rules, value,callback) =>{
            // 验证邮箱的正则表达式
            const regemail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if( regemail.test(value)){
                return callback()
            }
            callback(new Error('请输入合法邮箱'))
        }
        // 自定义手机号码验证规则
        var checkphone = (rules, value,callback) =>{
             // 验证手机号的正则表达式
            const regphone = /^1[3|4|5|7|8][0-9]{9}$/
            if( regphone.test(value)){
                return callback()
            }
            callback(new Error('请输入合法手机号'))
        }
        return {
            // 请求的用户列表参数对象
            queryinfo:{
                query:'',
                // 有几页信息
                pagenum:1,
                // 当前页面有多少条信息
                pagesize:2
            },
            userList:[],
            total:0,
            // dialogVisible 对话框
            dialogVisible:false,
            //  添加用户 addForm 表单绑定的数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
             },
            // rules 添加用户 表单验证规则
            addrules:{
                username:[  
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16   , message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: checkphone, trigger: 'blur'}
                ]
            },
            // 点击修改按钮 进行用户修改
            AlterBut:false,
            // 点就修改按钮 传递过来的后台数据
            AlterButData: {
            },
            // showBut 点击分配角色按钮 控制的弹窗组件
            showBut: false,
            // showBut 控制的弹窗组件所对应的显示信息 
            userInfo:{ },
            // 弹框组件中下拉框内容的数据
            rolesList:{ },
            // 下拉菜单中 已选中的角色ID值
            selectRolesId: ' '
        }
    },
    // created 生命周期函数 一般用来请求数据
    created(){
        this.getUserList()
    },
    methods:{
        async getUserList(){
// ajax 请求返回的是primse 对象 简化对象    关于get请求   get('users',{ params: { } })  get(a,{}) a是请求路径  {} 里面是一个params对象 里面是请求参数
            const {data:res}= await this.$http.get('users',{ params: this.queryinfo })
            if(res.meta.status !== 200) return this.$message.error('数据初始化渲染请求成功请求错误')
            this.$message.success('数据初始化渲染请求成功')
            console.log(res)
            // 把请求到的值传递给data 中然后进行页面渲染
            this.userList = res.data.users
            this.total = res.data.total
        },
        //监听pagesize 改变的事件
        pagesizes(How_many_info){
            console.log(How_many_info+'当前页面有多少条信息')
            // 既然改变了 就要把页面信息重新赋值 
            this.queryinfo.pagesize = How_many_info
           // 调用该方法进行数据刷新
           this.getUserList() 
        },
        // 监听当前的page页码改变
        pagenums(num){
            console.log(num+'一共有多少页面')
            // 页码改变也要重新赋值 
            this.queryinfo.pagenum = num
            // 调用方法刷新数据
            this.getUserList()
        },
        // 监挺switch 开关的改变  然后把改变后的值 同步到数据库保存  
        async switch_change(change){
            console.log(change)
            // this.$http.put(`users/:uId/state/:type`)
           const { data : res} = await this.$http.put(`users/${change.id}/state/${change.mg_state}`)
           console.log(res)
           if(res.meta.status !== 200){
               // 如果请求失败的话 重新赋值保证页面上的数据没用任何变化
               change.mg_state = !change.mg_state
               return this.$message.error('swith开关请求失败')
           } 
            this.$message.success('swith开关请求成功')
        },
        // addClose 添加用户对话框的关闭事件 要求: 关闭页面重置表单
        addClose(){
            this.$refs.addref.resetFields()
        },
        //  addCheck 添加用户表单 预校验  就是说添加的用户是否符合表单验证规则 符合进行添加 不符合进行报错
        addCheck(){
            this.$refs.addref.validate(async valid => {
                // console.log(valid)
                if(!valid) return
                // 进行用户添加  请求后台 进行数据添加
                const {data: res} = await this.$http.post('users',this.addForm)
                // console.log(res)
                // console.log(111)
                if(res.meta.status !== 201 ) {
                    this.$message.error('添加新用户失败')
                } 
                this.$message.success('添加新用户成功')
                // 添加完信息后关闭对话框 
                this.dialogVisible = false
                // 重新渲染用户列表
                this.getUserList()
            }) 
        },
        // alterBut  点击修改按钮 进行文本修改  里面传递了作用域插槽的 row.id （当前行数据）方法 
        async alterBut(id){
            // console.log(id)
            // 根据id 获取后台数据
            const {data: res} = await this.$http.get('users/'+id)
            // console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('查询用户信息失败')
            }
            this.$message.success('查询用户信息成功')
            // 点击按钮把获取到的数据传入到data中 进行页面渲染
            this.AlterButData = res.data
            // 点击按钮 弹出对话框
            this.AlterBut = true
        },
        // alterBut 重置表单验证结果
        AlterButClose(){
            this.$refs.AlterButRef.resetFields()
        },
        // alterBut 表单预验证
        AlterButSure(){
            this.$refs.AlterButRef.validate(async valid => {
                console.log('修改操作的表单校验结果：'+ valid)
                if(!valid) return this.$success.error('修改操作的表单校验结果验证错误')
                // 如果为真(符合表单规则) 发起用户修改提交请求把修改后的值保存到数据库中
                const { data: res} = await this.$http.put('users/'+this.AlterButData.id,
                {
                    email:this.AlterButData.email,
                    mobile:this.AlterButData.mobile
                })
                console.log(res)
                console.log('===================================================')
                if(res.meta.status !== 200){
                    return this.$message.error('表单修改失败')
                }
                // 表单修改成功后关闭对话框
                this.AlterBut = false
                // 对话框关闭后重新渲染页面
                this.getUserList()
                this.$message.success('表单修改成功')
            })
        },
        // removeBut 操作栏的 删除按钮 删除事件
        async remove(id){
            // console.log(id)
            const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)  // 这样写相当于catch(err => { return err})
            // 返回值是一个promise对象  用 async  await  优化  
            // 点击确认  返回值为 confirm 
            // 点击取消 会报错 这时候需要在后面加一个catch 方法 接受这个错误 
            // 加入catch 方法后 点击取消 会返回一个 cancel
            console.log(result)
            if( result !== 'confirm'){
                return console.log(取消删除)
            }
            console.log('进行删除操做')
            // 我们根据返回的值进行判断 是否进行删除
            // 点击确认 删除指定的用户  
            const { data : ress} = await this.$http.delete('users/' + id )
            console.log(ress)
            if( ress.meta.status !== 200 ){
               return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            // 后台数据库内容变更 前端页面重新加载
            this.getUserList()
        },
        // allocationRoles 点击分配角色按钮 对应的事件
         async allocationRoles(item){
            console.log(item)   
            this.userInfo = item
            // 在展示对话框前 获取所有角色的列表
            const {data:res} = await this.$http.get('roles')
            // console.log(res.data)
            // 把得到的数据 传递到data中进行页面渲染
            this.rolesList = res.data
            console.log(111111111111)
            console.log(this.rolesList)
            // 展示弹框组件
            this.showBut = true
        },
        // showButSure 弹框组件中的确定按钮 事件
        async showButSure(){
            // 判断是否进行数据修改
            if(!this.selectRolesId ){
               return this.$message.error('请选择要分配的角色')
            }
            // 把选择的值发送给到后台进行数据修改
            const {data:res} = await this.$http.put(`users/${this.userInfo.id }/role`,{rid:this.selectRolesId})
            if(res.meta.status !==200){
               return this.$message.error('更新角色失败')
            }
            this.$message.success('更新角色成功')
            // 数据库更新 刷新页面
            this.getUserList()
            // 关闭弹窗组件
            this.showBut = false
        },
        // rolesClose 对话框组件关闭 重置选项
        rolesClose(){
            // 把所选项为空
            this.selectRolesId = '' 
        }
    }
}
</script>
<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 20px;
    font-size: 12px;
}
.card{
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
// 搜索框
.input_search{
    margin-bottom: 20px;
}
// table 表格
.el-table{
    font-size: 16px;
}
//input_dialog 添加用户
.input_dialog {
    margin-top: 20px;
}
</style>
