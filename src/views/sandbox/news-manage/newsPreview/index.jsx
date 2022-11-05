import { Descriptions, PageHeader, Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router';
import './index.css'
const App = () => {
    const [newsInfo, setNewsInfo] = useState(null)
    const { id } = useParams()
    useEffect(() => {
        axios.get(`/news/${id}?&_expand=category&_expand=role`).then(res => {
            setNewsInfo(res.data)
        })
    }, [])
    const auditList = ['未审核', '审核中', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已上线', '已下线']

    return (
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo?.title}
                subTitle={newsInfo?.category.title}
            >
                {newsInfo && <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态" > <span style={{ color: 'red' }}>{auditList[newsInfo.auditState]}</span> </Descriptions.Item>
                    <Descriptions.Item label="发布状态"> <span style={{ color: 'red' }}>{publishList[newsInfo.publishState]}</span> </Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>}
                <Card
                    title="新闻内容"
                    style={{
                        width: '100%',
                        marginTop:'20px'
                    }}
                >
                    <p dangerouslySetInnerHTML={{__html:newsInfo?.content}}></p>
                </Card>
            </PageHeader>
        </div>
    )
};
export default App;