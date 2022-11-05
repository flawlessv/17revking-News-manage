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
import React from 'react'
import NewsPreview from '../views/sandbox/news-manage/newsPreview'
import NewsUpdate from '../views/sandbox/news-manage/newsUpdate'

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
        path:'news-manage/add',
        element:<NewsAdd/>
    },
    {
        path:'news-manage/draft',
        element:<NewsDraft/>
    },
    {
        path:'news-manage/category',
        element:<NewsCategory/>
    },
    {
        path:'news-manage/preview/:id',
        element:<NewsPreview/>
    },
    {
        path:'news-manage/update/:id',
        element:<NewsUpdate/>
    },
    {
        path:'audit-manage/audit',
        element:<Audit/>
    },
    {
        path:'audit-manage/list',
        element:<AuditList/>
    },
    {
        path:'publish-manage/unpublished',
        element:<Unpublished/>
    },
    {
        path:'publish-manage/published',
        element:<Published/>
    },
    {
        path:'publish-manage/sunset',
        element:<Sunset/>
    },

    {
        path:'/',
        element:<Navigate to="/home"/>
    },
    {
        path:'*',
        element:<NoPermisson/>
    },
]
export default routes
 


