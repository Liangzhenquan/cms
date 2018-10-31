<template>
	<div class="article">
		<!-- 按钮开始 -->
		<div class="btns">
			<el-button size='mini' @click='toAddArticle'>发布文章</el-button>
			<el-button size='mini' @click='batchDeleteArticle'>批量删除</el-button>
			<el-select v-model="aCategory.id" placeholder="所有栏目" size='mini' @change='valChange'>
				<el-option :key='c.id' v-for='c in categories' :label="c.name" :value="c.id"></el-option>
			</el-select>
		</div>
		
		<!-- 按钮结束 -->
		<!-- 文章表格 -->
		<el-table
		:data="articles"
		style="width: 100%" @selection-change="handleSelectionChange" border>
		<el-table-column
		type="selection"
		width="40" >
			</el-table-column>
			<el-table-column
			prop="title"
			label="文章标题"
			width="180">
		</el-table-column>
		<el-table-column
		prop="category.name"
		label="所属栏目"
		width="180">
		</el-table-column>
		<el-table-column
		prop="publishtime"
		label="发布时间"
		width="180">
		</el-table-column>
		<el-table-column
		prop="author"
		label="作者">
		</el-table-column>
		<el-table-column
		prop="status"
		label="审核进度">
		</el-table-column>
		 <el-table-column label="操作" width='100'>
	      	<template slot-scope='{row}'>
	      		<i class="fa fa-trash" @click='deleteArticle(row.id)'></i>
	      		<i class="fa fa-pencil" @click='toUpdateArticle(row)'></i>
	      	</template>
	      </el-table-column>
		</el-table>
<!-- 模态框开始 -->
<el-dialog :title="aDialog.title" :visible.sync="aDialog.visible" width="80%" :modal='false' @open='open()' center fullscreen>

   
	<el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
		<el-form-item label="文章标题" prop="title" :rules="rules.title" label-width="6em"
		>
		<el-input type="title" v-model="form.title" autocomplete="off"></el-input>
	</el-form-item>

	<el-form-item label="栏目" label-width="6em"  :rules='rules.categoryId' prop='categoryId'>
		<el-select v-model="form.categoryId" placeholder="栏目">
			<el-option :key='c.id' v-for='c in categories' :label="c.name" :value="c.id"></el-option>
		</el-select>	
	</el-form-item>
	<el-form-item label="文章内容" label-width="6em" prop='content' :rules='rules.content'>
		<mavon-editor v-model='form.content'></mavon-editor>
	</el-form-item>
	
	<el-form-item >
		
	</el-form-item>
</el-form>
	<span slot="footer" class="dialog-footer">
		<el-button @click="closeADialog">取消</el-button>
	     <el-button type="primary" @click="saveOrUpdateArticle('form')">提交</el-button>
	</span>

</el-dialog>
<!-- 模态框结束 -->
<!-- 分页开始 -->
<div class="block">
  <el-pagination
    @current-change='handleCurrentChange'
    layout="prev, pager, next"
	:page-size='params.pageSize'
    :total="total">
  </el-pagination>
