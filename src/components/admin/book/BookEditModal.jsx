import { Button, Col, Modal, Form, Divider, Input, message, notification, Row, InputNumber, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { getBookCategory, postCreateBook, postCreateUser, postUploadImageBook, putUpdateBook } from '../../../services/apiService';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const BookEditModal = (props) => {
    const { openUpdateModal, setOpenUpdateModal, dataUpdateModal, setDataUpdateModal } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const [listCategory, setListCategory] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingSlider, setLoadingSlider] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [dataThumbnail, setDataThumbnail] = useState([])
    const [dataSlider, setDataSlider] = useState([])
    const [initForm, setInitForm] = useState(null);


    const onFinish = async (values) => {
        const { _id, mainText, author, price, sold, quantity, category } = values
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
        const res = await putUpdateBook(_id, thumbnail, slider, mainText, author, price, sold, quantity, category)
        if (res && res.data) {
            message.success("Update book successfully")
            form.resetFields()
            setDataThumbnail([])
            setDataSlider([])
            setInitForm(null)
            setOpenUpdateModal(false)
            await props.fetchBooks()
        } else {
            notification.error({
                message: "Error",
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getBookCategory();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
        }
        fetchCategory();
    }, [])

    useEffect(() => {
        if (dataUpdateModal?._id) {
            const arrThumbnail = [{
                uid: uuidv4(),
                name: dataUpdateModal.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdateModal.thumbnail}`
            }]
            const arrSlider = dataUpdateModal.slider.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                }
            })
            const init = {
                _id: dataUpdateModal._id,
                mainText: dataUpdateModal.mainText,
                author: dataUpdateModal.author,
                price: dataUpdateModal.price,
                category: dataUpdateModal.category,
                quantity: dataUpdateModal.quantity,
                sold: dataUpdateModal.sold,
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider }
            }
            setInitForm(init)
            setDataThumbnail(arrThumbnail)
            setDataSlider(arrSlider)
            form.setFieldsValue(init)
        }
        return () => {
            form.resetFields()
        }
    }, [dataUpdateModal])

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

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        })


    };

    return (
        <>
            <Modal
                title="Update book"
                open={openUpdateModal}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setInitForm(null)
                    setDataUpdateModal(null);
                    setOpenUpdateModal(false)
                }}
                okText={"Update"}
                cancelText={"Cancel"}
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
                                <InputNumber defaultValue={0} style={{ width: "100%" }} />
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
                                    defaultFileList={initForm?.thumbnail?.fileList ?? []}

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
                                    defaultFileList={initForm?.slider?.fileList ?? []}

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
                        <Col>
                            <Form.Item
                                hidden
                                labelCol={{ span: 24 }}
                                label="Id"
                                name="_id"
                                rules={[{ required: true, message: 'Please fill the name of the book!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row >
                </Form >
            </Modal>
        </>
    )
}

export default BookEditModal