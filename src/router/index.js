
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Article from '@/pages/Article'
import Category from '@/pages/Category'
import User from '@/pages/User'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
Vue.use(Router)
export default new Router({
  routes: [
    {
        path:'/',
        redirect:'/category'
    },
    {
    	path:'/category',
    	name:'category',
    	component:Category
    },
    {
    	path:'/user',
    	name:'user',
    	component:User
    },
    {
    	path:'/article',
    	name:'article',
    	component:Article
    },
  ]
})
