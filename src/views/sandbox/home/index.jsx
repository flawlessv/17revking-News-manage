import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Typography, Drawer } from 'antd';
import axios from 'axios';
import _ from 'lodash'
import * as echarts from 'echarts';
import './card.css'
export default function Home() {
    const { username, role: { roleName }, region } = JSON.parse(localStorage.getItem('token'))[0]
    const [viewList, setViewList] = useState([])
    const [starList, setstarList] = useState([])
    const [allList, setAllList] = useState([])
    const [open, setOpen] = useState(false);
    const eRef = useRef()
    const pieRef = useRef()
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
            setViewList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
            setstarList(res.data)
        })
    }, [])
    useEffect(() => {
        // 基于准备好的dom，初始化echarts实例
        axios.get('/news?publishState=2&_expand=category').then(res => {
            const echartsData = _.groupBy(res.data, item => item.category.title)
            setEchartsData(echartsData)
            setAllList(res.data)
        })
        return () => {
            window.onresize = null
        }
    }, [])
    const onClose = () => {
        setOpen(false);
    };
    // 767
    const setEchartsData = (echartsData) => {
        var myChart = echarts.init(eRef.current);
        // 绘制图表
        myChart.setOption({
            title: {
                text: '新闻分类排行'
            },
            tooltip: {},
            xAxis: {
                data: Object.keys(echartsData)
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '发布量',
                    type: 'bar',
                    data: Object.values(echartsData).map(item => item.length)
                }
            ]
        });
        window.onresize = () => {
            myChart.resize()
        }
    }
    const setPieEcharts = () => {
        const data = _.groupBy(allList.filter(item => item.author === username), item => item.category.title)
        let arrPie = []
        for (const key in data) {
            arrPie.push({
                name: key,
                value: data[key].length
            })
        }
        var myChart = echarts.init(pieRef.current);
        var option;
        option = {
            title: {
                text: '当前用户文章统计',
                subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: arrPie,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }
    return (
        <div className="site-card-wrapper">
            <Row gutter={16} >
                <Col span={8}>
                    <Card title="最多浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Typography.Text mark>⭐ .</Typography.Text> <a href={`/#/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="最多点赞" bordered={true} >

                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Typography.Text mark> ♥ .</Typography.Text> <a href={`/#/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <div className="card">
                        <div className="imgBx">
                            <img src="img.png" />
                        </div>
                        <div className="content">
                            <div className="details">
                                <h2>{username}<br /><span>{region === '' ? '全球' : region}/{roleName}</span></h2>
                                <div className="data">
                                    <h3>342<br /><span>Posts</span></h3>
                                    <h3>120k<br /><span>Followers</span></h3>
                                    <h3>285<br /><span>Following</span></h3>
                                </div>
                                <div className="actionBtn">
                                    <button onClick={() => {
                                        setOpen(true)
                                        setTimeout(() => {
                                            setPieEcharts()
                                        }, 0);
                                    }} >发布详情</button>
                                    <button>Message</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Drawer title="Basic Drawer" placement="right" onClose={onClose} width={'500px'} open={open}>
                <div ref={pieRef} style={{
                    height: '400px',
                    marginTop: '30px'
                }}></div>
            </Drawer>

            <div ref={eRef} style={{
                height: '300px',
                marginTop: '30px'
            }}></div>
        </div>
    )
}
