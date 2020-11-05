<template>
    <div class="params">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="card">
            <!-- 警告-->
            <el-alert show-icon :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
            <!-- 级联选择器 -->
            <el-row class="cascaderDIV">
                <el-col>
                    <span>选择商品分类:</span>
                    <el-cascader v-model="cascaderChosenID" clearable :options="cascaderItem" :props="cascaderPorps" @change="cascaderChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- 标签页 -->
            <el-tabs class="tabs" v-model="tabsName" @tab-click="tabClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="idButDisabled" @click="addShowDialog">添加参数</el-button>
                    <!-- table表格视图区域 -->
                    <el-table :data="manyItem" border class="table">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                               <el-tag v-for="(item,index) in scope.row.attr_vals" closable :key=item.attr_id
                                class="expansionRow" @close="tagClose(index,scope.row)">
                                   {{item}}
                               </el-tag>
                               <!-- 添加 -->
                               <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                                    size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引行 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <!--  -->
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column prop="date" label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="delButTON(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="success" :disabled="idButDisabled" @click="addShowDialog">添加属性</el-button>
                    <!-- table表格视图区域 -->
                   <el-table :data="onlyItem" border class="table">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                               <el-tag v-for="(item,index) in scope.row.attr_vals" closable :key=item.attr_id
                                class="expansionRow" @close="tagClose(index,scope.row)">
                                   {{item}}
                               </el-tag>
                               <!-- 添加 -->
                               <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                                    size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引行 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <!--  -->
                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="delButTON(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- dialog 对话框组件 -->
        <el-dialog :title="'添加'+dialogTitleText" :visible.sync="dialogTabs" width="50%" @close="dialogFormClose">
            <!-- 内容主题区域 -->
            <el-form :model="dialogForm" :rules="dialogFormRules" ref="dialogFormRef">
                <el-form-item :label="dialogTitleText" label-width="80px" prop="attr_name">
                    <el-input v-model="dialogForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTabs = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormSure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改参数dialog 对话框 -->
        <el-dialog :title="'修改'+dialogTitleText" :visible.sync="modifyDialog" width="50%" @close="dialogFormClose">
            <!-- 内容主题区域 -->
            <el-form :model="modifyForm" :rules="modifyFormRules" ref="dialogFormRef">
                <el-form-item :label="dialogTitleText" label-width="80px" prop="attr_name">
                    <el-input v-model="modifyForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyDialog = false">取 消</el-button>
                <el-button type="primary" @click="modifyDialogSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 商品分类列表
            cascaderItem:[],
            // 级联选择器的配置规则
            cascaderPorps:{
                value:'cat_id', // 当前数据的ID 
                label:'cat_name', //显示的内容
                children:'children'
            },
            // 级联选择器的配置规则
            cascaderPorps:{
                value:'cat_id', // 当前数据的ID 
                label:'cat_name', //显示的内容
                children:'children'
            },
            // 级联选择器选中数据的ID 存放
            cascaderChosenID:[],
            // 级联选折起第三级ID
            Id:0,
            //被激活的标签页名称
            tabsName:'many',
            //  many 动态属性标签页显示数据
            manyItem:[],
            //  many 静态参数标签页显示数据
            onlyItem:[],
            //dialogTabs dialog 对话框控制
            dialogTabs:false,
            // 对话框form表单数据
            dialogForm:{
                attr_name:''
            },
            // 表单 规则
            dialogFormRules:{
                attr_name:[  
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ]
            },
            // 修该对话框按钮 
            modifyDialog:false,
            // 修改对话框的表单数据
            modifyForm:{ },
            // 表单规则
            modifyFormRules:{
                attr_name:[  
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        // 主要用于请求数据进行页面渲染
        this.getParamsList()
    },
    methods:{
        async getParamsList(){
            const {data:res} =  await this.$http.get('categories')
            if(res.meta.status !== 200){
                return this.$message.error('请求失败')
            }
            // this.$message.success('请求成功')
            //console.log(res.data)
            // 把请求到的数据传递到data中进行页面渲染
            this.cascaderItem = res.data
        },
        // 级联选择器 改变事件
        async cascaderChange(){
            // 选择器改变触发事件 请求数据进行页面渲染
            this.queryInfo()
        },
        // 标签页被触发的事件
        tabClick(){
            console.log(this.tabsName)
            // 标签页改变 请求数据进行页面渲染
            this.queryInfo()
        },
        // 请求数据单独事件
        async  queryInfo(){
             // 因为要进行限制 所以要进行限定 只允许为第三级分类设置相关参数
            if(this.cascaderChosenID.length !== 3 ){
               this.cascaderChosenID = [],
               // 禁用按钮
               this.onlyItem=[],
               // 清空表格数据
               this.manyItem=[]
               return 
            }
            // 证明选中的是三级分类
            // console.log(this.cascaderChosenID)
            /* console.log(this.cascaderChosenID.length) */
            this.Id = this.cascaderChosenID[2]
            // console.log(Id)
            // 点击页面发送请求 
            const {data:res} = await this.$http.get(`categories/${this.Id}/attributes`,{ params:{sel:this.tabsName}})
            if(res.meta.status !== 200){
                return this.$message.error('错误')
            }
            this.$message.success('成功')
            console.log(1111111111111111)
            // 展开行数据
            res.data.forEach(item  => {
                console.log(item)
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]
                // 解决每个tag按钮 点击时同时展开事件
                item.inputValue='',
                // 解决每个tag按钮 点击时同时展开事件  不要写在 data中 
                item.inputVisible=false
            })
            console.log(res.data)
            // 传递到 data中进行页面渲染 判定请求的数据是渲染到哪个部分的 进行判断
            if(this.tabsName === 'many'){
                //如果当前标签页是many  请求到的数据发送到data中进行many标签页的渲染
                this.manyItem = res.data
                console.log('动态属性') 
            }else{
                this.onlyItem = res.data 
                console.log('静态参数') 
            }
        },
        // 点击添加参数按钮 弹出dialog对话框
        addShowDialog(){
            // 显示dialog对话框组件
            this.dialogTabs = true
        },
        // dialogFormClose dialog关闭事件 
        dialogFormClose(){
            this.$refs.dialogFormRef.resetFields()
        },
        // dialog 确定按钮事件
        dialogFormSure(){
            // 对表单进行预验证
            this.$refs.dialogFormRef.validate(async valid => {
                if(!valid){
                    return this.$message.error('验证失败')
                }
                // 验证成功，向后台发送添加数据的请求
                const {data:res} = await this.$http.post(`categories/${this.Id}/attributes`,{
                    attr_name:this.dialogForm.attr_name,
                    attr_sel:this.tabsName,
                })
                // 判断
                if(res.meta.status !== 201){
                    return this.$message.error('请求失败')
                }
                this.$message.success('请求成功')
                // 关闭弹窗组件
                this.dialogTabs=false
                // 更新数据页面
                this.queryInfo()
                console.log(res.data)
            })
        },
        // 动态参数面板 编辑按钮 事件
        async showEditDialog(currentLienItemID){
            console.log(currentLienItemID)
            // 根据ID 查询参数
            const {data:res} = await this.$http.get(`categories/${this.Id}/attributes/${currentLienItemID}`,{ params:{attr_sel: this.tabsName }})
            if(res.meta.status !== 200){
                return this.$message.error('请求失败')
            }
            this.$message.success('请求成功')
            this.modifyForm = res.data
            console.log(res.data)
            this.modifyDialog=true
        },
        // 修改对话框 确定 按钮事件
        modifyDialogSure(){
            this.$refs.dialogFormRef.validate(async valid => {
                if(!valid){
                    return
                }
                // 点击确定按钮 发送数据请求
                const {data:res} =  await this.$http.put(`categories/${this.Id}/attributes/${this.modifyForm.attr_id}`,{attr_name:this.modifyForm.attr_name,
                                                                                            attr_sel:this.tabsName})
                if(res.meta.status !== 200){
                    return this.$message.error('请求失败')
                }
                this.$message.success('请求成功')
                // 局部数据刷新
                this.queryInfo()
                this.modifyDialog=false
            })
        },
        // delButTON 删除按钮 事件
        async delButTON(currentLineID){
            // console.log(currentLineID)
            const whether = await this.$confirm('此操作将永久删除该信息,是否继续','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(whether)
            if(whether == 'cancel'){
                return console.log('取消删除')
            }
            // onsole.log('删除成功')
            // 发送请求进行删除操作
            const {data:res} = await this.$http.delete(`categories/${this.Id}/attributes/${currentLineID}`)
            if(res.meta.status !== 200){
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            // 进行局部页面刷新
            this.queryInfo()
        },
        // tagClose 展开行tag标签关闭事件
        tagClose(index,currentLineItem){
            console.log(index)
            console.log(currentLineItem)
            // 删除点击的参数
            currentLineItem.attr_vals.splice(index,1)
            // 向后台发送数据
            this.unfoldLine(currentLineItem)
        },
        //展开行 添加按钮点击事件
        showInput(currentLineItem){
            // 点击添加按钮 展开input 输入框
            currentLineItem.inputVisible = true
            // input 自动获取焦点
            // $nextTick 方法作用：当页面元素从新渲染之后才会执行回调函数中的代码 
            this.$nextTick(_ => {
                // 直接调用该方法会报错 因为点击过后虽然变为了true  但是页面还未渲染出来 需要等到渲染出来之后再执行该方法才不会报错
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        //展开行 input输入框失去焦点事件
        async handleInputConfirm(currentLineItem){
            // 优化   当前的数据去除首位的文本框的空格，然后进行判断看是否合法
            if(currentLineItem.inputValue.trim().length === 0){
                // 不合法的话  重置数据为 空  然后关闭对话框
                currentLineItem.inputValue=''
                currentLineItem.inputVisible = false
                return                
            }
            // 没有return 这证明输入的是有效数据
            currentLineItem.attr_vals.push(currentLineItem.inputValue.trim())
            // 重置数据为 空  然后关闭对话框
            currentLineItem.inputValue=''
            currentLineItem.inputVisible = false
            // 向后台发送数据
            this.unfoldLine(currentLineItem)
        },
        // 展开行 添加的数据 向后台进行请求添加
        async unfoldLine(currentLineItem){
            // 向数据库发送请求添加数据 该项
            console.log(currentLineItem.attr_vals)
            const {data:res} = await this.$http.put(`categories/${this.Id}/attributes/${currentLineItem.attr_id}`,
            {
                attr_name:currentLineItem.attr_name,
                attr_sel:currentLineItem.attr_sel,
                attr_vals:currentLineItem.attr_vals.join(' ')
            })
            if(res.meta.status !== 200){
                return this.$message.error('请求失败')
            }
            this.$message.success('请求成功')
        }
    },
    // 计算属性
    computed:{
        idButDisabled(){
            if(this.cascaderChosenID.length !== 3){
                return true
            }else{
                return false
            }
        },
        // dialog提示标题
        dialogTitleText(){
            if(this.tabsName === 'many'){
                return "动态参数"
            }else{
                return "静态属性"
            }
        }
    }
}
</script>
<style lang="less" scoped>
.card{
    margin-top: 20px;
    box-shadow:  0 1px 1px rgba(0, 0, 0, 0.15) !important;;
}
.cascaderDIV{
    margin-top: 20px;
    span{
        padding: 0 10px;
    }
}
.tabs{
    margin-top: 20px;
}
.table{
    margin-top: 20px;
}
// 展开行
.expansionRow{
    margin-right: 10px;
}
.input-new-tag{
    width: 120px;
}
</style>