import { Table, Tag } from "antd";
import { getOrderHistory } from "../../services/apiService";
import { useEffect, useState } from "react";
import moment from 'moment';


const OrderHistory = () => {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(4)
    const [isLoading, setIsLoading] = useState(false)
    const [listData, setListData] = useState([])

    const onChange = (pagination, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: '_id',
        },
        {
            title: 'Time',
            dataIndex: 'updated_at',
            render: (text, record, index) => {
                return (
                    moment(listData?.data?.updatedAt).format('DD-MM-YYYY HH:mm:ss')
                )
            },
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            render: (text, record, index) => {
                return (
                    listData?.data?.totalPrice
                )
            },
        },
        {
            title: 'Status',
            dataIndex: 'statusCode',
            render: (text, record, index) => {
                if (listData?.statusCode === 200) {
                    return (
                        <Tag color="green">Success</Tag>
                    )
                } else {
                    return (
                        <Tag color="red">Fail</Tag>
                    )
                }
            },
        },
        {
            title: 'Detail',
            dataIndex: 'detail',
        },
    ];

    useEffect(() => {
        fetchHistory();
    }, [current, pageSize]);

    const fetchHistory = async () => {
        setIsLoading(true);
        const res = await getOrderHistory()
        console.log(res)
        if (res && res?.data) {
            setListData(res.data.totalPrice)
        }
        setIsLoading(false)
        console.log(listData)
    }

    return (
        <div>
            <div style={{ margin: '30px 0 0 40px' }} className="title">
                History:
            </div>
            <div>
                <Table style={{ margin: "50px auto", width: "85vw" }}
                    className='def'
                    columns={columns}
                    loading={isLoading}
                    dataSource={listData}
                    onChange={onChange}
                    rowKey="_id"
                    pagination={{
                        current: current,
                        pageSize: pageSize,
                        showSizeChanger: true,
                    }}
                />
            </div>
        </div>
    )
}

export default OrderHistory
