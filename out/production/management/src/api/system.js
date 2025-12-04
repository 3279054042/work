import axios from "axios";

// 后端 API 地址
const API_BASE = "http://127.0.0.1:8000/api/system";

const api = axios.create({
    baseURL: API_BASE,
    timeout: 5000,
});

// 获取系统列表
export const getSystemList = () => {
    return axios.get('http://127.0.0.1:8000/api/system/');
};

// 新建系统
export const addSystem = (data) => {
    return api.post("/add", data);
};

// 更新系统
export const updateSystem = (id, data) => {
    return axios.put(`http://127.0.0.1:8000/api/system/${id}`, data);
};

// 删除系统
export const deleteSystem = (id) => {
    return axios.delete(`/delete/${id}`);
};