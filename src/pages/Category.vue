<template>
	<div class="category">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click='toAddCategory'>新增</el-button>
			<el-button size='mini' @click='batchDeleteCategory'>批量删除</el-button>
		</div>
		<!-- 按钮结束 -->
		<!-- 栏目管理表格 -->
		<el-table :data='categories'
		style="width: 100%" border @selection-change="handleSelectionChange" v-loading='loading'>
		<el-table-column
		type="selection"
		width="40">
	</el-table-column>
	<el-table-column
	prop="name"
	label="栏目"
	width="180">
</el-table-column>
<el-table-column
prop="comment"
label="栏目描述"
width="300">
</el-table-column>
<el-table-column
prop="parent.name"
label="父栏目">
</el-table-column>
<el-table-column
fixed="right"
label="操作"
width="150">
<template slot-scope="{row}">
	<el-button @click="deleteCategory(row.id)" type="danger" size="small">删除</el-button>
	<el-button  size="small" @click='toUpdateCategory(row)'>修改</el-button>

</template>
</el-table-column>
</el-table>
<!-- 栏目管理结束 -->
<!-- 模态框开始 -->
<el-dialog :title="cDialog.title" :visible.sync="cDialog.visible" width="30%" :modal='false' @open='open()' center>
	<el-form :model="form" :rules='rules' ref='form'  size="mini" label-position="left" class="demo-ruleForm" >

		<!-- 注意 若要使用表单的重置功能需要用prop接收一个要重置的参数 -->
		<el-form-item label="栏目名称" label-width="6em" prop='name'>       
			<el-input v-model="form.name" autocomplete="off" :rules='rules.name' prop='name' ></el-input>
		</el-form-item>
		<el-form-item label="父栏目" :rules='rules.parentId' label-width="6em" prop='parentId'>
			<el-select v-model="form.parentId" placeholder="一级栏目">
			    <!-- <el-option :key='s.id'  v-for='s in cDefault'  :value='s.id' :label="s.name"></el-option> -->
				<el-option :key='c.id' v-for='c in categories' :label="c.name" :value="c.id"></el-option>

			</el-select>
		</el-form-item>
		<el-form-item label="栏目描述" label-width="6em" prop='comment'>
			<el-input v-model="form.comment" type="textarea" :rows="3"></el-input>
		</el-form-item>
		<el-form-item style='width:50%;left:50px'>
			<!-- <el-button @click="resetForm('form')">重置</el-button> -->
		
		</el-form-item>
	</el-form>
	<span slot="footer" class="dialog-footer">
			<el-button @click="closeCDialog">取 消</el-button>
			<el-button type="primary" @click="saveOrUpdateCategory('form')"  >确 定</el-button>
	</span>
</el-dialog>
<!-- 模态框结束 -->

</div>
</template>
<script>
	import axios from '@/http/axios';
	export default{
		data(){
			return {
				loading:false,
                //给模态框父栏目下拉框默认值
                // cDefault:[{
                // 	id:62,
                // 	name:'推荐'
                // }],
				categories:[],
				multipleSelection:[],     //复选框选中时保存的id值
				// 用来给模态框设置状态 visible为false则隐藏，title用来设置头部信息
				cDialog:{
					title:'',
					visible:false,

				},

			  //form对象用于保存模态框的输入的值
			  form:{
			  // 	id:undefined,
			  // 	name:undefined,
			  // 	parentId:undefined,
					// no:undefined,             //父栏目序号
					// comment:''
				},
				rules:{
					// parentId:[{
					// 	type:'number',required:true,message:'请选择栏目',trigger:'blur'
					// }],
					name:[{
						required:true,message:'标题不能为空',trigger:'blur'
					}]
				}     
			}
		},

		created(){
			this.findAllCategory();
		},
		methods:{
			//通过监听模态框执行表单验证结果重置
			open(){
				//判断是否有form需要清除验证
				if(this.$refs['form']){
				  this.$refs['form'].clearValidate();
				}
			},
			// 查询所有栏目
			findAllCategory(){
				this.loading=true;
				axios.get('/manager/category/findAllCategory')
				.then(({data:result})=>{
					// 过滤没有栏目名称的选项
					this.categories=result.data.filter((item)=>{
						return item.name;
					});
				})
				.catch(()=>{
					this.$message({
						showClose: true,
						message: '网络异常',
						type: 'error'
					});
				})
				.finally(()=>{
					this.loading=false;
				})
			},
			// 通过修改按钮打开模态框
			toUpdateCategory(row){
				for(var key in this.form){
						delete this.form[key];
                }
				this.cDialog.title='修改栏目',
				// row.parentId = row.parent.id;
				// assign合并对象，将要修改的行的数据合并到form中，解决修改模态框数据改变时，表格内容的变化
			    Object.assign(this.form,row);   
				this.cDialog.visible = true;

			},
			// 通过模态框确定按钮保存或更新修改数据
			saveOrUpdateCategory(form){
				console.log(this.form);
				this.$refs[form].validate((valid) => {
					if (valid) {		   
            		    //表单验证成功时提交数据       

            		    axios.post('/manager/category/saveOrUpdateCategory',this.form)
            		    .then((result)=>{
            		    	if(result.status==200){
	            		    	this.$message({
	            		    		message: '新增或修改成功',
	            		    		type: 'success'
	            		    	});
	            		    	this.closeCDialog();
	            		    	this.findAllCategory();
                            }else{
                            	this.$message({
	            		    		message: '新增或修改失败',
	            		    		type: 'error'
	            		    	});
                            }
            		    })
            		    .catch(()=>{
            		    	this.$message({
            		    		message: '网络异常',
            		    		type: 'error'
            		    	});
            		    })
            		} else {
            			return false;
            		}
            	});


			},

			// 通过模态框取消按钮关闭模态框的同时清除模态框数据
			closeCDialog(){
				this.cDialog.form={},
				this.cDialog.visible=false
			},
			// 通过新增按钮打开模态框
			toAddCategory(){
				//清空form数据以重置模态框，打开模态框
                for(var key in this.form){
						delete this.form[key];
                }
				this.cDialog.title='新增栏目',
				this.cDialog.visible=true
				// this.cDialog.form='',
				// this.cDialog.form=this.categories.id;
			},

			//通过删除按钮图标删除信息，删除确认
			deleteCategory(id){
				this.$confirm('是否永久删除信息？', '确认信息', {
					distinguishCancelAndClose: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				})
				.then((result) => {

					axios.get('/manager/category/deleteCategoryById?id='+id)
					.then((result)=>{
						  //操作成功且状态为200时执行
						  if(result.data.status==200){
						  	this.$message({
						  		showClose: true,
						  		message: '删除成功',
						  		type: 'success'
						  	});
						  	this.findAllCategory();
						  }else{
						  	this.$message({
						  		showClose: true,
						  		message: '数据错误,删除失败',
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
					});    
				});
			},
			batchDeleteCategory(){
				let ids = this.multipleSelection.map((item)=>{
					return item.id;
				});
				let obj={
					ids:ids.toString()
				}
				// 如果有选择栏目则执行删除
				if(obj.ids!=''){
					axios.post('/manager/category/batchDeleteCategory',obj)
					.then((result)=>{					    
						if(result.data.status==200){
							this.$message({
								showClose: true,
								message: '批量删除成功',
								type: 'success'
							});
							this.findAllCategory();	
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
						message: '请选择栏目',
						type: 'warning'
					});
				}
			},
			// 选择时，将栏目id赋值给multipleSelection
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
		}
	}
</script>
<style>
	.btns{
		margin-bottom: .5em;
	}
</style>