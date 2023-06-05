import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Form, Modal, Table, notification } from 'antd';
import React, { useState } from 'react';
const { Dragger } = Upload;
import * as XLSX from 'xlsx'
import { postCreateListUser } from '../../../../services/apiService';
import dataFile from './Data.xlsx?url'

const UserAddListUsers = (props) => {
    const { openAddListModal, setOpenAddListModal } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const [dataExcel, setDataExcel] = useState([]);

    const handleSubmit = async () => {
        const data = dataExcel.map(item => {
            item.password = '123456'
            return item
        })
        const res = await postCreateListUser(data)
        if (res.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess} - Error: ${res.data.countError}`,
                message: 'Upload Successfully!!'
            })
            setDataExcel([])
            setOpenAddListModal(false)
            props.fetchUsers()
        } else {
            notification.error({
                description: res.message,
                message: 'Error!!!'
            })
        }
    }

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("Successfully!")
        }, 1000)
    }

    //Convert excel data into json format
    const propsUpload = {
        name: 'file',
        multiple: true,
        maxCount: 1,
        action: '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file)
                    reader.onload = function (e) {
                        const data = new Uint8Array(reader.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]]
                        // find the name of your sheet in the workbook first
                        // convert to json format
                        const json = XLSX.utils.sheet_to_json(sheet, {
                            header: ["fullName", "email", "phone"],
                            range: 1
                        });
                        console.log(json);
                        if (json && json.length > 0) setDataExcel(json)
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    }
    return (
        <>
            <Modal
                title="Import data user"
                open={openAddListModal}
                onOk={() => handleSubmit()}
                onCancel={() => {
                    setOpenAddListModal(false)
                    setDataExcel([])
                }}
                okText={"Import data"}
                confirmLoading={isSubmit}
                onButtonProps={{
                    disabled: dataExcel.length < 1,
                }}
                maskClosable={false}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Only accept .csv .xls .xlsx .or
                        &nbsp;
                        <a
                            onClick={e => e.stopPropagation()}
                            href={dataFile}
                            download>Download Sample File</a>.
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        dataSource={dataExcel}
                        title={() => <span>Data Upload</span>}
                        columns={[
                            { dataIndex: 'fullName', title: 'FullName' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Phone' }
                        ]}
                    />
                </div>
            </Modal>
        </>
    )
}

export default UserAddListUsers

