import { Card, Col, Row, Statistic } from "antd"
import { useState } from "react"
import CountUp from 'react-countup'
import { getDashBoard } from "../../services/apiService"
import { useEffect } from "react"

const AdminPage = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0
    })

    useEffect(() => {
        getDashboard()
    }, [])

    const getDashboard = async () => {
        const res = await getDashBoard()
        if (res && res.data) {
            setDataDashboard(res.data)
        }
    }

    const formatter = (value) => <CountUp end={value} separator="," />;

    return (
        <>
            <Row gutter={16} style={{ margin: '20px' }}>
                <Col span={10}>
                    <Card title="" bordered={false}>
                        <Statistic
                            title="Active Users"
                            value={dataDashboard.countOrder} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title="" bordered={false}>
                        <Statistic
                            title="Total Orders"
                            value={dataDashboard.countUser} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default AdminPage