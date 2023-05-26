import { Button, Checkbox, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss'
import { postLogin } from '../../services/apiService';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onFinish = async (values) => {
        const { email, password } = values
        setIsSubmit(true)
        const res = await postLogin(email, password)
        setIsSubmit(false)
        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token)
            dispatch(doLoginAction(res.data.user))
            message.success('Login successful!')
            navigate('/')
        } else {
            notification.error({
                message: 'Login failed',
                description: res.message && Array.isArray(res.message) ? res.message : res.message,
                duration: 5
            })
        }
    }

    return (
        <div className='login-container'>
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
                <h1 style={{ margin: "40px auto", width: "100px" }}>Login</h1>
                <Divider></Divider>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="email"
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


                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button htmlType="submit" loading={isSubmit}>
                        Login
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className='text text-normal'>You don't have an account?
                    <span>
                        <Link to='/register'> Register</Link>
                    </span>
                </p>
            </Form>
        </div>
    )
}

export default LoginPage