<template>
  <div id="app">
    <div class="header">
         <div class="title">看点资讯后台管理系统</div>
    </div>
    <div class="content">
      <div class="left-nav">
          <ul>
            <li :class="{current:currentRouter=='/category'}"><router-link to='/category'>栏目管理</router-link></li>
            <li :class="{current:currentRouter=='/user'}"><router-link to='/user'>用户管理</router-link></li>
            <li :class="{current:currentRouter=='/article'}"><router-link to='/article'>文章管理</router-link></li>
            <!-- <li><router-link to='set'>网页设置</router-link></li> -->
          </ul>
      </div>
      <div class="right-content">
          <div class="wrap">
               
                 <router-view></router-view>
               
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
   data(){
       return {
        currentRouter:'/category'
       }
   },
   watch:{
      '$route':function(to,from){

           this.currentRouter=to.path;
      }
   },
   mounted(){
       //刷新页面时，左侧导航栏样式和地址栏对应
       this.currentRouter=this.$route.path;
   }
}
</script>


<style>
  html,body{
    margin: 0;
    padding: 0;
    height: 100%;
    color: #657180;
    font-size: 16px;
  }
  .header{
    height: 60px;
    width: 100%;
    position: fixed;
    top: 0;
    padding-left: 2em;
    background: #333;
  }
  .header .title{
    line-height: 60px;
    font-size: 24px;
    color: #fff;
  }
  .left-nav{
     width: 150px;
     position: fixed;
     top: 60px;
     bottom: 0;
     left: 0;
     overflow: auto;
     background: #333;
  }
  .left-nav ul{
    list-style: none;
    padding: 0;
  }
  .left-nav ul li{
    line-height: 2.4em;
    text-align: center;
    border-bottom: 1px solid #ccc;
  }
  .current{
   /*border-right:1px solid #000;*/
   background-color:#e15782;

  }
  .left-nav ul li a{
    text-decoration: none;
    color: #fff;
    display: block;
  }
  .left-nav ul li a:hover{
    background-color:#ccc;
    color:#fff;
  }
  .right-content{
    position: fixed;
    padding: 2em;
    top:60px;
    right: 0;
    bottom: 0;
    left: 150px;
    background-color: #ccc;
    padding: 1em;
  }
  .right-content .wrap{
     position: absolute;
     top:.5em;
     right: .5em;
     left: .5em;
     bottom: 0;
     background-color: #fff;
     padding: .5em;
     overflow: auto;
     border-radius: 5px;
     
  }

</style>
