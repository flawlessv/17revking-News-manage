import { Button, Checkbox, Form, Input, message, Typography } from 'antd';
import axios from 'axios';
import React from 'react';
import './index.css'
import { useNavigate } from 'react-router';
import ParticlesBg from 'particles-bg'
const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      if (res.data.length === 0) {
        message.error('登录失败')
      }
      else {
        localStorage.setItem("token", JSON.stringify(res.data))
        setTimeout(() => {
          message.success('登陆成功')
          navigate('/')
        }, 500);
      }

    })
  };
  return (
    <>
      <div className="container">
        <div className='FormContainer'>
          <Title level={3}>17revking新闻系统</Title>
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入您的用户名!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入您的密码!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 6,
                span: 12,
              }}
            >
              <Button type="primary" className={'submitBtn'} htmlType="submit" >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <ParticlesBg type="cirle" bg={true} />
    </>
  );
};

export default Login;