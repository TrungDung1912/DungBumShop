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