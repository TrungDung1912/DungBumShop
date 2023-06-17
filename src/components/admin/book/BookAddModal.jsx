import { Button, Col, Modal, Form, Divider, Input, message, notification, Row, InputNumber, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { getBookCategory, postCreateBook, postCreateUser, postUploadImageBook } from '../../../services/apiService';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';


const BookAddModal = (props) => {
    const { openAddModal, setOpenAddModal } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const [listCategory, setListCategory] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingSlider, setLoadingSlider] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [dataThumbnail, setDataThumbnail] = useState([])
    const [dataSlider, setDataSlider] = useState([])

    const onFinish = async (values) => {
        const { mainText, author, price, sold, quantity, category } = values
        if (dataThumbnail.length === 0) {
            notification.error({
                message: "Error",
                description: "Please uploading the thumbnail image!"
            })
            return;
        }
        if (dataSlider.length === 0) {
            notification.error({
                message: "Error",
                description: "Please uploading the slider image!"
            })
            return;
        }
        const thumbnail = dataThumbnail[0].name
        const slider = dataSlider.map(item => item.name)

        setIsSubmit(true)
        const res = await postCreateBook(thumbnail, slider, mainText, author, price, sold, quantity, category)
        if (res && res.data) {
            form.resetFields()
            setDataThumbnail([])
            setDataSlider([])
            setOpenAddModal(false)
            await props.fetchBooks()
        } else {
            notification.error({
                message: "Error",
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await postUploadImageBook(file)
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('Successfully!')
        } else {
            onError('Error!!!')
        }
    }

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await postUploadImageBook(file)
        if (res && res.data) {
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('Successfully!')
        } else {
            onError('Error!!!')
        }
    }

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getBookCategory();
            if (res && res.data) {
                const list = res.data.map(item => {
                    return {
                        label: item, value: item
                    }
                })
                setListCategory(list)
            }
        }
        fetchCategory()
    }, [])

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleRemove = (info, type) => {
        console.log(info)
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(item => item.uid !== info.uid)
            setDataSlider(newSlider)
        }
    }

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false)
                setImageUrl(url);
            });
        }
    }

    const getBase64_1 = (file) =>
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
            file.preview = await getBase64_1(file.originFileObj);
        }
        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    return (
        <>
            <Modal
                title="Add new book"
                open={openAddModal}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenAddModal(false)
                }}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"50vw"}
                //do not close when click fetchBook
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Name"
                                name="mainText"
                                rules={[{ required: true, message: 'Please fill the name of the book!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Author"
                                name="author"
                                rules={[{ required: true, message: 'Please fill the author input!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: 'Please fill the price input!' }]}
                            >
                                <InputNumber addonAfter="VND"
                                    min={0}
                                    // style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Type"
                                name="category"
                                rules={[{ required: true, message: 'Please fill the type input!' }]}
                            >
                                <Select
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true, message: 'Please fill the quantity input!' }]}
                            >
                                <InputNumber defaultValue={1} min={1} style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Sold"
                                name="sold"
                            >
                                <InputNumber initialValues={0} style={{ width: "100%" }} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(info) => handleRemove(info, 'thumbnail')}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Sliders"
                                name="slider"
                            >
                                <Upload
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    multiple={true}
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(info) => handleRemove(info, 'slider')}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </Form.Item>
                        </Col>
                    </Row >
                </Form >
            </Modal>
        </>
    )
}

export default BookAddModal