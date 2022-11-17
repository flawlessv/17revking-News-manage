import { useEffect, useState } from 'react'
import axios from 'axios'
import { message } from 'antd'
export default function UsePublish(props) {
    const { username } = JSON.parse(localStorage.getItem('token'))
    const [dataSource, setDataSource] = useState()
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${props}&_expand=category`).then(res => {
            setDataSource(res.data)
        })
    }, [])
    const handlePublish = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            message.success('发布成功')
        })
    }
    const handleDelete = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`/news/${id}`).then(res => {
            message.success('删除成功')
        })
    }
    const handleSunset = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            publishState: 3,
        }).then(res => {
            message.success('下线成功')
        })
    }
    return {
        dataSource,
        handlePublish,
        handleDelete,
        handleSunset
    }
}
