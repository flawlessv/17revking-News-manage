import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Typography, Drawer } from 'antd';
import axios from 'axios';
import _ from 'lodash'
import * as echarts from 'echarts';
import './card.css'
import e from './echarts.module.css'
export default function Home() {
    const { username, role: { roleName }, region } = JSON.parse(localStorage.getItem('token'))
    const [viewList, setViewList] = useState([])
    const [starList, setstarList] = useState([])
    const [authors, setAuthors] = useState([])
    const [echartsObj, setEchartsObj] = useState({})
    const [open, setOpen] = useState(false);
    const eRef = useRef()
    const pieRef = useRef()
    const lRef = useRef()
    const myRef = useRef()
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
            setViewList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
            const starArr = []
            const staredArr = []
            res.data.forEach(item => {
                starArr.push(item.title)
                staredArr.push(item.star)
            })
            starEcharts(starArr, staredArr)
        })
    }, [])
    // 设置分类排行
    useEffect(() => {
        // 基于准备好的dom，初始化echarts实例
        axios.get('/news?publishState=2&_expand=category').then(res => {
            const echartsData = _.groupBy(res.data, item => item.category.title)
            setEchartsData(echartsData)
        })
        return () => {
            window.onresize = null
        }
    }, [])
    // 设置新的echarts
    useEffect(() => {
        // 基于准备好的dom，初始化echarts实例
        axios.get('/news?publishState=2&_expand=category').then(res => {
            const echartsData = _.groupBy(res.data, item => item.author)
            const newEchartsObj = {};
            for (const item in echartsData) {
                newEchartsObj[item] = _.groupBy(echartsData[item], data => data.category.title)
            }
            setEchartsObj(newEchartsObj)
            setAuthors(Object.keys(echartsData))
        })
    }, [])
    const cateList = ['家庭教育', '美术绘画', '音乐体育', '考研培训', '书法武术', '瑜伽电竞']
    const handleEchartsArr = () => {
        const newarr = cateList.map((item) => {
            return [item, ...handleObj(item)]
        })
        return newarr
    }
    // 处理抽屉中的echarts数据
    const handleObj = (item) => {
        let arr = []
        for (const key in echartsObj) {
            const element = echartsObj[key];
            if (element.hasOwnProperty(item)) {
                arr.push(element[item].length)
            } else {
                arr.push(0)
            }
        }
        // console.log([11,22,...arr]);
        return arr
    }
    const setEchartsData = (echartsData) => {
        var myChart = echarts.init(eRef.current);
        // 绘制图表
        myChart.setOption({
            title: {
                text: '教育热度排行'
            },
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#FFC0CB' // 0% 处的颜色
                }, {
                    offset: 1, color: '#EE82EE' // 100% 处的颜色
                }],
                global: false // 缺省为 false
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
                    data: Object.values(echartsData).map(item => item.length),
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                },

            ]
        });
        window.onresize = () => {
            myChart.resize()
        }
    }
    const setNewPieEcharts = () => {
        var myChart = echarts.init(pieRef.current);
        var option;
        const sou = [
            ['author', ...authors],
            ...handleEchartsArr().map(item => item)
        ]
        const lines = cateList.map(_ => {
            return {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: { focus: 'series' }
            }
        })
        setTimeout(function () {
            option = {
                legend: {},
                tooltip: {
                    trigger: 'axis',
                    showContent: false
                },
                dataset: {
                    source: sou
                },
                xAxis: { type: 'category' },
                yAxis: { gridIndex: 0 },
                grid: { top: '55%' },
                series: [
                    ...lines,
                    {
                        type: 'pie',
                        id: 'pie',
                        radius: '30%',
                        center: ['50%', '30%'],
                        emphasis: {
                            focus: 'self'
                        },
                        label: {
                            formatter: '{b}: {@2012} ({d}%)'
                        },
                        encode: {
                            itemName: 'author',
                            value: '2012',
                            tooltip: '2012'
                        }
                    }
                ]
            };
            myChart.on('updateAxisPointer', function (event) {
                const xAxisInfo = event.axesInfo[0];
                if (xAxisInfo) {
                    const dimension = xAxisInfo.value + 1;
                    myChart.setOption({
                        series: {
                            id: 'pie',
                            label: {
                                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                            },
                            encode: {
                                value: dimension,
                                tooltip: dimension
                            }
                        }
                    });
                }
            });
            myChart.setOption(option);
        });

        option && myChart.setOption(option);
    }
    const starEcharts = (starArr, staredArr) => {
        var myChart = echarts.init(lRef?.current);
        var option;
        option = {
            xAxis: {
                type: 'category',
                data: starArr,
                // show:false
                boundaryGap: true,
                axisLabel: {
                    margin: 10,
                    rotate: 20,
                }

            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: staredArr,
                    type: 'line',
                    symbol: 'triangle',
                    symbolSize: 20,
                    lineStyle: {
                        color: '#5470C6',
                        width: 4,
                        type: 'dashed'
                    },
                    itemStyle: {
                        borderWidth: 3,
                        borderColor: '#EE6666',
                        color: 'yellow'
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }
    const onClose = () => {
        setOpen(false);
    };
    return (
        <div className="site-card-wrapper">
            <Row gutter={16} >
                <Col span={8}>
                    <Card title="最多浏览😍" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Typography.Text mark>💗 </Typography.Text> <a href={`/#/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="最多点赞⭐" bordered={true} >
                    <div ref={lRef} className={e.lRef}></div>
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
                                            setNewPieEcharts()
                                        }, 0);
                                    }} >发布详情</button>
                                    <button>Message</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Drawer title={"AllUsersの发布详情"} placement="right" onClose={onClose} width={'500px'} open={open}>
                <div ref={pieRef} className={e.pieRef}></div>
            </Drawer>
            <div ref={eRef} className={e.eRef}></div>
        </div>
    )
}
