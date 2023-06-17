import { Badge, Descriptions, Drawer, Divider, Upload, Modal } from "antd"
import moment from "moment/moment"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'

const BookViewDetail = (props) => {
    const { setOpenViewDetail, setDataViewDetail, openViewDetail, dataViewDetail } = props

    const onClose = () => {
        setOpenViewDetail(false)
        setDataViewDetail(null)
    }

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);



    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    useEffect(() => {
        if (dataViewDetail) {
            let imgThumbnail = {}, imgSlider = []
            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail.thumbnail}`
                }
            }
            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataViewDetail])

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
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
                    <Descriptions.Item label="Name">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Author">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Price">{dataViewDetail?.price} đ</Descriptions.Item>
                    <Descriptions.Item label="Sold">{dataViewDetail?.sold}</Descriptions.Item>
                    <Descriptions.Item label="Quantity">{dataViewDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Type" span={2}>
                        <Badge status="processing" text={dataViewDetail?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left" > Ảnh Books </Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-circle"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    )
}

export default BookViewDetail