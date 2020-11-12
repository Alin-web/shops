<template>
    <div class="addGoods">
       <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/Goods' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- alert 警告信息 -->
            <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>
            <!-- steps 步骤条 -->
            <el-steps :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- form大表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <!-- 左侧tab栏(标签页代替的) -->
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="activeTabsLeave" @tab-click="clickTabs">
                  <!-- 基本信息 -->
                    <el-tab-pane label="基本信息" name="0" >
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <!-- 级联选择器 -->
                        <el-form-item label="分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options="goodsClassifyList"
                            clearable :props="cascaderProps" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品参数 -->
                    <el-tab-pane label="商品参数" name="1" >
                        <el-form-item :label="item.attr_name" v-for="item in manyItem" :key="item.attr_id">
                            <!-- 多选按钮 -->
                            <el-checkbox-group v-model="item.attr_vals" >
                                <el-checkbox border size="small" :label="val" v-for="(val,index) in item.attr_vals" :key="index" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyItem" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                        
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            :action="uploadUrl"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="uploadSuccess"
                            list-type="picture"
                            :headers="headersObj">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span></span>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" @click="addbut" >添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- dialog 对话框组件 -->
        <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
        <img :src="previewPath" alt="" class="image">
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sure">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import _ from 'loadsh'

export default {
    data() {
        return {
            // 查询初始化商品分类数据列表的请求参数
            // 初始化页面请求到的商品分类数据列表
            goodsClassifyList:[],
            // 步骤条 控制激活的索引
            activeIndex:'0',
            // form大表单
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:[],
                // 添加的图片路径
                pics:[ ],
                // 商品介绍
                goods_introduce:'',
                // 商品的静态属性 和 动态参数
                attrs:[]
            },
            // 大表单验证规则
            addFormRules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight:[
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number:[
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat:[
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ]
            },
            // 级联选择器数据
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // manyItem 动态参数 数据
            manyItem:[],
            // onlyItem 静态属性 数据
            onlyItem:[],
            // 图片上传地址
            uploadUrl:"http://127.0.0.1:8888/api/private/v1/upload",
            // 图片请求请求头
            headersObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            // 图片的url路径
            previewPath:'',
            // 弹框组件控制
            dialogVisible:false

        }
    },
    created(){
        this.getGoodsClassifyList()
    },
    methods:{
        async getGoodsClassifyList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200){
                return this.$message.error('请求商品分类列表失败')
            }
            this.$message.success('请求商品分类列表成功')
            // console.log(res.data)
            this.goodsClassifyList =res.data
        },
        // handleChange 级联选择器 改变事件
        handleChange(){
            // 进行限制 必须选择三级标签
            if(this.addForm.goods_cat.length !== 3){
                this.addForm.goods_cat=[]
                return this.$message.error('请选择三级分类')
            }
            this.$message.success('选择三级分类成功')
            console.log(this.addForm.goods_cat)
        },
        //add  判断是否跳转标签页
        activeTabsLeave(activeName, oldActiveName){
            // 进行判断 看是否符合要求
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                return this.$message.error('请选择分类') , false
            }
        },
        // clickTabs  标签页点击事件
        async clickTabs(){
            console.log('标签被点击')
            if(this.activeIndex === '1'){
                // 标签页被点击 请求数据事件
                const {data:res} = await this.$http.get(`categories/${this.threeClassifyId}/attributes`,{params:{sel:'many'}})
                if(res.meta.status !== 200){
                    return this.$message.error('数据请求失败')
                }
                this.$message.success('数据请求成功')
                console.log(res.data)
                /* 把 res.data.attr_vals 的值修改为数组 */
                res.data.forEach(item => {
                    // 把得到的item.attr_vals 属性值 由字符串转换为数组
                    item.attr_vals  = item.attr_vals.length === 0 ? [] :item.attr_vals.split(' ')
                    console.log(item.attr_vals)
                })
                this.manyItem = res.data
            } else if(this.activeIndex === '2'){
                // 标签页被点击 请求数据事件
                const {data:res} = await this.$http.get(`categories/${this.threeClassifyId}/attributes`,{params:{sel:'only'}})
                if(res.meta.status !== 200){
                    return this.$message.error('数据请求失败')
                }
                this.$message.success('数据请求成功')
                console.log(res.data)
                this.onlyItem = res.data
                // this.manyItem = res.data
            }
        },
        // handlePreview 图片上传的函数钩子
        handlePreview(file){
            console.log(file)
            this.previewPath = file.response.data.url
            this.dialogVisible = true
        },
        // handleRemove 图片移除时的钩子函数
        handleRemove(file){
            console.log(file)
            //删除图片的三步
            // 1 第一步 根据钩子函数返回的数据 找到当前图片的临时路径
            const imageUrl = file.response.data.tmp_path
            // 2 第二部 找到路径在 addform 大表单的 pics 列表的索引值
            const imageIndex =  this.addForm.pics.findIndex( x => 
                x.pic === imageUrl
            )
            console.log(imageIndex)
            // 3然后用splice方法删除该路径
            this.addForm.pics.splice(imageIndex,1)
            
        },
        // 图片上传成功的钩子函数
        uploadSuccess(rps){
            // console.log(rps)
            // 拼接一个一个图片信息对象 
            const imageUrl = { pic:rps.data.tmp_path}
            // 添加到 form大表单的  pics 中
            this.addForm.pics.push( imageUrl)
            // console.log(this.addForm)
        },
        // 弹框组件
        sure(){
            this.dialogVisible = false
        },
        // 添加商品按钮
        addbut(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid){
                    return this.$message.error('表单验证规则失败')
                }
                // 符合验证规则  进行数据处理 让数据符合发送请求的数据格式
                //   goods_cat  以为','分割的分类列表 
                // 用深拷贝的方法 拷贝对象  用来解决 级联选择器 绑定的数据一定要绑定列表  因为我们要求是该属性是字符串
                const  copyAddForm = _.cloneDeep(this.addForm)
                copyAddForm.goods_cat = copyAddForm.goods_cat.join(',')
               
                // attrs商品的参数（数组），包含 `动态参数` 和 `静态属性`
                /* attrs":[{ "attr_id":15,"attr_value":"ddd"},
                    {"attr_id":15,"attr_value":"eee"}] */
                //处理form表单数据的 attrs 数据
                // 处理动态参数数据
                this.manyItem.forEach(item =>{
                    // 定义一个空对象 用来接收数据
                    const manyInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
                    // 处理好的数据添加到 attrs 中
                    this.addForm.attrs.push(manyInfo)
                })
                // 处理静态属性数据
                this.onlyItem.forEach(item =>{
                    // 定义一个空对象 用来接收数据
                    const onlyInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
                    this.addForm.attrs.push(onlyInfo)
                })
                // 处理好的数据 然后传递给深拷贝的对象  copyAddForm
                copyAddForm.attrs = this.addForm.attrs
                console.log(copyAddForm)
                // 发送数据请求 进行商品添加
                const {data:res} =  await this.$http.post('goods',copyAddForm)
                if(res.meta.status !== 201){
                    return this.$message.error('添加商品失败')
                }
                // 添加成功 编程式导航跳转页面
                this.$router.push('/Goods')
            })
        }
    },
    computed:{
        // 三级分类ID
        threeClassifyId(){
            if(this.addForm.goods_cat.length ===3){
                return  this.addForm.goods_cat[2]
            }
            return null
        },
    }
}
</script>
<style lang="less" scoped>

// 步骤条
.el-steps{
    margin: 20px 0;
    font-size: 10px;
}
.el-form-item:nth-child(1){
    margin-top: 0;
}
.el-form-item{
    margin-top: 20px;
}
.el-checkbox{
    margin: 0 5px !important;
}
.image{
    width: 100%;
}
.addbut{
    margin-top: 20px;
}
</style>
