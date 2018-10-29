<template>
	<div class="user">
        <div class="check">
			<el-form  label-width="100px" class="demo-ruleForm">
				<el-form-item label="查询" label-width='50px'>
					<el-input placeholder="输入用户名查询" label-width='80px' v-model="username" autocomplete="off" size='small' clearable>
						<el-button slot="append" icon="el-icon-search" @click='findUserByUsername'></el-button>
					</el-input>
					
			    </el-form-item>
			    <el-form-item>
				</el-form-item>
	        </el-form>
	    </div>
		<el-table :data="users" style="width: 100%" border>
	      <el-table-column prop="username" label="用户名" width="180">

	      </el-table-column>
	      <el-table-column prop="password" label="密码"  width="180">
	      </el-table-column>
	      <el-table-column   prop="nickname"  label="真实姓名">
	      </el-table-column>
	      <el-table-column   prop="email"  label="邮箱">
	      </el-table-column>
    </el-table>
	</div>
</template>
<script>
    import axios from '@/http/axios'
	export default{
		data(){
			return {
                  users:[],
                  username:undefined
			}
		},
		created(){
			this.findAllUser(); 
		},
		watch:{
			//监听用户名查询输入框
			username:function(){
				//当清空输入框时显示所有用户
               if(this.username==''){
               	   this.findAllUser();
               }
			}
		},
		methods:{
			//查询所有栏目
			findAllUser(){
                 axios.get('/manager/user/findAllUser')
				.then(({data:result})=>{
                    this.users=result.data;
				})
				.catch(()=>{

				})
			},
			findUserByUsername(){
				//用户名不为空时查询，为空时提示信息
				if(this.username!=undefined){
					axios.get('/manager/user/findUserByUsername?username='+this.username)
					.then(({data:result})=>{
						//清空users数组内容,将拿到的数据给users数组
						this.users.length=0;
	                    this.users.push(result.data);

					})
					.catch()
				}else{
					this.$message({
            		    message: '请输入用户名',
            		    type: 'warning'
            		});
				}
			}
		}
	}
</script>
<style>
	.check{
		width: 300px;
	}

</style>