import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, notification } from 'antd'
import {
  DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UpCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router';
const { confirm } = Modal
export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))[0]
  const navigate = useNavigate()
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      const dataLists = res.data
      setDataSource(dataLists)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'name',
      render: (id) => <b>{id}</b>
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: ((title, item) => <a href={`/#/news-manage/preview/${item.id}`}>{title}</a>)
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: item => item.value
    },
    {
      title: '操作',
      render: (item) =>
        <Space>
          <Button shape="circle" type="primary" icon={< EditOutlined />} onClick={() => navigate(`/news-manage/update/${item.id}`)}></Button>
          <Button shape="circle" type="danger" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(item)}></Button>
          <Button shape="circle" type="default" icon={<UpCircleOutlined />} onClick={() => handleUpdate(item)}></Button>
        </Space>
    },
  ];
  const showDeleteConfirm = (item) => {
    confirm({
      title: 'Are you sure delete this right?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const openNotification = () => {
    const args = {
      message: '秋一提示',
      description: '更新成功!即将跳转到审核列表页面',
      duration: 2,
    };
    notification.open(args);
    setTimeout(() => {
      navigate('/audit-manage/list')
    }, 1500);
  };
  const handleUpdate = (item) => {
    axios.patch(`/news/${item.id}`, {
      auditState: 1
    }).then(() => openNotification())
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </div>
  )
}
