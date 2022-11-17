import { Descriptions, PageHeader, Card, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, createElement } from 'react';
import moment from 'moment';
import { useParams } from 'react-router';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import './index.css'
let starFlag = true;
const Details = () => {
    const [newsInfo, setNewsInfo] = useState(null)
    const [likes, setLikes] = useState(0);
    const [action, setAction] = useState(null);
    const { id } = useParams()
    useEffect(() => {
        axios.get(`/news/${id}?&_expand=category&_expand=role`).then(res => {
            setLikes(res.data.star);
            setNewsInfo({...res.data,view:res.data.view+1})
            return res.data
        }).then(res=>{
            axios.patch(`/news/${id}`,{
                view:res.view+1
            })
        })
      
    }, [])
    const like = () => {
        if (starFlag) {
            setLikes(likes + 1);
            setAction('liked');
            message.success('点赞成功')
            axios.patch(`/news/${id}`, {
                star: likes + 1
            })
            starFlag=false
        }else{
            message.warn('你已经点过赞了')
        }
    };
    return (
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo?.title}
                subTitle={<div><span style={{ paddingRight: '7px' }}>{newsInfo?.category?.title}</span>    <span onClick={() => like(starFlag)} style={{ cursor: 'pointer' }}>
                    {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                    <span className="comment-action" >{likes}</span>
                </span></div>}
            >
                {newsInfo && <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>}
                <Card
                    title="新闻内容"
                    style={{
                        width: '100%',
                        marginTop: '20px'
                    }}
                >
                    <p dangerouslySetInnerHTML={{ __html: newsInfo?.content }}></p>
                </Card>
            </PageHeader>
        </div>
    )
};
export default Details;