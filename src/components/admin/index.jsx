import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { postLogout } from '../../services/apiService';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { AiFillInfoCircle, AiFillHeart } from 'react-icons/ai'

const { Content, Footer, Sider } = Layout;

const items = [
    {
        label: <Link to='/admin'>Dashboard</Link>,
        key: 'dashboard',
        icon: <AppstoreOutlined />
    },
    {
        label: <span>Manage Users</span>,
        // key: 'user',
        icon: <UserOutlined />,
        children: [
            {
                label: <Link to='/admin/user'>CRUD</Link>,
                key: 'crud',
                icon: <TeamOutlined />,
            },
            {
                label: 'Files1',
                key: 'file1',
                icon: <TeamOutlined />,
            }
        ]
    },
    {
        label: <Link to='/admin/book'>Manage Books</Link>,
        key: 'book',
        icon: <ExceptionOutlined />
    },
    {
        label: <Link to='/admin/order'>Manage Orders</Link>,
        key: 'order',
        icon: <DollarCircleOutlined />
    },

];

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const user = useSelector(state => state.account.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await postLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Logout Successful!');
            navigate('/login')
        }
    }

    useEffect(() => {
        if (window.location.pathname.includes('/book')) {
            setActiveMenu('book')
        }
        if (window.location.pathname.includes('/')) {
            setActiveMenu('dashboard')
        }
        if (window.location.pathname.includes('/order')) {
            setActiveMenu('order')
        }
        if (window.location.pathname.includes('/user/crud')) {
            setActiveMenu('crud')
        }
    }, [])

    const itemsDropdown = [
        {
            label: <Link to='/' style={{ cursor: 'pointer' }}>Homepage</Link>,
            key: 'homepage',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Logout</label>,
            key: 'logout',
        },

    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

    return (
        <Layout
            style={{ minHeight: '100vh' }}
            className="layout-admin"
        >
            <Sider
                theme='light'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                    Admin
                </div>
                <Menu
                    selectedKeys={[activeMenu]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setActiveMenu(e.key)}
                />
            </Sider>
            <Layout>
                <div className='admin-header'>
                    <span>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </span>
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space style={{ color: "black" }}>
                                <Avatar src={urlAvatar} /> {user?.fullName}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
                <Content>
                    <Outlet />
                </Content>
                <Footer style={{ width: "87vw", textAlign: "center" }}>
                    <span style={{ fontSize: "15px" }}>DungBumShop  <AiFillInfoCircle color='brown' />  Trung Dung - Made with <AiFillHeart color='red' /></span>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;