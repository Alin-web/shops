<template>
    <div class="roles">
      <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-button type="success" @click="addRoles">添加角色</el-button>
            <!-- tabel 表格-->
            <el-table border class="table" :data="rolesLitst" stripe>
                <!-- 展开行 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- row 进行遍历 子组件进行渲染 -->
                        <el-row v-for="(item1, index) in scope.row.children" :key="index" :class="['rowBottom', 'vcenter',index === 0 ? 'rowTop':'' ]" >
                            <!-- 一级权限渲染 -->
                            <el-col :span="5">
                                <el-tag  closable @close='removeTag(scope.row,item1.id)' >{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级三级权限渲染 -->
                            <el-col :span="19">
                                <!-- 二级权限渲染 -->
                                <el-row v-for="(it2 , ids ) in item1.children" :key="ids" :class="['vcenter',ids === 0 ? '': 'rowTop']" >
                                    <el-col  :span="6">
                                        <el-tag type="success"  closable @close='removeTag(scope.row,it2.id)'>{{ it2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限渲染 -->
                                    <el-col  :span="18">
                                        <el-tag type="warning" v-for="(it3 , id3 ) in it2.children" :key="id3" closable @close='removeTag(scope.row,it3.id)'>{{ it3.authName }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引序号列 -->
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="400px">
                    <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="editor(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" @click="showPermissions(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 点击添加用户弹出来的对话框 -->
        <el-dialog title="添加用户信息" :visible.sync="addRolesDialog" width="50%">
            <!-- 内容主题区域 -->
             <!-- 内容主题 -->
            <el-form :model="addUser" ref="addref" label-width="100px">
                <el-form-item  label="角色名称" class="input_dialog">
                    <el-input v-model="addUser.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" class="input_dialog">
                    <el-input v-model="addUser.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRolesDialog = false">取 消</el-button>
                <el-button type="primary" @click="addSure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 点击编辑按钮 进行角色信息编辑 -->
        <el-dialog title="更改用户信息" :visible.sync="getRolesDialog" width="50%">
            <!-- 内容主题区域 -->
             <!-- 内容主题 -->
            <el-form :model="getUser" ref="addref" label-width="100px">
                <el-form-item  label="角色名称" class="input_dialog">
                    <el-input v-model="getUser.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述" class="input_dialog">
                    <el-input v-model="getUser.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="getRolesDialog = false">取 消</el-button>
                <el-button type="primary" @click="getSure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 点击分配权限 弹出对话框 -->
        <el-dialog @close='closepermission' title="分配权限" :visible.sync="PermissionsHidden" width="50%">
            <!-- 内容主题区域 -->
             <!-- 内容主题  树形结构 :data="rightsList" 绑定数据源  :props="treeProps" 渲染规则  default-expand-all 当为true的时候默认展开所有节点 default-checked-keys-->
            <el-tree ref="treeref" :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKey"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="PermissionsHidden = false">取 消</el-button>
                <el-button type="primary" @click="PermissionsSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            rolesLitst:[],
            // 点击添加用户按钮弹出来的对话框  控制弹框组件
            addRolesDialog:false,
            // 添加角色的信息
            addUser:{
                roleName:'',
                roleDesc:''
            },
            // 点击编辑角色 控制的弹框组件
            getRolesDialog:false,
            // 查询得到的角色信息  
            getUser:{

            },
            // 分配权限 控制的弹框组件
            PermissionsHidden:false,
            //  获取到的所有用户权限
            rightsList:[],
            //树形控件的属性绑定对象
            treeProps:{
                children: 'children',  // 父子嵌套 嵌套的属性 
                label: 'authName'  // 看到的是哪个属性
            },
            // 默认选中的 key的数组
            defKey:[],
            // 当前即将分配权限的角色id值 
            idRoles:''
        }
    },
    // created 生命周期函数 一般用来获取后台数据 进行初始化渲染  实际实现还是在 methods 中实现
    created(){
        this.getRolesLitst()
    },
    methods:{
        async getRolesLitst(){
            const  {data:res} =  await this.$http.get('roles')
            // console.log(res)
            // 进行判断 看是否获取成功
            if(res.meta.status !== 200 ){
                return this.$message.error('初始数据请求失败')
            }
            this.$message.success('初始数据请求成功')
            // console.log(res.data)
            // 把请求成功的数据返回给data中 进行数据渲染
            this.rolesLitst = res.data
        },
        // 点击tag标签的 × 按钮 实现删除功能 第三层
        async removeTag(fid,id){
            const res  = await this.$confirm('此操作将永久删除该功能是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(res)
            // 根据返回值进行判断是否进行删除
            if(res !== 'confirm'){
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            console.log(fid)
            console.log(id)
            // 向后台发起请求 进行数据删除 根据api接口文档要求 访问需要指定id
            const { data:del } = await this.$http.delete(`roles/${fid.id}/rights/${id}`)
            // console.log(del)
            if(del.meta.status !== 200){
               return this.$message.error('获取当前角色信息失败')
            }
            // 后台数据更改前端页面数据从新渲染 this.getRolesLitst() 不建议使用这个 因为会使得页面进行重新渲染
            // this.getRolesLitst()
            fid.children = del.data
        },
        // showPermissions 点击分配权限 展示分配权限
        async showPermissions(roles){
            //把当前的id传递给data中 以便后续使用
            this.idRoles = roles.id
            // 请求所有数据
            const {data:res} = await this.$http.get('rights/tree')
            // console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('获取所有数据失败')
            }
            this.$message.success('获取所有数据成功')
            //  把获取到的数据 传递到data中
            this.rightsList = res.data
            this.dgkeys(roles,this.defKey)
            this.PermissionsHidden = true
        },
        // 通过递归的形式获取三级权限的 id 保存到defKey数组中
        dgkeys(node,arr){
            if( !node.children){
                return  arr.push(node.id)
            }
            node.children.forEach(item => {
                this.dgkeys(item,arr)
            })

        },
        // 解决bug  当分配权限对话框按钮关闭时清空:default-checked-keys 绑定的值可以解决重复选项问题了
        closepermission(){
            this.defKey=[]
        },
        // 点击 分配权限的弹出框的确定按钮 
        async PermissionsSure(){
            const keys = [
    // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
                ...this.$refs.treeref.getCheckedKeys(),
    // 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
                ...this.$refs.treeref.getHalfCheckedKeys()
            ]
            console.log(keys)
            // 根据api接口文档要求 发送请求以 `,` 分割的权限 ID 列表 字符串
            const idStr = keys.join(',')
            const {data:res} = await this.$http.post(`roles/${this.idRoles}/rights`,{rids:idStr})
            if(res.meta.status !== 200){
                return this.$message.error('获取所有数据失败')
            }
            this.$message.success('获取所有数据成功')
            console.log(res)
            // 数据更新 重新渲染页面
            this.getRolesLitst()
            // 关闭弹框组件
            this.PermissionsHidden = false
        },
        // 点击添加按钮 进行角色添加
        addRoles(){
            // 点击按钮控制 dialog 弹框组件显示出来
            this.addRolesDialog=true
        },
        // 点击弹框组件的确定按钮 显示用户输入内容
        async addSure(){
            console.log(this.addUser.roleName)
            console.log(this.addUser.roleDesc)
            // 隐藏弹框组件
            this.addRolesDialog = false
            // 进行数据添加
            const {data:res}  = await this.$http.post('roles',this.addUser)
            console.log(res)
            // 数据库数据更新  更新前端页面
            this.getRolesLitst()
        },
        // 点击编辑按钮 进行角色描述编辑
        async editor(id){
            // 进行弹框
            this.getRolesDialog=true
            // 使用了作用域插槽的方式 row 的方法获取到了当前行的数据内容的id
            // 根据id 发起用户请求
            const { data:res} =  await this.$http.get('roles/'+id)
            // console.log(res)
            if(res.meta.status !== 200){
                this.$message.error('获取当前角色信息失败')
            }
            // 成功则把当前的值赋值给data中 进行页面数据渲染
            this.getUser = res.data
            // console.log(this.getUser)
             
        },
        // 点击确定按钮 进行关闭弹框等一些列操作
        async getSure(){
            // 向后台发送请求把用户更改的数据提交上去
            const {data:res} = await this.$http.put('roles/'+this.getUser.roleId,this.getUser)
            // console.log(res)
            if(res.meta.status !== 200){
                this.$message.error('获取当前角色信息失败')
            }
            this.getRolesLitst()
            this.getRolesDialog=false
        },
        // 点击删除按钮 删除当前的信息
        async del(id){
            // 向数据库发送请求删除指定id的数据
            const {data:res} = await this.$http.delete('roles/'+id)
            console.log(res)
            if(res.meta.status !== 200){
                this.$message.error('获取当前角色信息失败')
            }
            // 数据改变 重新渲染页面
            this.getRolesLitst()
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
// table 表格
.table{
    margin-top: 20px;
}
// el-row Layout 布局 组件样式
.rowTop{
    border-top: 1px solid #ccc;
}
.rowBottom{
    border-bottom: 1px solid #ccc;
}
// tag 组件标签
.el-tag{
    margin: 7px;
}
.col2{
    border-bottom: 1px solid #ccc;
}
// 纵向 剧中对其
.vcenter{
    display: flex;
    align-items: center;
}
//  添加的表单 
.input_dialog {
    margin-top: 20px;
}
</style>
