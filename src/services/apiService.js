import axios from "../utils/axios-customize";

export const postRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', { fullName, email, password, phone })
}

export const postLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password })
}

export const fetchAccount = () => {
    return axios.get('/api/v1/auth/account')
}

export const postLogout = () => {
    return axios.post('/api/v1/auth/logout')
}

export const getPaginatedPage = (query) => {
    return axios.get(`/api/v1/user?${query}`)
}

export const postCreateUser = (fullName, password, email, phone) => {
    return axios.post(`/api/v1/user`, { fullName, password, email, phone })
}

export const postCreateListUser = (data) => {
    return axios.post('/api/v1/user/bulk-create', data)
}

export const deleteDeleteUser = (id) => {
    return axios.delete(`./api/v1/user/${id}`)
}

export const updateUpdateUser = (_id, fullName, phone) => {
    return axios.put('/api/v1/user', { _id, fullName, phone })
}

export const getPaginatedPageBook = (query) => {
    return axios.get(`/api/v1/book?${query}`)
}

export const getBookCategory = () => {
    return axios.get(`api/v1/database/category`)
}

export const postUploadImageBook = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg)
    return axios({
        method: 'POST',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        }
    })
}

export const postCreateBook = (thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    return axios.post('/api/v1/book', { thumbnail, slider, mainText, author, price, sold, quantity, category })
}

export const putUpdateBook = (id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    return axios.put(`/api/v1/book/${id}`, { thumbnail, slider, mainText, author, price, sold, quantity, category })
}

export const deleteBook = (id) => {
    return axios.delete(`/api/v1/book/${id}`)
}

export const getBookbyID = (id) => {
    return axios.get(`/api/v1/book/${id}`)
}

export const callPlaceOrder = (data) => {
    return axios.post('/api/v1/order', {
        ...data
    })
}

export const getOrderHistory = () => {
    return axios.get('/api/v1/history')
}

export const postUploadAvatar = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg)
    return axios({
        method: 'POST',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "avatar"
        }
    })
}

export const putUpdateUserInfo = (_id, phone, fullName, avatar) => {
    return axios.put('/api/v1/user', {
        _id, phone, fullName, avatar
    })
}

export const getListOrderPaginated = (query) => {
    return axios.get(`/api/v1/order?${query}`)
}

export const getDashBoard = () => {
    return axios.get('/api/v1/database/dashboard')
}