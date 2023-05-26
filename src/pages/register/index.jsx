import { Button, Checkbox, Divider, Form, Input, message, notification } from 'antd';
import './style.scss'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postRegister } from '../../services/apiService';

const RegisterPage = () => {
    const navigate = useNavigate()
    const [isSubmit, setIsSubmit] = useState(false)

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values
        setIsSubmit(true)
        const res = await postRegister(fullName, email, password, phone)
        setIsSubmit(false)
        if (res?.data?._id) {
            message.success('Register Successful!')
            navigate('/login')
        } else {
            notification.error({
                message: 'Register Failure',
                description: res.message && Array.isArray(res.message) ? res.message : res.message,
                duration: 5
            })
        }
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
                autoComplete="off"
            >
                <h1 style={{ margin: "40px auto", width: "100px" }}>Register</h1>
                <Divider></Divider>
                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Fullname"
                    name="fullName"
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
                    <Input type='password' />
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
                    <Button htmlType="submit" loading={isSubmit}>
                        Register
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className='text text-normal'>Do you have an account?
                    <span>
                        <Link to='/login'>Login</Link>
                    </span>
                </p>
            </Form>
        </div>
    )
}

export default RegisterPage