</div>
<!-- 分页结束 -->
</div>
</template>
<script>
	import axios from '@/http/axios'

	export default{
		data(){
			return {
				total:null,
				articles:[],
				categories:[],
				multipleSelection:[],
				aDialog:{
					title:'',
					visible:false,

				},
				aCategory:{id:''},  //用于保存栏目id以便操作文章时自动刷新页面
		        
		        // 模态框表单数据 用于传给后台
				form:{
					title:'',
					content:'',
					categoryId:'',
					liststyle:'style-one',		
				},
				//保存或修改时，将模态框form数据保存以发送
				paramsForm:{},

				//查询文章要的数据
                	params:{
                       page:0,
                       pageSize:7,
                       categoryId:null      //为null时是查看所有文章
                },
                // 表单验证规则
				rules:{
					title:[{ required: true, message: '标题不能为空',trigger:'blur'}
					],
					content:[{type:'string', required: true, message: '内容不能为空',trigger:'blur'}
					],
					author:[{ required: true, message: '请输入作者'}],
					categoryId:[{type:'number', required: true, message: '请选择栏目',trigger:'blur'}],

                     
				},
			

			}
		},
		watch:{
           params:{
           	   handler(){
           	   	console.log(1);
           	   	  this.findArticle();
           	   },
           	   deep:true
           }
		},
		created(){
			this.findArticle();
			this.findAllCategory();
		},
		methods:{
			//模态框打开则清除表单验证结果
			open(){
				if(this.$refs['form']){
				 this.$refs['form'].clearValidate();
				}

			},
			//当分页功能当前页改变时触发
			handleCurrentChange(val){
				this.params.page=val-1;
			},
            // 表单验证
            saveOrUpdateArticle(formName) {

            	this.$refs[formName].validate((valid) => {
            		if (valid) {		   
            		    //表单验证成功时提交数据 

            		    //如果是从修改跳转来，则将id和列表样式和审核状态及发布时间发送，否则修改后审核状态和发布时间变空 
    		            if(this.aDialog.title=='修改文章'){
	            		    this.paramsForm.id=this.form.id;
	            		    this.paramsForm.liststyle=this.form.liststyle;
	            		    this.paramsForm.status=this.form.status;
	            	        this.paramsForm.publishtime=this.form.publishtime;
	            		};
	            		    this.paramsForm.title=this.form.title;
	            		    this.paramsForm.content=this.form.content;
	            		    this.paramsForm.categoryId=this.form.categoryId;
	            	       
            		    axios.post('/manager/article/saveOrUpdateArticle',this.paramsForm)
            		    .then((result)=>{

            		    	this.aDialog.visible=false;   //关闭模态框
            		    	if(result.status==200){
	            		    	this.$message({
									showClose: true,
									message: '发布成功',
									type: 'success'
						        });
	                            // 传递栏目id刷新页面
	            		    	this.findArticle(this.form.categoryId);
	            		    }else{
	            		    	this.$message({
								showClose: true,
								message: '数据错误',
								type: 'error'
						});
	            		    }
            		    })
            		    .catch(()=>{
            		    	this.$message({
								showClose: true,
								message: '网络异常',
								type: 'error'
						});
            		    })
            		} else {
            			return false;
            		}
            	});
            },
            // 模态框取消按钮关闭模态框
            closeADialog(){
            	this.aDialog.visible=false;
            },
			// 当下拉列表框选项改变时传递栏目id值给findAllArticle来查找
			valChange(val){
				this.params.categoryId=val;
				this.params.page=0;   //查询栏目下拉框值改变时，重置查询当前页为0
				this.findArticle();

			},
			resetForm(form){
					this.$refs[form].resetFields();
			},
            // 通过发布文章按钮打开模态框
            toAddArticle(){
                 //清空form数据以重置模态框，打开模态框
                for(var key in this.form){
						delete this.form[key];
                }
                 this.aDialog.title='发布文章',
                 this.aDialog.visible=true
             },
             //通过修改按钮打开模态框
             toUpdateArticle(row){
             	  this.aDialog.title='修改文章',
             	  this.aDialog.visible=true,
				// assign合并对象，将要修改的行的数据合并到form中，解决修改模态框数据改变时，表格内容的变化   
			      Object.assign(this.form,row);   
             	  // this.form.content=row.content;
             },
             // 通过id删除文章
             deleteArticle(id){
             	axios.get('/manager/article/deleteArticleById?id='+id)
             	.then(({data})=>{
             		
             		if(data.status==200){
	             		this.$message({
								showClose: true,
								message: '删除成功',
								type: 'success'
						});
						this.findArticle(this.aCategory.id);
					}else{
						this.$message({
								showClose: true,
								message: '删除失败',
								type: 'error'
						});
					}
             	})
             	.catch(()=>{
             			this.$message({
								showClose: true,
								message: '网络异常',
								type: 'error'
						});
             	})
             },

            // 批量删除文章
            batchDeleteArticle(){
                let ids = this.multipleSelection.map((item)=>{
					return item.id;
				});
				let obj={
					ids:ids.toString()
				};
				// 如果有选择文章则执行删除
                if(obj.ids!=''){
					axios.post('/manager/article/batchDeleteArticle',obj)
					.then((result)=>{
						//响应状态为200时删除成功提示信息并刷新页面
						if(result.data.status==200){
                            this.$message({
								showClose: true,
								message: '批量删除成功',
								type: 'success'
							});
							//批量删除时根据栏目id刷新页面
							this.findArticle(this.aCategory.id);
						}else{
							this.$message({
								showClose: true,
								message: '数据出错批量删除失败',
								type: 'error'
							});
						}
					})
					.catch(()=>{
						this.$message({
								showClose: true,
								message: '网络异常',
								type: 'error'
						});
					})
				}else{
					this.$message({
						showClose: true,
						message: '请选择要删除的文章',
						type: 'warning'
					});
				}
            },
			// 获取栏目
			findAllCategory(){
				axios.get('/manager/category/findAllCategory')
				.then(({data:result})=>{
					this.categories=result.data;
				})
				.catch(()=>{
                       this.$message({
								showClose: true,
								message: '网络异常',
								type: 'error'
						});
				})
			},
			// 查找文章
			findArticle(id){
				axios.get('/manager/article/findArticle',{
					params:this.params
				})
				.then(({data:result})=>{
					this.total=result.data.total;
					this.articles=result.data.list;

				})
				.catch(()=>{
					this.$message({
								showClose: true,
								message: '网络异常',
								type: 'error'
						});

				})
			},
			//获取要选择的文章，便于批量删除
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
		}
	}
</script>
<style>
	.btns{
		margin: .5em;
	}
	i.fa {
		margin: 0 .3em;
		cursor: pointer;
	}
	i.fa.fa-trash {
		color: #F56C6C;
	}
	.block{
		
	}
</style>