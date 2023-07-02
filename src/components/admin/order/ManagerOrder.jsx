import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Popconfirm, message, notification } from 'antd';
import { deleteDeleteUser, getListOrderPaginated, getOrderHistory, getPaginatedPage } from '../../../services/apiService';
import { current } from '@reduxjs/toolkit';
import { TiUserDelete } from 'react-icons/ti'
import { BiExport, BiImport, BiMessageSquareAdd } from 'react-icons/bi'
import { TfiReload } from 'react-icons/tfi'
import moment from 'moment';
import { MdTipsAndUpdates } from 'react-icons/md'
import * as XLSX from 'xlsx';
import InputSearch from './InputSearch';

const ManagerOrderr = () => {
    const [listOrder, setListOrder] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(4)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("")
    const [sortQuery, setSortQuery] = useState("")
    const [dataViewDetail, setDataViewDetail] = useState("")

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
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Create day',
            dataIndex: 'createdAt',
            render: (text, record, index) => {
                return (
                    moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')
                )
            },
            sorter: true
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            sorter: true,
        },
    ];

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
        // fetchListUsers();
        fetchOrders();
    }, [current, pageSize, filter, sortQuery]);

    const fetchOrders = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await getListOrderPaginated(query)
        if (res && res.data) {
            setListOrder(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleSearch = (search) => {
        setFilter(search)
    }

    //export data user JSON to CSV/EXCEL
    const handleExportData = () => {
        if (listOrder.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listOrder);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "DataExportOrder.csv");
        }
    }

    const panelRender = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Table List Orders</span>
                <span style={{ display: "flex", gap: 15 }}>
                    <Button
                        style={{ display: "flex", gap: 10, alignItems: "center" }}
                        icon={<BiExport />}
                        type='primary'
                        onClick={() => handleExportData()}
                    >Export
                    </Button>

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
                    <InputSearch handleSearch={handleSearch} />
                </Col>
                <Col span={24} >
                    <Table style={{ margin: "50px auto", width: "85vw" }}
                        title={panelRender}
                        className='def'
                        columns={columns}
                        loading={isLoading}
                        dataSource={listOrder}
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
        </div>
    )
}

export default ManagerOrderr