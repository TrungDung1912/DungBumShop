import { Row, Col, Form, Input, Avatar, Upload, Button, message, notification } from "antd"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { AntDesignOutlined, UploadOutlined } from '@ant-design/icons'
import { MdDragHandle } from "react-icons/md";
import { postUploadAvatar, putUpdateUserInfo } from "../../services/apiService";
import { doUploadAvatarAction } from "../../redux/account/accountSlice";

const UserInfo = (props) => {
    const [form] = Form.useForm();
    const user = useSelector(state => state.account.user);
    const [isSubmit, setIsSubmit] = useState(false)
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "")
    const tempAvatar = ""
    const dispatch = useDispatch()

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`

    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        const res = await postUploadAvatar(file)
        console.log(res)
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded
            dispatch(doUploadAvatarAction({ avatar: newAvatar }))
            setUserAvatar(newAvatar)
            onSuccess('Success')
        } else {
            onError('Error')
        }

    }

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadAvatar,
        onChange(info) {
            if (info.file.status !== 'uploading') {

            }
            if (info.file.status === 'done') {
                message.success('Upload file Success')
            }
            else if (info.file.status === 'error') {
                message.error('Upload file Error')
            }
        }
    }

    const onFinish = async (values) => {
        const { fullName, phone, _id } = values
        setIsSubmit(true)
        const res = await putUpdateUserInfo(_id, phone, fullName, userAvatar)
        if (res && res.data) {
            dispatch(doUpdateUserInfoAction({ avatar: userAvatar, phone, fullName }))
            message.success('Update User Success')
            localStorage.removeItem('access_token')
        } else {
            notification.error({
                description: res.message,
                message: 'Error'
            })
        }
        setIsSubmit(false)
    }

    return (
        <div>
            <Row gutter={'20, 20'}>
                <Col md={12} sm={24}>
                    <Avatar
                        style={{ width: ' 200px', height: '200px' }}
                        size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                        src={urlAvatar}
                        shape="circle"
                    />
                    <Upload
                        {...propsUpload}
                    >
                        <Button
                            style={{ marginTop: '30px' }}
                        >Click to Upload
                        </Button>
                    </Upload>
                </Col>
                <Col md={12} sm={24}>
                    <Form
                        onFinish={onFinish}
                        form={form}>
                        <input hidden value={user.id} />
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Email"
                            name='email'
                        >
                            <Input disabled defaultValue={user.email} />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Username"
                            name='fullName'
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <Input defaultValue={user.fullName} />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Phone"
                            name='phone'
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <Input defaultValue={user.phone} />
                        </Form.Item>
                    </Form>
                    <div style={{ padding: '10px' }}>
                        <button
                            onClick={() => { form.submit() }}
                            style={{
                                cursor: 'pointer',
                                padding: '7px 10px',
                                borderRadius: '0.5em',
                                border: '1px solid grey',
                                backgroundColor: 'white',
                            }}
                        >
                            Update</button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default UserInfo