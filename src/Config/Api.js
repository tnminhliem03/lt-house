import axios from "axios";

const HOST ="https://liemtnm03.pythonanywhere.com/";
// const HOST = "http://127.0.0.1:8000/"

export const endpoints = {
    'rooms': '/rooms/',
    'residents': '/residents/',
    'login': '/ol/token/',
    'current-user': '/residents/current/',
    'update-profile':(id) => `/residents/${id}/profile/`,
    'complaints': '/complaints/',
    'create-complaint':'/complaints/create-complaint/',
    'packages': '/packages',
    'security_cards':'/security_cards/',
    'add-sc': '/security_cards/add-sc/',
    'delete-sc': (id) => `/security_cards/${id}/`,
    'update-sc': (id) => `/security_cards/${id}/update-sc/`,
    'payments': '/payments/',
    'momo-methods': (payment) => `/payments/${payment}/paid-momo/`,
    'vnp-methods': (payment) => `/payments/${payment}/paid-vnp/`,
    'receipts' :'/receipts/',
    'surveys': '/surveys/',
    's_questions': '/s_questions/',
    's_choices': '/s_choices/',
    'fill-answer': '/s_answers/submit-answers/',
    'notifications':'/notifications/',
}

export const authApi = (accessToken) => axios.create({
    baseURL:HOST,
    headers:{
        Authorization: `Bearer ${accessToken}` 
    }
})

export default axios.create({
    baseURL : HOST
})