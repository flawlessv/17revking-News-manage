import Login from '../views/login'
import Sandbox from '../views/sandbox'
import ViewNews from '../views/News/viewNews'
import Details from '../views/News/Details'
const routes=[
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/news',
        element:<ViewNews/>
    },
    {
        path:'/details/:id',
        element:<Details/>
    },
    {
        path:'*',
        element:localStorage.getItem('token')?<Sandbox/>:<Login/>
    }
     
]
export default routes