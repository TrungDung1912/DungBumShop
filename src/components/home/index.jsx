import { Checkbox, Col, Pagination, Rate, Row, Spin, Tabs } from "antd"
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Form, Divider, InputNumber, Button } from "antd"
import './style.scss'
import { useEffect, useState } from "react";
import { getBookCategory, getPaginatedPageBook } from "../../services/apiService";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [listCategory, setListCategory] = useState([])
    const [listBook, setListBook] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("")
    const [sortQuery, setSortQuery] = useState("sort=-sold")

    const [form] = Form.useForm()
    const navigate = useNavigate()
    const items = [
        {
            key: 'sort=-sold',
            label: 'Popular',
            children: <></>
        },
        {
            key: 'sort=-updatedAt',
            label: 'New',
            children: <></>
        },
        {
            key: 'sort=price',
            label: 'Price: Low to High',
            children: <></>
        },
        {
            key: 'sort=-price',
            label: 'Price: High to Low',
            children: <></>
        }
    ]

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

    const handleChangeFilter = (changeValues, values) => {
        console.log("chnageValue", changeValues, values)
        if (changeValues.category) {
            const cate = changeValues.category
            if (cate && cate.length > 0) {
                const f = cate.join(',')
                setFilter(`category=${f}`)
            } else {
                setFilter('')
            }
        }
    }

    const handleOnChangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
    };

    useEffect(() => {
        // fetchlistBooks();
        fetchBooks();
    }, [current, pageSize, filter, sortQuery]);

    const fetchBooks = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        console.log('query', query)
        const res = await getPaginatedPageBook(query)
        if (res && res.data) {
            setListBook(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleDetailBook = (book) => {
        const slug = convertSlug(book.mainText);
        navigate(`/book/${slug}?id=${book._id}`)
    }

    const onFinish = (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`
            if (values?.category?.length) {
                const cate = values?.category?.join(',')
                f += `&category=${cate}`
            }
            setFilter(f)
        }
    }

    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row gutter={[20, 20]} style={{ marginTop: "20px" }}>
                <Col md={4} sm={0} xs={0} style={{ borderRadius: "10px", border: "1px solid grey" }} >
                    <div style={{ display: 'flex', justifyContent: "space-between", marginTop: "10px" }}>
                        <span> <FilterTwoTone /> Filter Group</span>
                        <ReloadOutlined title="Reset" onClick={() => {
                            form.resetFields()
                            setFilter('')
                        }} />
                    </div>
                    <Divider />
                    <Form
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={(changeValues, values) => handleChangeFilter(changeValues, values)}
                    >
                        <Form.Item
                            name="category"
                            label="List Product"
                            labelCol={{ span: 24 }}
                        >
                            <Checkbox.Group>
                                <Row >
                                    {listCategory.map((item, index) => {
                                        return (
                                            <Col style={{ margin: "10px 0px" }} key={`index-${index}`} span={24}>
                                                <Checkbox value={item.value}>
                                                    <span style={{ fontSize: "15px" }}>{item.label}</span>
                                                </Checkbox>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Price range"
                            labelCol={{ span: 24 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                                <Form.Item name={["range", 'from']}>
                                    <InputNumber
                                        name='from'
                                        min={0}
                                        placeholder="đ From"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                <span >-</span>
                                <Form.Item name={["range", 'to']}>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="đ To"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <Button onClick={() => form.submit()}
                                    style={{ width: "100%" }} type='primary'>Apply</Button>
                            </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Judgement"
                            labelCol={{ span: 24 }}
                        >
                            <div>
                                <Rate value={5} disabled style={{ fontSize: 15 }} />
                                <span className="ant-rate-text"></span>
                            </div>
                            <div>
                                <Rate value={4} disabled style={{ fontSize: 15 }} />
                                <span className="ant-rate-text">Above</span>
                            </div>
                            <div>
                                <Rate value={3} disabled style={{ fontSize: 15 }} />
                                <span className="ant-rate-text">Above</span>
                            </div>
                            <div>
                                <Rate value={2} disabled style={{ fontSize: 15 }} />
                                <span className="ant-rate-text">Above</span>
                            </div>
                            <div>
                                <Rate value={1} disabled style={{ fontSize: 15 }} />
                                <span className="ant-rate-text">Above</span>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
                <Col md={20} sm={24} xs={24} style={{}}>
                    <Spin spinning={isLoading} tip="Loading...">
                        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
                            <Row>
                                <Tabs
                                    defaultActiveKey="sort=-sold"
                                    items={items}
                                    onChange={(value) => { setSortQuery(value) }}
                                    style={{ overflowX: "auto" }} />
                            </Row>
                            <Row className='customize-row'>
                                {listBook?.map((item, index) => {
                                    return (
                                        <div onClick={() => handleDetailBook(item)} className="column" key={`book-${index}`} >
                                            <div className='wrapper' style={{ height: "300px" }}>
                                                <div className='thumbnail'>
                                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                </div>
                                                <div className='text' style={{ marginLeft: "5px" }}>{item.mainText}</div>
                                                <div className='price' style={{ marginLeft: "5px" }}>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${item.price}`)}
                                                </div>
                                                <div className='rating' style={{ marginLeft: "5px" }}>
                                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                    <span>{item.sold}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Row>
                            <Divider />
                            <Row style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(p, s) => handleOnChangePage({ current: p, pageSize: s })}
                                />
                            </Row>
                        </div>
                    </Spin>
                </Col>
            </Row>
        </div>
    )
}

export default Home