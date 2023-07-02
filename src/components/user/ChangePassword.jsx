import { Col, Form, Input, Row } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

const ChangePassword = (props) => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false)
    const user = useSelector(state => state.account.user);

    const onFinish = () => {

    }

    return (
        <div>
            <Row gutter={'20, 20'}>
                <Col md={24} sm={24}>
                    <Form
                        onFinish={onFinish}
                        form={form}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Email"
                            name='email'
                        >
                            <Input disabled defaultValue={user.email} />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Password"
                            name='oldpass'
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="New Password"
                            name='newpass'
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <Input.Password />
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

export default ChangePassword