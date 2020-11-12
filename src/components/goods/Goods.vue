<template>
    <div class="goodes">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
       <el-card>
            <!-- 第一部分 layout布局:搜素框，添加按钮 -->
            <el-row class="firstPart">
                <!-- 搜素框 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="goodsList">
                        <el-button slot="append" icon="el-icon-search" @click="goodsList"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加按钮 -->
                <el-col :span="8">
                    <el-button type="primary" @click="addRouter">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 第二部分:table表格 -->
            <el-table class="secondPart" border stripe :data="goods">
                <!-- 索引行 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="120px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="180px">
                    <!-- 过滤器使用需要在自定义插槽内使用 -->
                    <template slot-scope="scope">
                        {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delButton(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 第三部分：分页组件 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                 :page-sizes="[5,10,15,20,25,30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
       </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 初始请求商品数据
            queryInfo:{
                // 查询参数
                query:'',
                // 请求第几页
                pagenum:1,
                // 一页显示多少条数据
                pagesize:10,
            },
            //商品列表
            goods:[],
            // 总条数
            total:0
        }
    },
    created(){
        this.goodsList()
    },
    methods:{
        async goodsList(){
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status !==200){
                return this.$message.error('商品列表请求失败')
            }
            // 数据传递 然后进行页面渲染
            this.goods = res.data.goods
            // 一个有多少条数据
            this.total= res.data.total
        },
        //handleSizeChange 页面大小改变
        handleSizeChange(newsize){
            this.queryInfo.pagesize =newsize
            this.goodsList()
        },
        // handleCurrentChange 当前页码改变
        handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum
            this.goodsList()
        },
        //删除功能delButton
        async delButton(currentLineItemId){
            const result = await this.$confirm('此操作将删除该商品信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            console.log(result)
            if(result !== 'confirm'){
                return  this.$message('取消删除成功')
            }
            // 确认删除 向后台发送删除请求 进行数据删除
            const {data:return_value} = await this.$http.delete(`goods/${currentLineItemId}`)
            if(return_value.meta.status !== 200){
                return  this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.goodsList()
        },
        // 添加商品按钮
        addRouter(){
            this.$router.push('/goods/add')
        }
    },
    computed:{
    }
}
</script>
<style lang="less" scoped>
.el-card{
    margin-top: 20px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
// 第一部分
.firstPart{
    margin: 0 0 20px 0;

}
.firstPart :nth-child(2){
    margin-left: 40px;
}
// secondPart 第二部分
.secondPart{
    font-size: 14px;
}
</style>
