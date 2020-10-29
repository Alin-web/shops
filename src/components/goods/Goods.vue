<template>
    <div class="goodes">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="card">
            <el-table :data="rolesList" >
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 使用layout布局 -->
                        <el-row v-for="(item1,index) in scope.row.children" :key="index" :class="['vconter','bbottom',index === 0 ? 'btop':''  ]">
                            <!-- 一级权限列表 -->
                            <el-col :span="5" class="oneCol">
                                <el-tag closable  @close="tagClose(scope.row,item1.id)"> {{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级三级权限列表 -->
                            <el-col :span="19">
                                <el-row v-for="(item2,index2) in item1.children" :key="index2" :class="['vconter',index2 === 0 ? ' ':'btop']">
                                    <!-- 二级权限列表渲染 -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable  @close="tagClose(scope.row,item2.id)" > {{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限列表渲染 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" closable v-for="(item3,index3) in item2.children" :key="index3" @close="tagClose(scope.row,item3.id)"> {{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="400px">
                    <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" >编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" >删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" @click="showPermissions(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 点击分配权限按钮 弹框组件 -->
        <el-dialog title="分配权限" :visible.sync="show" width="50%" @close="showClose">
            <!-- 内容主题区域 -->
            <el-tree ref="treeref" :data="permissionsList" :props="treePorps" show-checkbox  
                node-key="id" default-expand-all  :default-checked-keys="defKey"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show = false">取 消</el-button>
                <el-button type="primary" @click="showSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            rolesList:[],
            // showFPQX 弹框组件的显示与隐藏
            show: false,
            // 点击的当前行数据的ID
            currentLineID:'',
            // 所有的权限列表
            permissionsList:[],
            treePorps: {
                children: 'children',
                label: 'authName'
            },
            // 默认选中的id 第三层权限的ID 
            defKey:[]
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
            const { data:res } = await this.$http.get('roles')
            if( res.meta.status !==200){
                return this.$message.error('请求失败')
            }
            // this.$message.success(res.meta.msg)
            // console.log(res)
            // 把获取到的数据 传递到data 中进行页面渲染
            this.rolesList = res.data
        },
        // showPermissions 点击分配权限按钮对应的事件
        async showPermissions(item){
            this.currentLineID = item.id
            console.log(this.currentLineID)
            // 请求所有权限列表
            const {data:res} = await this.$http.get('rights/tree')
            if( res.meta.status !==200){
                return this.$message.error('请求失败')
            }
            this.$message.success(res.meta.msg)
            // 获取成功 传递到data中
            this.permissionsList = res.data
            // 得到第三层权限ID
            this.getPermissions(item,this.defKey)
            // 显示弹框组件
            this.show=true
        },
        // 获取第三层的权限ID 通过递归的形式获取三级权限的 id 保存到defKey数组中
        getPermissions(roles,arr){
            if(!roles.children){
                return arr.push(roles.id)
            }
            roles.children.forEach(
                it => this.getPermissions(it,arr)
            )
        },
        // showClose 解决bug 清空当前默认选中的节点ID
        showClose(){
            this.defKey=[]
        },
        // 点击确定按钮 提交选择的节点数据 到后台
        async showSure(){
            const permissionsID =[
                // 都是列表 利用展开运算符进行简化操作
                // 获取当前的选中节点的ID  
                ...this.$refs.treeref.getCheckedKeys(),
                // 获取当前的半选中节点的ID
                ...this.$refs.treeref.getHalfCheckedKeys()
            ]
            console.log(permissionsID)
            // 进行优化，使其符合后台申请的参数
            const idList = permissionsID.join(',')
            // 向后台发送请求 把选中的权限授权给当前数据
            const {data:res} = await this.$http.post(`roles/${this.currentLineID }/rights`,{rids:idList})
            if( res.meta.status !==200){
                return this.$message.error('请求失败')
            }
            this.$message.success(res.meta.msg)
            // 更新页面
            this.getRolesList()
            // 关闭弹窗
            this.show=false
        },
        //点击tag标签 进行后台请求 删除对应数据
        async tagClose(currentLineItem,PermissionsID){
            // 返回的是一个Promise对象 需要简化
            const del = await this.$confirm('此操作将永久删除该用户权限，是否删除','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            console.log(del)
            // 点击确认 del=confirm 点击取消 del = cancel 进行判断 看用户是否删除
            if(del == 'cancel' ){
                return this.$message.error('取消删除用户权限')
            }
            this.$message.success('成功删除用户权限')
            // 确认删除用户权限后向数据库发送请求 删除对应权限 根据API 接口要求需要 需要提供删除的角色ID 和权限ID
            console.log(currentLineItem)
            console.log(PermissionsID)
            // 删除权限
            const {data:res} = await this.$http.delete(`roles/${currentLineItem.id}/rights/${PermissionsID}`)
            if( res.meta.status !==200){
                return this.$message.error('请求失败')
            }
            this.$message.success(res.meta.msg)
            // 刷新后台数据 如果重新刷新后台数据的话调用该方法 this.getRolesList() 会从刷新页面 推荐使用操作原本的数据进行操作来更新页面数据
            // this.getRolesList()
            // 把返回的数据 重新赋值给作用域插槽的当前行
            currentLineItem.children = res.data

        }
    }
}
</script>
<style lang="less" scoped>
.card{
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
// tag 标签
.el-tag{
    margin: 7px;
}
// 居中对其
.vconter{
    display: flex;
    align-items: center;
}
// btop 上边框线
.btop{
    border-top: 1px solid #ccc;
}
.bbottom{
    border-bottom:1px solid #ccc;
}
</style>
