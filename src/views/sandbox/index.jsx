import React from 'react'
import './index.css'
import { useRoutes } from 'react-router'
import SlideMenu from '../../components/sandbox/slideMenu'
import TopHeader from '../../components/sandbox/topHeader'
import { Outlet } from 'react-router'
import routes from '../../router/indexHome'
// antd
import { Layout, Spin } from 'antd'
import { connect } from 'react-redux'
const { Content } = Layout;
function SandBox(props) {
  const element = useRoutes(routes)
  return (
    <Layout>
      <SlideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: '14px 12px',
            padding: '14px 14px 0',
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Spin size="large" spinning={props.SpinReducer}>
            {element}
          </Spin>
          <Outlet />
        </Content>
      </Layout>

    </Layout>
  )
}
const mapStateToProps = (state) => {
  return state
}
export default connect(mapStateToProps)(SandBox)