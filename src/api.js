import axios from 'axios'

export const apiUrl = 'http://127.0.0.1:8000'

export const axiosLoginInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        Accept: 'application/json'
    }
})

export const axiosApiInstance = axios.create({
    baseURL: `${apiUrl}/api`,
    withCredentials: true,
    headers: {
        Accept: 'application/json'
    }
})