import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, Modal, message, } from 'antd'
import {
  CloseCircleOutlined, ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal
export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const { roleId, author, region } = JSON.parse(localStorage.getItem('token'))[0]
  useEffect(() => {
    axios.get('/news?auditState=1&_expand=category').then(res => {
      console.log(res.data);
      const list = res.data
      setDataSource(roleId == 1 ? list : [
        ...list.filter(item => item.author == author),
        ...list.filter(item => item.region == region && item.roleId == 3)
      ])
      setDataSource(res.data)
    })
  }, [])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'name',
      render: id => id
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render: (key) => <Tag color='magenta'>{key.value}</Tag>
    },
    {
      title: '操作',
      render: (item) =>
        <Space>
          <Button shape="circle" type="primary" icon={<CheckCircleOutlined />} onClick={() => showRefuseConfirm(item, 2, 1)}></Button>
          <Button shape="circle" type="danger" icon={<CloseCircleOutlined />} onClick={() => showRefuseConfirm(item, 3, 0)}></Button>
        </Space>
    },
  ];
  const showRefuseConfirm = (item, auditState, publishState) => {
    confirm({
      title: publishState ? 'Are you sure refuse this news?' : 'Are you sure argee this news?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',

      onOk() {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
          auditState,
          publishState
        }).then(_ => {
          publishState ? message.success('审核通过成功') : message.success('拒绝通过成功')
        })
      },

      onCancel() {

      },
    });
  };
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}
