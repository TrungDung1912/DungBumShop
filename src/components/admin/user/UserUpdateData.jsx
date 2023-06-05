import { Button, Modal, Form, Divider, Input, message, notification, Descriptions } from 'antd';
import React, { useEffect, useState } from 'react';
import { updateUpdateUser } from '../../../services/apiService';

const UserUpdate = (props) => {
    const { openUpdateModal, setOpenUpdateModal, dataUpdateModal, setDataUpdateModal } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {
        const { _id, fullName, phone } = values
        setIsSubmit(true)
        const res = await updateUpdateUser(_id, fullName, phone)
        if (res && res.data) {
            message.success('Update user successfully!!!')
            setOpenUpdateModal(false)
            await props.fetchUsers()
        } else {
            notification.error({
                message: 'Error updating user',
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    useEffect(() => {
        form.setFieldsValue(dataUpdateModal)
    }, [dataUpdateModal])
    return (
        <>
            <Modal
                title="Update user"
                open={openUpdateModal}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenUpdateModal(false)
                    setDataUpdateModal(null)
                }}
                okText={"Update"}
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
                        hidden
                        labelCol={{ span: 24 }}
                        label="Id"
                        name="_id"
                        rules={[{ required: true, message: 'Please input your id!' }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="FullName"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your fullname!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: "50px" }}
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: "50px" }}
                        labelCol={{ span: 24 }}
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UserUpdate