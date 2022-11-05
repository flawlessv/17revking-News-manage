
import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../../components/sandbox/newsPublish'
import UsePublish from '../../../../components/usePublish'
export default function Published() {
  const { dataSource ,handleSunset} = UsePublish(2)
  return (
    <NewsPublish dataSource={dataSource} button={(id)=><Button type="primary" onClick={()=>handleSunset(id)}>下线</Button>}/>
  )
}
