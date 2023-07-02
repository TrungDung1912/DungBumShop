import React, { useEffect, useState } from 'react';
import { BsShopWindow } from 'react-icons/bs'
import { MdAddShoppingCart } from 'react-icons/md';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Avatar, Popover } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './style.scss';
import { fetchAccount, postLogin, postLogout } from '../../services/apiService';
import { doGetAccountAction, doLogoutAction } from '../../redux/account/accountSlice';
import { Link } from 'react-router-dom';
import AccountManage from '../user/AccountManage';

const Header = (props) => {
    const { searchTerm, setSearchTerm } = props
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const carts = useSelector(state => state.order.carts)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);


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

    const handleHistory = () => {
        navigate('/history')
    }

    let items = [
        {
            label: <label onClick={() => setShow(true)} style={{ cursor: 'pointer' }}>Account Management</label>,
            key: 'account',
        },
        {
            label: <label onClick={() => handleHistory()} style={{ cursor: 'pointer' }}>Order History </label>,
            key: 'history',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Log out</label>,
            key: 'logout',
        },

    ];
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin' style={{ cursor: 'pointer' }}>Administrator Page </Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

    const contentPopover = () => {
        return (
            <div className='popcart-body'>
                <div className='popcart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`bool-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div>{book.detail.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${book?.detail?.price}`)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='pop-cart-footer'>
                    <button onClick={() => navigate('/order')}>Show the cart</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo' onClick={() => { navigate('/') }}>
                                <BsShopWindow className='rotate icon-react' /> DungBumShop
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="input-search" type={'text'}
                                placeholder="What things do you want to search?"
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom" style={{ display: "flex", alignItems: "center" }}>
                        <ul id="navigation" className="navigation" style={{ display: "contents" }}>
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement='topRight'
                                    rootClassName='popover-carts'
                                    title={'Products'}
                                    content={contentPopover}
                                    arrow={true}
                                >
                                    <Badge
                                        count={carts?.length ?? 0}
                                        size={"small"}
                                        showZero
                                    >
                                        <MdAddShoppingCart className='icon-cart' />
                                    </Badge>
                                </Popover>
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
            <AccountManage
                show={show}
                setShow={setShow}
            />
        </>
    )
};

export default Header;
