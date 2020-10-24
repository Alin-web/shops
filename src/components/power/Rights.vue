<template>
    <div class="rights">
       <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="card">
            <el-table :data="rightsList"  border style="width: 100%" stripe>
                <el-table-column type="index" width="50px" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称"> </el-table-column>
                <el-table-column prop="path" label="路径" > </el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag type="success"  v-if="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag type="warning"  v-else-if="scope.row.level === '1'">二级权限</el-tag>
                        <el-tag type="danger"   v-else>三级权限</el-tag>
                    </template> 
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 所有的权限列表
            rightsList:[]
        }
    },
    // created 生命周期函数 用来向后台请求数据 这里面只调用 请求一般放在 methods 中定义
     created(){
        this.getRightsList()
        
    },
    methods:{
        async getRightsList(){
            const {data:res} = await this.$http.get('rights/list')
            //console.log(res)
            // 进行判断 看是否请求成功
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            // 请求成功 把请求到的数据 传递到data中 进行页面渲染
            this.rightsList = res.data
            //console.log(this.rightsList)
        },
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
</style>
