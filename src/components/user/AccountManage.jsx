import { Modal, Tabs } from "antd"
import UserInfo from "./UserInfo";
import ChangePassword from "./ChangePassword";

const AccountManage = (props) => {
    const { show, setShow } = props;


    const items = [
        {
            key: 'info',
            label: 'Update Information',
            children: <UserInfo />
        },
        {
            key: 'password',
            label: 'Change Password',
            children: <ChangePassword />
        }
    ]

    return (
        <div>
            <Modal
                title="Account Management"
                open={show}
                footer={null}
                onCancel={() => setShow(false)}
                width={'60vw'}
                maskClosable={false}
            >
                <Tabs
                    defaultActiveKey='info'
                    items={items}
                />
            </Modal>
        </div>
    )
}

export default AccountManage