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