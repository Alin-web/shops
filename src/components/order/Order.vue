<template>
    <div>
        <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 查询按钮 -->
            <el-input placeholder="请输入内容" v-model="queryInput" class="search">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <!-- table表格 -->
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column type="index" width="50px"></el-table-column>
                <el-table-column  prop="order_number" label="订单编号" width="250px"></el-table-column>
                <el-table-column  prop="order_price" label="订单价格"></el-table-column>
                <el-table-column  prop="pay_status" label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  prop="is_send" label="是否发货"></el-table-column>
                <el-table-column  prop="update_time" label="下单时间" width="200px">
                    <template slot-scope="scope">
                        {{scope.row.update_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" @click="eidtClick"></el-button>
                        <el-button type="success" icon="el-icon-location" @click="logisticsProgress"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 弹框组件 -->
        <el-dialog title="修改地址" :visible.sync="editDialog" width="50%" @close="dialogClose">
            <!-- 内容主题区域 -->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" >
                <el-form-item label="省市区/县" prop="name1" class="inputItem">
                    <el-cascader v-model="ruleForm.name1" :options="cityData" :props="porps" class="cascader"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="name2">
                    <el-input v-model="ruleForm.name2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button type="primary" @click="editDialog = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 物流进度对话框 -->
        <el-dialog title="物流进度" :visible.sync="logisticsDialog" width="50%">
            <!-- 时间线 -->
            <el-timeline :reverse="true">
                <el-timeline-item  v-for="(activity, index) in activities" :key="index"
                :timestamp="activity.timestamp">
                {{activity.content}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>
<script>
import cityData  from './citydata.js'
export default {
    data() {
        return {
            // 初始话请求数据
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            // 查询框
            queryInput:'',
            //table 表格数据
            tableData:[],
            // total 总共多少条订单
            total:0,
            // 弹框组件 
            editDialog:false,
            // 弹框组件form表单
            ruleForm:{
                name1:[],
                name2:''
            },
            rules:{
                name1:[{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
                name2:[{ required: true, message: '请选择详细地址', trigger: 'blur' }]
            },
            // 级联选择器数据  绑定的是对应的 cityData.js  当属性名和属性值一样的话可以简写 写一个就行 cityData 
            cityData:cityData,
            //级联选择器规则
            porps:{
                value:cityData.value,
                label:cityData.label,
                children:cityData.children
            },
            // logisticsDialog 物流进度组件
            logisticsDialog:false,
            activities: [{
                content: '活动按期开始',
                timestamp: '2018-04-15'
                }, {
                content: '通过审核',
                timestamp: '2018-04-13'
                }, {
                content: '创建成功',
                timestamp: '2018-04-11'
            }]
        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        async getOrderList(){
            const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
            if(res.meta.status !==200){
                return this.$message.error('请求数据失败')
            }
            // total 总计
            this.total = res.data.total
            // order_number 订单编号
            this.tableData = res.data.goods
            console.log(res)
            console.log(res.data.total)
            console.log(this.tableData)
        },
        // 分页事件
        handleSizeChange(newsiez){
            this.queryInfo.pagesize = newsiez
            // 然后刷新页面
            this.getOrderList()
        },
        handleCurrentChange(newpage){
            this.queryInfo.pagenum = newpage
            // 然后刷新页面
            this.getOrderList()
        },
        // 编辑按钮事件
        eidtClick(){
            this.editDialog = true
        },
        // dialog 对话框关闭事件
        dialogClose(){
            this.$refs.ruleForm.resetFields()
        },
        // 物流进度按钮事件
        async logisticsProgress(){
            
            this.logisticsDialog=true
        }
    }
}
</script>
<style lang="less" scoped>
.search{
    width: 40%;
    margin-bottom: 20px;
}
.cascader{
    width: 400px;
}
</style>
