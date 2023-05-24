import { Button, Checkbox, Divider, Form, Input } from 'antd';
import './style.scss'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, isLoading] = useState(false)

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='container'>
            <Form
                className='form-container'
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, margin: "0 auto" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <h1 style={{ margin: "40px auto", width: "100px" }}>Register</h1>
                <Divider></Divider>
                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Fullname"
                    name="fullname"
                    rules={[{ required: true, message: 'Please input your fullname!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your phone!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button htmlType="submit" loading={false}>
                        Register
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className='text text-normal'>Do you have an account?
                    <span>
                        <Link to='/login'> Login</Link>
                    </span>
                </p>
            </Form>
        </div>
    )
}

export default RegisterPage