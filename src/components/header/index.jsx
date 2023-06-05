import React, { useEffect, useState } from 'react';
import { BsShopWindow } from 'react-icons/bs'
import { MdAddShoppingCart } from 'react-icons/md';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './style.scss';
import { fetchAccount, postLogin, postLogout } from '../../services/apiService';
import { doGetAccountAction, doLogoutAction } from '../../redux/account/accountSlice';
import { Link } from 'react-router-dom';

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleLogout = async () => {
        const res = await postLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            console.log(res.data)
            message.success('Logout Successful!');
            navigate('/')
        }
    }

    const reloadPage = async () => {
        const res = await fetchAccount();
        dispatch(doGetAccountAction(res.data));
    }

    useEffect(() => {
        if (window.location.reload) {
            reloadPage()
        }
    }, [])

    let items = [
        {
            label: <label style={{ cursor: 'pointer' }}>Account Management</label>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Log out</label>,
            key: 'logout',
        }
    ];
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin' style={{ cursor: 'pointer' }}>Administrator Page </Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`
    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <BsShopWindow className='rotate icon-react' /> DungBumShop
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="What things do you want to search?"
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom" style={{ display: "flex", alignItems: "center" }}>
                        <ul id="navigation" className="navigation" style={{ display: "contents" }}>
                            <li className="navigation__item">
                                <Badge
                                    count={5}
                                    size={"small"}
                                >
                                    <MdAddShoppingCart className='icon-cart' />
                                </Badge>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}>Account</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space style={{ color: "black" }}>
                                                <Avatar src={urlAvatar} /> {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Account"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Account Management</p>
                <Divider />

                <p>Log out</p>
                <Divider />
            </Drawer>
        </>
    )
};

export default Header;
