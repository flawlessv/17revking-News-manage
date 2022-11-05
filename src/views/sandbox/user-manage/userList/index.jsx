import { Button, Form, Input, Popconfirm, Table, Switch, Space, Modal, Select, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'
import './index.css'
const { Option } = Select;
const Userlist = () => {
  const [dataSource, setDataSource] = useState([]);
  const [regions, setRegions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleSelect, setRoleSelect] = useState(null);
  const [editRoleSelect, setEditRoleSelect] = useState(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [form] = Form.useForm();
  const [upForm] = Form.useForm();
  const { username, region, roleId } = JSON.parse(localStorage.getItem('token'))[0]
  useEffect(() => {
    axios.get('/users?_expand=role').then(res => {
      const list = res.data
      // 超级管理员可以看到所有用户，区域管理员只能看到自己和同区域的区域编辑 
      setDataSource(roleId == 1 ? list : [
        ...list.filter(item => item.username == username),
        ...list.filter(item => item.region == region && item.roleId == 3)
      ])
    })
  }, [])
  useEffect(() => {
    axios.get('/regions').then(res => {
      setRegions(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/roles').then(res => {
      setRoles(res.data)
    })
  }, [])
  const handleDelete = (value) => {
    const newData = dataSource.filter(item => item.id !== value.id);
    setDataSource(newData);
    axios.delete(`/users/${value.id}`)
  };
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
    axios.post('/users', {
      ...values,
      "roleState": true,
      "default": false
    }).then(res => {
      console.log(roles);
      setDataSource([...dataSource, {
        ...res.data,
        role: roles.find(item => item.id === values.roleId * 1)
      }])
    })
  };
  const onUpCreate = (values) => {
    console.log(values);
    setEditOpen(false);
    axios.patch(`/users/${editId}`, {
      ...values,
    }).then(res => {
      setDataSource(dataSource.map(item => {
        if (item.id === editId) {
          return {
            ...item,
            ...values,
            role: roles.filter(data => data.id * 1 === values.roleId * 1)[0]
          }
        } else {
          return item
        }
      }))
    })
  };
  const onCancel = (values) => {
    setOpen(false);
  };
  const upOnCancel = (values) => {
    setEditOpen(false);
  };
  const confirm = (record) => {
    message.success('删除成功！');
    handleDelete(record)
  };

  const cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  };

  const changeUserState = (State, item) => {
    axios.patch(`/users/${item.id}`, {
      roleState: !State
    })
    item.roleState = !State
    setDataSource([...dataSource])
  }
  const RisDIsable = (item) => {
    if (roleId == 1) {
      return false
    } else {
      return item.value !== region
    }
  }
  const RoisDIsable = (item) => {

    if (roleId == 1) {
      return false
    } else {
      return item.id !== 3
    }
  }
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      width: '30%',
      editable: true,
      render: (region) => <b>{region === '' ? '全球' : region}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => role?.roleName
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, record) => <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={roleState} disabled={record.default} onChange={() => changeUserState(roleState, record)} />
    },

    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) =>
        <Space>
          <Button shape="circle" type="primary" icon={<FormOutlined />} disabled={record.default} onClick={() => {
            setEditOpen(true)
            upForm.setFieldsValue({ ...record, roleId: record.roleId * 1 === 1 ? '超级管理员' : record.roleId * 1 === 2 ? '区域管理员' : '区域编辑' })
            setEditId(record.id)
          }}></Button>
          <Popconfirm
            title="Are you sure to delete this role?"
            onConfirm={() => confirm(record)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button shape="circle" type="danger" icon={<DeleteOutlined />} disabled={record.default} ></Button>
          </Popconfirm>
        </Space>
    },
  ];

  return (
    <div>
      {/* newAddModal */}
      <Modal
        open={open}
        title="新增用户"
        okText="确定鸭"
        cancelText="取消啦"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        {/* newAddForm */}
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
        >
          <Form.Item
            name="username"
            label="姓名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}

          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="region"
            label="区域"
            rules={roleSelect ? [] : [
              {
                required: true,
                message: '请输入区域!',
              },
            ]}
          >
            <Select
              style={{
                width: 472,
              }}
              disabled={roleSelect}

            >
              {
                regions.map(item => {
                  return <Option value={item.value} key={item.id} disabled={RisDIsable(item)}>{item.title}</Option>
                })
              }

            </Select>
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[
              {
                required: true,
                message: '请输入角色!',
              },
            ]}
          >
            <Select
              style={{
                width: 472,
              }}
              onSelect={(value) => {
                if (value * 1 === 1) {
                  setRoleSelect(true)
                  form.setFieldsValue({ region: '' })
                } else {
                  setRoleSelect(false)
                }

              }}

            >
              {
                roles.map(item => {
                  return <Option value={item.roleId} key={item.id} disabled={RoisDIsable(item)}>{item.roleName}</Option>
                })
              }

            </Select>
          </Form.Item>

        </Form>
      </Modal>
      {/* upUsersModal */}
      <Modal
        open={editOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={upOnCancel}
        onOk={() => {
          upForm
            .validateFields()
            .then((values) => {
              upForm.resetFields();
              onUpCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={upForm}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
        >
          <Form.Item
            name="username"
            label="姓名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}

          >
            <Input />
          </Form.Item>
          <Form.Item
            name="passsword"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="region"
            label="区域"
            rules={roleSelect ? [] : [
              {
                required: true,
                message: '请输入区域!',
              },
            ]}
          >
            <Select
              style={{
                width: 472,
              }}
              disabled={editRoleSelect}

              onChange={(value, option) => {
                console.log(value, option);
              }}

            >
              {
                regions.map(item => {
                  return <Option value={item.value} key={item.id} disabled={RisDIsable(item)}>{item.title}</Option>
                })
              }

            </Select>
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[
              {
                required: true,
                message: '请输入角色!',
              },
            ]}
          >
            <Select
              style={{
                width: 472,
              }}
              onSelect={(value) => {
                if (value * 1 === 1) {
                  setEditRoleSelect(true)
                  upForm.setFieldsValue({ region: '' })
                } else {
                  setEditRoleSelect(false)
                }

              }}

            >
              {
                roles.map(item => {
                  return <Option value={item.roleId} key={item.id} disabled={RisDIsable(item)}>{item.roleName}</Option>
                })
              }

            </Select>
          </Form.Item>

        </Form>
      </Modal>

      <Button
        onClick={() => {
          setOpen(true);
        }}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        新增用户
      </Button>
      <Table

        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey={item => item.id}
      />
    </div>
  );
};

export default Userlist;
