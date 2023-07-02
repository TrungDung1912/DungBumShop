import { useDispatch, useSelector } from "react-redux"
import { Col, Divider, Empty, Form, Input, InputNumber, Row, message, notification } from "antd"
import { AiFillDelete, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { doDeleteItemCartAction, doPlaceOrderAction, doUpdateCartAction } from "../../redux/order/orderSlice"
import { useEffect, useState } from "react"
import './style.scss'
import { useNavigate } from "react-router-dom"
import { callPlaceOrder } from "../../services/apiService"

const Payment = (props) => {
    const { setCurrentStep } = props
    const carts = useSelector(state => state.order.carts)
    const user = useSelector(state => state.account.user);
    const dispatch = useDispatch()
    const [totalPrice, setTotalPrice] = useState(0)
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false)

    const handleOnChangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: book, _id: book._id }))
        }
    }



    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price
            })
            setTotalPrice(sum)
        } else {
            setTotalPrice(0)
        }
    }, [carts])

    const onFinish = async (values) => {
        setIsSubmit(true)
        const detailOrder = carts.map(item => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id
            }
        })
        const data = {
            name: values.name,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder
        }
        const res = await callPlaceOrder(data)
        if (res && res.data) {
            message.success('Order successfully')
            dispatch(doPlaceOrderAction())
            setCurrentStep(2)
        } else {
            notification.error({
                message: 'Error',
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    return (
        <Row gutter={[20, 20]} style={{ backgroundColor: "rgb(222, 214, 214)", paddingBottom: '20px' }}>
            <Col md={15} sm={24}>
                <div className='order-body'>
                    <div className='order-content'>
                        {carts.length > 0 ?
                            carts?.map((book, index) => {
                                return (
                                    <div className='book' key={`bool-${index}`}>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                        <div style={{ width: '30%' }}>{book.detail.mainText}</div>
                                        <div className='price'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${+book?.detail?.price}`)}
                                        </div>
                                        <div >
                                            <InputNumber onChange={(value) => handleOnChangeInput(value, book)} style={{ width: '100px' }} value={book?.quantity} />
                                        </div>
                                        <div>
                                            Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${book.detail.price * (book.quantity)}`)}
                                        </div>
                                        <span style={{ cursor: 'pointer' }} onClick={() => {
                                            dispatch(doDeleteItemCartAction({
                                                _id: book._id
                                            }))
                                        }} className="buttonx" ><AiFillDelete /></span>
                                    </div>
                                )
                            }) : <Empty description='No Product In the Cart' className="bookz" style={{ paddingTop: '50px' }} />
                        }
                    </div>
                </div>
            </Col>
            <Col md={9} sm={24}>
                <div className="payload-container">
                    <Form
                        onFinish={onFinish}
                        form={form}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Username"
                            name="name"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            style={{}}
                            labelCol={{ span: 24 }}
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item

                            labelCol={{ span: 24 }}
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input your Address!' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                    <div>
                        <span>Payment method</span>
                        <br /><br />
                        <span><input type="radio" checked style={{ color: 'blue' }} /> Pay when received the product</span>
                    </div>
                    <Divider />
                    <div className="payload-bill">
                        <span>Last Bill</span>
                        <span className="title">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${totalPrice}`)}
                        </span>
                    </div>
                    <Divider />
                    <div className="payload-buy">
                        <button
                            disabled={isSubmit}
                            onClick={() => { form.submit() }}
                            style={{ cursor: 'pointer' }}
                        >
                            {isSubmit && <span><AiOutlineLoading3Quarters />&nbsp;</span>}
                            Buy now({carts?.length})</button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default Payment