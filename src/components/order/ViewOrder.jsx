import { useDispatch, useSelector } from "react-redux"
import { Col, Divider, Empty, InputNumber, Row } from "antd"
import { AiFillDelete } from 'react-icons/ai'
import { doDeleteItemCartAction, doUpdateCartAction } from "../../redux/order/orderSlice"
import { useEffect, useState } from "react"
import './style.scss'
import { useNavigate } from "react-router-dom"

const ViewOrder = (props) => {
    const { setCurrentStep } = props
    const carts = useSelector(state => state.order.carts)
    const dispatch = useDispatch()
    const [totalPrice, setTotalPrice] = useState(0)
    const navigate = useNavigate()

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

    return (
        <Row gutter={[20, 20]} style={{ width: '100vw', backgroundColor: "rgb(222, 214, 214)", paddingBottom: '50px' }}>
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
                    <div className="payload-total">
                        <span>Total</span>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${totalPrice}`)}
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
                        <button onClick={() => { setCurrentStep(1) }} style={{ cursor: 'pointer' }}>Buy now({carts?.length})</button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default ViewOrder