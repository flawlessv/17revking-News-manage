import React, { useEffect, useState } from 'react';
import { PageHeader, Steps, Button, message, Form, Select, Input, notification } from 'antd';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './index.css'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
const { Step } = Steps;
const { Option } = Select;
export default function NewsAdd() {
    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [editorState, setEditorState] = useState();
    const [formInfo, setFormInfo] = useState({});
    const [content, setContent] = useState({});
    const User = JSON.parse(localStorage.getItem('token'))[0]
    const { id } = useParams()
    const navigate = useNavigate()
    const formRef = React.createRef();
    //   获取新闻分类
    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoryList(res.data)
        })
        console.log(User);
    }, [])
    //设置之前的新闻内容
    useEffect(() => {
        axios.get(`/news/${id}?&_expand=category&_expand=role`).then(res => {
            console.log(res.data);
            const { title, categoryId, content } = res.data
            setContent(content)
            formRef?.current?.setFieldsValue({
                title,
                categoryId
            })
            const html = content;
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const editorState = EditorState.createWithContent(contentState);
             setEditorState(editorState)}
        })
    }, [])
    // 表单布局
    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    const next = () => {
        if (current === 0) {
            formRef.current.validateFields().then(res => {
                setFormInfo(formRef.current.getFieldValue())
                setCurrent(current + 1);
            })
        } else if (content === "" || content.trim() === "<p></p>") {
            message.error('新闻内容不可以为空')
        } else {
            setCurrent(current + 1);
        }
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const openNotification = (auditState) => {
        const args = {
            message: '秋一提示',
            description: `${auditState === 0 ? '保存' : '提交'}成功!即将跳转到${auditState === 0 ? '草稿箱' : '审核列表'}页面`,
            duration: 2,
        };
        notification.open(args);
        setTimeout(() => {
            auditState === 0 ? navigate('/news-manage/draft') : navigate('/audit-manage/list')
        }, 1500);
    };
    const handleSave = (auditState) => {
        console.log(formInfo, content);
        axios.patch(`/news/${id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
        }).then(() => {
            openNotification(auditState)
        })
    }
    // 步骤条配置
    const steps = [
        {
            title: '基本信息',
            description: '新闻标题，新闻分类',
            content:
                <Form {...layout} ref={formRef} name="control-ref" onFinish={next} style={{ marginRight: '80px' }}>
                    <Form.Item
                        name="title"
                        label="新闻标题"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="categoryId"
                        label="新闻分类"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            placeholder="选择新闻分类"
                            allowClear
                        >

                            {
                                categoryList.map(item => <Option values={item.id} key={item.id}>{item.title}</Option>)
                            }
                        </Select>
                    </Form.Item>
                </Form>
            ,
        },
        {
            title: '新闻内容',
            description: '新闻主题内容',
            content: <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => { setEditorState(editorState) }}
                onBlur={() => {
                    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                    setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />,
        },
        {
            title: '新闻提交',
            description: '保存草稿或提交审核',
            content: 'last-content',

        },
    ];
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() => navigate(-1)}
            />
            <Steps current={current}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} description={item.description} />
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <span>
                        <Button type="danger" onClick={() => handleSave(1)}>
                            提交审核
                        </Button>
                        <Button type="primary" style={{
                            margin: '0 0px 0 8px',
                        }} onClick={() => handleSave(0)}>
                            保存草稿
                        </Button>
                    </span>
                )}
                {current > 0 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        上一步
                    </Button>
                )}
            </div>

        </div>
    )
}
