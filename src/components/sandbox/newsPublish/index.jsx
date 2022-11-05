import React from 'react'
import { Table, Tag } from 'antd'
export default function NewsPublish(props) {
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            key: 'name',
            render: (title,item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            key: 'category',
            render: (key) => <Tag color='blue'>{key.title}</Tag>
        },
        {
            title: '操作',
            render: (item) =>
                props.button(item.id)
               
        },
    ];
    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
