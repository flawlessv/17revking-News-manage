import { Avatar, Button, List, message, Skeleton, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.css'
import axios from 'axios';
import { useNavigate } from 'react-router';
const count = 3;
let page = 2;
const App = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const colorList = ["orange", "volcano", "lime", "magenta"]
  const { username } = JSON.parse(localStorage.getItem('token'))[0]
  const navigate=useNavigate()
  // 请求审核列表数据
  useEffect(() => {
    axios.get(`/news?_limit=4&author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setInitLoading(false);
      setData(res.data)
      setList(res.data)
    })
  }, [])
  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          author: {},
          picture: {},
        })),
      ),
    );
    axios.get(`/news?_page=${page}&_limit=4&author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
      const newData = data.concat(res.data);
      setData(newData);
      setList(newData);
      console.log(newData);
      setLoading(false);
      // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
      // In real scene, you can using public method of react-virtualized:
      // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
      window.dispatchEvent(new Event('resize'));
    });
    page++
  };
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;
  const handleRevert = (item) => {
    console.log(list);
    setList(list.filter(data => data.id !== item.id))
    console.log(item.id);
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res=>{
      message.success('撤销成功，您可以到草稿箱中查看！')
    })
  }
  const handleChange = (item) => {
    navigate(`/news-manage/update/${item.id}`)
  }
  const handlePublish=(item)=>{
    setList(list.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime:Date.now()
    }).then(res=>{
      message.success('发布成功，您可以到已发布中查看！')
    })
  }
  const getBtn = (count, item) => {
    return count === 1 ? <Button type='primary' danger style={{ marginRight: '40px' }} onClick={() => handleRevert(item)}>撤销</Button> : count === 2 ? <Button type='primary' style={{ marginRight: '40px' }} onClick={()=>handlePublish(item)}>发布</Button> : <Button type='default' style={{ marginRight: '40px' }} onClick={()=>handleChange(item)}>修改</Button>
  }
  return (
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={list}
      header={'新闻列表'}
      renderItem={(item) => (
        <List.Item
          actions={[getBtn(item.auditState, item)]}

        >
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              avatar={<Avatar src={'http://api.btstu.cn/sjtx/api.php?lx=c1&format=images'} />}
              title={<a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>}
              description={<div dangerouslySetInnerHTML={{ __html: item.content }}></div>}
            />
            <div style={{ margin: '0 20px' }}>{item.category?.title}</div>
            <div>{<Tag color={colorList[item.auditState]}>{auditList[item.auditState]}</Tag>}</div>
          </Skeleton>
        </List.Item>
      )}
    />
  );
};
export default App;

