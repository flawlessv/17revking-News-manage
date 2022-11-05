import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, Modal, Popover, Switch } from 'antd'
import {
  DeleteOutlined, EditOutlined, ExclamationCircleOutlined,
  CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal
export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      const dataLists = res.data
      dataLists.forEach(element => {
        if (element.children.length === 0) {
          element.children = ''
        }
      });
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
      title: '权限名称',
      dataIndex: 'title',
      key: 'age',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'address',
      render: (key) => <Tag color='magenta'>{key}</Tag>
    },
    {
      title: '操作',
      render: (item) =>
        <Space>
          <Popover
            content={
              <div style={{ textAlign: 'center' }}>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked={item.pagepermisson === 1}
                  onChange={() => changeSwitch(item)}
                />
              </div>
            }
            title="配置权限"
            trigger={item.pagepermisson === undefined ? '' : 'click'}
            style={{ width: '20px' }}

          >
            <Button shape="circle" type="primary" icon={< EditOutlined />} disabled={item.pagepermisson === undefined}></Button>

          </Popover>
          <Button shape="circle" type="danger" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(item)}></Button>
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
        if (item.grade === 1) {
          setDataSource(dataSource.filter(data => data.id !== item.id))
          axios.delete(`/rights/${item.id}`)
        } else {
          const list = dataSource.filter(data => data.id === item.rightId)
          list[0].children = list[0].children.filter(child => child.id !== item.id)
          setDataSource([...dataSource])
          axios.delete(`/children/${item.id}`)
        }
      },

      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const changeSwitch = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
