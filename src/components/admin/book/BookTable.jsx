import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Popconfirm, message, notification } from 'antd';
import InputSearchBook from './InputSearchBook';
import { deleteBook, deleteDeleteUser, getPaginatedPageBook } from '../../../services/apiService';
import { current } from '@reduxjs/toolkit';
import { TiUserDelete } from 'react-icons/ti'
import { BiExport, BiImport, BiMessageSquareAdd } from 'react-icons/bi'
import { TfiReload } from 'react-icons/tfi'
import moment from 'moment';
import { BiEditAlt } from 'react-icons/bi'
import * as XLSX from 'xlsx';
import BookViewDetail from './BookViewDetail';
import BookAddModal from './BookAddModal';
import BookEditModal from './BookEditModal';



const BookTable = () => {
    const [listBook, setListBook] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(4)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("")
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt")
    const [dataViewDetail, setDataViewDetail] = useState("")
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [openAddModal, setOpenAddModal] = useState(false)
    const [openAddListModal, setOpenAddListModal] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [dataUpdateModal, setDataUpdateModal] = useState("")

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        setOpenViewDetail(true)
                        setDataViewDetail(record)
                    }}>
                        {record._id}</a>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Type',
            dataIndex: 'category',
            sorter: true,

        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true,

        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (text, record, index) => {
                let a = `${record.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                return (
                    a.concat(' đ')
                )
            },
            sorter: true,

        },
        {
            title: 'Update day',
            dataIndex: 'updatedAt',
            render: (text, record, index) => {
                return (
                    moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')
                )
            },
            sorter: true
        },
        {
            title: 'Action',
            width: 100,
            render: (text, record, index) => {
                return (
                    <div style={{ display: "flex", gap: 15 }}>
                        <Popconfirm
                            placement='leftTop'
                            title="Delete the account?"
                            description="Are you want to delete the account?"
                            onConfirm={() => handleDeleteBook(record._id)}
                            okText="Confirm"
                            cancelText="Cancel"
                        >
                            <span style={{ cursor: "pointer", color: "red", fontSize: "20px" }}>
                                <TiUserDelete />
                            </span>
                        </Popconfirm>
                        <span onClick={() => {
                            setOpenUpdateModal(true)
                            setDataUpdateModal(record)
                        }} style={{ cursor: "pointer", color: "green", fontSize: "20px" }}><BiEditAlt /></span>
                    </div>
                )
            }
        },
    ];

    const handleDeleteBook = async (book_id) => {
        const res = await deleteBook(book_id)
        if (res && res.data) {
            message.success('Delete a book successfully!!!')
            fetchBooks()
        } else {
            notification.error({
                message: 'Error deleting!!!',
                description: res.message,
            })
        }
    }

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        if (sorter && sorter.field) {
            const q = sorter.order === "ascend" ? `sort=${sorter.field}` : `sort=-${sorter.field}`
            setSortQuery(q)
        }
        console.log('params', pagination, filters, sorter, extra);
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


    const handleSearch = (search) => {
        setFilter(search)
    }

    //export data user JSON to CSV/EXCEL
    const handleExportData = () => {
        if (listBook.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBook);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "DataExportBook.csv");
        }
    }

    const panelRender = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Table List Users</span>
                <span style={{ display: "flex", gap: 15 }}>
                    <Button
                        style={{ display: "flex", gap: 10, alignItems: "center" }}
                        icon={<BiExport />}
                        type='primary'
                        onClick={() => handleExportData()}
                    >Export
                    </Button>

                    <Button
                        style={{ display: "flex", gap: 10, alignItems: "center" }}
                        icon={<BiMessageSquareAdd />}
                        type='primary'
                        onClick={() => {
                            setOpenAddModal(true)
                        }}
                    >Add new </Button>

                    <Button type='ghost' onClick={() => {
                        setFilter("")
                        setSortQuery("")
                    }}>
                        <TfiReload />
                    </Button>
                </span>
            </div>
        )
    }

    return (
        <div className='table-container'>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearchBook handleSearch={handleSearch} />
                </Col>
                <Col span={24} >
                    <Table style={{ margin: "50px auto", width: "85vw" }}
                        title={panelRender}
                        className='def'
                        columns={columns}
                        loading={isLoading}
                        dataSource={listBook}
                        onChange={onChange}
                        rowKey="_id"
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            total: total,
                            showTotal: (total, range) => {
                                return (
                                    <div>
                                        {range[0]}-{range[1]} in {total} rows
                                    </div>
                                )
                            }
                        }}
                    />
                </Col>
            </Row>
            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <BookAddModal
                openAddModal={openAddModal}
                setOpenAddModal={setOpenAddModal}
                fetchBooks={fetchBooks}
            />
            <BookEditModal
                openUpdateModal={openUpdateModal}
                setOpenUpdateModal={setOpenUpdateModal}
                dataUpdateModal={dataUpdateModal}
                setDataUpdateModal={setDataUpdateModal}
                fetchBooks={fetchBooks}
            />
        </div>
    )
}

export default BookTable