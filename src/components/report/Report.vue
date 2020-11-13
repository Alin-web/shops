<template>
    <div>
        <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 第二步 为echarts 准备dom节点 -->
            <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
// 第一步 导入echarts 图标插件
import echarts from 'echarts'
export default {
    data() {
        return {
            // 需要合并的数据
            options:{
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ]
            }
        }
    },
    created(){

    },
    // 生命周期函数  页面节点已经渲染完毕
    async mounted(){
        // 第三步  基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))
        // 第四步 准备数据和配置项
        const {data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200){
            return this.$message.error('请求图标数据失败')
        }
        // 合并对象
        const result = _.merge(res.data,this.options)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result)
        
    },
    methods:{
        
    }    
}
</script>
<style lang="less" scoped>

</style>
