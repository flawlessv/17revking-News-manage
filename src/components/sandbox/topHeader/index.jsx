import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Dropdown, Menu, Space, Layout, Avatar, message } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
const { Header } = Layout;
function TopHeader(props) {
  const navigate = useNavigate()
  const { username, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  const changeCollapsed = () => {
    props.changeisCollapsed()
  }
  const onClick = ({ key }) => {
    if (key * 1 === 2) {
      setTimeout(() => {
        message.success('退出成功！！')
        navigate('/login')
      }, 500);
    }
  };
  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          label: [roleName],
          key: '1',
        },
        {
          label: '退出',
          key: '2',
          danger: true
        }
      ]}
    />
  );
  return (

    <Header
      className="site-layout-background"
      style={{
        padding: '0 24px',
      }}
    >
      {
        props.collapsedReducer ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: 'right' }}> <span style={{ marginRight: '5px' }}>欢迎 <a>{username}</a> 回来</span>
        <Dropdown overlay={menu} overlayStyle={{ marginTop: '10px' }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar src="https://joeschmoe.io/api/v1/random" />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown></div>

    </Header>
  )
}
const mapStateToProps = (state) => {
  return state
}
const mapDispatchToProps = (dispatch) => {
  return {
    changeisCollapsed: () => {
      dispatch({
        type: 'change_isCollapsed'
      })
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)