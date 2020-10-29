<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addClassify">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table border class="table" :data="goodeList" :columns="columns" :show-index="true" index-text="#"
                :expand-type="false" :selection-type="false" :stripe="true" border>
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:green"></i>
                    <i class="el-icon-error" type="primary" v-else style="color:red"></i>
                </template>
                <template slot="sort" slot-scope="scope">
                    <el-tag type="success"  v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="warning" size="small" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="danger" size="mini" v-else>三级</el-tag>
                </template>
                <template slot="operation" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="compile(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delItem(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类按钮对应的弹框 -->
        <el-dialog title="添加分类" :visible.sync="addClassifyDialog" width="50%" @close="addFormClose">
            <!-- 内容主题区域 -->
            <el-form class="addForm" :model="formAddClassif" :rules="formAddClassifRules" ref="addFormRef" label-width="80px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="formAddClassif.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- Cascader 级联选择器  options绑定数据源-->
                    <!-- 可通过 props 属性 checkStrictly = true 来设置父子节点取消选中关联，从而达到选择任意一级选项的目的。 -->
                   <!-- 也可以 change-on-select 属性设置为true 来设置富子结点取消选中关联 从而达到选择任意一级选项的目的 -->
                   <el-cascader
                    v-model="valueCascader" clearable 
                    :options="ParentClassify" 
                    :props="cascaderProps"
                    @change="cascaderChange"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addClassifyDialog = false">取 消</el-button>
                <el-button type="primary" @click="DialogSure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑 dialog 弹框组件 -->
        <el-dialog title="编辑信息" :visible.sync="compileDialog" width="50%">
            <!-- 内容主题区域 -->
            <el-form class="compileForm" ref="compileFormRef" :model="compileModel" label-width="80px" :rules="formAddClassifRules">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="compileModel.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="compileDialog = false">取 消</el-button>
                <el-button type="primary" @click="compileSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 查询条件  页面初始化数据
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品列表
            goodeList:[],
            // 总数据条数
            total:0,
            // 为table指定列的定义
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    type: 'template',
                    template: 'isok',
                },
                {
                    label:'排序',
                    type: 'template',
                    template: 'sort',
                },
                {
                    label:'操作',
                    type: 'template',
                    template: 'operation',
                },
            ],
            // 点击添加分类按钮 对应的弹框组件 addClassifyDialog
            addClassifyDialog:false,
            // 弹框组建的form表单
            formAddClassif:{
                cat_name:'',
                // 分类父ID
                cat_pid:0,
                // 分类的等级 默认为一级分类
                cat_level:0
            },
            // 弹框组件表单规则
            formAddClassifRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // Dialog 对话框组件数据 Cascader 级联选择器 用到的
            ParentClassify:[],
            // Cascader 级联选择器 数据 选中的数据id
            valueCascader:[],
            // 级联选择器的props 配置属性
            cascaderProps:{
                expandTrigger:'hover',
                value:'cat_id',
                children:'children',
                label:'cat_name',
                /* 可通过 props.checkStrictly = true 来设置父子节点取消选中关联，从而达到选择任意一级选项的目的。 */
                checkStrictly:true
            },
            // dialog 组件 编辑按钮事件
            compileDialog:false,
            // 表单 compileModel 
            compileModel:{},
            // 点击的当前行ID
            lineId:0

        }
    },
    // created 生命周期函数 一般用来请求数据 进行初始化渲染
    created(){
        this.getGoodesList()
    },
    methods:{
        async getGoodesList(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status !== 200){
                return this.$message.error('请求失败')
            }
            // console.log(res.data)
            // 把总数据保存到data中
            this.goodeList = res.data.result
            // 总数据条数
            this.total = res.data.total
        },
        // 分页 handleSizeChange size-change 方法
        handleSizeChange(newSize){
            // console.log('handleSizeChange')
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            // 刷新数据
            this.getGoodesList()
        },
        // handleCurrentChange 分页  current-change 触发方法
        handleCurrentChange(newPageNum){
            // console.log('handleCurrentChange')
            this.queryInfo.pagenum = newPageNum
            this.getGoodesList()
        },
        // 添加分类按钮事件 addClassify
        addClassify(){
            //打开组件
            this.addClassifyDialog=true
            // 调用函数 获得二级分类数据
            this.getParentClassify()
        },
        // 获取分类数据
        async  getParentClassify(){
            // 获取商品分类数据列表
            const { data:res} = await this.$http.get('categories',{ params: { type:2 } } )
            if(res.meta.status !== 200 ){
                return this.$message.error('获取父级分类失败')
            }
            this.$message.success('成功')
            this.ParentClassify = res.data
            // console.log(this.ParentClassify )
        },
        // 级联选择器 里面的选项发生变化会触发 该方法
        cascaderChange(){
            //console.log(this.valueCascader)
            // 进行判断 如果数组中的length >0 证明选中了父级分类 反正则不是
            if(this.valueCascader.length  > 0){   
                // 把选中的最后一项的ID 赋值给弹框组件的form表单 的cat_pid 属性 以便后续发送请求进行添加
                this.formAddClassif.cat_pid = this.valueCascader[this.valueCascader.length - 1]
                // 更新 分类的等级 
                this.formAddClassif.cat_level = this.valueCascader.length
                console.log('分类等级：'+this.formAddClassif.cat_level+'======扩展项ID' +this.formAddClassif.cat_pid,)
                return
            }else{
                // 当等于零的时候 我们把数据重置为初始状态
                this.formAddClassif.cat_level=0
                this.formAddClassif.cat_pid=0
            }
        },
        // 弹出框组建的 确定按钮 事件
        DialogSure(){
            //当点击表单确定按钮提交数据之前 进行预验证
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$http.post('categories',this.formAddClassif)
                if(res.meta.status !== 201){
                    return this.$message.error('添加失败')
                }
                this.$message.success('添加成功')
                // 刷新页面
                this.getGoodesList()
                // 关闭弹窗
                this.addClassifyDialog = false
            })
        },
        // 监听对话框关闭时间 进行表单重置
        addFormClose(){
            // 重置表单
            this.$refs.addFormRef.resetFields()
            // 重置接连选择器
            this.formAddClassif.cat_level=0
            this.formAddClassif.cat_pid=0
            // 清空选中储存的数据
            this.valueCascader=[]
        },
        // 编辑按钮事件 compile
        async compile(currentLineItemID){
            // 先保存 进行后续的使用
            this.lineId = currentLineItemID
            // 根据 ID 发送请求
            const {data:res} = await this.$http.get(`categories/${this.lineId}`)
            if(res.meta.status !== 200){
                return this.$message.error('请求失败')
            }
            // 传递值
            this.compileModel = res.data
            // 弹出弹框
            this.compileDialog =true
        },
        // 编辑 弹框组件 确定按钮事件
        compileSure(){
            // 表单预验证
            this.$refs.compileFormRef.validate( async valid =>{
                if(!valid){
                    return this.$message.error('表单验证失败')
                }
                // 表单验证成功 向后台发送数据 进行数据修改
                const { data:res} = await this.$http.put(`categories/${this.lineId}`,{cat_name:this.compileModel.cat_name})
                if(res.meta.status !== 200){
                    return this.$message.error('请求失败')
                }
                // 请求成功  刷新数据
                this.getGoodesList()
                 this.compileDialog =false
            })
        },
        // delItem 删除按钮事件
        async delItem(itemId){
            console.log(itemId)
            const messageBOX =  await this.$confirm('此操作将永久删除该数据，是否继续','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            console.log(messageBOX)
            if(messageBOX == 'cancel'){
                return this.$message.warning('取消删除')
            }
            this.$message.success('删除成功')
            // 向数据库发送请求进行删除
            const {data:res} = await this.$http.delete(`categories/${itemId}`)
            if(res.meta.status !==200){
                return this.$message.warning('删除失败')
            }
            // 删除成功 刷新列表
            this.getGoodesList()
        }
    }
}
</script>
<style lang="less" scoped>
.card{
    margin-top: 20px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.table{
    margin-top: 20px;
}
.addForm{
    box-sizing: border-box;
    .el-form-item{
        width: 100%;
        padding: 0 10px;
    }
}
.el-cascader{ 
    width: 100%;
}
</style>