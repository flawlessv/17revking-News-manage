import React, { useEffect, useState } from 'react';
import './index.css'
import {
  HomeOutlined, UserOutlined, UsergroupAddOutlined, HeatMapOutlined,
  TeamOutlined, UsergroupDeleteOutlined, WalletOutlined, FileAddOutlined,
  UpSquareOutlined, AndroidOutlined, SkypeOutlined, SlackSquareOutlined,
  SketchOutlined, AlibabaOutlined, RedditOutlined, BgColorsOutlined
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
const { Sider } = Layout;
const { Title } = Typography;

function SlideMenu(props) {
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  //检查item是否应该渲染在侧边栏
  const checkItems = (item) => {
    return item.pagepermisson === 1 && rights.includes(item.key)
  }

  // item所对应的各个icon
  const itemIcons = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/user-manage/list": <UsergroupAddOutlined />,
    "/right-manage": <HeatMapOutlined />,
    "/right-manage/role/list": <TeamOutlined />,
    "/right-manage/right/list": <UsergroupDeleteOutlined />,
    "/news-manage": <WalletOutlined />,
    "/news-manage/add": <FileAddOutlined />,
    "/news-manage/draft": <UpSquareOutlined />,
    "/news-manage/category": <UpSquareOutlined />,
    "/audit-manage": <AndroidOutlined />,
    "/audit-manage/audit": <SkypeOutlined />,
    "/audit-manage/list": <BgColorsOutlined />,
    "/publish-manage": <SlackSquareOutlined />,
    "/publish-manage/unpublished": <SketchOutlined />,
    "/publish-manage/published": <AlibabaOutlined />,
    "/publish-manage/sunset": <RedditOutlined />,
  }

  // 对侧边栏的item json数据做处理
  const doItems = (item) => {
    if (item.children && item.children.length !== 0) {
      let tempArr = []
      for (let i = 0; i < item.children.length; i++) {
        if (checkItems(item.children[i]))
          tempArr.push(getItem(item.children[i].title, item.children[i].key, itemIcons[item.children[i].key]))
      }
      return checkItems(item) && getItem(item.title, item.key, itemIcons[item.key], tempArr)
    }
    return checkItems(item) && getItem(item.title, item.key, itemIcons[item.key])
  }

  const [menu, setMenu] = useState([])
  const location = useLocation()
  // 获取侧边栏数据（动态展示不同用户侧边栏）
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setMenu(res.data.map(item => doItems(item)))
    })
  }, [])
  const navigate = useNavigate()
  const changeRouter = (item) => {
    navigate(item.key)
  }
  return (
    <Sider trigger={null} collapsible collapsed={props.collapsedReducer} theme="light">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="logo" >
        <Title level={5} style={{margin:'20px',color:'#FF5F95',fontFamily:'YouYuan'}}>凡思美育后台管理</Title></div>
        <div style={{ flex: 1, overflow: 'auto' }} >
          <Menu
            theme='light'
            onClick={changeRouter}
            style={{
              width: '100%',
            }}
            selectedKeys={location.pathname}
            defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
            mode="inline"
            items={menu}
          />
        </div>
      </div>
    </Sider>
  )
}
const mapStateToProps = (state) => {
  return state
}
export default connect(mapStateToProps)(SlideMenu)