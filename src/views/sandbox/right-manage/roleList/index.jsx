import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Tree } from 'antd'
import { OrderedListOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import { IndexHome } from '../../../../router/indexHome'
export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [id, setId] = useState(0);
  const { confirm } = Modal
  useEffect(() => {
    axios.get('/roles').then(res => {
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setTreeData(res.data)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: 'Role Name',
      dataIndex: 'roleName',
    },
    {
      title: 'Option',
      render: (item) =>
        <Space>
          <Button shape="circle" type="danger" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(item)}></Button>
          <Button shape="circle" type="primary" icon={<OrderedListOutlined onClick={() => {
            showModal()
            setCheckedKeys(item.rights)
            setId(item.id)
          }} />} ></Button>
        </Space>
    },

  ]
  const showDeleteConfirm = (item) => {
    confirm({
      title: 'Are you sure delete this role?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',

      onOk() {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/roles/${item.id}`)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setDataSource(dataSource.map(item => {
      if (item.id === id) {
        return {
          ...item,
          rights: checkedKeys
        }
      } else {
        return item
      }
    }))
    axios.patch(`/roles/${id}`, {
      rights: checkedKeys
    })

  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };
  return (
    <div>
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          treeData={treeData}
          checkable
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          checkStrictly
        />
      </Modal>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
      {/* <IndexHome /> */}
    </div>
  )
}
