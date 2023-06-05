import { Button, Modal, Form, Divider, Input, message, notification } from 'antd';
import React, { useState } from 'react';
import { postCreateUser } from '../../../services/apiService';

const UserAddModal = (props) => {
    const { openAddModal, setOpenAddModal } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {
        const { fullName, password, email, phone } = values
        setIsSubmit(true)
        const res = await postCreateUser(fullName, password, email, phone)
        console.log(res)
        if (res && res.data) {
            message.success('Add new user successfully!')
            form.resetFields()
            setOpenAddModal(false)
            await props.fetchUsers()
        } else {
            notification.error({
                message: 'Error',
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    return (
        <>
            <Modal
                title="Add new user"
                open={openAddModal}
                onOk={() => { form.submit() }}
                onCancel={() => setOpenAddModal(false)}
                okText={"Create"}
                cancelText={"Cancel"}
                confirmLoading={isSubmit}
            >
                <Form
                    name="basic"
                    style={{ maxWidth: 600, margin: "0 auto" }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Divider></Divider>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="FullName"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "50px" }}
                        labelCol={{ span: 24 }}
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input type='password' />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: "50px" }}
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: "50px" }}
                        labelCol={{ span: 24 }}
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UserAddModal