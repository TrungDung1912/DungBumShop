import { Badge, Descriptions, Drawer } from "antd"
import moment from "moment/moment"

const UserViewDetail = (props) => {
    const { setOpenViewDetail, setDataViewDetail, openViewDetail, dataViewDetail } = props

    const onClose = () => {
        setOpenViewDetail(false)
        setDataViewDetail(null)
    }

    return (
        <>
            <Drawer
                title="View User Information"
                open={openViewDetail}
                onClose={onClose}
                width={"50vw"}
            >
                <Descriptions
                    title="User Information"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Name">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{dataViewDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>

            </Drawer>
        </>
    )
}

export default UserViewDetail