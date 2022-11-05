import Home from '../views/sandbox/home'
import UserList from '../views/sandbox/user-manage/userList'
import RightList from '../views/sandbox/right-manage/rightList'
import RoleList from '../views/sandbox/right-manage/roleList'
import NewsAdd from '../views/sandbox/news-manage/newsAdd'
import NewsCategory from '../views/sandbox/news-manage/newsCategory'
import NewsDraft from '../views/sandbox/news-manage/newsDraft'
import Published from '../views/sandbox/publish-manage/published'
import Unpublished from '../views/sandbox/publish-manage/unpublished'
import Sunset from '../views/sandbox/publish-manage/sunset'
import Audit from '../views/sandbox/audit-manage/audit'
import AuditList from '../views/sandbox/audit-manage/audit-list'
import { Navigate } from 'react-router'
import NoPermisson from '../views/sandbox/noPermisson'
import axios from 'axios'
let key=[]
     function getRoutes(){
    return Promise.all([
        axios({
            method:'get',
            url: '/rights'
        }),
        axios({
            method:'get',
            url: '/children'
        })
    ])
}
let rs=[]
const callback=(v)=>{
console.log(v,'v');
return v
}
export default async function test(){
 rs=await getRoutes()
const res=[...rs[0].data,...rs[1].data]
let route=res.map(item=>{
    return {
        path:item.key,
        element:backRoutes[item.key]
    }
})
key=route
console.log('1');
console.log(route,'in');//打印的是数组
callback(route)
console.log('3');
return route //返回的是promise对象
}
console.log(test());
console.log(key,'key');
console.log(rs,'rs');
const backRoutes={
    "/home":<Home/>,
    "/user-manage/list" :<UserList/>,
    "/right-manage/role/list" :<RoleList/>,
    "/right-manage/right/list":<RightList/>,
    "/news-manage/ add" : <NewsAdd/>,
    "/news-manage/draft" :<NewsDraft/>,
    "/news-manage/category" :<NewsCategory/>,
    "/audit-manage/audit" :<Audit/>,
    "/audit-manage/list" :<AuditList/>,
    "/publi.sh-manage/unpublished" : <Unpublished/>,
    "/publish-manage/published" :<Published/>,
    "/publish-manage/sunset" :<Sunset/>
}

console.log(getRoutes(),'getRoutes');

 const routes=[
    {
        path:'/home',
        element:<Home/>
    },
    {
        path:'user-manage/list',
        element:<UserList/>
    },
    {
        path:'right-manage/role/list',
        element:<RoleList/>
    },
    {
        path:'right-manage/right/list',
        element:<RightList/>
    },
    {
        path:'/',
        element:<Navigate to="/home"/>
    },
    // {
    //     path:'*',
    //     element:<NoPermisson/>
    // },
]

// export default routes



