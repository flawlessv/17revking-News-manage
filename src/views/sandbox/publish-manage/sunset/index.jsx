import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../../components/sandbox/newsPublish'
import UsePublish from '../../../../components/usePublish'
export default function Sunset() {
  const { dataSource ,handleDelete} = UsePublish(3)
  return (
    <NewsPublish dataSource={dataSource} button={(id) => <Button type="primary" danger onClick={() => handleDelete(id)}>删除</Button>} />
  )
}