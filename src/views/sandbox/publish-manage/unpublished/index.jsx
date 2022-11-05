import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../../components/sandbox/newsPublish'
import UsePublish from '../../../../components/usePublish'
export default function Sunset() {
  const { dataSource ,handlePublish} = UsePublish(1)
  return (
    <NewsPublish dataSource={dataSource} button={(id)=><Button type="primary" onClick={()=>handlePublish(id)}>发布</Button>}/>
    )
  }