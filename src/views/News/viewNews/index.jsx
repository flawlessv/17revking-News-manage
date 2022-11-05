import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Col, Row, List } from 'antd';
import axios from 'axios';
import _ from 'lodash'
export default function ViewNews() {
    const [list, setList] = useState([])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            console.log(Object.entries(_.groupBy(res.data, item => item.category.title)));
            setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })
    }, [])
    return (
        <div style={{
            width: '95%',
            margin: "0 auto"
        }}>
            <PageHeader
                className="site-page-header"
                title="17revking News-manage"
                subTitle={'^^'}
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {list.map(item =>
                        <Col span={8} key={item[0]}>
                            <Card title={item[0]} bordered={true} size="small">
                                <List
                                    size="small"
                                    pagination={{ pageSize: 3 }}
                                    dataSource={item[1]}
                                    renderItem={(data) => <List.Item> <a href={`#/details/${data.id}`}>{data.title}</a> </List.Item>}
                                />
                            </Card>
                        </Col>
                    )}
                </Row>

            </div>
        </div>
    )
}
