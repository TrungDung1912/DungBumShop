import { useDispatch, useSelector } from "react-redux"
import './style.scss'
import { Button, Col, Divider, Empty, InputNumber, Result, Row, Steps } from "antd"
import { AiFillDelete } from 'react-icons/ai'
import { doDeleteItemCartAction, doUpdateCartAction } from "../../redux/order/orderSlice"
import { useEffect, useState } from "react"
import ViewOrder from "../../components/order/ViewOrder"
import { SmileOutlined } from "@ant-design/icons"
import Payment from "../../components/order/Payment"
import { useNavigate } from 'react-router'

const ManagerOrder = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const navigate = useNavigate()

    return (
        <div style={{ width: '100vw', background: 'efefef', padding: '20px 0' }}>
            <div className="order-container" style={{ maxWidth: 1800 }}>
                <div className="order-steps">
                    <Steps
                        style={{ paddingBottom: '30px' }}
                        size="small"
                        current={currentStep}
                        status={'finish'}
                        items={[
                            {
                                title: 'The Order'
                            },
                            {
                                title: 'Payment'
                            },
                            {
                                title: 'Finished'
                            }
                        ]}
                    />
                    {currentStep === 0 &&
                        <ViewOrder setCurrentStep={setCurrentStep} />
                    }
                    {currentStep === 1 &&
                        <Payment setCurrentStep={setCurrentStep} />
                    }
                    {currentStep === 2 &&
                        <Result
                            icon={<SmileOutlined />}
                            title='Successfully!!!'
                            extra={<Button onClick={() => navigate('/history')} type='primary'>Show History</Button>}
                        />
                    }
                </div>
            </div>

        </div>
    )
}

export default ManagerOrder